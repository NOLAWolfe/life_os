const fs = require('fs');
const path = require('path');
const { processAllCrates } = require('./seratoReader');
const { parseHistoryCsv } = require('./historyReader');
const seratojs = require('seratojs');

const BASE_DIR = path.join(__dirname, '..', '..');
const LIBRARY_SNAPSHOT_FILE = path.join(BASE_DIR, 'library_snapshot.json');
const PROPOSAL_OUTPUT_FILE = path.join(BASE_DIR, 'ai_crate_proposal.json');

// --- 1. Generate Library Snapshot ---

async function generateSnapshot() {
    console.log('Starting DJ World library processing...');
    const libraryData = await processAllCrates();
    console.log(`\nSaving library snapshot to: ${LIBRARY_SNAPSHOT_FILE}`);
    fs.writeFileSync(LIBRARY_SNAPSHOT_FILE, JSON.stringify(libraryData, null, 2));
    console.log('\n✅ Success! AI context has been updated with your Serato library snapshot.');
}


// --- 2. Propose Crates ---

function createLibraryLookup() {
    if (!fs.existsSync(LIBRARY_SNAPSHOT_FILE)) {
        throw new Error(`Library snapshot not found at ${LIBRARY_SNAPSHOT_FILE}. Please generate it first.`);
    }
    const library = JSON.parse(fs.readFileSync(LIBRARY_SNAPSHOT_FILE, 'utf-8'));
    const lookup = new Map();
    for (const crate of library) {
        for (const track of crate.tracks) {
            if (track.title) {
                const key = track.title.toLowerCase().trim();
                if (!lookup.has(key)) {
                    lookup.set(key, []);
                }
                lookup.get(key).push(track);
            }
        }
    }
    console.log(`Created a library lookup map with ${lookup.size} unique track titles.`);
    return lookup;
}

function findBestMatch(historyTrack, potentialMatches) {
    if (potentialMatches.length === 1) return potentialMatches[0];
    let bestMatch = null;
    let smallestBpmDiff = Infinity;
    const sameGenreMatches = potentialMatches.filter(libTrack => libTrack.genre === historyTrack.genre);
    const matchesToSearch = sameGenreMatches.length > 0 ? sameGenreMatches : potentialMatches;
    const historyBpm = parseFloat(historyTrack.bpm);
    if (isNaN(historyBpm)) return matchesToSearch[0] || null;
    for (const libTrack of matchesToSearch) {
        if (libTrack.bpm) {
            const diff = Math.abs(historyBpm - libTrack.bpm);
            if (diff < smallestBpmDiff) {
                smallestBpmDiff = diff;
                bestMatch = libTrack;
            }
        }
    }
    return bestMatch || matchesToSearch[0] || null;
}

const crateDefinitions = [
    {
        id: 'high_energy_mix',
        name: 'AI - High Energy Mix',
        filter: ({ library }) => {
            const energy = library.comment ? parseInt(library.comment, 10) : 0;
            return library.genre && library.genre.includes('House') && energy >= 6;
        },
    },
    {
        id: 'midnight_house_mix',
        name: 'AI - Midnight House Mix',
        filter: ({ library, history }) => {
            const energy = library.comment ? parseInt(library.comment, 10) : 0;
            const startTime = new Date(history['start time']);
            const midnight = new Date(startTime.toDateString() + ' 23:00:00');
            const closing = new Date(startTime.toDateString() + ' 01:30:00');
            closing.setDate(closing.getDate() + 1); // Next day for closing
            const isTimeMatch = startTime >= midnight || startTime <= closing; // Simplified logic for overnight sets
            return library.genre === 'House' && (energy >= 5 && energy <= 7) && isTimeMatch;
        },
    },
    {
        id: 'hip_hop_and_rb',
        name: 'AI - Hip-Hop & R&B',
        filter: ({ library }) => library.genre && (library.genre.includes('Hip Hop') || library.genre.includes('R&B')),
    },
    {
        id: 'closing_time_mix',
        name: 'AI - Closing Time Mix',
        filter: ({ library }) => {
            const genre = library.genre || '';
            return !genre.includes('House') && library.bpm >= 120;
        },
    },
     {
        id: 'open_format_warmup',
        name: 'AI - Open Format Warmup',
        filter: ({ library }) => {
            const energy = library.comment ? parseInt(library.comment, 10) : 0;
            const bpm = library.bpm ? parseInt(library.bpm, 10) : 0;
            return energy < 7 && energy > 0 && bpm > 65 && bpm < 120;
        },
    },
];

async function proposeCrates(historyFilePath) {
    console.log('Starting AI Crate proposal generation...');
    const libraryLookup = createLibraryLookup();
    const historyTracks = await parseHistoryCsv(historyFilePath);
    
    const proposal = {
        proposal_id: `prop_${Date.now()}`,
        proposed_crates: [],
    };

    for (const definition of crateDefinitions) {
        console.log(`\nProcessing rule for: "${definition.name}"`);
        const tracksForCrate = new Map();

        for (const historyTrack of historyTracks) {
            const key = historyTrack.name.toLowerCase().trim();
            const potentialMatches = libraryLookup.get(key);

            if (potentialMatches) {
                const bestMatch = findBestMatch(historyTrack, potentialMatches);
                if (bestMatch && definition.filter({ library: bestMatch, history: historyTrack })) {
                    if (!tracksForCrate.has(bestMatch.filePath)) {
                         tracksForCrate.set(bestMatch.filePath, {
                            artist: bestMatch.artist,
                            title: bestMatch.title,
                            genre: bestMatch.genre,
                            bpm: bestMatch.bpm,
                            filePath: bestMatch.filePath,
                        });
                    }
                }
            }
        }
        
        const tracks = Array.from(tracksForCrate.values());

        if (tracks.length > 0) {
            proposal.proposed_crates.push({
                id: definition.id,
                name: definition.name,
                track_count: tracks.length,
                tracks: tracks,
            });
            console.log(`  ✅ Added proposal for crate "${definition.name}" with ${tracks.length} tracks.`);
        } else {
            console.log(`  - No tracks from the history matched the rules for this crate.`);
        }
    }

    fs.writeFileSync(PROPOSAL_OUTPUT_FILE, JSON.stringify(proposal, null, 2));
    console.log(`\nProposal generation complete. Review the 'ai_crate_proposal.json' file.`);
    return proposal;
}


// --- 3. Approve Crates ---

async function approveCrates(approvedIds) {
    if (!approvedIds || approvedIds.length === 0) {
        console.error('No crate IDs were provided to approve.');
        return;
    }
    
    if (!fs.existsSync(PROPOSAL_FILE)) {
        console.error(`Error: Proposal file not found at ${PROPOSAL_FILE}`);
        console.log('Please run the proposal generation step first.');
        return;
    }

    console.log('Starting AI Crate approval process...');
    
    const proposal = JSON.parse(fs.readFileSync(PROPOSAL_FILE, 'utf-8'));
    const approvedCrates = new Set(approvedIds);

    for (const crateData of proposal.proposed_crates) {
        if (approvedCrates.has(crateData.id)) {
            console.log(`\nApproving and creating crate: "${crateData.name}"`);

            if (!crateData.tracks || crateData.tracks.length === 0) {
                console.log('  - Warning: This crate has no tracks in the proposal. Skipping.');
                continue;
            }

            try {
                const newCrate = new seratojs.Crate(crateData.name);
                crateData.tracks.forEach(track => {
                    if (track.filePath) {
                        newCrate.addSong(track.filePath);
                    }
                });
                await newCrate.save();
                console.log(`  ✅ Successfully created crate "${crateData.name}" in your Serato library.`);
            } catch (error) {
                console.error(`  ❌ Failed to create or save crate "${crateData.name}".`, error);
            }
        }
    }

    console.log('\nCrate approval process complete.');
}

module.exports = {
    generateSnapshot,
    proposeCrates,
    approveCrates,
};
