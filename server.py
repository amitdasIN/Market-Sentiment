#!/usr/bin/env python3
"""
OmniPulse Indian & Worldwide Market Sentiment Terminal — Live Python Backend (server.py)
Automatically fetches live Indian & Worldwide index levels via yfinance and computes
the Next-Day 9:15 AM IST NIFTY 50 Opening Cue.
"""

import json
import os
from datetime import datetime, timezone, timedelta
from http.server import SimpleHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse

try:
    import yfinance as yf
    HAS_YFINANCE = True
except ImportError:
    HAS_YFINANCE = False

DATA_FILE = os.path.join(os.path.dirname(__file__), "market_data.json")
IST_OFFSET = timezone(timedelta(hours=5, minutes=30))


def load_market_data():
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def save_market_data(data):
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def sync_live_quotes_from_yfinance(data):
    if not HAS_YFINANCE:
        return data

    ist_now = datetime.now(IST_OFFSET)
    is_weekend = ist_now.weekday() in (5, 6)

    for asset in data.get("assets", []):
        ticker_sym = asset.get("yf_ticker")
        if not ticker_sym:
            continue

        # Preserve calibrated GIFT NIFTY & NIFTY 50 settlement on weekends
        if is_weekend and asset["id"] in ("GIFT_NIFTY", "NIFTY_50"):
            continue

        try:
            tk = yf.Ticker(ticker_sym)
            hist = tk.history(period="5d")
            if len(hist) >= 1:
                latest = hist.iloc[-1]
                prev_close = float(hist.iloc[-2]["Close"]) if len(hist) >= 2 else float(latest["Open"])
                price = round(float(latest["Close"]), 2)

                if asset["id"] == "GIFT_NIFTY":
                    price = round(price - 64.50, 2)

                change = round(price - prev_close, 2)
                change_pct = round((change / prev_close) * 100, 2) if prev_close else 0.0

                asset["price"] = price
                asset["prevClose"] = round(prev_close, 2)
                asset["open"] = round(float(latest["Open"]), 2)
                asset["high"] = round(float(latest["High"]), 2)
                asset["low"] = round(float(latest["Low"]), 2)
                asset["change"] = change
                asset["changePct"] = change_pct
        except Exception:
            continue

    save_market_data(data)
    return data


def compute_nifty_opening_cue(data):
    assets = {a["id"]: a for a in data.get("assets", [])}
    gift = assets.get("GIFT_NIFTY")
    nifty = assets.get("NIFTY_50")

    if not gift or not nifty:
        return {}

    spread_pts = round(gift["price"] - nifty["price"], 2)
    spread_pct = round((spread_pts / nifty["price"]) * 100, 2)
    expected_mid = round(nifty["price"] + spread_pts * 0.92)
    band_low = expected_mid - 25
    band_high = expected_mid + 25

    spread_score = max(20.0, min(80.0, 50.0 + spread_pts * 0.18))
    global_assets = [a for a in data.get("assets", []) if a.get("region") in ("US", "ASIA_EU")]
    avg_global = sum(a["sentiment"] for a in global_assets) / max(1, len(global_assets))
    platforms = data.get("platforms", [])
    avg_platform = sum(p["sentiment"] for p in platforms) / max(1, len(platforms))

    composite_score = round(spread_score * 0.5 + avg_global * 0.3 + avg_platform * 0.2)

    if spread_pts < -20:
        cue_status = f"CAUTIOUS / SOFT GAP-DOWN CUE ({spread_pts:+.2f} PTS)"
    elif spread_pts > 20:
        cue_status = f"CONSTRUCTIVE GAP-UP CUE ({spread_pts:+.2f} PTS)"
    else:
        cue_status = f"FLAT / RANGE-BOUND OPENING CUE ({spread_pts:+.2f} PTS)"

    return {
        "gift_nifty": gift["price"],
        "nifty_50_close": nifty["price"],
        "basis_spread_pts": spread_pts,
        "basis_spread_pct": spread_pct,
        "implied_open_band": [band_low, band_high],
        "expected_open_midpoint": expected_mid,
        "composite_score": composite_score,
        "cue_status": cue_status,
        "support_levels": [22445.00, 22372.00],
        "resistance_levels": [22687.65, 22787.25],
        "timestamp_ist": datetime.now(IST_OFFSET).strftime("%Y-%m-%d %H:%M:%S IST")
    }


class MarketTerminalHandler(SimpleHTTPRequestHandler):
    def _send_json(self, payload, status=200):
        body = json.dumps(payload, indent=2).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/market-data":
            data = load_market_data()
            data["opening_cue"] = compute_nifty_opening_cue(data)
            self._send_json(data)
            return
        elif parsed.path == "/api/opening-cue":
            data = load_market_data()
            self._send_json(compute_nifty_opening_cue(data))
            return
        return super().do_GET()

    def do_POST(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/sync-live":
            data = load_market_data()
            data = sync_live_quotes_from_yfinance(data)
            data["opening_cue"] = compute_nifty_opening_cue(data)
            self._send_json({"status": "SYNCED", "data": data})
            return
        self._send_json({"error": "Not found"}, status=404)


def run_server(port=8000):
    server_address = ("", port)
    httpd = HTTPServer(server_address, MarketTerminalHandler)
    print(f"⚡ OmniPulse Market Sentiment Terminal running at http://localhost:{port}")
    httpd.serve_forever()


if __name__ == "__main__":
    run_server()
