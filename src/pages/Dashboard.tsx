import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import SessionsClock from "@/components/SessionsClock";
import Sidebar from "@/components/Sidebar";
import {
  LayoutDashboard, TrendingUp, LineChart, Send, BookOpen,
  Calendar, Settings, LogOut, Bell, Sun, Moon,
  ArrowUpRight, ArrowDownRight, CheckCircle, ExternalLink,
  Zap, Target, Wallet, Activity, BarChart2, ChevronRight,
  Camera, Upload, Check, X, Menu, Users, Trophy, Video,
  Calculator, Gift, PlusCircle, ChevronLeft,
} from "lucide-react";

interface Announcement { id: string; title: string; body: string; type: string }

const mockSignals = [
  { id: 1, asset: "BTC/USD",  type: "BUY",  entry: "64,200", sl: "63,800", tp: ["65,500","66,200"], status: "active",  timeframe: "H4", session: "New York",  timestamp: "1h ago" },
  { id: 2, asset: "EUR/USD",  type: "SELL", entry: "1.0850",  sl: "1.0875",  tp: ["1.0800","1.0750"], status: "active",  timeframe: "H1", session: "London",   timestamp: "3h ago" },
  { id: 3, asset: "XAU/USD",  type: "BUY",  entry: "2,035",   sl: "2,020",   tp: ["2,050","2,065"],   status: "tp_hit",  timeframe: "H4", session: "London",   timestamp: "6h ago" },
  { id: 4, asset: "NAS100",   type: "SELL", entry: "18,450",  sl: "18,520",  tp: ["18,380","18,300"], status: "sl_hit",  timeframe: "M30",session: "New York",  timestamp: "8h ago" },
];

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard",        href: "/dashboard" },
  { icon: TrendingUp,      label: "Signals",           href: "/dashboard" },
  { icon: LineChart,       label: "Strategies",        href: "/dashboard" },
  { icon: Send,            label: "Telegram",          href: "https://t.me/TonnyFxacademy" },
  { icon: BookOpen,        label: "Trading Journal",   href: "/journal" },
  { icon: BarChart2,       label: "Performance",       href: "/performance" },
  { icon: Calculator,      label: "Calculator",        href: "/calculator" },
  { icon: Calendar,        label: "Economic Calendar", href: "/calendar" },
  { icon: Gift,            label: "Referral",          href: "/referral" },
  { icon: Settings,        label: "Settings",          href: "/settings" },
];

export default function Dashboard() {
  const { user, subscription, isLoading, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter]        = useState("all");
  const [announcements, setAnnouncements]       = useState<Announcement[]>([]);
  const [avatarUrl, setAvatarUrl]               = useState<string | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [avatarPreview, setAvatarPreview]       = useState<string | null>(null);
  const [avatarFile, setAvatarFile]             = useState<File | null>(null);
  const [uploading, setUploading]               = useState(false);
  const [uploadDone, setUploadDone]             = useState(false);
  const fileRef                                 = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isLoading) return;
    if (!user) { navigate("/auth"); return; }
    if (!subscription?.active) { navigate("/payment"); return; }
  }, [user, subscription, isLoading, navigate]);

  useEffect(() => {
    supabase.from("announcements").select("id,title,body,type")
      .order("pinned", { ascending: false }).order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setAnnouncements(data); });
  }, []);

  useEffect(() => {
    if (user) {
      const url = (user as any).user_metadata?.avatar_url ?? null;
      // Only load from metadata on first mount — don't overwrite a freshly uploaded URL
      setAvatarUrl(prev => prev ?? url);
    }
  }, [user]);

  const displayName = user?.name
    ? user.name.split(" ").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
    : "Trader";
  const firstName = displayName.split(" ")[0];
  const initials  = displayName.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();

  const filteredSignals = mockSignals.filter(s =>
    activeFilter === "all" ? true : s.status === activeFilter
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    setAvatarFile(f); setAvatarPreview(URL.createObjectURL(f)); setUploadDone(false);
  };

  const uploadAvatar = async () => {
    if (!avatarFile || !user) return;
    setUploading(true);
    const ext = avatarFile.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;
    const { error } = await supabase.storage.from("avatars").upload(path, avatarFile, { upsert: true });
    if (error) {
      toast.error(
        error.message.includes("Bucket not found")
          ? "Storage bucket missing — go to Supabase → Storage → create an 'avatars' bucket (public)"
          : `Upload failed: ${error.message}`
      );
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    // Cache-bust so browser always loads the new image
    const freshUrl = `${data.publicUrl}?t=${Date.now()}`;
    const { error: updateErr } = await supabase.auth.updateUser({ data: { avatar_url: freshUrl } });
    if (updateErr) {
      toast.error(`Profile update failed: ${updateErr.message}`);
      setUploading(false);
      return;
    }
    setAvatarUrl(freshUrl);
    setUploadDone(true);
    toast.success("Profile picture updated!");
    setTimeout(() => { setShowProfileModal(false); setAvatarPreview(null); setAvatarFile(null); setUploadDone(false); }, 1400);
    setUploading(false);
  };

  const AvatarImg = ({ size = 36, radius = "rounded-full" }: { size?: number; radius?: string }) => (
    <div className={`${radius} overflow-hidden flex-shrink-0`} style={{ width: size, height: size }}>
      {avatarUrl
        ? <img src={avatarUrl} alt="av" className="w-full h-full object-cover" />
        : <div className="w-full h-full flex items-center justify-center font-black text-white text-xs"
            style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>{initials}</div>}
    </div>
  );

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100">

      <Sidebar />

      {/* ───────────────── MAIN ───────────────── */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">

        {/* ── Top header ── */}
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-5 border-b border-white/5"
          style={{ background: "rgba(12,18,34,0.95)", backdropFilter: "blur(16px)" }}>
          {/* Greeting (offset on mobile to clear the sidebar hamburger) */}
          <div className="hidden md:block">
            <p className="text-lg font-bold text-white">Good {new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 17 ? "Afternoon" : "Evening"}, {firstName} 👋</p>
            <p className="text-xs text-slate-500">{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p>
          </div>

          {/* Mobile title */}
          <span className="md:hidden font-bold text-white pl-12">Dashboard</span>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Markets open */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-400">Markets Open</span>
            </div>
            {/* Theme */}
            <button onClick={toggleTheme}
              className="w-9 h-9 rounded-xl flex items-center justify-center border border-white/8 hover:bg-white/5 transition-all text-slate-400 hover:text-white">
              {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
            {/* Bell */}
            <button className="relative w-9 h-9 rounded-xl flex items-center justify-center border border-white/8 hover:bg-white/5 transition-all text-slate-400 hover:text-white">
              <Bell className="w-4 h-4" />
              {announcements.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                  {announcements.length}
                </span>
              )}
            </button>
            {/* Avatar */}
            <button onClick={() => setShowProfileModal(true)}
              className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl border border-white/8 hover:bg-white/5 hover:border-indigo-500/30 transition-all">
              <AvatarImg size={30} radius="rounded-lg" />
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold text-white leading-tight">{firstName}</p>
                <p className="text-[10px] text-slate-500">Pro Member</p>
              </div>
            </button>
          </div>
        </header>

        {/* ── Ticker ── */}
        <div className="hidden md:block overflow-hidden border-b border-white/5" style={{ background: "#080f1e" }}>
          <div className="stitch-ticker py-2 font-mono text-[11px] whitespace-nowrap">
            {[
              { pair: "GBP/USD", price: "1.2710", pct: "-0.3%", up: false },
              { pair: "US30",    price: "38,920", pct: "+0.9%", up: true },
              { pair: "BTC/USD", price: "64,230", pct: "+2.4%", up: true },
              { pair: "ETH/USD", price: "3,450",  pct: "-0.8%", up: false },
              { pair: "XAU/USD", price: "2,038",  pct: "+0.5%", up: true },
              { pair: "EUR/USD", price: "1.0845", pct: "+0.1%", up: true },
              { pair: "NAS100",  price: "18,342", pct: "+1.2%", up: true },
              { pair: "SOL/USD", price: "145.60", pct: "+5.1%", up: true },
              ...announcements.map(a => ({ pair: "⚡ ALERT", price: a.title, pct: "", up: true })),
            ].concat([
              { pair: "GBP/USD", price: "1.2710", pct: "-0.3%", up: false },
              { pair: "US30",    price: "38,920", pct: "+0.9%", up: true },
              { pair: "BTC/USD", price: "64,230", pct: "+2.4%", up: true },
              { pair: "NAS100",  price: "18,342", pct: "+1.2%", up: true },
            ]).map((t, i) => (
              <span key={i} className="mx-6 inline-flex items-center gap-2">
                <span className="text-slate-500">{t.pair}</span>
                <span className="text-slate-200 font-semibold">{t.price}</span>
                {t.pct && <span className={t.up ? "text-emerald-400" : "text-rose-400"}>{t.up ? "▲" : "▼"} {t.pct}</span>}
              </span>
            ))}
          </div>
        </div>

        {/* ── Page content ── */}
        <div className="flex-1 p-5 md:p-6 space-y-6 pb-24 md:pb-8">

          {/* Onboarding banner */}
          {user && !(user as any).user_metadata?.onboarded && (
            <div className="flex items-center justify-between px-5 py-3.5 rounded-2xl border border-indigo-500/30 bg-indigo-500/8">
              <div className="flex items-center gap-3">
                <span className="text-xl">🚀</span>
                <div>
                  <p className="text-sm font-semibold text-white">Complete your setup — takes 2 minutes</p>
                  <p className="text-xs text-slate-400">Connect Telegram · Set preferences · Configure MT5</p>
                </div>
              </div>
              <Link to="/onboarding" className="flex-shrink-0 px-4 py-2 rounded-xl bg-indigo-500 text-white text-xs font-bold hover:bg-indigo-400 transition-all">
                Start →
              </Link>
            </div>
          )}

          {/* ── Stat cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Active Signals", value: "14",     sub: "+3 today",     icon: Zap,      from: "from-indigo-500/20", border: "border-indigo-500/20", icon_c: "text-indigo-400", val_c: "text-white" },
              { label: "Win Rate (30d)", value: "68%",    sub: "Last 30 sigs", icon: Target,   from: "from-emerald-500/15",border: "border-emerald-500/20",icon_c: "text-emerald-400",val_c: "text-emerald-400", bar: 68 },
              { label: "Est. PnL",       value: "+$4.2k", sub: "Strong trend", icon: Wallet,   from: "from-violet-500/15", border: "border-violet-500/20", icon_c: "text-violet-400", val_c: "text-violet-300" },
              { label: "Total Signals",  value: "156",    sub: "All time",     icon: Activity, from: "from-sky-500/15",    border: "border-sky-500/20",    icon_c: "text-sky-400",    val_c: "text-white" },
            ].map(card => (
              <div key={card.label}
                className={`relative rounded-2xl border ${card.border} bg-gradient-to-br ${card.from} to-transparent p-5 overflow-hidden`}>
                <div className="absolute -top-5 -right-5 w-20 h-20 rounded-full blur-2xl opacity-30" />
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{card.label}</span>
                  <div className={`w-8 h-8 rounded-xl ${card.from} border ${card.border} flex items-center justify-center`}>
                    <card.icon className={`w-4 h-4 ${card.icon_c}`} />
                  </div>
                </div>
                <p className={`text-2xl md:text-3xl font-black mb-1 ${card.val_c}`}>{card.value}</p>
                {card.bar ? (
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden mt-2">
                    <div className="h-full rounded-full bg-emerald-400 transition-all" style={{ width: `${card.bar}%` }} />
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">{card.sub}</p>
                )}
              </div>
            ))}
          </div>

          {/* ── Main grid ── */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* Signals — 2 cols */}
            <div className="xl:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white">Latest Signals</h2>
                <div className="flex gap-1 p-1 rounded-xl border border-white/8 bg-white/3">
                  {[
                    { key: "all", label: "All" },
                    { key: "active", label: "Active" },
                    { key: "tp_hit", label: "TP Hit" },
                    { key: "sl_hit", label: "SL Hit" },
                  ].map(f => (
                    <button key={f.key} onClick={() => setActiveFilter(f.key)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        activeFilter === f.key
                          ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
                          : "text-slate-500 hover:text-slate-200"
                      }`}>
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                {filteredSignals.map(signal => {
                  const isBuy    = signal.type === "BUY";
                  const isActive = signal.status === "active";
                  const isTp     = signal.status === "tp_hit";
                  return (
                    <div key={signal.id}
                      className={`group rounded-2xl border transition-all hover:scale-[1.005] hover:shadow-lg cursor-pointer ${
                        isActive
                          ? isBuy
                            ? "border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/35 hover:shadow-emerald-500/10"
                            : "border-rose-500/20 bg-rose-500/5 hover:border-rose-500/35 hover:shadow-rose-500/10"
                          : "border-white/6 bg-white/2 opacity-70"
                      }`}>
                      {/* Top color bar */}
                      <div className={`h-0.5 rounded-t-2xl ${
                        isActive ? (isBuy ? "bg-gradient-to-r from-emerald-400 to-emerald-400/0" : "bg-gradient-to-r from-rose-400 to-rose-400/0") : "bg-white/10"
                      }`} />
                      <div className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                        {/* Direction + asset */}
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            isTp ? "bg-emerald-500/15 border border-emerald-500/25"
                            : signal.status === "sl_hit" ? "bg-rose-500/15 border border-rose-500/25"
                            : isBuy ? "bg-emerald-500/15 border border-emerald-500/25"
                            : "bg-rose-500/15 border border-rose-500/25"
                          }`}>
                            {signal.status === "tp_hit" || signal.status === "sl_hit"
                              ? <CheckCircle className={`w-5 h-5 ${isTp ? "text-emerald-400" : "text-rose-400"}`} />
                              : isBuy
                              ? <ArrowUpRight className="w-5 h-5 text-emerald-400" />
                              : <ArrowDownRight className="w-5 h-5 text-rose-400" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white">{signal.asset}</span>
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                                isBuy ? "bg-emerald-500/15 text-emerald-400" : "bg-rose-500/15 text-rose-400"
                              }`}>{signal.type}</span>
                              {!isActive && (
                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                  isTp ? "bg-emerald-500/15 text-emerald-400" : "bg-rose-500/15 text-rose-400"
                                }`}>{isTp ? "✓ TP HIT" : "✕ SL HIT"}</span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">{signal.timeframe} · {signal.session} · {signal.timestamp}</p>
                          </div>
                        </div>

                        {/* Price grid */}
                        {isActive && (
                          <div className="grid grid-cols-3 gap-3 text-center sm:ml-auto">
                            {[
                              { label: "Entry",   value: signal.entry, color: "text-slate-200" },
                              { label: "TP",      value: signal.tp[0], color: "text-emerald-400" },
                              { label: "SL",      value: signal.sl,    color: "text-rose-400" },
                            ].map(p => (
                              <div key={p.label} className="px-3 py-2 rounded-xl bg-white/4 border border-white/6">
                                <p className="text-[9px] uppercase text-slate-500 font-semibold mb-0.5">{p.label}</p>
                                <p className={`text-xs font-bold font-mono ${p.color}`}>{p.value}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        <button className="hidden sm:flex w-8 h-8 rounded-xl items-center justify-center border border-white/8 text-slate-500 opacity-0 group-hover:opacity-100 transition-all hover:text-white hover:bg-white/8 flex-shrink-0 ml-auto">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick access */}
              <div>
                <h2 className="text-base font-bold text-white mb-3">Quick Access</h2>
                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    { img: "/tradingview-logo.png.jpg", label: "TradingView",   sub: "Charts & Indicators",  href: "https://www.tradingview.com", border: "hover:border-blue-500/30",    bg: "hover:bg-blue-500/5" },
                    { img: "/ninjatrader-logo.png.png", label: "NinjaTrader",   sub: "NT8 Strategies",        href: "https://ninjatrader.com",      border: "hover:border-emerald-500/30", bg: "hover:bg-emerald-500/5" },
                    { img: "/telegram-logo.png.jpg",    label: "VVIP Telegram", sub: "Private Channel",       href: "https://t.me/TonnyFxacademy",  border: "hover:border-sky-500/30",     bg: "hover:bg-sky-500/5" },
                  ].map(item => (
                    <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer"
                      className={`flex items-center gap-3 p-3.5 rounded-2xl border border-white/6 ${item.bg} ${item.border} transition-all group`}>
                      <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center flex-shrink-0">
                        <img src={item.img} alt={item.label} className="w-6 h-6 object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-200 truncate">{item.label}</p>
                        <p className="text-xs text-slate-500 truncate">{item.sub}</p>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 transition-colors flex-shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-4">

              {/* Sessions Clock */}
              <div className="rounded-2xl border border-white/6 bg-white/2 p-4">
                <SessionsClock compact />
              </div>

              {/* Services */}
              <div className="rounded-2xl border border-white/6 bg-white/2 p-4">
                <h3 className="text-sm font-bold text-white mb-3">Services & Tools</h3>
                <div className="space-y-1">
                  {[
                    { icon: Users,   label: "1-on-1 Mentorship", badge: "$150/session",badge_c: "text-violet-400 bg-violet-500/10" },
                    { icon: Trophy,  label: "Prop Firm Prep",     badge: "$79/month",   badge_c: "text-amber-400 bg-amber-500/10" },
                    { icon: Video,   label: "Live Webinars",      badge: "Included",    badge_c: "text-sky-400 bg-sky-500/10" },
                    { icon: BookOpen,label: "Trading Journal",    badge: "Included",    badge_c: "text-emerald-400 bg-emerald-500/10" },
                    { icon: Calculator,label:"Calculator",        badge: "Free",        badge_c: "text-indigo-400 bg-indigo-500/10" },
                  ].map(s => (
                    <div key={s.label}
                      className="flex items-center justify-between py-2 px-2 rounded-xl hover:bg-white/4 transition-all cursor-pointer group">
                      <div className="flex items-center gap-2.5">
                        <s.icon className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
                        <span className="text-sm text-slate-300">{s.label}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.badge_c}`}>{s.badge}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <button className="w-full py-3.5 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 hover:scale-[1.01]"
                style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", boxShadow: "0 8px 24px rgba(99,102,241,0.3)" }}>
                <PlusCircle className="w-4 h-4" />
                Set Custom Alert
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ───────────────── MOBILE BOTTOM NAV ───────────────── */}
      <nav className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-40 flex justify-around items-center py-3 px-4 rounded-full border border-white/10"
        style={{ background: "rgba(12,18,34,0.97)", backdropFilter: "blur(20px)", boxShadow: "0 -4px 40px rgba(0,0,0,0.5)" }}>
        {[
          { icon: LayoutDashboard, href: "/dashboard",   active: true },
          { icon: BarChart2,       href: "/performance", active: false },
          { icon: Calculator,      href: "/calculator",  active: false },
          { icon: Bell,            href: "/dashboard",   active: false },
          { icon: Settings,        href: "/settings",    active: false },
        ].map(({ icon: Icon, href, active }, i) => (
          <Link key={i} to={href}
            className={`p-2.5 rounded-full transition-all ${active ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/40" : "text-slate-500 hover:text-white"}`}>
            <Icon className="w-5 h-5" />
          </Link>
        ))}
      </nav>

      {/* ───────────────── PROFILE MODAL ───────────────── */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => { setShowProfileModal(false); setAvatarPreview(null); setAvatarFile(null); }} />
          <div className="relative w-full max-w-sm rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
              <div>
                <h2 className="font-bold text-base text-white">Profile Picture</h2>
                <p className="text-xs text-slate-400">Update your avatar</p>
              </div>
              <button onClick={() => { setShowProfileModal(false); setAvatarPreview(null); setAvatarFile(null); }}
                className="w-8 h-8 rounded-xl flex items-center justify-center border border-white/10 hover:bg-red-500/10 hover:text-red-400 transition-all text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 flex flex-col items-center gap-5">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-indigo-500/20">
                  {avatarPreview ? <img src={avatarPreview} alt="preview" className="w-full h-full object-cover" />
                    : avatarUrl ? <img src={avatarUrl} alt="current" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-3xl font-black text-white"
                        style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>{initials}</div>}
                </div>
                <button onClick={() => fileRef.current?.click()}
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl flex items-center justify-center border-2 border-slate-900 bg-indigo-500 text-white transition-all hover:bg-indigo-400">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div className="text-center">
                <p className="font-semibold text-white">{displayName}</p>
                <p className="text-xs text-slate-400">{user?.email}</p>
              </div>
              <button onClick={() => fileRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-white/15 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all text-sm text-slate-400">
                <Upload className="w-4 h-4" />{avatarPreview ? "Change photo" : "Choose a photo"}
              </button>
              <div className="flex gap-3 w-full">
                <button onClick={() => { setShowProfileModal(false); setAvatarPreview(null); setAvatarFile(null); }}
                  className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm text-slate-400 hover:bg-white/5 transition-all">Cancel</button>
                <button onClick={uploadAvatar} disabled={!avatarFile || uploading || uploadDone}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-indigo-500 text-white hover:bg-indigo-400 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
                  {uploadDone ? <><Check className="w-4 h-4" />Saved!</>
                    : uploading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving…</>
                    : <><Upload className="w-4 h-4" />Save</>}
                </button>
              </div>
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
        </div>
      )}
    </div>
  );
}
