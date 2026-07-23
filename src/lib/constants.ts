// ── Brand / external links ──────────────────────────────────────────────────
// MQTRADE PRO YouTube channel — used by the Webinars dashboard for the
// "Subscribe" button and as the fallback live-stream destination.
export const MQTRADE_YOUTUBE_ID = "UCgt_QgYoonLvY0OICqjJ5Mw";
export const MQTRADE_YOUTUBE = `https://www.youtube.com/channel/${MQTRADE_YOUTUBE_ID}`;
// Direct link to the channel's current/most-recent live stream.
export const MQTRADE_YOUTUBE_LIVE = `${MQTRADE_YOUTUBE}/live`;

export const MQTRADE_TELEGRAM = "https://t.me/TonnyFxacademy";

// ── Product catalog (paid add-ons, separate from the $50 subscription) ───────
export const PRODUCTS = {
  mentorship: {
    key: "mentorship",
    name: "1-on-1 Mentorship",
    price: 150,
    priceUnit: "session",
    priceLabel: "$150 / session",
  },
  prop_firm: {
    key: "prop_firm",
    name: "Prop Firm Prep",
    price: 79,
    priceUnit: "month",
    priceLabel: "$79 / month",
  },
} as const;

export type ProductKey = keyof typeof PRODUCTS;

// ── YouTube helpers ─────────────────────────────────────────────────────────
/** Extract a YouTube video/live ID from any common URL shape. */
export function youTubeId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/live\/|youtube\.com\/embed\/)([\w-]{11})/,
    /[?&]v=([\w-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

export function youTubeEmbed(url: string): string | null {
  const id = youTubeId(url);
  return id ? `https://www.youtube.com/embed/${id}` : null;
}

export function youTubeThumb(url: string): string | null {
  const id = youTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}
