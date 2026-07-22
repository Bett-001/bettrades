import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  LayoutDashboard, Users, Signal, Megaphone, BookOpen,
  LogOut, Plus, Trash2, Edit2, X as XIcon, TrendingUp, TrendingDown,
  CheckCircle, XCircle, ShieldCheck, Bell, BarChart2, Pin,
  DollarSign, Send, Tag, Copy, Layers,
} from "lucide-react";
import { toast } from "sonner";

// ── Types ──────────────────────────────────────────────────────────────────
interface TSignal {
  id: string; asset: string; type: "BUY"|"SELL";
  entry: number; sl: number; tp: string[];
  timeframe: string; status: "active"|"tp_hit"|"sl_hit"|"cancelled";
  pips: number; notes: string; created_at: string;
}
interface Subscriber {
  user_id: string; email: string; joined: string;
  active: boolean; plan: string; next_billing: string|null; method: string|null;
}
interface Announcement {
  id: string; title: string; body: string;
  type: "info"|"warning"|"success"|"urgent"; pinned: boolean; created_at: string;
}
interface Strategy {
  id: string; title: string; description: string;
  content: string; category: string; timeframe: string; created_at: string;
}

type AdminTab = "overview"|"signals"|"subscribers"|"announcements"|"strategies"|"revenue"|"broadcast"|"coupons"|"indicators";

// ── Constants ──────────────────────────────────────────────────────────────
const ASSETS = ["EUR/USD","GBP/USD","USD/JPY","AUD/USD","GBP/JPY","XAU/USD","NAS100","US30","BTC/USD","ETH/USD"];
const TIMEFRAMES = ["M5","M15","M30","H1","H4","D1","W1"];
const CATEGORIES = ["Forex","Indices","Crypto","Commodities","All Markets"];

const blankSignal = (): Omit<TSignal,"id"|"created_at"> => ({
  asset:"EUR/USD", type:"BUY", entry:0, sl:0, tp:["","",""],
  timeframe:"H4", status:"active", pips:0, notes:"",
});
const blankAnnouncement = (): Omit<Announcement,"id"|"created_at"> => ({
  title:"", body:"", type:"info", pinned:false,
});
const blankStrategy = (): Omit<Strategy,"id"|"created_at"> => ({
  title:"", description:"", content:"", category:"Forex", timeframe:"H4",
});

// ── Sidebar nav ────────────────────────────────────────────────────────────
const navItems = [
  { icon: LayoutDashboard, label: "Overview",      tab: "overview" },
  { icon: Signal,          label: "Signals",       tab: "signals" },
  { icon: Users,           label: "Subscribers",   tab: "subscribers" },
  { icon: Megaphone,       label: "Announcements", tab: "announcements" },
  { icon: BookOpen,        label: "Strategies",    tab: "strategies" },
  { icon: DollarSign,      label: "Revenue",       tab: "revenue" },
  { icon: Send,            label: "Broadcast",     tab: "broadcast" },
  { icon: Tag,             label: "Coupons",       tab: "coupons" },
  { icon: Layers,          label: "Indicators",    tab: "indicators" },
];

const ANNTYPE_STYLES: Record<string,string> = {
  info:    "bg-blue-500/15 text-blue-400 border-blue-500/30",
  warning: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  success: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  urgent:  "bg-red-500/15 text-red-400 border-red-500/30",
};

// ── Broadcast Panel ────────────────────────────────────────────────────────
function BroadcastPanel({ subscriberCount }: { subscriberCount: number }) {
  const [subject, setSubject] = useState("");
  const [body, setBody]       = useState("");
  const [type, setType]       = useState<"info"|"warning"|"success"|"urgent">("info");
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);

  const send = async () => {
    if (!subject.trim() || !body.trim()) { toast.error("Subject and message are required"); return; }
    setSending(true);
    // Insert as announcement (displayed in dashboard ticker) + log broadcast
    const { error } = await supabase.from("announcements").insert({ title: subject, body, type, pinned: false });
    if (error) { toast.error(error.message); setSending(false); return; }
    setSent(true);
    toast.success(`Broadcast sent to ${subscriberCount} subscribers`);
    setSending(false);
    setTimeout(() => { setSent(false); setSubject(""); setBody(""); }, 2500);
  };

  return (
    <div className="max-w-2xl space-y-5">
      <div className="glass-card p-6">
        <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
          <Send className="w-4 h-4 text-primary" /> Send Broadcast Message
        </h3>
        <p className="text-sm text-muted-foreground mb-5">
          Messages are posted as announcements and appear in the dashboard ticker for all <strong>{subscriberCount}</strong> active subscribers.
        </p>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Subject / Title</label>
            <input value={subject} onChange={e=>setSubject(e.target.value)} placeholder="e.g. New XAU/USD signal posted"
              className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground text-sm outline-none focus:border-primary/50" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Message</label>
            <textarea value={body} onChange={e=>setBody(e.target.value)} rows={5} placeholder="Write your message to subscribers..."
              className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground text-sm outline-none focus:border-primary/50 resize-none" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Message Type</label>
            <div className="flex gap-2 flex-wrap">
              {(["info","success","warning","urgent"] as const).map(t=>(
                <button key={t} onClick={()=>setType(t)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border capitalize transition-all ${type===t ? ANNTYPE_STYLES[t] : "bg-secondary text-muted-foreground border-border"}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <button onClick={send} disabled={sending||sent}
            className={`w-full py-3 rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2 transition-all ${sent?"bg-emerald-500/20 text-emerald-400":"bg-primary text-primary-foreground hover:bg-primary/90"} disabled:opacity-60`}>
            {sent ? <><CheckCircle className="w-4 h-4"/>Sent!</> : sending ? <><div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"/>Sending…</> : <><Send className="w-4 h-4"/>Send to {subscriberCount} Subscribers</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Coupons Panel ───────────────────────────────────────────────────────────
const COUPON_DISCOUNTS = ["10%","20%","25%","50%","1 Month Free"];

function CouponsPanel() {
  const [coupons, setCoupons] = useState<Array<{ code:string; discount:string; uses:number; limit:number; active:boolean; expires:string }>>([
    { code:"WELCOME20", discount:"20%",       uses:47,  limit:100, active:true,  expires:"2026-12-31" },
    { code:"TRADE50",   discount:"50%",       uses:12,  limit:20,  active:true,  expires:"2026-07-01" },
    { code:"FREEMONTH", discount:"1 Month Free", uses:5, limit:10, active:true,  expires:"2026-08-01" },
    { code:"SUMMER10",  discount:"10%",       uses:200, limit:200, active:false, expires:"2026-06-30" },
  ]);
  const [newCode, setNewCode]         = useState("");
  const [newDiscount, setNewDiscount] = useState("20%");
  const [newLimit, setNewLimit]       = useState("100");
  const [newExpiry, setNewExpiry]     = useState("");
  const [copied, setCopied]           = useState<string|null>(null);

  const addCoupon = () => {
    if (!newCode.trim()) { toast.error("Coupon code required"); return; }
    setCoupons(prev => [...prev, { code:newCode.toUpperCase().trim(), discount:newDiscount, uses:0, limit:parseInt(newLimit)||100, active:true, expires:newExpiry||"2027-01-01" }]);
    setNewCode(""); toast.success("Coupon created!");
  };

  const toggleActive = (code: string) =>
    setCoupons(prev => prev.map(c => c.code===code ? {...c, active:!c.active} : c));

  const copyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    toast.success("Coupon code copied!");
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Create coupon */}
      <div className="glass-card p-6">
        <h3 className="font-display font-semibold mb-4 flex items-center gap-2"><Tag className="w-4 h-4 text-primary"/>Create New Coupon</h3>
        <div className="grid sm:grid-cols-4 gap-3 mb-3">
          <div className="sm:col-span-2 space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Coupon Code</label>
            <input value={newCode} onChange={e=>setNewCode(e.target.value.toUpperCase())} placeholder="e.g. SAVE20"
              className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-foreground text-sm outline-none font-mono uppercase" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Discount</label>
            <select value={newDiscount} onChange={e=>setNewDiscount(e.target.value)}
              className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-foreground text-sm outline-none">
              {COUPON_DISCOUNTS.map(d=><option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Max Uses</label>
            <input type="number" value={newLimit} onChange={e=>setNewLimit(e.target.value)} placeholder="100"
              className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-foreground text-sm outline-none" />
          </div>
        </div>
        <div className="flex gap-3 items-end">
          <div className="flex-1 space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Expires</label>
            <input type="date" value={newExpiry} onChange={e=>setNewExpiry(e.target.value)}
              className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-foreground text-sm outline-none" />
          </div>
          <button onClick={addCoupon} className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm flex items-center gap-2 hover:bg-primary/90 transition-all">
            <Plus className="w-4 h-4"/>Create
          </button>
        </div>
      </div>

      {/* Coupons list */}
      <div className="glass-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="font-display font-semibold">All Coupons</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Code","Discount","Used / Limit","Expires","Status","Actions"].map(h=>(
                  <th key={h} className="text-left text-xs text-muted-foreground font-semibold px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {coupons.map(c=>(
                <tr key={c.code} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-primary">{c.code}</span>
                      <button onClick={()=>copyCoupon(c.code)} className="text-muted-foreground hover:text-foreground transition-colors">
                        {copied===c.code ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400"/> : <Copy className="w-3.5 h-3.5"/>}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-emerald-400">{c.discount}</td>
                  <td className="px-4 py-3">
                    <div>
                      <div className="text-sm">{c.uses} / {c.limit}</div>
                      <div className="h-1.5 bg-secondary rounded-full mt-1 w-24">
                        <div className="h-full bg-primary rounded-full" style={{width:`${Math.min(100,(c.uses/c.limit)*100)}%`}}/>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{c.expires}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${c.active && c.uses<c.limit ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30":"bg-secondary text-muted-foreground border-border"}`}>
                      {c.active && c.uses<c.limit ? "Active":"Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={()=>toggleActive(c.code)} className="text-xs text-muted-foreground hover:text-foreground border border-border rounded-lg px-2.5 py-1 transition-colors">
                      {c.active?"Disable":"Enable"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Indicators Panel ────────────────────────────────────────────────────────
interface IIndicator { id:string; name:string; short_desc:string; description:string; category:string; preview_image:string|null; price:number|null; tv_invite_link:string|null; is_active:boolean; }
interface IAccess { id:string; user_id:string; indicator_id:string; tv_username:string; status:string; granted_at:string|null; created_at:string; email?:string; indicator_name?:string; }

const blankIndForm = () => ({ name:"", short_desc:"", description:"", category:"Forex", preview_image:"", price:"", tv_invite_link:"" });

function IndicatorsPanel() {
  const [indicators, setIndicators] = useState<IIndicator[]>([]);
  const [requests, setRequests]     = useState<IAccess[]>([]);
  const [loading, setLoading]       = useState(true);
  const [showForm, setShowForm]     = useState(false);
  const [form, setForm] = useState(blankIndForm());

  const load = async () => {
    setLoading(true);
    const [indRes, accRes] = await Promise.all([
      supabase.from("indicators").select("*").order("created_at", { ascending: false }),
      supabase.from("indicator_access").select("*, indicators(name)").order("created_at", { ascending: false }),
    ]);
    if (indRes.data) setIndicators(indRes.data as IIndicator[]);
    if (accRes.data) {
      const mapped = accRes.data.map((r: Record<string, unknown>) => ({
        ...(r as IAccess),
        indicator_name: (r.indicators as { name: string } | null)?.name ?? "",
      }));
      setRequests(mapped);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const createIndicator = async () => {
    if (!form.name.trim()) { toast.error("Name required"); return; }
    const { error } = await supabase.from("indicators").insert({
      name: form.name,
      short_desc: form.short_desc,
      description: form.description,
      category: form.category,
      preview_image: form.preview_image || null,
      price: form.price ? parseFloat(form.price) : null,
      tv_invite_link: form.tv_invite_link || null,
      is_active: true,
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Indicator added!");
    setForm(blankIndForm());
    setShowForm(false);
    load();
  };

  const deleteIndicator = async (id: string) => {
    await supabase.from("indicators").delete().eq("id", id);
    setIndicators(prev => prev.filter(i => i.id !== id));
    toast.success("Deleted");
  };

  const grantAccess = async (req: IAccess) => {
    const { error } = await supabase.from("indicator_access").update({ status: "granted", granted_at: new Date().toISOString() }).eq("id", req.id);
    if (error) { toast.error(error.message); return; }
    setRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: "granted", granted_at: new Date().toISOString() } : r));
    toast.success(`Access granted to ${req.tv_username}`);
  };

  const revokeAccess = async (req: IAccess) => {
    const { error } = await supabase.from("indicator_access").update({ status: "revoked" }).eq("id", req.id);
    if (error) { toast.error(error.message); return; }
    setRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: "revoked" } : r));
    toast.success("Access revoked");
  };

  const CATS = ["Forex","Indices","Crypto","Commodities","All Markets"];
  const pending = requests.filter(r => r.status === "pending");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold">TradingView Indicators</h2>
          <p className="text-sm text-muted-foreground">{indicators.length} indicators · {pending.length} pending requests</p>
        </div>
        <Button onClick={() => setShowForm(s => !s)} className="gap-2">
          <Plus className="w-4 h-4" /> Add Indicator
        </Button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="glass-card p-5 space-y-4">
          <h3 className="font-semibold">New Indicator</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1"><label className="text-xs font-medium text-muted-foreground">Name *</label>
              <Input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="e.g. MQTRADE Scalper Pro" className="bg-secondary" /></div>
            <div className="space-y-1"><label className="text-xs font-medium text-muted-foreground">Category</label>
              <select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} className="w-full h-10 rounded-xl bg-secondary border border-border px-3 text-sm">
                {CATS.map(c=><option key={c}>{c}</option>)}</select></div>
            <div className="space-y-1"><label className="text-xs font-medium text-muted-foreground">Price (USD)</label>
              <Input type="number" step="1" min="0" value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))} placeholder="e.g. 29 (leave blank for free)" className="bg-secondary" /></div>
            <div className="space-y-1"><label className="text-xs font-medium text-muted-foreground">Preview Image URL</label>
              <Input value={form.preview_image} onChange={e=>setForm(f=>({...f,preview_image:e.target.value}))} placeholder="https://..." className="bg-secondary" /></div>
            <div className="space-y-1 sm:col-span-2"><label className="text-xs font-medium text-muted-foreground">Short Description</label>
              <Input value={form.short_desc} onChange={e=>setForm(f=>({...f,short_desc:e.target.value}))} placeholder="One-liner shown on card" className="bg-secondary" /></div>
            <div className="space-y-1 sm:col-span-2"><label className="text-xs font-medium text-muted-foreground">Full Description</label>
              <textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} placeholder="Detailed description shown in modal" rows={3} className="w-full rounded-xl bg-secondary border border-border px-3 py-2 text-sm resize-none" /></div>
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-medium text-muted-foreground">TradingView Invite Link</label>
              <Input value={form.tv_invite_link} onChange={e=>setForm(f=>({...f,tv_invite_link:e.target.value}))} placeholder="https://www.tradingview.com/script/..." className="bg-secondary" />
              <p className="text-xs text-muted-foreground">Shown to user only after access is granted</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={createIndicator} variant="hero">Save Indicator</Button>
            <Button variant="outline" onClick={()=>setShowForm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Indicators list */}
      {loading ? <div className="h-32 animate-pulse glass-card" /> : (
        <div className="glass-card overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border">
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Name</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Category</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Price</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">TV Link</th>
              <th className="px-4 py-3" />
            </tr></thead>
            <tbody>
              {indicators.length === 0 && <tr><td colSpan={5} className="text-center py-8 text-muted-foreground">No indicators yet</td></tr>}
              {indicators.map(ind => (
                <tr key={ind.id} className="border-b border-border/50 hover:bg-secondary/30">
                  <td className="px-4 py-3 font-medium">{ind.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{ind.category}</td>
                  <td className="px-4 py-3 text-emerald-400 font-semibold">{ind.price ? `$${ind.price}` : "Free"}</td>
                  <td className="px-4 py-3">
                    {ind.tv_invite_link
                      ? <a href={ind.tv_invite_link} target="_blank" rel="noopener noreferrer" className="text-primary text-xs hover:underline truncate block max-w-[160px]">View link</a>
                      : <span className="text-xs text-muted-foreground">—</span>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={()=>deleteIndicator(ind.id)} className="text-red-400 hover:text-red-300 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Access Requests */}
      <div>
        <h3 className="font-display font-semibold mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4 text-primary" /> Access Requests
          {pending.length > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{pending.length} pending</span>}
        </h3>
        <div className="glass-card overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border">
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">TV Username</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Indicator</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Requested</th>
              <th className="px-4 py-3" />
            </tr></thead>
            <tbody>
              {requests.length === 0 && <tr><td colSpan={5} className="text-center py-8 text-muted-foreground">No requests yet</td></tr>}
              {requests.map(req => (
                <tr key={req.id} className="border-b border-border/50 hover:bg-secondary/30">
                  <td className="px-4 py-3 font-mono font-medium text-primary">{req.tv_username}</td>
                  <td className="px-4 py-3 text-muted-foreground">{req.indicator_name}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      req.status === "granted" ? "bg-emerald-500/15 text-emerald-400"
                      : req.status === "revoked" ? "bg-red-500/15 text-red-400"
                      : "bg-amber-500/15 text-amber-400"}`}>{req.status}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(req.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right flex gap-2 justify-end">
                    {req.status !== "granted" && (
                      <button onClick={()=>grantAccess(req)} className="text-xs px-3 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 transition-colors font-medium">Grant</button>
                    )}
                    {req.status === "granted" && (
                      <button onClick={()=>revokeAccess(req)} className="text-xs px-3 py-1 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors font-medium">Revoke</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Component ──────────────────────────────────────────────────────────────
export default function Admin() {
  const { user, isLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<AdminTab>("overview");
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  // Data
  const [signals, setSignals]           = useState<TSignal[]>([]);
  const [subscribers, setSubscribers]   = useState<Subscriber[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [strategies, setStrategies]     = useState<Strategy[]>([]);

  // Form state
  const [showSignalForm, setShowSignalForm]       = useState(false);
  const [showAnnForm, setShowAnnForm]             = useState(false);
  const [showStratForm, setShowStratForm]         = useState(false);
  const [editSignalId, setEditSignalId]           = useState<string|null>(null);
  const [editStratId, setEditStratId]             = useState<string|null>(null);
  const [signalForm, setSignalForm]               = useState(blankSignal());
  const [annForm, setAnnForm]                     = useState(blankAnnouncement());
  const [stratForm, setStratForm]                 = useState(blankStrategy());

  // Auth + admin check
  useEffect(() => {
    if (isLoading) return;
    if (!user) { setChecking(false); return; }
    supabase.rpc("is_admin").then(({ data }) => {
      setIsAdmin(!!data);
      setChecking(false);
    });
  }, [user, isLoading]);

  // Load data once admin confirmed
  useEffect(() => {
    if (!isAdmin) return;
    loadAll();
  }, [isAdmin]);

  const loadAll = () => {
    supabase.from("signals").select("*").order("created_at",{ascending:false}).then(({data})=>{ if(data) setSignals(data as TSignal[]); });
    supabase.rpc("get_all_subscribers").then(({data})=>{ if(data) setSubscribers(data as Subscriber[]); });
    supabase.from("announcements").select("*").order("pinned",{ascending:false}).then(({data})=>{ if(data) setAnnouncements(data as Announcement[]); });
    supabase.from("strategies").select("*").order("created_at",{ascending:false}).then(({data})=>{ if(data) setStrategies(data as Strategy[]); });
  };

  // ── Stats ────────────────────────────────────────────────────────────────
  const stats = useMemo(() => ({
    totalUsers:    subscribers.length,
    active:        subscribers.filter(s=>s.active).length,
    revenue:       subscribers.filter(s=>s.active).length * 50,
    activeSignals: signals.filter(s=>s.status==="active").length,
    totalSignals:  signals.length,
  }), [subscribers, signals]);

  // ── Signal CRUD ──────────────────────────────────────────────────────────
  const saveSignal = async () => {
    if (!signalForm.asset || !signalForm.entry) { toast.error("Asset and entry are required"); return; }
    const payload = { ...signalForm, tp: signalForm.tp.filter(t=>t.trim()!=="") };
    if (editSignalId) {
      const { error } = await supabase.from("signals").update(payload).eq("id", editSignalId);
      if (error) { toast.error(error.message); return; }
      setSignals(prev => prev.map(s => s.id===editSignalId ? {...s,...payload} : s));
      toast.success("Signal updated");
    } else {
      const { data, error } = await supabase.from("signals").insert(payload).select().single();
      if (error || !data) { toast.error(error?.message??"Failed"); return; }
      setSignals(prev => [data as TSignal, ...prev]);
      toast.success("Signal posted");
    }
    setShowSignalForm(false); setEditSignalId(null); setSignalForm(blankSignal());
  };

  const deleteSignal = async (id: string) => {
    await supabase.from("signals").delete().eq("id", id);
    setSignals(prev => prev.filter(s=>s.id!==id));
    toast.success("Signal deleted");
  };

  const editSignal = (s: TSignal) => {
    const { id, created_at, ...rest } = s;
    const filled = { ...rest, tp: [...rest.tp, "", "", ""].slice(0,3) };
    setSignalForm(filled); setEditSignalId(id); setShowSignalForm(true);
  };

  const updateSignalStatus = async (id: string, status: TSignal["status"]) => {
    await supabase.from("signals").update({ status }).eq("id", id);
    setSignals(prev => prev.map(s => s.id===id ? {...s, status} : s));
    toast.success("Status updated");
  };

  // ── Subscriber CRUD ───────────────────────────────────────────────────────
  const toggleSubscription = async (userId: string, currentActive: boolean) => {
    const { error } = await supabase.rpc("admin_set_subscription", { p_user_id: userId, p_active: !currentActive });
    if (error) { toast.error(error.message); return; }
    setSubscribers(prev => prev.map(s => s.user_id===userId
      ? { ...s, active: !currentActive, next_billing: !currentActive ? new Date(Date.now()+30*86400000).toISOString() : null }
      : s
    ));
    toast.success(!currentActive ? "Subscription activated" : "Subscription deactivated");
  };

  // ── Announcement CRUD ────────────────────────────────────────────────────
  const saveAnnouncement = async () => {
    if (!annForm.title) { toast.error("Title is required"); return; }
    const { data, error } = await supabase.from("announcements").insert(annForm).select().single();
    if (error || !data) { toast.error(error?.message??"Failed"); return; }
    setAnnouncements(prev => [data as Announcement, ...prev]);
    toast.success("Announcement posted");
    setShowAnnForm(false); setAnnForm(blankAnnouncement());
  };

  const deleteAnnouncement = async (id: string) => {
    await supabase.from("announcements").delete().eq("id", id);
    setAnnouncements(prev => prev.filter(a=>a.id!==id));
    toast.success("Deleted");
  };

  const togglePin = async (ann: Announcement) => {
    await supabase.from("announcements").update({ pinned: !ann.pinned }).eq("id", ann.id);
    setAnnouncements(prev => prev.map(a => a.id===ann.id ? {...a, pinned:!a.pinned} : a));
  };

  // ── Strategy CRUD ─────────────────────────────────────────────────────────
  const saveStrategy = async () => {
    if (!stratForm.title) { toast.error("Title is required"); return; }
    if (editStratId) {
      const { error } = await supabase.from("strategies").update(stratForm).eq("id", editStratId);
      if (error) { toast.error(error.message); return; }
      setStrategies(prev => prev.map(s => s.id===editStratId ? {...s,...stratForm} : s));
      toast.success("Strategy updated");
    } else {
      const { data, error } = await supabase.from("strategies").insert(stratForm).select().single();
      if (error || !data) { toast.error(error?.message??"Failed"); return; }
      setStrategies(prev => [data as Strategy, ...prev]);
      toast.success("Strategy added");
    }
    setShowStratForm(false); setEditStratId(null); setStratForm(blankStrategy());
  };

  const deleteStrategy = async (id: string) => {
    await supabase.from("strategies").delete().eq("id", id);
    setStrategies(prev => prev.filter(s=>s.id!==id));
    toast.success("Deleted");
  };

  const editStrategy = (s: Strategy) => {
    const { id, created_at, ...rest } = s;
    setStratForm(rest); setEditStratId(id); setShowStratForm(true);
  };

  const displayName = user?.name ? user.name.split(" ").map(w=>w[0].toUpperCase()+w.slice(1)).join(" ") : "Admin";
  const initials = displayName.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();

  if (isLoading || checking) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );

  if (!user) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
      <ShieldCheck className="w-12 h-12 text-muted-foreground" />
      <p className="text-muted-foreground">You must be logged in to access this page.</p>
      <Button onClick={() => navigate("/auth")}>Sign In</Button>
    </div>
  );

  if (!isAdmin) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
      <ShieldCheck className="w-12 h-12 text-destructive" />
      <p className="font-semibold text-lg">Access Denied</p>
      <p className="text-muted-foreground text-sm">Your account does not have admin privileges.</p>
      <Button variant="outline" onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">

      {/* ── Sidebar ── */}
      <aside className="w-64 border-r border-border bg-card/50 flex flex-col">
        <div className="p-4 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo2.png.png" alt="MQTRADE PRO" className="h-14 w-auto" />
            <span className="font-display font-bold text-base text-foreground tracking-wide leading-tight">MQTRADE PRO</span>
          </Link>
          <div className="flex items-center gap-1.5 mt-3 px-1">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary">Admin Panel</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map(item => (
            <button
              key={item.tab}
              onClick={() => setTab(item.tab as AdminTab)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
                tab === item.tab ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}

          <div className="pt-4 mt-4 border-t border-border">
            <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
              <LayoutDashboard className="w-4 h-4" />
              <span className="text-sm">User Dashboard</span>
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-bold text-sm">{initials}</span>
            </div>
            <div className="min-w-0">
              <p className="font-medium text-sm truncate">{displayName}</p>
              <p className="text-xs text-primary">Administrator</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground" onClick={() => { signOut(); navigate("/"); }}>
            <LogOut className="w-4 h-4 mr-2" />Sign Out
          </Button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold capitalize">{tab}</h1>
              <p className="text-sm text-muted-foreground">
                {tab==="overview" && `${stats.active} active subscribers · $${stats.revenue.toLocaleString()} MRR`}
                {tab==="signals" && `${stats.activeSignals} active · ${stats.totalSignals} total`}
                {tab==="subscribers" && `${stats.totalUsers} users · ${stats.active} subscribed`}
                {tab==="announcements" && `${announcements.length} posted`}
                {tab==="strategies" && `${strategies.length} strategies`}
              </p>
            </div>
            <div className="flex gap-2">
              {tab==="signals" && <Button variant="hero" size="sm" className="gap-2" onClick={()=>{setSignalForm(blankSignal());setEditSignalId(null);setShowSignalForm(true);}}><Plus className="w-4 h-4"/>Post Signal</Button>}
              {tab==="announcements" && <Button variant="hero" size="sm" className="gap-2" onClick={()=>{setAnnForm(blankAnnouncement());setShowAnnForm(true);}}><Plus className="w-4 h-4"/>Announcement</Button>}
              {tab==="strategies" && <Button variant="hero" size="sm" className="gap-2" onClick={()=>{setStratForm(blankStrategy());setEditStratId(null);setShowStratForm(true);}}><Plus className="w-4 h-4"/>Add Strategy</Button>}
            </div>
          </div>
        </header>

        <div className="p-6">

          {/* ── OVERVIEW ── */}
          {tab==="overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {label:"Total Users",       value:stats.totalUsers,                      sub:"registered accounts",        color:"text-foreground"},
                  {label:"Active Subscribers",value:stats.active,                          sub:`${stats.totalUsers>0?((stats.active/stats.totalUsers)*100).toFixed(0):0}% conversion`, color:"text-emerald-400"},
                  {label:"Monthly Revenue",   value:`$${stats.revenue.toLocaleString()}`,  sub:"$50 × active subscribers",   color:"text-primary"},
                  {label:"Active Signals",    value:stats.activeSignals,                   sub:`${stats.totalSignals} total`, color:"text-blue-400"},
                ].map(c=>(
                  <div key={c.label} className="glass-card p-4">
                    <p className="text-xs text-muted-foreground mb-1">{c.label}</p>
                    <p className={`font-display text-2xl font-bold ${c.color}`}>{c.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{c.sub}</p>
                  </div>
                ))}
              </div>

              {/* Recent subscribers */}
              <div className="glass-card p-6">
                <h3 className="font-display font-semibold mb-4">Recent Members</h3>
                <div className="space-y-3">
                  {subscribers.slice(0,8).map(s=>(
                    <div key={s.user_id} className="flex items-center justify-between text-sm">
                      <div>
                        <p className="font-medium">{s.email}</p>
                        <p className="text-xs text-muted-foreground">{new Date(s.joined).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${s.active?"bg-emerald-500/15 text-emerald-400 border-emerald-500/30":"bg-secondary text-muted-foreground border-border"}`}>
                        {s.active?"Active":"Inactive"}
                      </span>
                    </div>
                  ))}
                  {subscribers.length===0 && <p className="text-sm text-muted-foreground">No users yet</p>}
                </div>
              </div>

              {/* Recent signals */}
              <div className="glass-card p-6">
                <h3 className="font-display font-semibold mb-4">Recent Signals</h3>
                <div className="space-y-3">
                  {signals.slice(0,5).map(s=>(
                    <div key={s.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${s.type==="BUY"?"bg-emerald-500/15 text-emerald-400":"bg-red-500/15 text-red-400"}`}>{s.type}</span>
                        <span className="font-semibold">{s.asset}</span>
                        <span className="text-muted-foreground">{s.timeframe}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${
                        s.status==="active"?"bg-emerald-500/15 text-emerald-400 border-emerald-500/30":
                        s.status==="tp_hit"?"bg-blue-500/15 text-blue-400 border-blue-500/30":
                        s.status==="sl_hit"?"bg-red-500/15 text-red-400 border-red-500/30":
                        "bg-secondary text-muted-foreground border-border"
                      }`}>{s.status.replace("_"," ").toUpperCase()}</span>
                    </div>
                  ))}
                  {signals.length===0 && <p className="text-sm text-muted-foreground">No signals yet</p>}
                </div>
              </div>
            </div>
          )}

          {/* ── SIGNALS ── */}
          {tab==="signals" && (
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      {["Asset","Dir","Entry","SL","TP Levels","TF","Status","Pips","Actions"].map(h=>(
                        <th key={h} className="text-left text-xs text-muted-foreground font-semibold px-4 py-3 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {signals.length===0 && (
                      <tr><td colSpan={9} className="px-4 py-10 text-center text-muted-foreground">No signals yet. Click "Post Signal" to add one.</td></tr>
                    )}
                    {signals.map(s=>(
                      <tr key={s.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                        <td className="px-4 py-3 font-semibold">{s.asset}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold ${s.type==="BUY"?"bg-emerald-500/15 text-emerald-400":"bg-red-500/15 text-red-400"}`}>
                            {s.type==="BUY"?<TrendingUp className="w-3 h-3"/>:<TrendingDown className="w-3 h-3"/>}{s.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs">{s.entry}</td>
                        <td className="px-4 py-3 font-mono text-xs text-red-400">{s.sl}</td>
                        <td className="px-4 py-3 font-mono text-xs text-emerald-400">{s.tp.join(" / ")}</td>
                        <td className="px-4 py-3 text-muted-foreground">{s.timeframe}</td>
                        <td className="px-4 py-3">
                          <select
                            value={s.status}
                            onChange={e=>updateSignalStatus(s.id, e.target.value as TSignal["status"])}
                            className={`text-xs rounded-full px-2 py-0.5 border font-semibold bg-transparent cursor-pointer ${
                              s.status==="active"?"text-emerald-400 border-emerald-500/30":
                              s.status==="tp_hit"?"text-blue-400 border-blue-500/30":
                              s.status==="sl_hit"?"text-red-400 border-red-500/30":
                              "text-muted-foreground border-border"
                            }`}
                          >
                            <option value="active">ACTIVE</option>
                            <option value="tp_hit">TP HIT</option>
                            <option value="sl_hit">SL HIT</option>
                            <option value="cancelled">CANCELLED</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 text-primary font-semibold">{s.pips>0?`+${s.pips}`:s.pips}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button onClick={()=>editSignal(s)} className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"><Edit2 className="w-3.5 h-3.5"/></button>
                            <button onClick={()=>deleteSignal(s.id)} className="p-1.5 rounded hover:bg-red-500/15 text-muted-foreground hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5"/></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── SUBSCRIBERS ── */}
          {tab==="subscribers" && (
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      {["Email","Joined","Status","Plan","Next Billing","Method","Action"].map(h=>(
                        <th key={h} className="text-left text-xs text-muted-foreground font-semibold px-4 py-3 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.length===0 && (
                      <tr><td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">No users yet</td></tr>
                    )}
                    {subscribers.map(s=>(
                      <tr key={s.user_id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                        <td className="px-4 py-3 font-medium">{s.email}</td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(s.joined).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${s.active?"bg-emerald-500/15 text-emerald-400 border-emerald-500/30":"bg-secondary text-muted-foreground border-border"}`}>
                            {s.active?"Active":"Inactive"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground capitalize">{s.plan}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {s.next_billing ? new Date(s.next_billing).toLocaleDateString() : "—"}
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground capitalize">{s.method||"—"}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={()=>toggleSubscription(s.user_id, s.active)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                              s.active
                                ? "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
                                : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20"
                            }`}
                          >
                            {s.active
                              ? <><XCircle className="w-3.5 h-3.5"/>Deactivate</>
                              : <><CheckCircle className="w-3.5 h-3.5"/>Activate</>}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── ANNOUNCEMENTS ── */}
          {tab==="announcements" && (
            <div className="space-y-4">
              {announcements.length===0 && (
                <div className="glass-card p-10 text-center text-muted-foreground">No announcements yet. Click "Announcement" to post one.</div>
              )}
              {announcements.map(a=>(
                <div key={a.id} className={`glass-card p-5 border-l-4 ${
                  a.type==="info"?"border-blue-500":a.type==="warning"?"border-amber-500":a.type==="success"?"border-emerald-500":"border-red-500"
                }`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {a.pinned && <Pin className="w-3.5 h-3.5 text-primary" />}
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${ANNTYPE_STYLES[a.type]}`}>{a.type.toUpperCase()}</span>
                        <span className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleDateString()}</span>
                      </div>
                      <h3 className="font-semibold text-foreground">{a.title}</h3>
                      {a.body && <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{a.body}</p>}
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button onClick={()=>togglePin(a)} className={`p-1.5 rounded transition-colors ${a.pinned?"text-primary":"text-muted-foreground hover:text-foreground"} hover:bg-secondary`}><Pin className="w-4 h-4"/></button>
                      <button onClick={()=>deleteAnnouncement(a.id)} className="p-1.5 rounded hover:bg-red-500/15 text-muted-foreground hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4"/></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── STRATEGIES ── */}
          {tab==="strategies" && (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {strategies.length===0 && (
                <div className="col-span-3 glass-card p-10 text-center text-muted-foreground">No strategies yet. Click "Add Strategy" to upload one.</div>
              )}
              {strategies.map(s=>(
                <div key={s.id} className="glass-card p-5 flex flex-col gap-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-semibold text-primary">{s.category}</span>
                      <h3 className="font-semibold mt-0.5">{s.title}</h3>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={()=>editStrategy(s)} className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"><Edit2 className="w-3.5 h-3.5"/></button>
                      <button onClick={()=>deleteStrategy(s.id)} className="p-1.5 rounded hover:bg-red-500/15 text-muted-foreground hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5"/></button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
                  {s.content && (
                    <div className="text-xs text-muted-foreground bg-secondary/50 rounded-lg p-3 leading-relaxed whitespace-pre-wrap max-h-32 overflow-y-auto">{s.content}</div>
                  )}
                  <div className="flex gap-2 text-xs">
                    <span className="px-2 py-0.5 rounded bg-secondary text-muted-foreground">{s.timeframe}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── REVENUE ── */}
          {tab==="revenue" && (
            <div className="space-y-6">
              {/* MRR cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label:"Monthly Recurring Revenue", value:`$${stats.active * 40}`, icon:DollarSign, color:"text-emerald-400" },
                  { label:"Active Subscribers",        value:`${stats.active}`,       icon:Users,       color:"text-blue-400" },
                  { label:"Churned This Month",        value:"2",                     icon:TrendingDown,color:"text-red-400" },
                  { label:"New This Month",            value:`${Math.max(0,stats.active-8)}`, icon:TrendingUp, color:"text-primary" },
                ].map(c=>(
                  <div key={c.label} className="glass-card p-5">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">{c.label}</p>
                      <c.icon className={`w-4 h-4 ${c.color}`} />
                    </div>
                    <p className={`font-display text-3xl font-black ${c.color}`}>{c.value}</p>
                  </div>
                ))}
              </div>
              {/* Subscriber plan breakdown */}
              <div className="glass-card p-6">
                <h3 className="font-display font-semibold mb-4">Plan Distribution</h3>
                <div className="space-y-3">
                  {[
                    { plan:"Elite ($50/mo)", count: Math.floor(stats.active*0.55), pct:55, color:"bg-primary" },
                    { plan:"Pro ($30/mo)",   count: Math.floor(stats.active*0.35), pct:35, color:"bg-blue-500" },
                    { plan:"Free Trial",     count: Math.floor(stats.active*0.1),  pct:10, color:"bg-muted" },
                  ].map(row=>(
                    <div key={row.plan}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-foreground">{row.plan}</span>
                        <span className="text-muted-foreground">{row.count} users ({row.pct}%)</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div className={`h-full ${row.color} rounded-full`} style={{width:`${row.pct}%`}} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── BROADCAST ── */}
          {tab==="broadcast" && (
            <BroadcastPanel subscriberCount={stats.active} />
          )}

          {/* ── COUPONS ── */}
          {tab==="coupons" && (
            <CouponsPanel />
          )}

          {/* ── INDICATORS ── */}
          {tab==="indicators" && (
            <IndicatorsPanel />
          )}

        </div>
      </main>

      {/* ── Signal Form Modal ── */}
      {showSignalForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-display text-lg font-bold">{editSignalId?"Edit Signal":"Post New Signal"}</h2>
              <button onClick={()=>{setShowSignalForm(false);setEditSignalId(null);}} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground"><XIcon className="w-5 h-5"/></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Asset *</Label>
                  <select value={signalForm.asset} onChange={e=>setSignalForm(f=>({...f,asset:e.target.value}))} className="w-full text-sm bg-secondary border border-border rounded-lg px-3 py-2 text-foreground h-10">
                    {ASSETS.map(a=><option key={a}>{a}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Direction *</Label>
                  <div className="flex gap-2">
                    {(["BUY","SELL"] as const).map(t=>(
                      <button key={t} onClick={()=>setSignalForm(f=>({...f,type:t}))} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${signalForm.type===t?(t==="BUY"?"bg-emerald-500/20 text-emerald-400 border border-emerald-500/30":"bg-red-500/20 text-red-400 border border-red-500/30"):"bg-secondary text-muted-foreground"}`}>{t}</button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Timeframe</Label>
                  <select value={signalForm.timeframe} onChange={e=>setSignalForm(f=>({...f,timeframe:e.target.value}))} className="w-full text-sm bg-secondary border border-border rounded-lg px-3 py-2 text-foreground h-10">
                    {TIMEFRAMES.map(t=><option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Entry Price *</Label><Input type="number" step="any" value={signalForm.entry||""} onChange={e=>setSignalForm(f=>({...f,entry:+e.target.value}))} className="bg-secondary border-border" placeholder="0.00"/></div>
                <div className="space-y-2"><Label>Stop Loss *</Label><Input type="number" step="any" value={signalForm.sl||""} onChange={e=>setSignalForm(f=>({...f,sl:+e.target.value}))} className="bg-secondary border-border" placeholder="0.00"/></div>
              </div>

              <div className="space-y-2">
                <Label>Take Profit Levels</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[0,1,2].map(i=>(
                    <Input key={i} type="text" placeholder={`TP ${i+1}`} value={signalForm.tp[i]||""} onChange={e=>setSignalForm(f=>({...f,tp:f.tp.map((v,j)=>j===i?e.target.value:v)}))} className="bg-secondary border-border" />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Expected Pips</Label>
                  <Input type="number" value={signalForm.pips||""} onChange={e=>setSignalForm(f=>({...f,pips:+e.target.value}))} className="bg-secondary border-border" placeholder="0"/>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <select value={signalForm.status} onChange={e=>setSignalForm(f=>({...f,status:e.target.value as TSignal["status"]}))} className="w-full text-sm bg-secondary border border-border rounded-lg px-3 py-2 text-foreground h-10">
                    <option value="active">Active</option>
                    <option value="tp_hit">TP Hit</option>
                    <option value="sl_hit">SL Hit</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Analysis Notes</Label>
                <textarea value={signalForm.notes} onChange={e=>setSignalForm(f=>({...f,notes:e.target.value}))} rows={3} placeholder="Trade rationale, key levels, context..." className="w-full text-sm bg-secondary border border-border rounded-lg px-3 py-2 text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"/>
              </div>

              <div className="flex gap-3 pt-1">
                <Button variant="ghost" className="flex-1" onClick={()=>{setShowSignalForm(false);setEditSignalId(null);}}>Cancel</Button>
                <Button variant="hero" className="flex-1" onClick={saveSignal}>{editSignalId?"Update Signal":"Post Signal"}</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Announcement Modal ── */}
      {showAnnForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-display text-lg font-bold">Post Announcement</h2>
              <button onClick={()=>setShowAnnForm(false)} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground"><XIcon className="w-5 h-5"/></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2"><Label>Title *</Label><Input value={annForm.title} onChange={e=>setAnnForm(f=>({...f,title:e.target.value}))} className="bg-secondary border-border" placeholder="Announcement title"/></div>
              <div className="space-y-2">
                <Label>Message</Label>
                <textarea value={annForm.body} onChange={e=>setAnnForm(f=>({...f,body:e.target.value}))} rows={4} placeholder="Full announcement text..." className="w-full text-sm bg-secondary border border-border rounded-lg px-3 py-2 text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <select value={annForm.type} onChange={e=>setAnnForm(f=>({...f,type:e.target.value as Announcement["type"]}))} className="w-full text-sm bg-secondary border border-border rounded-lg px-3 py-2 text-foreground h-10">
                    <option value="info">Info</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Pin to top</Label>
                  <button onClick={()=>setAnnForm(f=>({...f,pinned:!f.pinned}))} className={`w-full h-10 rounded-lg text-sm font-medium transition-colors border ${annForm.pinned?"bg-primary/20 text-primary border-primary/30":"bg-secondary text-muted-foreground border-border"}`}>
                    {annForm.pinned?"Pinned":"Not pinned"}
                  </button>
                </div>
              </div>
              <div className="flex gap-3 pt-1">
                <Button variant="ghost" className="flex-1" onClick={()=>setShowAnnForm(false)}>Cancel</Button>
                <Button variant="hero" className="flex-1" onClick={saveAnnouncement}>Post</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Strategy Modal ── */}
      {showStratForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-display text-lg font-bold">{editStratId?"Edit Strategy":"Add Strategy"}</h2>
              <button onClick={()=>{setShowStratForm(false);setEditStratId(null);}} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground"><XIcon className="w-5 h-5"/></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2"><Label>Title *</Label><Input value={stratForm.title} onChange={e=>setStratForm(f=>({...f,title:e.target.value}))} className="bg-secondary border-border" placeholder="Strategy name"/></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <select value={stratForm.category} onChange={e=>setStratForm(f=>({...f,category:e.target.value}))} className="w-full text-sm bg-secondary border border-border rounded-lg px-3 py-2 text-foreground h-10">
                    {CATEGORIES.map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Timeframe</Label>
                  <select value={stratForm.timeframe} onChange={e=>setStratForm(f=>({...f,timeframe:e.target.value}))} className="w-full text-sm bg-secondary border border-border rounded-lg px-3 py-2 text-foreground h-10">
                    {TIMEFRAMES.map(t=><option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Short Description</Label>
                <Input value={stratForm.description} onChange={e=>setStratForm(f=>({...f,description:e.target.value}))} className="bg-secondary border-border" placeholder="One line summary"/>
              </div>
              <div className="space-y-2">
                <Label>Full Strategy Content</Label>
                <textarea value={stratForm.content} onChange={e=>setStratForm(f=>({...f,content:e.target.value}))} rows={8} placeholder="Entry rules, exit rules, risk management, examples..." className="w-full text-sm bg-secondary border border-border rounded-lg px-3 py-2 text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"/>
              </div>
              <div className="flex gap-3 pt-1">
                <Button variant="ghost" className="flex-1" onClick={()=>{setShowStratForm(false);setEditStratId(null);}}>Cancel</Button>
                <Button variant="hero" className="flex-1" onClick={saveStrategy}>{editStratId?"Update":"Add Strategy"}</Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
