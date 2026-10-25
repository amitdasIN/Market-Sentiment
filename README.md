# ⚡ OmniPulse — Indian & Worldwide Stock Market Sentiment & Next-Day Opening Cue Terminal

A live-calibrated **Indian (`NSE / BSE / GIFT City`) & Worldwide Stock Market Sentiment Terminal** that tracks real-time market levels, aggregates sentiment across **6 major platforms** (*Financial News, YouTube, X/Twitter, Instagram, Reddit, and Web Search*), and computes the **Next-Day 9:15 AM IST NIFTY 50 Opening Cue** from **GIFT NIFTY** and global market handover.

---

## 📂 Project Files Included
* **`index.html`** — Main terminal interface featuring the Top Live Command Bar, GIFT NIFTY Spotlight (`22,535.50`), Next-Day 9:15 AM IST NIFTY 50 Opening Cue (`22,505 – 22,555`), 6-Platform Sentiment Pulse, and 16 Indian & Worldwide market cards.
* **`styles.css`** — Custom dark-mode styling, glassmorphism surfaces, and real-time price tick animations.
* **`app.js`** — Frontend engine for the live IST clock, 9:15 AM market session detector, GIFT NIFTY basis spread calculator, and 60-second auto-sync loop.
* **`market_data.json`** — Structured JSON dataset containing calibrated benchmark levels (`GIFT NIFTY: 22,535.50`, `NIFTY 50: 22,600.00`, `SENSEX`, `BANK NIFTY`, `S&P 500`, `NASDAQ`, `DOW JONES`, `NIKKEI 225`, `HANG SENG`, `FTSE 100`, etc.) and 6-platform sentiment scores.
* **`server.py`** — Python HTTP & API server that serves the web app and provides `/api/market-data` and `/api/opening-cue` endpoints.
* **`package.json`** & **`requirements.txt`** — Project metadata and Python dependencies.

---

## 🚀 How to Run Locally

### Option 1: Run with the Python Server (`server.py`)
```bash
python3 server.py
```
Then open **`http://localhost:8000`** in your browser.
* Live JSON API: `http://localhost:8000/api/market-data`
* Next-Day NIFTY 50 Opening Cue API: `http://localhost:8000/api/opening-cue`

### Option 2: Open Directly in Browser / GitHub Pages
Simply open `index.html` in any browser or push the files to a GitHub repository and enable **GitHub Pages**.
