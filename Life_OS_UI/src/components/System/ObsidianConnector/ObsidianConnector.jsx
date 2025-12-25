import React, { useState } from 'react';
import './ObsidianConnector.css';

const ObsidianConnector = () => {
    const [vaultHandle, setVaultHandle] = useState(null);
    const [fileContent, setFileContent] = useState('');
    const [error, setError] = useState('');

    const connectVault = async () => {
        try {
            const handle = await window.showDirectoryPicker();
            setVaultHandle(handle);
            setError('');
        } catch (err) {
            console.error('Error connecting to vault:', err);
            setError('Failed to connect to the vault directory.');
        }
    };

    const readDailyNote = async () => {
        if (!vaultHandle) {
            alert('Please connect to your Obsidian vault first.');
            return;
        }
        try {
            const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
            const dailyNoteHandle = await vaultHandle.getFileHandle(`${today}.md`, {
                create: false,
            });
            const file = await dailyNoteHandle.getFile();
            const content = await file.text();
            setFileContent(content);
            setError('');
        } catch (err) {
            console.error('Error reading daily note:', err);
            setFileContent('');
            setError(`Could not find or read daily note for today. Error: ${err.name}`);
        }
    };

    const writeDailySummary = async () => {
        if (!vaultHandle) {
            alert('Please connect to your Obsidian vault first.');
            return;
        }
        try {
            const today = new Date().toISOString().split('T')[0];
            const fileName = `LifeIO-Summary-${today}.md`;
            const newFileHandle = await vaultHandle.getFileHandle(fileName, { create: true });
            const writable = await newFileHandle.createWritable();
            await writable.write('# Life.io Daily Summary\n\n');
            await writable.write(`- **Date:** ${today}\n`);
            await writable.write("- **Workout:** Completed 'Push Day 1'.\n");
            await writable.write('- **Tasks:** Completed 3 tasks.\n');
            await writable.close();
            alert(`Successfully wrote summary to ${fileName}`);
            setError('');
        } catch (err) {
            console.error('Error writing daily summary:', err);
            setError('Failed to write daily summary file.');
        }
    };

    return (
        <div className="obsidian-connector-container">
            <h3>Obsidian Connector (Spike)</h3>
            <p className="note">
                This uses the File System Access API, which may not be supported in all browsers.
            </p>

            <div className="connector-buttons">
                <button onClick={connectVault}>1. Connect Obsidian Vault</button>
                {vaultHandle && (
                    <span className="status-ok">Vault Connected: {vaultHandle.name}</span>
                )}
            </div>

            {vaultHandle && (
                <>
                    <div className="connector-buttons">
                        <button onClick={readDailyNote}>2. Read Today's Daily Note</button>
                        <button onClick={writeDailySummary}>3. Write Daily Summary</button>
                    </div>

                    {fileContent && (
                        <div className="file-content-display">
                            <h4>Content of Daily Note:</h4>
                            <pre>{fileContent}</pre>
                        </div>
                    )}
                </>
            )}

            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default ObsidianConnector;
