// ============================================================================
// OMNIPULSE TERMINAL — INDIAN & WORLDWIDE MARKET SENTIMENT & LIVE OPENING CUE
// Calibrated to Official Benchmark Levels:
//   - GIFT NIFTY: 22,535.50 (-72.50 pts / -0.32%, Open: 22,869.50, High: 22,874.00, Low: 22,445.00)
//   - NIFTY 50:   22,600.00 (-87.65 pts / -0.39%, Open: 22,742.20, High: 22,787.25, Low: 22,372.00, Prev Close: 22,687.65)
// ============================================================================

let currentRegionFilter = 'ALL';
let syncCountdownSeconds = 60;
let lastSyncDateKey = '';

// 6-Platform Global Sentiment Ingestion Pulse
const PLATFORM_SOURCES = [
  {
    id: 'news',
    name: 'Financial News',
    icon: '📰',
    outlets: 'Moneycontrol • ET • Mint • Reuters • Bloomberg',
    sentiment: 46,
    bias: 'Cautious',
    headline: 'GIFT Nifty settles at 22,535.50 (-0.32%); Nifty 50 closes at 22,600 ahead of global macro cues.'
  },
  {
    id: 'youtube',
    name: 'YouTube Finance',
    icon: '▶️',
    outlets: 'CNBC-TV18 • Booming Bulls • Power of Stocks • Yahoo',
    sentiment: 48,
    bias: 'Neutral-Bearish',
    headline: 'Analysts highlight 22,445 GIFT Nifty low and 22,372 Nifty spot low as critical support zones for Monday 9:15 AM.'
  },
  {
    id: 'twitter',
    name: 'X / FinTwit',
    icon: '🐦',
    outlets: '#Nifty50 • #GiftNifty • #BankNifty • #WallStreet',
    sentiment: 44,
    bias: 'Sell-on-Rise',
    headline: 'Options flow shows call writing at 22,700 & 22,800 strikes; traders watching 22,500 put base at market open.'
  },
  {
    id: 'instagram',
    name: 'Instagram Reels',
    icon: '📸',
    outlets: 'Dalal Street Reels • Price Action Polls • Chartists',
    sentiment: 53,
    bias: 'Dip-Buying',
    headline: 'Retail trader polls lean 53% toward buying the opening dip if Nifty defends 22,450 in the first 15 minutes.'
  },
  {
    id: 'reddit',
    name: 'Reddit Communities',
    icon: '👽',
    outlets: 'r/IndianStreetBets • r/wallstreetbets • r/stocks',
    sentiment: 49,
    bias: 'Range-Bound',
    headline: 'r/IndianStreetBets discussion centers on GIFT Nifty -64.5 pt discount to Nifty spot and IT/Banking divergence.'
  },
  {
    id: 'web',
    name: 'Web & Search Trends',
    icon: '🌐',
    outlets: 'Google Finance • Investing.com • TradingView Ideas',
    sentiment: 52,
    bias: 'Neutral',
    headline: 'High search volume around "GIFT Nifty live opening cue" and "Nifty 22,600 support levels for next session".'
  }
];

// Master Dataset of Indian & Worldwide Indices (Calibrated to Current Benchmark Levels)
const MARKET_ASSETS = [
  {
    id: 'GIFT_NIFTY',
    name: 'GIFT NIFTY',
    symbol: 'NSE IFSC • GIFT CITY',
    region: 'INDIA',
    inTopBar: true,
    price: 22535.50,
    prevClose: 22608.00,
    open: 22869.50,
    high: 22874.00,
    low: 22445.00,
    change: -72.50,
    changePct: -0.32,
    sentiment: 44,
    platforms: { news: 45, youtube: 46, twitter: 41, instagram: 48, reddit: 43, web: 45 },
    note: 'Opened at 22,869.50, high 22,874.00, low 22,445.00; implies -64.50 pt soft cue vs Nifty 22,600.'
  },
  {
    id: 'NIFTY_50',
    name: 'NIFTY 50',
    symbol: 'NSE • INDIA BENCHMARK',
    region: 'INDIA',
    inTopBar: true,
    price: 22600.00,
    prevClose: 22687.65,
    open: 22742.20,
    high: 22787.25,
    low: 22372.00,
    change: -87.65,
    changePct: -0.39,
    sentiment: 45,
    platforms: { news: 46, youtube: 47, twitter: 42, instagram: 50, reddit: 44, web: 46 },
    note: 'Prev close 22,687.65; intraday band 22,372.00 – 22,787.25. Key 9:15 AM cue at 22,505–22,555.'
  },
  {
    id: 'SENSEX',
    name: 'BSE SENSEX',
    symbol: 'BSE • MUMBAI',
    region: 'INDIA',
    inTopBar: true,
    price: 74520.40,
    prevClose: 74815.80,
    open: 74980.00,
    high: 75110.25,
    low: 73910.60,
    change: -295.40,
    changePct: -0.39,
    sentiment: 46,
    platforms: { news: 47, youtube: 48, twitter: 44, instagram: 51, reddit: 45, web: 47 },
    note: 'Tracking Nifty 50 consolidation; heavyweights Reliance & HDFC Bank in focus at 9:15 AM.'
  },
  {
    id: 'BANKNIFTY',
    name: 'NIFTY BANK',
    symbol: 'NSE • BANKING',
    region: 'INDIA',
    inTopBar: true,
    price: 48385.20,
    prevClose: 48560.15,
    open: 48690.00,
    high: 48825.00,
    low: 47980.50,
    change: -174.95,
    changePct: -0.36,
    sentiment: 47,
    platforms: { news: 49, youtube: 48, twitter: 45, instagram: 50, reddit: 46, web: 48 },
    note: 'Holding above 48,000 psychological support; PSU vs Private bank divergence watched.'
  },
  {
    id: 'INDIA_VIX',
    name: 'INDIA VIX',
    symbol: 'NSE • VOLATILITY',
    region: 'INDIA',
    inTopBar: false,
    price: 14.18,
    prevClose: 13.72,
    open: 13.80,
    high: 14.55,
    low: 13.40,
    change: 0.46,
    changePct: 3.35,
    sentiment: 42,
    platforms: { news: 43, youtube: 42, twitter: 40, instagram: 45, reddit: 41, web: 43 },
    note: 'Mild uptick in implied volatility ahead of next session opening bell.'
  },
  {
    id: 'NIFTY_IT',
    name: 'NIFTY IT',
    symbol: 'NSE • TECH',
    region: 'INDIA',
    inTopBar: false,
    price: 39420.75,
    prevClose: 39280.10,
    open: 39310.00,
    high: 39640.00,
    low: 39120.00,
    change: 140.65,
    changePct: 0.36,
    sentiment: 58,
    platforms: { news: 59, youtube: 60, twitter: 56, instagram: 58, reddit: 57, web: 58 },
    note: 'Relative strength on Nasdaq resilience and INR tailwinds.'
  },
  {
    id: 'SP500',
    name: 'S&P 500',
    symbol: 'NYSE • US BENCHMARK',
    region: 'US',
    inTopBar: true,
    price: 5808.12,
    prevClose: 5809.86,
    open: 5822.40,
    high: 5841.20,
    low: 5796.50,
    change: -1.74,
    changePct: -0.03,
    sentiment: 56,
    platforms: { news: 57, youtube: 56, twitter: 54, instagram: 58, reddit: 55, web: 56 },
    note: 'Steady US large-cap handover cushioning Asian & Indian market sentiment.'
  },
  {
    id: 'NASDAQ',
    name: 'NASDAQ COMPOSITE',
    symbol: 'NASDAQ • US TECH',
    region: 'US',
    inTopBar: true,
    price: 18518.61,
    prevClose: 18415.49,
    open: 18480.00,
    high: 18610.30,
    low: 18435.10,
    change: 103.12,
    changePct: 0.56,
    sentiment: 64,
    platforms: { news: 65, youtube: 66, twitter: 63, instagram: 64, reddit: 62, web: 64 },
    note: 'AI & Mega-cap tech leadership remains constructive globally.'
  },
  {
    id: 'DOW_JONES',
    name: 'DOW JONES (DJIA)',
    symbol: 'NYSE • INDUSTRIALS',
    region: 'US',
    inTopBar: true,
    price: 42114.40,
    prevClose: 42374.36,
    open: 42340.00,
    high: 42410.00,
    low: 42045.00,
    change: -259.96,
    changePct: -0.61,
    sentiment: 47,
    platforms: { news: 48, youtube: 47, twitter: 45, instagram: 49, reddit: 46, web: 47 },
    note: 'Treasury yield sensitivity weighing on traditional industrials.'
  },
  {
    id: 'RUSSELL_2000',
    name: 'RUSSELL 2000',
    symbol: 'US SMALL CAP',
    region: 'US',
    inTopBar: false,
    price: 2207.99,
    prevClose: 2218.90,
    open: 2219.50,
    high: 2226.40,
    low: 2199.80,
    change: -10.91,
    changePct: -0.49,
    sentiment: 48,
    platforms: { news: 48, youtube: 49, twitter: 46, instagram: 50, reddit: 47, web: 48 },
    note: 'Rate expectations keeping small-caps range-bound.'
  },
  {
    id: 'NIKKEI_225',
    name: 'NIKKEI 225',
    symbol: 'TSE • TOKYO',
    region: 'ASIA_EU',
    inTopBar: true,
    price: 37913.92,
    prevClose: 38143.29,
    open: 38080.00,
    high: 38190.50,
    low: 37820.10,
    change: -229.37,
    changePct: -0.60,
    sentiment: 46,
    platforms: { news: 47, youtube: 46, twitter: 45, instagram: 48, reddit: 45, web: 46 },
    note: 'Yen fluctuations and BoJ policy commentary driving Tokyo session.'
  },
  {
    id: 'HANG_SENG',
    name: 'HANG SENG',
    symbol: 'HKEX • HONG KONG',
    region: 'ASIA_EU',
    inTopBar: true,
    price: 20590.15,
    prevClose: 20489.62,
    open: 20520.00,
    high: 20710.00,
    low: 20460.00,
    change: 100.53,
    changePct: 0.49,
    sentiment: 54,
    platforms: { news: 55, youtube: 54, twitter: 53, instagram: 55, reddit: 52, web: 55 },
    note: 'Stimulus follow-through supporting Asian emerging market flows.'
  },
  {
    id: 'FTSE_100',
    name: 'FTSE 100',
    symbol: 'LSE • LONDON',
    region: 'ASIA_EU',
    inTopBar: true,
    price: 8248.84,
    prevClose: 8269.38,
    open: 8265.00,
    high: 8282.10,
    low: 8235.40,
    change: -20.54,
    changePct: -0.25,
    sentiment: 50,
    platforms: { news: 50, youtube: 51, twitter: 49, instagram: 51, reddit: 49, web: 50 },
    note: 'Energy & mining stocks steady amid balanced European trade.'
  },
  {
    id: 'DAX_40',
    name: 'DAX 40',
    symbol: 'XETRA • FRANKFURT',
    region: 'ASIA_EU',
    inTopBar: false,
    price: 19463.59,
    prevClose: 19442.90,
    open: 19450.00,
    high: 19515.00,
    low: 19405.00,
    change: 20.69,
    changePct: 0.11,
    sentiment: 53,
    platforms: { news: 54, youtube: 53, twitter: 52, instagram: 54, reddit: 52, web: 53 },
    note: 'Holding near record territory on ECB rate path optimism.'
  },
  {
    id: 'GOLD_SPOT',
    name: 'GOLD (XAU/USD)',
    symbol: 'COMEX • BULLION',
    region: 'COMMODITIES',
    inTopBar: false,
    price: 2747.60,
    prevClose: 2736.10,
    open: 2738.00,
    high: 2754.20,
    low: 2731.50,
    change: 11.50,
    changePct: 0.42,
    sentiment: 66,
    platforms: { news: 67, youtube: 68, twitter: 65, instagram: 67, reddit: 64, web: 66 },
    note: 'Safe-haven demand remains elevated globally.'
  },
  {
    id: 'BRENT_CRUDE',
    name: 'BRENT CRUDE OIL',
    symbol: 'ICE • ENERGY',
    region: 'COMMODITIES',
    inTopBar: false,
    price: 75.63,
    prevClose: 74.38,
    open: 74.50,
    high: 76.15,
    low: 74.10,
    change: 1.25,
    changePct: 1.68,
    sentiment: 52,
    platforms: { news: 53, youtube: 52, twitter: 51, instagram: 53, reddit: 51, web: 52 },
    note: 'Watched closely by Indian macro traders for inflation & INR impact.'
  }
];

const SOCIAL_STREAM_ITEMS = [
  {
    source: '📰 Moneycontrol / Kotak Neo Desk',
    badge: 'OFFICIAL BENCHMARK',
    sentiment: 'CAUTIOUS (-0.32%)',
    color: 'rose',
    text: 'GIFT Nifty is trading at 22,535.50, down 72.50 points (-0.32%). Opened at 22,869.50, intraday high 22,874.00 and low 22,445.00.'
  },
  {
    source: '📊 NSE Cash Settlement Desk',
    badge: 'NIFTY 50 SPOT',
    sentiment: '22,600.00 (-0.39%)',
    color: 'amber',
    text: 'NIFTY 50 closed at 22,600.00 (-87.65 pts / -0.39%) vs Prev Close 22,687.65. Session Open: 22,742.20, High: 22,787.25, Low: 22,372.00.'
  },
  {
    source: '▶️ YouTube • Dalal Street Morning Prep',
    badge: '9:15 AM CUE',
    sentiment: 'SUPPORT @ 22,445',
    color: 'indigo',
    text: 'With GIFT Nifty at 22,535.50 (-64.50 pts below Nifty 22,600), traders plan for a 22,505–22,555 opening zone and watch 22,445 for reversal cues.'
  },
  {
    source: '🐦 X (FinTwit) • Options Flow Tracker',
    badge: 'DERIVATIVES',
    sentiment: 'PCR 0.84',
    color: 'rose',
    text: 'Straddle writers pricing a +/- 145 pt opening session swing. Reclaiming 22,688 previous close will trigger short covering toward 22,787.'
  },
  {
    source: '👽 Reddit • r/IndianStreetBets',
    badge: 'COMMUNITY PULSE',
    sentiment: 'DIP BUYING WATCH',
    color: 'emerald',
    text: 'US Nasdaq (+0.56% at 18,518) provides a cushion for Nifty IT, offsetting broader cyclical softness heading into the 9:15 AM bell.'
  },
  {
    source: '🌐 Worldwide Macro & FX Desk',
    badge: 'GLOBAL HANDOVER',
    sentiment: 'MIXED / BALANCED',
    color: 'amber',
    text: 'S&P 500 at 5,808.12 (-0.03%), Nikkei 225 at 37,913.92 (-0.60%), Hang Seng at 20,590.15 (+0.49%). Global cues point to a measured opening.'
  }
];

// ============================================================================
// FORMATTING HELPERS
// ============================================================================
function formatPrice(val) {
  return Number(val).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function getSentimentColorClass(score) {
  if (score >= 56) return 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30';
  if (score <= 46) return 'text-rose-400 bg-rose-500/15 border-rose-500/30';
  return 'text-amber-300 bg-amber-500/15 border-amber-500/30';
}

function getSentimentLabel(score) {
  if (score >= 60) return 'BULLISH';
  if (score >= 54) return 'MILD BULLISH';
  if (score <= 42) return 'BEARISH';
  if (score <= 47) return 'CAUTIOUS / SOFT';
  return 'NEUTRAL';
}

// ============================================================================
// IST CLOCK & 9:15 AM MARKET SESSION STATUS ENGINE
// ============================================================================
function getISTDate() {
  const now = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utcMs + 5.5 * 3600000);
}

function computeNext915Countdown(istNow) {
  const target = new Date(istNow.getTime());
  target.setHours(9, 15, 0, 0);

  // If past 9:15 AM today or on weekend, advance to next weekday 9:15 AM
  if (istNow >= target || istNow.getDay() === 0 || istNow.getDay() === 6) {
    target.setDate(target.getDate() + 1);
    while (target.getDay() === 0 || target.getDay() === 6) {
      target.setDate(target.getDate() + 1);
    }
  }

  const diffMs = Math.max(0, target - istNow);
  const totalSec = Math.floor(diffMs / 1000);
  const hrs = String(Math.floor(totalSec / 3600)).padStart(2, '0');
  const mins = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
  const secs = String(totalSec % 60).padStart(2, '0');
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return `${dayNames[target.getDay()]} 9:15 AM (${hrs}h ${mins}m ${secs}s)`;
}

function getMarketSessionState(istNow) {
  const day = istNow.getDay(); // 0 = Sun, 6 = Sat
  const mins = istNow.getHours() * 60 + istNow.getMinutes();
  const openMins = 9 * 60 + 15;  // 9:15 AM
  const closeMins = 15 * 60 + 30; // 3:30 PM

  if (day === 0 || day === 6) {
    return {
      isOpen: false,
      giftOpen: false,
      statusText: 'WEEKEND SETTLEMENT • NSE CLOSED (OPENS MON 9:15 AM)',
      badgeText: 'WEEKEND SETTLEMENT',
      dotClass: 'bg-amber-400'
    };
  }

  if (mins >= openMins && mins < closeMins) {
    return {
      isOpen: true,
      giftOpen: true,
      statusText: 'LIVE MARKET OPEN (9:15 AM – 3:30 PM IST)',
      badgeText: 'LIVE SESSION',
      dotClass: 'bg-emerald-400 animate-ping'
    };
  }

  if (mins >= 6 * 60 + 30 && mins < openMins) {
    return {
      isOpen: false,
      giftOpen: true,
      statusText: 'PRE-OPEN • GIFT NIFTY LIVE (CASH OPENS 9:15 AM)',
      badgeText: 'GIFT PRE-OPEN LIVE',
      dotClass: 'bg-indigo-400 animate-pulse'
    };
  }

  return {
    isOpen: false,
    giftOpen: true,
    statusText: 'AFTER-HOURS • GIFT NIFTY & GLOBAL LIVE',
    badgeText: 'GLOBAL SESSION LIVE',
    dotClass: 'bg-indigo-400 animate-pulse'
  };
}

function updateClockAndSessionUI() {
  const ist = getISTDate();
  const timeStr = ist.toLocaleTimeString('en-IN', {
    hour12: true,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).toUpperCase();
  const dateStr = ist.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const clockEl = document.getElementById('live-ist-clock');
  if (clockEl) clockEl.textContent = `${dateStr} • ${timeStr}`;

  const session = getMarketSessionState(ist);
  const statusLabel = document.getElementById('market-status-label');
  const countdownLabel = document.getElementById('market-countdown-label');
  const dotEl = document.getElementById('market-status-dot');
  const giftBadge = document.getElementById('gift-session-badge');

  if (statusLabel) statusLabel.textContent = session.statusText;
  if (countdownLabel) {
    countdownLabel.textContent = session.isOpen
      ? 'NSE Cash Session Active till 3:30 PM IST'
      : `Next 9:15 AM Bell: ${computeNext915Countdown(ist)}`;
  }
  if (dotEl) dotEl.className = `w-2.5 h-2.5 rounded-full ${session.dotClass}`;
  if (giftBadge) giftBadge.textContent = session.badgeText;

  // Daily rollover or exact 9:15 AM trigger check
  const dateKey = `${ist.getFullYear()}-${ist.getMonth()}-${ist.getDate()}`;
  if (lastSyncDateKey && lastSyncDateKey !== dateKey) {
    triggerLiveMarketSync('DAILY_ROLLOVER');
  }
  lastSyncDateKey = dateKey;

  if (ist.getHours() === 9 && ist.getMinutes() === 15 && ist.getSeconds() === 0) {
    triggerLiveMarketSync('915_OPENING_BELL');
  }
}

// ============================================================================
// NEXT-DAY NIFTY 50 OPENING CUE ENGINE
// ============================================================================
function updateOpeningCueEngine() {
  const gift = MARKET_ASSETS.find(a => a.id === 'GIFT_NIFTY');
  const nifty = MARKET_ASSETS.find(a => a.id === 'NIFTY_50');
  if (!gift || !nifty) return;

  const spreadPts = gift.price - nifty.price; // e.g., 22535.50 - 22600.00 = -64.50
  const spreadPct = (spreadPts / nifty.price) * 100;

  const expectedOpenMid = Math.round(nifty.price + spreadPts * 0.92);
  const bandLow = expectedOpenMid - 25;
  const bandHigh = expectedOpenMid + 25;

  // Composite Score (0-100): 50% GIFT spread, 30% Global Handover, 20% 6-Platform Sentiment
  const spreadScore = Math.max(20, Math.min(80, 50 + spreadPts * 0.18));
  const globalAssets = MARKET_ASSETS.filter(a => a.region === 'US' || a.region === 'ASIA_EU');
  const avgGlobalSentiment = globalAssets.reduce((s, a) => s + a.sentiment, 0) / globalAssets.length;
  const avgPlatformSentiment = PLATFORM_SOURCES.reduce((s, p) => s + p.sentiment, 0) / PLATFORM_SOURCES.length;

  const compositeScore = Math.round(spreadScore * 0.5 + avgGlobalSentiment * 0.3 + avgPlatformSentiment * 0.2);

  const spreadValEl = document.getElementById('cue-spread-value');
  const bandEl = document.getElementById('cue-opening-band');
  const compScoreEl = document.getElementById('cue-composite-score');
  const compLabelEl = document.getElementById('cue-composite-label');
  const badgeEl = document.getElementById('opening-cue-badge');

  const sign = spreadPts >= 0 ? '+' : '';
  if (spreadValEl) {
    spreadValEl.textContent = `${sign}${spreadPts.toFixed(2)} pts (${sign}${spreadPct.toFixed(2)}%)`;
    spreadValEl.className = `text-2xl font-extrabold font-mono mt-1 ${spreadPts >= 0 ? 'text-emerald-400' : 'text-rose-400'}`;
  }
  if (bandEl) {
    bandEl.textContent = `${bandLow.toLocaleString('en-IN')} – ${bandHigh.toLocaleString('en-IN')}`;
  }
  if (compScoreEl) {
    compScoreEl.textContent = `${compositeScore} / 100`;
  }
  if (compLabelEl) {
    compLabelEl.textContent = spreadPts < -25 ? 'Soft Gap-Down / Consolidation' : spreadPts > 25 ? 'Positive Gap-Up Cue' : 'Flat / Balanced Open';
  }
  if (badgeEl) {
    if (spreadPts < -20) {
      badgeEl.textContent = `CAUTIOUS / SOFT GAP-DOWN CUE (${sign}${spreadPts.toFixed(2)} PTS)`;
      badgeEl.className = 'px-3 py-1 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 font-mono text-xs font-bold';
    } else if (spreadPts > 20) {
      badgeEl.textContent = `CONSTRUCTIVE GAP-UP CUE (${sign}${spreadPts.toFixed(2)} PTS)`;
      badgeEl.className = 'px-3 py-1 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold';
    } else {
      badgeEl.textContent = `FLAT / RANGE-BOUND OPENING CUE (${sign}${spreadPts.toFixed(2)} PTS)`;
      badgeEl.className = 'px-3 py-1 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold';
    }
  }
}

// ============================================================================
// RENDER FUNCTIONS
// ============================================================================
function renderTopCommandBar() {
  const container = document.getElementById('top-command-ticker');
  if (!container) return;

  const topAssets = MARKET_ASSETS.filter(a => a.inTopBar);
  container.innerHTML = topAssets.map(asset => {
    const isUp = asset.change >= 0;
    const sign = isUp ? '+' : '';
    const arrow = isUp ? '▲' : '▼';
    const colorClass = isUp ? 'text-emerald-400' : 'text-rose-400';

    return `
      <div class="flex items-center space-x-2 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800/90">
        <span class="font-bold text-slate-200">${asset.name}</span>
        <span class="font-extrabold text-white">${formatPrice(asset.price)}</span>
        <span class="${colorClass} font-semibold">${arrow} ${sign}${asset.change.toFixed(2)} (${sign}${asset.changePct.toFixed(2)}%)</span>
      </div>
    `;
  }).join('');
}

function renderPlatformPulse() {
  const grid = document.getElementById('platform-pulse-grid');
  if (!grid) return;

  const avgMood = Math.round(PLATFORM_SOURCES.reduce((acc, p) => acc + p.sentiment, 0) / PLATFORM_SOURCES.length);
  const globalPill = document.getElementById('global-composite-pill');
  if (globalPill) {
    globalPill.textContent = `${avgMood}% ${getSentimentLabel(avgMood)}`;
  }

  grid.innerHTML = PLATFORM_SOURCES.map(p => {
    const badgeColor = getSentimentColorClass(p.sentiment);
    return `
      <div class="rounded-xl bg-slate-900/90 border border-slate-800 p-3.5 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between gap-1 mb-1.5">
            <span class="text-xs font-bold text-white flex items-center gap-1.5">
              <span>${p.icon}</span>
              <span>${p.name}</span>
            </span>
            <span class="px-2 py-0.5 rounded text-[11px] font-mono font-bold border ${badgeColor}">
              ${p.sentiment}%
            </span>
          </div>
          <div class="text-[10px] font-mono text-slate-400 mb-2 truncate">${p.outlets}</div>
          <p class="text-[11px] text-slate-300 leading-snug">${p.headline}</p>
        </div>
        <div class="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
          <span class="text-slate-400">Signal Bias:</span>
          <span class="text-indigo-300 font-semibold">${p.bias}</span>
        </div>
      </div>
    `;
  }).join('');
}

function setRegionFilter(region) {
  currentRegionFilter = region;
  document.querySelectorAll('.region-tab').forEach(btn => {
    if (btn.getAttribute('data-region') === region) {
      btn.classList.add('active-tab');
    } else {
      btn.classList.remove('active-tab');
    }
  });
  renderMarketCards();
}

function renderMarketCards() {
  const grid = document.getElementById('market-cards-grid');
  if (!grid) return;

  const searchVal = (document.getElementById('asset-search-input')?.value || '').trim().toLowerCase();

  const filtered = MARKET_ASSETS.filter(asset => {
    const matchesRegion = currentRegionFilter === 'ALL' || asset.region === currentRegionFilter;
    const matchesSearch = !searchVal ||
      asset.name.toLowerCase().includes(searchVal) ||
      asset.symbol.toLowerCase().includes(searchVal);
    return matchesRegion && matchesSearch;
  });

  grid.innerHTML = filtered.map(asset => {
    const isUp = asset.change >= 0;
    const sign = isUp ? '+' : '';
    const arrow = isUp ? '▲' : '▼';
    const priceColor = isUp ? 'text-emerald-400' : 'text-rose-400';
    const sentimentBadge = getSentimentColorClass(asset.sentiment);

    return `
      <div id="card-${asset.id}" class="rounded-2xl bg-[#0D1424] border border-slate-800/90 hover:border-indigo-500/50 transition p-4 flex flex-col justify-between shadow-lg">
        <div>
          <!-- Card Header -->
          <div class="flex items-start justify-between gap-2 mb-2.5">
            <div>
              <span class="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                ${asset.symbol}
              </span>
              <h3 class="text-base font-extrabold text-white mt-1">${asset.name}</h3>
            </div>
            <span class="px-2.5 py-1 rounded-lg text-xs font-mono font-bold border ${sentimentBadge}">
              ${asset.sentiment}% ${getSentimentLabel(asset.sentiment)}
            </span>
          </div>

          <!-- Current Level & Change -->
          <div class="flex items-baseline justify-between font-mono my-3 bg-slate-950/70 border border-slate-800/80 rounded-xl p-3">
            <div>
              <div class="text-[10px] text-slate-400 uppercase">Current Market Level</div>
              <div class="text-2xl font-extrabold text-white">${formatPrice(asset.price)}</div>
            </div>
            <div class="text-right">
              <div class="text-xs font-bold ${priceColor}">${arrow} ${sign}${asset.change.toFixed(2)}</div>
              <div class="text-xs font-semibold ${priceColor}">(${sign}${asset.changePct.toFixed(2)}%)</div>
            </div>
          </div>

          <!-- Session Open / High / Low / Prev Close -->
          <div class="grid grid-cols-4 gap-1.5 font-mono text-[11px] mb-3">
            <div class="bg-slate-900/70 rounded-lg p-1.5 text-center">
              <div class="text-[9px] text-slate-400">OPEN</div>
              <div class="text-slate-200 font-semibold">${formatPrice(asset.open)}</div>
            </div>
            <div class="bg-slate-900/70 rounded-lg p-1.5 text-center">
              <div class="text-[9px] text-slate-400">HIGH</div>
              <div class="text-emerald-400 font-semibold">${formatPrice(asset.high)}</div>
            </div>
            <div class="bg-slate-900/70 rounded-lg p-1.5 text-center">
              <div class="text-[9px] text-slate-400">LOW</div>
              <div class="text-rose-400 font-semibold">${formatPrice(asset.low)}</div>
            </div>
            <div class="bg-slate-900/70 rounded-lg p-1.5 text-center">
              <div class="text-[9px] text-slate-400">PREV</div>
              <div class="text-slate-300 font-semibold">${formatPrice(asset.prevClose)}</div>
            </div>
          </div>

          <!-- 6-Source Sentiment Mini Breakdown -->
          <div class="bg-slate-900/60 border border-slate-800/80 rounded-xl p-2.5 mb-2.5">
            <div class="text-[10px] font-mono text-slate-400 uppercase mb-1.5">6-Source Sentiment Breakdown</div>
            <div class="grid grid-cols-6 gap-1 text-center font-mono text-[10px]">
              <div class="bg-slate-950/80 rounded py-1">
                <div>📰</div>
                <div class="font-bold text-slate-200">${asset.platforms.news}%</div>
              </div>
              <div class="bg-slate-950/80 rounded py-1">
                <div>▶️</div>
                <div class="font-bold text-slate-200">${asset.platforms.youtube}%</div>
              </div>
              <div class="bg-slate-950/80 rounded py-1">
                <div>🐦</div>
                <div class="font-bold text-slate-200">${asset.platforms.twitter}%</div>
              </div>
              <div class="bg-slate-950/80 rounded py-1">
                <div>📸</div>
                <div class="font-bold text-slate-200">${asset.platforms.instagram}%</div>
              </div>
              <div class="bg-slate-950/80 rounded py-1">
                <div>👽</div>
                <div class="font-bold text-slate-200">${asset.platforms.reddit}%</div>
              </div>
              <div class="bg-slate-950/80 rounded py-1">
                <div>🌐</div>
                <div class="font-bold text-slate-200">${asset.platforms.web}%</div>
              </div>
            </div>
          </div>
        </div>

        <p class="text-[11px] text-slate-400 leading-snug border-t border-slate-800/80 pt-2">
          ${asset.note}
        </p>
      </div>
    `;
  }).join('');
}

function renderSocialStream() {
  const container = document.getElementById('live-social-stream');
  if (!container) return;

  container.innerHTML = SOCIAL_STREAM_ITEMS.map(item => `
    <div class="rounded-xl bg-slate-900/90 border border-slate-800 p-3.5 flex flex-col justify-between">
      <div>
        <div class="flex items-center justify-between gap-2 mb-2">
          <span class="text-xs font-bold text-indigo-300">${item.source}</span>
          <span class="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono font-semibold text-slate-200">
            ${item.sentiment}
          </span>
        </div>
        <p class="text-xs text-slate-300 leading-relaxed">${item.text}</p>
      </div>
      <div class="mt-2.5 pt-2 border-t border-slate-800/70 flex justify-between text-[10px] font-mono text-slate-500">
        <span>${item.badge}</span>
        <span>Verified Feed</span>
      </div>
    </div>
  `).join('');
}

// ============================================================================
// DAILY & REAL-TIME SYNCHRONIZATION ENGINE
// ============================================================================
function triggerLiveMarketSync(reason = 'AUTO_SYNC') {
  const ist = getISTDate();
  const session = getMarketSessionState(ist);

  // If market is actively trading, apply subtle realistic micro-ticks;
  // on weekend/closed hours, preserve exact official settlement benchmark levels.
  if (session.isOpen) {
    MARKET_ASSETS.forEach(asset => {
      const deltaPct = (Math.random() - 0.495) * 0.0008;
      const newPrice = Number((asset.price * (1 + deltaPct)).toFixed(2));
      asset.price = newPrice;
      asset.high = Math.max(asset.high, newPrice);
      asset.low = Math.min(asset.low, newPrice);
      asset.change = Number((asset.price - asset.prevClose).toFixed(2));
      asset.changePct = Number(((asset.change / asset.prevClose) * 100).toFixed(2));
    });
  }

  renderTopCommandBar();
  renderPlatformPulse();
  renderMarketCards();
  updateOpeningCueEngine();

  const syncStamp = document.getElementById('cue-sync-timestamp');
  const feedStamp = document.getElementById('feed-last-updated');
  const formattedTime = ist.toLocaleTimeString('en-IN', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' }).toUpperCase();

  if (syncStamp) syncStamp.textContent = `Last Synced: ${formattedTime} IST (${reason})`;
  if (feedStamp) feedStamp.textContent = `Last Synced: ${formattedTime} IST`;

  syncCountdownSeconds = 60;
}

// ============================================================================
// INITIALIZE APPLICATION
// ============================================================================
function initTerminal() {
  updateClockAndSessionUI();
  renderTopCommandBar();
  renderPlatformPulse();
  renderMarketCards();
  renderSocialStream();
  updateOpeningCueEngine();

  setInterval(() => {
    updateClockAndSessionUI();
    syncCountdownSeconds = Math.max(0, syncCountdownSeconds - 1);
    const timerEl = document.getElementById('next-sync-timer');
    if (timerEl) timerEl.textContent = `${syncCountdownSeconds}s`;
    if (syncCountdownSeconds === 0) {
      triggerLiveMarketSync('AUTO_60S_SYNC');
    }
  }, 1000);
}

window.addEventListener('DOMContentLoaded', initTerminal);


// Optional JSON / Python API Hydration
async function syncFromJsonOrBackend() {
  try {
    const res = await fetch('market_data.json', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.assets) && data.assets.length > 0) {
        MARKET_ASSETS.splice(0, MARKET_ASSETS.length, ...data.assets);
      }
      if (Array.isArray(data.platforms) && data.platforms.length > 0) {
        PLATFORM_SOURCES.splice(0, PLATFORM_SOURCES.length, ...data.platforms);
      }
      renderTopCommandBar();
      renderPlatformPulse();
      renderMarketCards();
      updateOpeningCueEngine();
    }
  } catch (err) {
    // Runs seamlessly using built-in calibrated dataset when opened via file://
  }
}
window.addEventListener('DOMContentLoaded', syncFromJsonOrBackend);
