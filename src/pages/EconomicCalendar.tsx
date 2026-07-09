import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard, Signal, LineChart, MessageSquare, Settings,
  LogOut, BookOpen, Users, Calendar, Trophy, Video, BarChart2,
  Sun, Moon, RefreshCw, Clock, AlertTriangle, ChevronDown, ChevronUp,
} from "lucide-react";
import { toast } from "sonner";

// ── Types ──────────────────────────────────────────────────────────────────
interface CalEvent {
  title: string;
  country: string;
  date: string;
  impact: "High" | "Medium" | "Low" | "Holiday";
  forecast: string;
  previous: string;
  actual: string;
}

interface DaySummary {
  label: string;
  dateKey: string;
  isToday: boolean;
  events: CalEvent[];
  high: number;
  medium: number;
  low: number;
  holiday: number;
}

// ── Constants ──────────────────────────────────────────────────────────────
const FLAGS: Record<string, string> = {
  USD:"🇺🇸", EUR:"🇪🇺", GBP:"🇬🇧", JPY:"🇯🇵",
  AUD:"🇦🇺", CAD:"🇨🇦", CHF:"🇨🇭", NZD:"🇳🇿",
  CNY:"🇨🇳", HKD:"🇭🇰", SGD:"🇸🇬", SEK:"🇸🇪",
  NOK:"🇳🇴", MXN:"🇲🇽", ZAR:"🇿🇦", KRW:"🇰🇷",
};

const IMPACT_ORDER: Record<string, number> = { High: 0, Medium: 1, Low: 2, Holiday: 3 };

const IMPACT_CONFIG = {
  High:    { dot: "bg-red-500",    pill: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30",    row: "border-l-red-500",    label: "High",    countBg: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/25" },
  Medium:  { dot: "bg-amber-500",  pill: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30", row: "border-l-amber-500", label: "Medium",  countBg: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/25" },
  Low:     { dot: "bg-sky-500",    pill: "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30",    row: "border-l-sky-500",    label: "Low",     countBg: "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/25" },
  Holiday: { dot: "bg-gray-400",   pill: "bg-gray-500/15 text-gray-500 border-gray-400/30",                   row: "border-l-gray-400",   label: "Holiday", countBg: "bg-gray-500/10 text-gray-500 border-gray-400/20" },
};

const CURRENCIES = ["All","USD","EUR","GBP","JPY","AUD","CAD","CHF","NZD","CNY"];

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard",        href: "/dashboard" },
  { icon: Signal,          label: "Signals",           href: "/dashboard" },
  { icon: LineChart,       label: "Strategies",        href: "/dashboard" },
  { icon: MessageSquare,   label: "Telegram",          href: "https://t.me/TonnyFxacademy" },
  { icon: BookOpen,        label: "Trading Journal",   href: "/journal" },
  { icon: Calendar,        label: "Economic Calendar", href: "/calendar", active: true },
  { icon: Settings,        label: "Settings",          href: "/settings" },
];

const extraProducts = [
  { icon: Users,     label: "1-on-1 Mentorship",      badge: "$150/session", color: "text-violet-500", bg: "from-violet-500/15 to-purple-500/5" },
  { icon: Trophy,    label: "Prop Firm Prep",          badge: "$79/month",    color: "text-amber-500",  bg: "from-amber-500/15 to-orange-500/5" },
  { icon: BookOpen,  label: "Trading Journal",         badge: "Included",     color: "text-emerald-500",bg: "from-emerald-500/15 to-teal-500/5", href: "/journal" },
  { icon: Video,     label: "Live Webinars",           badge: "Included",     color: "text-sky-500",    bg: "from-sky-500/15 to-blue-500/5" },
  { icon: BarChart2, label: "Market Analysis Reports", badge: "Included",     color: "text-blue-500",   bg: "from-blue-500/15 to-indigo-500/5" },
  { icon: Calendar,  label: "Economic Calendar",       badge: "Live",         color: "text-rose-500",   bg: "from-rose-500/15 to-pink-500/5",   href: "/calendar" },
];

// ── Helpers ────────────────────────────────────────────────────────────────
function toDateKey(iso: string) {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? iso.slice(0, 10) : d.toISOString().slice(0, 10);
}
function formatDateLabel(key: string) {
  const d = new Date(key + "T12:00:00");
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}
function formatTime(iso: string) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "All Day";
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
}
function todayKey() {
  return new Date().toISOString().slice(0, 10);
}
function isPast(iso: string) {
  return new Date(iso) < new Date();
}

// ── Day Card ───────────────────────────────────────────────────────────────
function DayCard({ day, filterCurrency }: { day: DaySummary; filterCurrency: string }) {
  const [open, setOpen] = useState(day.isToday);

  const events = filterCurrency === "All"
    ? day.events
    : day.events.filter(e => e.country === filterCurrency);

  if (events.length === 0) return null;

  const high    = events.filter(e => e.impact === "High").length;
  const medium  = events.filter(e => e.impact === "Medium").length;
  const low     = events.filter(e => e.impact === "Low").length;
  const holiday = events.filter(e => e.impact === "Holiday").length;

  return (
    <div className={`rounded-2xl border overflow-hidden shadow-sm transition-all duration-300 ${
      day.isToday ? "border-primary/40 shadow-primary/10" : "border-border"
    } bg-card`}>

      {/* Day header — always visible */}
      <button
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center justify-between px-5 py-4 transition-colors hover:bg-secondary/50 ${
          day.isToday ? "bg-primary/8" : "bg-secondary/30"
        }`}
      >
        <div className="flex items-center gap-3 flex-wrap">
          {/* Date */}
          <div className="flex items-center gap-2">
            {day.isToday && (
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse flex-shrink-0" />
            )}
            <span className={`font-display font-bold text-base ${day.isToday ? "text-primary" : "text-foreground"}`}>
              {day.isToday ? "TODAY — " : ""}{day.label}
            </span>
          </div>

          {/* Impact counts */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {high > 0 && (
              <span className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${IMPACT_CONFIG.High.countBg}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                {high} High
              </span>
            )}
            {medium > 0 && (
              <span className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${IMPACT_CONFIG.Medium.countBg}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                {medium} Medium
              </span>
            )}
            {low > 0 && (
              <span className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${IMPACT_CONFIG.Low.countBg}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                {low} Low
              </span>
            )}
            {holiday > 0 && (
              <span className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${IMPACT_CONFIG.Holiday.countBg}`}>
                {holiday} Holiday
              </span>
            )}
            <span className="text-xs text-muted-foreground ml-1">
              · {events.length} total event{events.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <div className="flex-shrink-0 ml-3">
          {open
            ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
            : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </div>
      </button>

      {/* Events list */}
      {open && (
        <div className="divide-y divide-border/60">
          {/* Column headers */}
          <div className="hidden md:grid md:grid-cols-[110px_80px_1fr_100px_90px_90px_90px] gap-3 px-5 py-2.5 bg-secondary/50 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            <span>Time</span>
            <span>Currency</span>
            <span>Event</span>
            <span>Impact</span>
            <span className="text-right">Actual</span>
            <span className="text-right">Forecast</span>
            <span className="text-right">Previous</span>
          </div>

          {events.map((ev, i) => {
            const cfg     = IMPACT_CONFIG[ev.impact] ?? IMPACT_CONFIG.Low;
            const past    = isPast(ev.date);
            const hasActual = ev.actual && ev.actual.trim() !== "";

            return (
              <div
                key={i}
                className={`grid grid-cols-1 md:grid-cols-[110px_80px_1fr_100px_90px_90px_90px] gap-2 md:gap-3 items-center px-5 py-3.5 border-l-[3px] transition-colors hover:bg-secondary/30 ${cfg.row} ${
                  past ? "opacity-60" : ""
                }`}
              >
                {/* Time */}
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                  <span className="text-xs font-semibold text-foreground">{formatTime(ev.date)}</span>
                </div>

                {/* Currency */}
                <div className="flex items-center gap-1.5">
                  <span className="text-lg leading-none">{FLAGS[ev.country] ?? "🌐"}</span>
                  <span className="text-xs font-bold text-foreground">{ev.country}</span>
                </div>

                {/* Event name */}
                <div className="flex items-start gap-2">
                  {!past && ev.impact === "High" && (
                    <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
                  )}
                  <span className="text-sm font-medium text-foreground leading-snug">{ev.title}</span>
                </div>

                {/* Impact badge */}
                <div>
                  <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border ${cfg.pill}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                    {cfg.label}
                  </span>
                </div>

                {/* Actual */}
                <div className="text-right">
                  {hasActual
                    ? <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{ev.actual}</span>
                    : <span className="text-muted-foreground text-xs">—</span>}
                </div>

                {/* Forecast */}
                <div className="text-right">
                  <span className="text-sm font-medium text-foreground">{ev.forecast || <span className="text-muted-foreground text-xs">—</span>}</span>
                </div>

                {/* Previous */}
                <div className="text-right">
                  <span className="text-xs text-muted-foreground">{ev.previous || "—"}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function EconomicCalendar() {
  const { user, subscription, isLoading, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [days, setDays]                   = useState<DaySummary[]>([]);
  const [fetching, setFetching]           = useState(true);
  const [lastUpdated, setLastUpdated]     = useState<Date | null>(null);
  const [filterCurrency, setFilterCurrency] = useState("All");
  const [view, setView]                   = useState<"thisweek" | "nextweek" | "thismonth">("thisweek");
  const [error, setError]                 = useState<string | null>(null);
  const [useFallback, setUseFallback]     = useState(false);
  const tvRef                             = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoading) return;
    if (!user) { navigate("/auth"); return; }
    if (!subscription?.active) { navigate("/payment"); return; }
  }, [user, subscription, isLoading, navigate]);

  // TradingView fallback widget
  useEffect(() => {
    if (!useFallback || !tvRef.current) return;
    const container = tvRef.current;
    container.innerHTML = "";
    const widget = document.createElement("div");
    widget.className = "tradingview-widget-container__widget";
    container.appendChild(widget);
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-events.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      colorTheme: theme,
      isTransparent: true,
      width: "100%",
      height: "650",
      locale: "en",
      importanceFilter: "-1,0,1",
      countryFilter: "us,eu,gb,jp,au,ca,ch,nz,cn",
    });
    container.appendChild(script);
    return () => { container.innerHTML = ""; };
  }, [useFallback, theme]);

  const fetchCalendar = useCallback(async () => {
    setFetching(true);
    setError(null);
    setUseFallback(false);

    // Try multiple sources in order
    const base = `https://nfs.faireconomy.media/ff_calendar_${view}.json`;
    const sources = [
      `/api/calendar/ff_calendar_${view}.json`,
      `https://corsproxy.io/?${base}`,
      `https://api.allorigins.win/get?url=${encodeURIComponent(base)}`,
      `https://api.codetabs.com/v1/proxy?quest=${base}`,
      `https://thingproxy.freeboard.io/fetch/${base}`,
    ];

    let data: CalEvent[] | null = null;

    for (const url of sources) {
      try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) continue;
        const json = await res.json();
        // allorigins wraps in { contents: "..." }
        data = typeof json === "string"
          ? JSON.parse(json)
          : Array.isArray(json)
            ? json
            : json.contents
              ? JSON.parse(json.contents)
              : null;
        if (data && Array.isArray(data) && data.length > 0) break;
      } catch { continue; }
    }

    if (!data || !Array.isArray(data) || data.length === 0) {
      if (view === "nextweek") {
        setError("Next week's calendar is not published yet. Forex Factory releases it on Thursday or Friday.");
      } else {
        setUseFallback(true);
      }
      setFetching(false);
      return;
    }

    // Sort each day: High → Medium → Low → Holiday, then by time
    const grouped: Record<string, CalEvent[]> = {};
    for (const ev of data) {
      const key = toDateKey(ev.date);
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(ev);
    }

    const today = todayKey();
    const sorted: DaySummary[] = Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, evs]) => {
        const sortedEvs = [...evs].sort((a, b) => {
          const impDiff = (IMPACT_ORDER[a.impact] ?? 3) - (IMPACT_ORDER[b.impact] ?? 3);
          if (impDiff !== 0) return impDiff;
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
        return {
          label:    formatDateLabel(key),
          dateKey:  key,
          isToday:  key === today,
          events:   sortedEvs,
          high:     sortedEvs.filter(e => e.impact === "High").length,
          medium:   sortedEvs.filter(e => e.impact === "Medium").length,
          low:      sortedEvs.filter(e => e.impact === "Low").length,
          holiday:  sortedEvs.filter(e => e.impact === "Holiday").length,
        };
      });

    setDays(sorted);
    setLastUpdated(new Date());
    setFetching(false);
  }, [view]);

  useEffect(() => { fetchCalendar(); }, [fetchCalendar]);
  // Auto-refresh every 5 min
  useEffect(() => {
    const id = setInterval(fetchCalendar, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, [fetchCalendar]);

  const displayName = user?.name
    ? user.name.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
    : "Trader";
  const initials = displayName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  // Week totals
  const totalHigh   = days.reduce((s, d) => s + d.high, 0);
  const totalMedium = days.reduce((s, d) => s + d.medium, 0);
  const totalLow    = days.reduce((s, d) => s + d.low, 0);
  const totalEvents = days.reduce((s, d) => s + d.events.length, 0);

  if (isLoading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex gap-0">

      {/* Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-rose-500/8 dark:bg-rose-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 right-0 w-80 h-80 bg-amber-500/8 dark:bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <Sidebar />

      {/* ── Main ── */}
      <main className="relative z-10 flex-1 overflow-auto">

        {/* Header */}
        <header className="sticky top-0 z-20 bg-background/95 dark:bg-background/70 backdrop-blur-2xl border-b border-border shadow-sm dark:shadow-none">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  Live · Auto-refresh 5 min
                </span>
                {lastUpdated && (
                  <span className="text-[11px] text-muted-foreground hidden sm:block">
                    Updated {lastUpdated.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                )}
              </div>
              <h1 className="font-display text-xl font-bold text-foreground">Economic Calendar</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={fetchCalendar} disabled={fetching}
                className="w-9 h-9 rounded-xl bg-secondary border border-border hover:bg-secondary/80">
                <RefreshCw className={`w-4 h-4 ${fetching ? "animate-spin" : ""}`} />
              </Button>
              <Button variant="ghost" size="icon" onClick={toggleTheme}
                className="w-9 h-9 rounded-xl bg-secondary border border-border hover:bg-secondary/80">
                {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-500" />}
              </Button>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-5">

          {/* Week summary stat bubbles */}
          {!fetching && !error && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Total Events",   value: totalEvents,  color: "text-foreground",    border: "border-border",           bg: "from-secondary/80 to-secondary/30" },
                { label: "High Impact",    value: totalHigh,    color: "text-red-600 dark:text-red-400",    border: "border-red-500/30",    bg: "from-red-500/15 to-red-500/5" },
                { label: "Medium Impact",  value: totalMedium,  color: "text-amber-600 dark:text-amber-400", border: "border-amber-500/30",  bg: "from-amber-500/15 to-amber-500/5" },
                { label: "Low Impact",     value: totalLow,     color: "text-sky-600 dark:text-sky-400",     border: "border-sky-500/30",    bg: "from-sky-500/15 to-sky-500/5" },
              ].map(s => (
                <div key={s.label} className={`rounded-2xl border ${s.border} bg-gradient-to-br ${s.bg} p-4 shadow-sm`}>
                  <p className={`font-display text-3xl font-black ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-muted-foreground font-medium mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Controls row */}
          <div className="flex flex-wrap items-center gap-3">
            {/* View toggle */}
            <div className="flex gap-1 bg-secondary border border-border rounded-xl p-1">
              {([
                { key: "thisweek",  label: "This Week" },
                { key: "nextweek",  label: "Next Week" },
                { key: "thismonth", label: "This Month" },
              ] as const).map(v => (
                <button key={v.key} onClick={() => setView(v.key)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    view === v.key ? "bg-primary text-primary-foreground shadow-md shadow-primary/25" : "text-muted-foreground hover:text-foreground"
                  }`}>
                  {v.label}
                </button>
              ))}
            </div>

            {/* Currency filter */}
            <div className="flex flex-wrap gap-1.5">
              {CURRENCIES.map(c => (
                <button key={c} onClick={() => setFilterCurrency(c)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    filterCurrency === c
                      ? "bg-foreground text-background border-foreground"
                      : "bg-secondary text-muted-foreground border-border hover:text-foreground hover:border-foreground/30"
                  }`}>
                  {c !== "All" ? `${FLAGS[c] ?? ""} ${c}` : "All Currencies"}
                </button>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 flex-wrap">
            {[
              { dot: "bg-red-500",   label: "High Impact — market-moving events" },
              { dot: "bg-amber-500", label: "Medium Impact" },
              { dot: "bg-sky-500",   label: "Low Impact" },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className={`w-2.5 h-2.5 rounded-full ${l.dot}`} />
                {l.label}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          {useFallback ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 px-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Live data source unavailable — showing TradingView calendar instead
                </div>
                <Button onClick={fetchCalendar} variant="outline" size="sm" className="ml-auto">
                  <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Retry custom view
                </Button>
              </div>
              <div className="rounded-2xl border border-border overflow-hidden shadow-lg bg-card">
                <div ref={tvRef} className="tradingview-widget-container" style={{ minHeight: 650 }} />
              </div>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-10 text-center">
              <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
              <p className="font-semibold text-foreground mb-2">Next Week Not Available Yet</p>
              <p className="text-sm text-muted-foreground mb-5 max-w-md mx-auto">{error}</p>
              <div className="flex items-center justify-center gap-3">
                <Button onClick={() => setView("thismonth")} size="sm">View This Month</Button>
                <Button onClick={fetchCalendar} variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" /> Retry
                </Button>
              </div>
            </div>
          ) : fetching ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden">
                  <div className="h-16 bg-secondary/50 animate-pulse" />
                </div>
              ))}
            </div>
          ) : days.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-10 text-center">
              <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="font-semibold">No events found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {days.map(day => (
                <DayCard key={day.dateKey} day={day} filterCurrency={filterCurrency} />
              ))}
            </div>
          )}

          <p className="text-center text-xs text-muted-foreground pb-2">
            Data sourced from Forex Factory via faireconomy.media · Sorted High → Medium → Low
          </p>
        </div>
      </main>
    </div>
  );
}
