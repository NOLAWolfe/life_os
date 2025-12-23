# DJ Assistant: Project Roadmap & Architecture

## 🎯 Project Overview
**Goal:** Create a comprehensive AI Assistant to manage the lifecycle of the DJ brand. This includes automating content creation for non-designers, streamlining music discovery/crate management, and error-proofing business administration.

**Status:** Planning Phase / Architecture Design
**User Context:** "Two left hands" for design; needs automation. High focus on efficiency during slow business seasons.

---

## 🏗️ Module 1: The Content Factory (Creative Automation)
*Goal: Turn text/audio inputs into visual marketing assets without manual graphic design skills.*

### A. The "No-Design" Flyer Bot
- **Input:** Raw text (Venue, Time, Genre, Ticket Price).
- **Process:** AI Agent converts raw text into "Midjourney/Ideogram/Canva Magic" prompt syntax (e.g., specifying color palette, style, typography).
- **Output:** High-quality event poster/flyer.

### B. The Promo Generator (Audio-to-Video Bridge)
- **Concept:** Create video assets from SoundCloud audio recordings (no camera footage required).
- **Workflows:**
    1.  **Audiograms:** Static background + Moving Waveform (Tools: Headliner, Canva Apps).
    2.  **Vibe Match:** Stock footage (dancing/lights) + Audio Overlay.
    3.  **AI Visualizers:** Audio-reactive generative art (Tools: Vizzy.io).

### C. Live Visuals (VJ Mode)
- **Goal:** Create loops for event screens.
- **Process:** Generate style-consistent loops based on music genre tags (e.g., Techno = Industrial/Dark; Disco = Glitter/Gold).

---

## 🎧 Module 2: The Crate Digger (Music Organization)
*Goal: Streamline the "Discovery to Decks" pipeline.*

### Feature: Apple Music Integration ("Future DJ Songs")
- **Problem:** Songs found while listening on the go (Apple Music) are often forgotten or hard to transfer to DJ software.
- **Proposed Workflow:**
    1.  **Trigger:** User adds track to specific "DJ Potential" playlist in Apple Music.
    2.  **Action:** Assistant scrapes/reads this playlist.
    3.  **Output:** Adds metadata (Artist - Title) to a "To Buy/Download" list.
    4.  **Integration:** (Long-term) API connection to Serato/Rekordbox for crate management.

---

## 💼 Module 3: Admin & Ops (The Business Manager)
*Goal: Remove human error from financial transactions.*

### Feature: Automated Invoicing
- **Current State:** Manual Adobe template (prone to errors).
- **New Workflow:**
    - **Input:** Client Name, Event Date, Agreed Fee, Deposit Status.
    - **Logic:**
        - Calculate Balance Due.
        - Auto-generate Invoice Number (Sequential).
        - Apply current date.
    - **Output:** Filled PDF ready to send.
- **Requirement:** Must validate data before generation to ensure no math errors.

---

## ✅ Immediate Action Items (Next Steps)
- [ ] **Content:** Select one "Audio-to-Video" tool (likely Audiogram workflow) and create one test asset from the recent SoundCloud mix.
- [ ] **Music:** Investigate Apple Music API capabilities or Shortcuts for exporting playlist data to text/CSV.
- [ ] **Admin:** Upload current Adobe Invoice template to analyze structure for automation.
