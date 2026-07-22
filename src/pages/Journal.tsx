import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  LayoutDashboard, Signal, LineChart as LineChartIcon, MessageSquare,
  Settings as SettingsIcon, LogOut, BookOpen, Plus, Trash2, Edit2, X as XIcon,
  TrendingUp, TrendingDown, Users, Trophy, Video, BarChart2, Calendar,
  ChevronLeft, ChevronRight, Zap, Copy, CheckCircle, Download, ExternalLink,
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { toast } from "sonner";

interface Trade {
  id: string;
  date: string;
  asset: string;
  type: "BUY" | "SELL";
  entry: number;
  exit: number;
  sl: number;
  tp: number;
  lots: number;
  pnl: number;
  rr: number;
  timeframe: string;
  session: string;
  strategy: string;
  emotion: string;
  notes: string;
  source?: "manual" | "mt5";
  mt5Ticket?: number | null;
}

const getStatus = (pnl: number) => (pnl > 0 ? "WIN" : pnl < 0 ? "LOSS" : "BE");

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Signal, label: "Signals", href: "/dashboard" },
  { icon: LineChartIcon, label: "Strategies", href: "/dashboard" },
  { icon: MessageSquare, label: "Telegram", href: "https://t.me/TonnyFxacademy" },
  { icon: BookOpen, label: "Trading Journal", href: "/journal", active: true },
  { icon: SettingsIcon, label: "Settings", href: "/settings" },
];

const extraProducts = [
  { icon: Users, label: "1-on-1 Mentorship", badge: "$150 / session", color: "text-violet-400", bg: "bg-violet-500/10" },
  { icon: Trophy, label: "Prop Firm Prep", badge: "$79 / month", color: "text-amber-400", bg: "bg-amber-500/10" },
  { icon: Video, label: "Live Webinars", badge: "Included", color: "text-sky-400", bg: "bg-sky-500/10" },
  { icon: BarChart2, label: "Market Analysis Reports", badge: "Included", color: "text-blue-400", bg: "bg-blue-500/10" },
  { icon: Calendar, label: "Economic Calendar", badge: "Coming Soon", color: "text-rose-400", bg: "bg-rose-500/10" },
];

const ASSETS = ["EUR/USD","GBP/USD","USD/JPY","AUD/USD","GBP/JPY","XAU/USD","NAS100","US30","BTC/USD","ETH/USD","Other"];
const TIMEFRAMES = ["M5","M15","M30","H1","H4","D1","W1"];
const SESSIONS = ["London","New York","Asian","Overlap"];
const EMOTIONS = ["Calm","Confident","Anxious","FOMO","Revenge"];
const STRATEGIES = ["Support Bounce","Resistance Rejection","Breakout","Supply Zone","Demand Zone","Trend Continuation","Trend Reversal","Range Trade","News Trade","Other"];

// Map DB row → Trade
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fromDB = (r: any): Trade => ({
  id: r.id,
  date: (r.date as string).slice(0, 10),
  asset: r.asset,
  type: r.type as "BUY" | "SELL",
  entry: r.entry ?? 0,
  exit: r.exit_price ?? 0,
  sl: r.sl ?? 0,
  tp: r.tp ?? 0,
  lots: r.lots ?? 0,
  pnl: r.pnl ?? 0,
  rr: r.rr ?? 0,
  timeframe: r.timeframe ?? "",
  session: r.session ?? "",
  strategy: r.strategy ?? "",
  emotion: r.emotion ?? "",
  notes: r.notes ?? "",
  source: (r.source ?? "manual") as "manual" | "mt5",
  mt5Ticket: r.mt5_ticket ?? null,
});

// Map Trade → DB row (omit id, keep user_id separate)
const toDB = (t: Omit<Trade,"id">) => ({
  date: t.date,
  asset: t.asset,
  type: t.type,
  entry: t.entry,
  exit_price: t.exit,
  sl: t.sl,
  tp: t.tp,
  lots: t.lots,
  pnl: t.pnl,
  rr: t.rr,
  timeframe: t.timeframe,
  session: t.session,
  strategy: t.strategy,
  emotion: t.emotion,
  notes: t.notes,
});

const blank = (): Omit<Trade,"id"> => ({
  date: new Date().toISOString().slice(0,10),
  asset:"EUR/USD", type:"BUY",
  entry:0, exit:0, sl:0, tp:0, lots:0.1, pnl:0, rr:0,
  timeframe:"H4", session:"London", strategy:"", emotion:"Calm", notes:"",
});

type JTab = "overview" | "trades" | "analytics";

const EMOTION_COLORS: Record<string,string> = {
  Calm:"#22c55e", Confident:"#3b82f6", Anxious:"#f59e0b", FOMO:"#ef4444", Revenge:"#8b5cf6",
};

export default function Journal() {
  const { user, subscription, isLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<JTab>("overview");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string|null>(null);
  const [form, setForm] = useState<Omit<Trade,"id">>(blank());
  const [filterAsset, setFilterAsset] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [calMonth, setCalMonth] = useState(() => new Date().toISOString().slice(0, 7));

  const [trades, setTrades] = useState<Trade[]>([]);
  const [tradesLoading, setTradesLoading] = useState(false);
  const [mt5Token, setMt5Token] = useState<string | null>(null);
  const [showMT5Setup, setShowMT5Setup] = useState(false);
  const [tokenCopied, setTokenCopied] = useState(false);
  const [tokenLoading, setTokenLoading] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!user) { navigate("/auth"); return; }
    if (!subscription?.active) { navigate("/payment"); return; }
  }, [user, subscription, isLoading, navigate]);

  // Load this user's trades from Supabase once they're authenticated
  useEffect(() => {
    if (!user) return;
    setTradesLoading(true);
    supabase
      .from("trades")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setTrades(data.map(fromDB));
        setTradesLoading(false);
      });
  }, [user]);

  const handleSave = async () => {
    if (!form.date || !user) { toast.error("Date is required"); return; }
    if (editId) {
      const { error } = await supabase.from("trades").update(toDB(form)).eq("id", editId).eq("user_id", user.id);
      if (error) { toast.error(error.message); return; }
      setTrades(prev => prev.map(t => t.id === editId ? { ...form, id: editId } : t));
      toast.success("Trade updated");
    } else {
      const { data, error } = await supabase.from("trades").insert({ ...toDB(form), user_id: user.id }).select().single();
      if (error || !data) { toast.error(error?.message ?? "Failed to log trade"); return; }
      setTrades(prev => [...prev, fromDB(data)]);
      toast.success("Trade logged");
    }
    setShowForm(false); setEditId(null); setForm(blank());
  };

  const handleEdit = (t: Trade) => {
    const { id, ...rest } = t;
    setForm(rest); setEditId(id); setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    const { error } = await supabase.from("trades").delete().eq("id", id).eq("user_id", user.id);
    if (error) { toast.error("Failed to delete trade"); return; }
    setTrades(prev => prev.filter(t => t.id !== id));
    toast.success("Trade deleted");
  };

  // Fetch existing MT5 token
  useEffect(() => {
    if (!user) return;
    supabase.from("mt5_tokens").select("token").eq("user_id", user.id).single()
      .then(({ data }) => { if (data) setMt5Token(data.token); });
  }, [user]);

  // Realtime: auto-add trades synced from MT5 EA
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`journal-rt-${user.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "trades", filter: `user_id=eq.${user.id}` },
        (payload) => {
          const t = fromDB(payload.new);
          setTrades(prev => prev.some(x => x.id === t.id) ? prev : [...prev, t]);
          if (t.source === "mt5") toast.success(`MT5 synced: ${t.asset} ${t.pnl >= 0 ? "+" : ""}$${t.pnl.toFixed(0)}`);
        }
      ).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const generateToken = async () => {
    if (!user) return;
    setTokenLoading(true);
    const { data, error } = await supabase.rpc("generate_mt5_token");
    if (!error && data) {
      setMt5Token(data as string);
      toast.success("API token generated");
    } else {
      console.error("Token generation error:", error);
      toast.error("Failed to generate token — " + (error?.message ?? "unknown error"));
    }
    setTokenLoading(false);
  };

  const copyToken = () => {
    if (!mt5Token) return;
    navigator.clipboard.writeText(mt5Token);
    setTokenCopied(true);
    setTimeout(() => setTokenCopied(false), 2000);
  };

  const displayName = user?.name
    ? user.name.split(" ").map(w => w[0].toUpperCase() + w.slice(1)).join(" ")
    : "Trader";
  const initials = displayName.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase();
  const nextBilling = subscription?.nextBilling
    ? new Date(subscription.nextBilling).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})
    : null;

  const sorted = useMemo(() => [...trades].sort((a,b) => a.date.localeCompare(b.date)), [trades]);

  const stats = useMemo(() => {
    const wins = trades.filter(t => t.pnl > 0);
    const losses = trades.filter(t => t.pnl < 0);
    const bes = trades.filter(t => t.pnl === 0);
    const decided = wins.length + losses.length;
    const totalPnl = trades.reduce((s,t) => s + t.pnl, 0);
    const winRate = decided > 0 ? wins.length / decided * 100 : 0;
    const avgWin = wins.length > 0 ? wins.reduce((s,t) => s+t.pnl,0)/wins.length : 0;
    const avgLoss = losses.length > 0 ? Math.abs(losses.reduce((s,t) => s+t.pnl,0)/losses.length) : 0;
    const grossWin = wins.reduce((s,t) => s+t.pnl,0);
    const grossLoss = Math.abs(losses.reduce((s,t) => s+t.pnl,0));
    const pf = grossLoss > 0 ? grossWin/grossLoss : wins.length > 0 ? 999 : 0;
    const avgRr = wins.filter(t=>t.rr>0).length>0 ? wins.filter(t=>t.rr>0).reduce((s,t)=>s+t.rr,0)/wins.filter(t=>t.rr>0).length : 0;
    let peak=0,run=0,maxDd=0;
    for (const t of sorted) { run+=t.pnl; if(run>peak) peak=run; const dd=peak-run; if(dd>maxDd) maxDd=dd; }
    return {
      total: trades.length, wins: wins.length, losses: losses.length, bes: bes.length,
      totalPnl, winRate, avgWin, avgLoss, pf, avgRr, maxDd,
      best: wins.length>0 ? Math.max(...wins.map(t=>t.pnl)) : 0,
      worst: losses.length>0 ? Math.min(...losses.map(t=>t.pnl)) : 0,
    };
  }, [trades, sorted]);

  const equityData = useMemo(() => {
    let run = 0;
    return sorted.map(t => { run += t.pnl; return { date: t.date.slice(5), pnl: +run.toFixed(2) }; });
  }, [sorted]);

  const pieData = useMemo(() => [
    { name:"Win",   value: stats.wins,   color:"#22c55e" },
    { name:"Loss",  value: stats.losses, color:"#ef4444" },
    { name:"BE",    value: stats.bes,    color:"#6b7280" },
  ].filter(d => d.value > 0), [stats]);

  const assetPnl = useMemo(() => {
    const m: Record<string,number> = {};
    trades.forEach(t => { m[t.asset] = (m[t.asset]||0) + t.pnl; });
    return Object.entries(m).map(([asset,pnl]) => ({ asset, pnl:+pnl.toFixed(2) })).sort((a,b)=>b.pnl-a.pnl);
  }, [trades]);

  const monthlyPnl = useMemo(() => {
    const m: Record<string,number> = {};
    trades.forEach(t => { const mo=t.date.slice(0,7); m[mo]=(m[mo]||0)+t.pnl; });
    return Object.entries(m).sort(([a],[b])=>a.localeCompare(b)).map(([mo,pnl])=>({
      month: new Date(mo+"-01").toLocaleDateString("en-US",{month:"short",year:"2-digit"}),
      pnl: +pnl.toFixed(2),
    }));
  }, [trades]);

  const strategyData = useMemo(() => {
    const m: Record<string,{pnl:number;count:number}> = {};
    trades.forEach(t => {
      if (!t.strategy) return;
      if (!m[t.strategy]) m[t.strategy]={pnl:0,count:0};
      m[t.strategy].pnl+=t.pnl; m[t.strategy].count+=1;
    });
    return Object.entries(m).map(([s,{pnl,count}])=>({strategy:s,pnl:+pnl.toFixed(2),count,avg:+(pnl/count).toFixed(2)})).sort((a,b)=>b.pnl-a.pnl);
  }, [trades]);

  const emotionData = useMemo(() => {
    const m: Record<string,{pnl:number;count:number}> = {};
    trades.forEach(t => {
      if (!t.emotion) return;
      if (!m[t.emotion]) m[t.emotion]={pnl:0,count:0};
      m[t.emotion].pnl+=t.pnl; m[t.emotion].count+=1;
    });
    return Object.entries(m).map(([e,{pnl,count}])=>({emotion:e,pnl:+pnl.toFixed(2),count,avg:+(pnl/count).toFixed(2)})).sort((a,b)=>b.avg-a.avg);
  }, [trades]);

  const allAssets = useMemo(() => ["all",...Array.from(new Set(trades.map(t=>t.asset)))],[trades]);

  const dailyPnl = useMemo(() => {
    const m: Record<string, number> = {};
    trades.forEach(t => { m[t.date] = +(((m[t.date] || 0) + t.pnl).toFixed(2)); });
    return m;
  }, [trades]);

  const calCells = useMemo(() => {
    const [year, month] = calMonth.split("-").map(Number);
    const firstDow = new Date(year, month - 1, 1).getDay(); // 0=Sun
    const offset = (firstDow + 6) % 7; // shift to Mon=0
    const daysInMonth = new Date(year, month, 0).getDate();
    const cells: ({ date: string; day: number } | null)[] = [];
    for (let i = 0; i < offset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ date: `${calMonth}-${String(d).padStart(2, "0")}`, day: d });
    }
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [calMonth]);

  const filtered = useMemo(() => [...sorted].reverse().filter(t => {
    if (filterAsset !== "all" && t.asset !== filterAsset) return false;
    if (filterStatus !== "all" && getStatus(t.pnl) !== filterStatus) return false;
    return true;
  }), [sorted, filterAsset, filterStatus]);

  if (isLoading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex gap-0">

      <Sidebar />

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold">Trading Journal</h1>
              <p className="text-muted-foreground text-sm">
                {stats.total} trades &middot; {stats.winRate.toFixed(0)}% win rate &middot;{" "}
                <span className={stats.totalPnl >= 0 ? "text-emerald-400" : "text-red-400"}>
                  {stats.totalPnl >= 0 ? "+" : ""}${stats.totalPnl.toFixed(0)} total P&L
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowMT5Setup(true)} className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${mt5Token ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25" : "bg-secondary text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"}`}>
                <img src="/mt5-logo.png" alt="MT5" className="w-4 h-4 rounded object-cover flex-shrink-0" />
                {mt5Token ? "MT5 Connected" : "Connect MT5"}
              </button>
              <Button variant="hero" size="sm" onClick={() => { setForm(blank()); setEditId(null); setShowForm(true); }} className="gap-2">
                <Plus className="w-4 h-4" />Log Trade
              </Button>
            </div>
          </div>
          <div className="flex gap-1 mt-4">
            {(["overview","trades","analytics"] as JTab[]).map(t => (
              <button key={t} onClick={() => setTab(t)} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${tab===t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>{t}</button>
            ))}
          </div>
        </header>

        <div className="p-6">

          {/* ── OVERVIEW ── */}
          {tab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label:"Total P&L",      value:`${stats.totalPnl>=0?"+":""}$${stats.totalPnl.toFixed(0)}`, sub:`${stats.total} trades`, color: stats.totalPnl>=0?"text-emerald-400":"text-red-400" },
                  { label:"Win Rate",        value:`${stats.winRate.toFixed(1)}%`,  sub:`${stats.wins}W / ${stats.losses}L / ${stats.bes}BE`, color:"text-primary" },
                  { label:"Profit Factor",   value: isFinite(stats.pf)?stats.pf.toFixed(2):"∞",  sub:`Avg RR: ${stats.avgRr.toFixed(2)}`, color: stats.pf>=1.5?"text-emerald-400":stats.pf>=1?"text-primary":"text-red-400" },
                  { label:"Avg Win",         value:`$${stats.avgWin.toFixed(0)}`,   sub:`vs -$${stats.avgLoss.toFixed(0)} avg loss`, color:"text-foreground" },
                  { label:"Best Trade",      value:`+$${stats.best.toFixed(0)}`,    sub:"", color:"text-emerald-400" },
                  { label:"Worst Trade",     value:`-$${Math.abs(stats.worst).toFixed(0)}`, sub:"", color:"text-red-400" },
                  { label:"Max Drawdown",    value:`-$${stats.maxDd.toFixed(0)}`,   sub:"", color:"text-red-400" },
                  { label:"Avg Win RR",      value:`${stats.avgRr.toFixed(2)}R`,    sub:"", color:"text-foreground" },
                ].map(card => (
                  <div key={card.label} className="glass-card p-4">
                    <p className="text-xs text-muted-foreground mb-1">{card.label}</p>
                    <p className={`font-display text-2xl font-bold ${card.color}`}>{card.value}</p>
                    {card.sub && <p className="text-xs text-muted-foreground mt-1">{card.sub}</p>}
                  </div>
                ))}
              </div>

              {/* Equity curve */}
              <div className="glass-card p-6">
                <h3 className="font-display font-semibold mb-4">Equity Curve</h3>
                {equityData.length > 1 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={equityData} margin={{top:5,right:20,left:0,bottom:5}}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" tick={{fontSize:11,fill:"hsl(var(--muted-foreground))"}} />
                      <YAxis tick={{fontSize:11,fill:"hsl(var(--muted-foreground))"}} tickFormatter={v=>`$${v}`} />
                      <Tooltip contentStyle={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))",borderRadius:"8px"}} labelStyle={{color:"hsl(var(--foreground))"}} formatter={(v:number)=>[`$${v.toFixed(2)}`,"Cumulative P&L"]} />
                      <Line type="monotone" dataKey="pnl" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">Log at least 2 trades to see the equity curve</div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Pie */}
                <div className="glass-card p-6">
                  <h3 className="font-display font-semibold mb-4">Win / Loss Breakdown</h3>
                  {pieData.length > 0 ? (
                    <div className="flex items-center gap-6">
                      <ResponsiveContainer width={130} height={130}>
                        <PieChart>
                          <Pie data={pieData} cx="50%" cy="50%" innerRadius={38} outerRadius={62} dataKey="value" paddingAngle={3}>
                            {pieData.map((e,i) => <Cell key={i} fill={e.color} />)}
                          </Pie>
                          <Tooltip contentStyle={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))",borderRadius:"8px"}} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="space-y-2 flex-1">
                        {pieData.map(d => (
                          <div key={d.name} className="flex items-center gap-2 text-sm">
                            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{background:d.color}} />
                            <span className="text-muted-foreground">{d.name}</span>
                            <span className="font-semibold ml-auto">{d.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : <div className="h-[130px] flex items-center justify-center text-muted-foreground text-sm">No trades yet</div>}
                </div>

                {/* Asset P&L bars */}
                <div className="glass-card p-6">
                  <h3 className="font-display font-semibold mb-4">P&L by Asset</h3>
                  {assetPnl.length > 0 ? (
                    <div className="space-y-2.5">
                      {assetPnl.map(({asset,pnl}) => {
                        const max = Math.max(...assetPnl.map(a=>Math.abs(a.pnl)));
                        return (
                          <div key={asset} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">{asset}</span>
                              <span className={`font-semibold ${pnl>=0?"text-emerald-400":"text-red-400"}`}>{pnl>=0?"+":""}${pnl.toFixed(0)}</span>
                            </div>
                            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${pnl>=0?"bg-emerald-500":"bg-red-500"}`} style={{width:`${max>0?Math.abs(pnl)/max*100:0}%`}} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : <div className="h-[130px] flex items-center justify-center text-muted-foreground text-sm">No trades yet</div>}
                </div>
              </div>

              {/* Daily Performance Calendar */}
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="font-display font-semibold">Daily Performance</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Net P&L per trading day</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCalMonth(m => { const d = new Date(m + "-01"); d.setMonth(d.getMonth() - 1); return d.toISOString().slice(0, 7); })}
                      className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-medium w-32 text-center">
                      {new Date(calMonth + "-01").toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </span>
                    <button
                      onClick={() => setCalMonth(m => { const d = new Date(m + "-01"); d.setMonth(d.getMonth() + 1); return d.toISOString().slice(0, 7); })}
                      className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Weekday headers */}
                <div className="grid grid-cols-7 mb-1">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
                    <div key={d} className="text-xs text-muted-foreground font-semibold text-center py-1">{d}</div>
                  ))}
                </div>

                {/* Day cells */}
                <div className="grid grid-cols-7 gap-1.5">
                  {calCells.map((cell, i) => {
                    if (!cell) return (
                      <div key={i} className="min-h-[62px] rounded-lg border border-border/30 bg-secondary/20" />
                    );
                    const pnl = dailyPnl[cell.date];
                    const hasTrade = pnl !== undefined;
                    const isProfit = hasTrade && pnl > 0;
                    const isLoss   = hasTrade && pnl < 0;
                    const isBe     = hasTrade && pnl === 0;
                    return (
                      <div
                        key={cell.date}
                        className={`rounded-lg p-2.5 min-h-[62px] flex flex-col justify-between border transition-colors ${
                          isProfit ? "bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/15"
                          : isLoss  ? "bg-red-500/10 border-red-500/30 hover:bg-red-500/15"
                          : isBe    ? "bg-secondary border-border"
                          :           "bg-secondary/40 border-border/60"
                        }`}
                      >
                        <span className={`text-xs font-semibold ${hasTrade ? "text-foreground" : "text-muted-foreground/50"}`}>
                          {cell.day}
                        </span>
                        {hasTrade && (
                          <span className={`text-[11px] font-bold leading-snug ${isProfit ? "text-emerald-400" : isLoss ? "text-red-400" : "text-muted-foreground"}`}>
                            {isBe ? "BE" : `${isProfit ? "+" : "-"}$${Math.abs(pnl).toFixed(0)}`}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex items-center gap-5 mt-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/30" />
                    <span className="text-xs text-muted-foreground">Profitable day</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-red-500/20 border border-red-500/30" />
                    <span className="text-xs text-muted-foreground">Loss day</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-secondary border border-border" />
                    <span className="text-xs text-muted-foreground">Breakeven</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-secondary/40 border border-border/60" />
                    <span className="text-xs text-muted-foreground">No trades</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ── TRADES ── */}
          {tab === "trades" && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3 items-center">
                <select value={filterAsset} onChange={e=>setFilterAsset(e.target.value)} className="text-sm bg-secondary border border-border rounded-lg px-3 py-2 text-foreground">
                  {allAssets.map(a=><option key={a} value={a}>{a==="all"?"All Assets":a}</option>)}
                </select>
                <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} className="text-sm bg-secondary border border-border rounded-lg px-3 py-2 text-foreground">
                  <option value="all">All Results</option>
                  <option value="WIN">Win</option>
                  <option value="LOSS">Loss</option>
                  <option value="BE">Breakeven</option>
                </select>
                <span className="text-sm text-muted-foreground ml-auto">{filtered.length} trades</span>
              </div>

              <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        {["Date","Asset","Type","Entry","Exit","P&L","RR","Result","Source","Strategy","Emotion","Actions"].map(h=>(
                          <th key={h} className="text-left text-xs text-muted-foreground font-semibold px-4 py-3 whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tradesLoading && (
                        <tr><td colSpan={11} className="px-4 py-10 text-center text-muted-foreground">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                            Loading your trades...
                          </div>
                        </td></tr>
                      )}
                      {!tradesLoading && filtered.length === 0 && (
                        <tr><td colSpan={11} className="px-4 py-10 text-center text-muted-foreground">No trades yet. Click "Log Trade" to record your first trade.</td></tr>
                      )}
                      {filtered.map(trade => {
                        const status = getStatus(trade.pnl);
                        return (
                          <tr key={trade.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                            <td className="px-4 py-3 font-mono text-xs whitespace-nowrap">{trade.date}</td>
                            <td className="px-4 py-3 font-semibold whitespace-nowrap">{trade.asset}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold ${trade.type==="BUY"?"bg-emerald-500/15 text-emerald-400":"bg-red-500/15 text-red-400"}`}>
                                {trade.type==="BUY"?<TrendingUp className="w-3 h-3"/>:<TrendingDown className="w-3 h-3"/>}{trade.type}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-mono text-xs">{trade.entry}</td>
                            <td className="px-4 py-3 font-mono text-xs">{trade.exit}</td>
                            <td className={`px-4 py-3 font-bold ${trade.pnl>0?"text-emerald-400":trade.pnl<0?"text-red-400":"text-muted-foreground"}`}>
                              {trade.pnl>0?"+":""}${trade.pnl.toFixed(0)}
                            </td>
                            <td className="px-4 py-3 text-sm">{trade.rr!==0?`${trade.rr}R`:"—"}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${status==="WIN"?"bg-emerald-500/15 text-emerald-400":status==="LOSS"?"bg-red-500/15 text-red-400":"bg-secondary text-muted-foreground"}`}>{status}</span>
                            </td>
                            <td className="px-4 py-3">
                              {trade.source === "mt5" ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/15 text-violet-500 border border-violet-500/20">
                                  <img src="/mt5-logo.png" alt="MT5" className="w-3 h-3 object-contain" />MT5
                                </span>
                              ) : (
                                <span className="text-[10px] text-muted-foreground/50">manual</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">{trade.strategy||"—"}</td>
                            <td className="px-4 py-3 text-xs" style={{color:EMOTION_COLORS[trade.emotion]||"hsl(var(--muted-foreground))"}}>{trade.emotion||"—"}</td>
                            <td className="px-4 py-3">
                              <div className="flex gap-1">
                                <button onClick={()=>handleEdit(trade)} className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"><Edit2 className="w-3.5 h-3.5"/></button>
                                <button onClick={()=>handleDelete(trade.id)} className="p-1.5 rounded hover:bg-red-500/15 text-muted-foreground hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5"/></button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── ANALYTICS ── */}
          {tab === "analytics" && (
            <div className="space-y-6">
              {/* Monthly P&L bar chart */}
              <div className="glass-card p-6">
                <h3 className="font-display font-semibold mb-4">Monthly P&L</h3>
                {monthlyPnl.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={monthlyPnl} margin={{top:5,right:20,left:0,bottom:5}}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" tick={{fontSize:11,fill:"hsl(var(--muted-foreground))"}} />
                      <YAxis tick={{fontSize:11,fill:"hsl(var(--muted-foreground))"}} tickFormatter={v=>`$${v}`} />
                      <Tooltip contentStyle={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))",borderRadius:"8px"}} formatter={(v:number)=>[`$${v.toFixed(2)}`,"P&L"]} />
                      <Bar dataKey="pnl" radius={[4,4,0,0]}>
                        {monthlyPnl.map((e,i)=><Cell key={i} fill={e.pnl>=0?"#22c55e":"#ef4444"}/>)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">No data yet</div>}
              </div>

              {/* Strategy performance */}
              <div className="glass-card p-6">
                <h3 className="font-display font-semibold mb-4">Strategy Performance</h3>
                {strategyData.length > 0 ? (
                  <div className="space-y-3">
                    {strategyData.map(({strategy,pnl,count,avg})=>{
                      const max=Math.max(...strategyData.map(s=>Math.abs(s.pnl)));
                      return (
                        <div key={strategy} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{strategy}</span>
                            <div className="flex items-center gap-4">
                              <span className="text-muted-foreground text-xs">{count} trades &middot; avg ${avg>=0?"+":""}${avg}/trade</span>
                              <span className={`font-bold w-20 text-right ${pnl>=0?"text-emerald-400":"text-red-400"}`}>{pnl>=0?"+":""}${pnl.toFixed(0)}</span>
                            </div>
                          </div>
                          <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${pnl>=0?"bg-emerald-500":"bg-red-500"}`} style={{width:`${max>0?Math.abs(pnl)/max*100:0}%`}} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : <div className="h-[120px] flex items-center justify-center text-muted-foreground text-sm">No strategy data yet</div>}
              </div>

              {/* Emotion analysis */}
              <div className="glass-card p-6">
                <h3 className="font-display font-semibold mb-1">Emotion vs Performance</h3>
                <p className="text-xs text-muted-foreground mb-4">Understand how your mindset affects your results</p>
                {emotionData.length > 0 ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    {emotionData.map(({emotion,pnl,count,avg})=>(
                      <div key={emotion} className="p-4 rounded-xl bg-secondary/50 text-center">
                        <div className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center" style={{background:(EMOTION_COLORS[emotion]||"#6b7280")+"25"}}>
                          <div className="w-4 h-4 rounded-full" style={{background:EMOTION_COLORS[emotion]||"#6b7280"}} />
                        </div>
                        <p className="text-xs font-semibold mb-1">{emotion}</p>
                        <p className={`text-lg font-bold ${avg>=0?"text-emerald-400":"text-red-400"}`}>{avg>=0?"+":""}${avg.toFixed(0)}</p>
                        <p className="text-xs text-muted-foreground">avg / trade</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{count} trade{count!==1?"s":""}</p>
                      </div>
                    ))}
                  </div>
                ) : <div className="h-[100px] flex items-center justify-center text-muted-foreground text-sm">No data yet</div>}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ── Trade Form Modal ── */}
      {/* ── MT5 Sync Setup Modal ── */}
      {showMT5Setup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <img src="/mt5-logo.png" alt="MT5" className="w-12 h-12 rounded-2xl object-cover flex-shrink-0 shadow-lg" />
                <div>
                  <h2 className="font-display text-lg font-bold">Connect MT5</h2>
                  <p className="text-xs text-muted-foreground">Trades sync automatically when you close a position</p>
                </div>
              </div>
              <button onClick={() => setShowMT5Setup(false)} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground">
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">

              {/* Step 1: Token */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">1</div>
                  <h3 className="font-semibold text-sm">Get Your API Token</h3>
                </div>
                {mt5Token ? (
                  <div className="flex gap-2">
                    <code className="flex-1 bg-secondary border border-border rounded-lg px-3 py-2 text-xs font-mono text-foreground truncate">{mt5Token}</code>
                    <button onClick={copyToken} className={`px-3 rounded-lg border transition-all flex items-center justify-center ${tokenCopied ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-secondary text-muted-foreground border-border hover:text-foreground"}`}>
                      {tokenCopied ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={generateToken} disabled={tokenLoading} className="px-3 py-2 rounded-lg text-xs bg-secondary border border-border text-muted-foreground hover:text-foreground transition-all">Regen</button>
                  </div>
                ) : (
                  <button onClick={generateToken} disabled={tokenLoading} className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50">
                    {tokenLoading ? "Generating..." : "Generate API Token"}
                  </button>
                )}
                <p className="text-xs text-muted-foreground">Keep this private — it links your MT5 to your account.</p>
              </div>

              {/* Step 2: Download EA */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">2</div>
                  <h3 className="font-semibold text-sm">Download & Install the EA</h3>
                </div>
                <a href="/BetTradesSync.mq5" download className="flex items-center gap-3 p-3 rounded-xl bg-secondary border border-border hover:border-primary/30 transition-all group cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Download className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">BetTradesSync.mq5</p>
                    <p className="text-xs text-muted-foreground">MetaTrader 5 Expert Advisor</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
                </a>
                <div className="bg-secondary/50 rounded-xl p-4 text-xs text-muted-foreground space-y-1">
                  <p className="font-semibold text-foreground mb-1.5">Installation:</p>
                  <p>• MT5 → <strong className="text-foreground">File → Open Data Folder</strong></p>
                  <p>• Navigate to <code className="bg-secondary px-1 rounded">MQL5 / Experts</code></p>
                  <p>• Copy <code className="bg-secondary px-1 rounded">BetTradesSync.mq5</code> there</p>
                  <p>• In MT5 Navigator: right-click Experts → <strong className="text-foreground">Refresh</strong></p>
                </div>
              </div>

              {/* Step 3: Allow WebRequest */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">3</div>
                  <h3 className="font-semibold text-sm">Allow WebRequest in MT5</h3>
                </div>
                <div className="bg-secondary/50 rounded-xl p-4 text-xs text-muted-foreground space-y-1">
                  <p>• MT5: <strong className="text-foreground">Tools → Options → Expert Advisors</strong></p>
                  <p>• Check <strong className="text-foreground">"Allow WebRequest for listed URL"</strong></p>
                  <p>• Add this URL and click OK:</p>
                  <code className="block bg-secondary px-2 py-1.5 rounded mt-1.5 text-foreground text-[11px] break-all select-all">https://hjqgjbeuwzcxnusxvrzy.supabase.co</code>
                </div>
              </div>

              {/* Step 4: Attach EA */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">4</div>
                  <h3 className="font-semibold text-sm">Attach EA to a Chart</h3>
                </div>
                <div className="bg-secondary/50 rounded-xl p-4 text-xs text-muted-foreground space-y-1">
                  <p>• Open any chart in MT5 (e.g. EURUSD M1)</p>
                  <p>• Navigator → Expert Advisors → <strong className="text-foreground">BetTradesSync</strong></p>
                  <p>• Drag onto the chart or double-click</p>
                  <p>• In <strong className="text-foreground">Inputs</strong> tab: paste your API Token from Step 1</p>
                  <p>• Enable <strong className="text-foreground">"Allow live trading"</strong> → OK</p>
                </div>
              </div>

              {mt5Token && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Token ready! Once the EA is attached, every closed trade appears here automatically in real time.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-display text-lg font-bold">{editId?"Edit Trade":"Log New Trade"}</h2>
              <button onClick={()=>{setShowForm(false);setEditId(null);setForm(blank());}} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground">
                <XIcon className="w-5 h-5"/>
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Date + Asset + Type */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Date *</Label>
                  <Input type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} className="bg-secondary border-border" />
                </div>
                <div className="space-y-2">
                  <Label>Asset *</Label>
                  <select value={form.asset} onChange={e=>setForm(f=>({...f,asset:e.target.value}))} className="w-full text-sm bg-secondary border border-border rounded-lg px-3 py-2 text-foreground h-10">
                    {ASSETS.map(a=><option key={a}>{a}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Direction *</Label>
                  <div className="flex gap-2">
                    {(["BUY","SELL"] as const).map(t=>(
                      <button key={t} onClick={()=>setForm(f=>({...f,type:t}))} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${form.type===t ? (t==="BUY"?"bg-emerald-500/20 text-emerald-400 border border-emerald-500/30":"bg-red-500/20 text-red-400 border border-red-500/30") : "bg-secondary text-muted-foreground"}`}>{t}</button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Entry, Exit, Lots */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2"><Label>Entry Price</Label><Input type="number" step="any" value={form.entry||""} onChange={e=>setForm(f=>({...f,entry:+e.target.value||0}))} className="bg-secondary border-border" placeholder="0.00"/></div>
                <div className="space-y-2"><Label>Exit Price</Label><Input type="number" step="any" value={form.exit||""} onChange={e=>setForm(f=>({...f,exit:+e.target.value||0}))} className="bg-secondary border-border" placeholder="0.00"/></div>
                <div className="space-y-2"><Label>Lot Size</Label><Input type="number" step="0.01" value={form.lots||""} onChange={e=>setForm(f=>({...f,lots:+e.target.value||0}))} className="bg-secondary border-border" placeholder="0.10"/></div>
              </div>

              {/* SL, TP */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Stop Loss</Label><Input type="number" step="any" value={form.sl||""} onChange={e=>setForm(f=>({...f,sl:+e.target.value||0}))} className="bg-secondary border-border" placeholder="0.00"/></div>
                <div className="space-y-2"><Label>Take Profit</Label><Input type="number" step="any" value={form.tp||""} onChange={e=>setForm(f=>({...f,tp:+e.target.value||0}))} className="bg-secondary border-border" placeholder="0.00"/></div>
              </div>

              {/* P&L, RR */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Profit / Loss ($) *</Label><Input type="number" step="0.01" value={form.pnl||""} onChange={e=>setForm(f=>({...f,pnl:+e.target.value||0}))} className="bg-secondary border-border" placeholder="-250 or +320"/></div>
                <div className="space-y-2"><Label>Risk:Reward (RR)</Label><Input type="number" step="0.01" value={form.rr||""} onChange={e=>setForm(f=>({...f,rr:+e.target.value||0}))} className="bg-secondary border-border" placeholder="1.5"/></div>
              </div>

              {/* Timeframe, Session, Emotion */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Timeframe</Label>
                  <select value={form.timeframe} onChange={e=>setForm(f=>({...f,timeframe:e.target.value}))} className="w-full text-sm bg-secondary border border-border rounded-lg px-3 py-2 text-foreground h-10">
                    {TIMEFRAMES.map(t=><option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Session</Label>
                  <select value={form.session} onChange={e=>setForm(f=>({...f,session:e.target.value}))} className="w-full text-sm bg-secondary border border-border rounded-lg px-3 py-2 text-foreground h-10">
                    {SESSIONS.map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Emotion</Label>
                  <select value={form.emotion} onChange={e=>setForm(f=>({...f,emotion:e.target.value}))} className="w-full text-sm bg-secondary border border-border rounded-lg px-3 py-2 text-foreground h-10">
                    {EMOTIONS.map(em=><option key={em}>{em}</option>)}
                  </select>
                </div>
              </div>

              {/* Strategy */}
              <div className="space-y-2">
                <Label>Strategy</Label>
                <select value={form.strategy} onChange={e=>setForm(f=>({...f,strategy:e.target.value}))} className="w-full text-sm bg-secondary border border-border rounded-lg px-3 py-2 text-foreground h-10">
                  <option value="">Select strategy...</option>
                  {STRATEGIES.map(s=><option key={s}>{s}</option>)}
                </select>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label>Notes</Label>
                <textarea value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} rows={3} placeholder="What did you see? What was your reasoning? Lessons learned..." className="w-full text-sm bg-secondary border border-border rounded-lg px-3 py-2 text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>

              <div className="flex gap-3 pt-1">
                <Button variant="ghost" className="flex-1" onClick={()=>{setShowForm(false);setEditId(null);setForm(blank());}}>Cancel</Button>
                <Button variant="hero" className="flex-1" onClick={handleSave}>{editId?"Save Changes":"Log Trade"}</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
