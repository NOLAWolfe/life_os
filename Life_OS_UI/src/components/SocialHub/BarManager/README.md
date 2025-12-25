# Bar Manager's Aid (PoC)

**Status:** Prototype / Mock Data
**Goal:** Provide bar managers with actionable "Crowd & Channel" intelligence.

## Features

### 1. 🏈 Sports Ticker
*   **Problem:** "What channel is the game on?"
*   **Solution:** A daily digest of major sports events with TV Channel mappings.
*   **Data Source (Future):** [TheSportsDB](https://www.thesportsdb.com/) (API).

### 2. 📡 Local Intel (Event Radar)
*   **Problem:** "Why is it dead?" or "Why are we slammed?"
*   **Solution:** Monitoring major crowd-generating events (Concerts, Conventions).
*   **Data Source (Future):** Ticketmaster API + Manual Scraping.

## Target Hotels (Minneapolis)
We are monitoring conventions at these key locations:
1.  **Hilton Minneapolis** (1001 Marquette Ave)
2.  **Hyatt Regency Minneapolis** (1300 Nicollet Mall)
3.  **Millennium Minneapolis** (1313 Nicollet Mall)
4.  **Marriott City Center** (30 S 7th St)
5.  **Minneapolis Convention Center** (The Hub)

## Roadmap
- [ ] Connect `TheSportsDB` API for live schedule data.
- [ ] Create a "TV Guide" mapping tool (e.g., ESPN = Ch 206 on DirecTV vs Ch 31 on Comcast).
- [ ] Implement "Print View" for generating a daily staff PDF.
