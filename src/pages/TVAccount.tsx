import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import TVLayout from "@/components/TVLayout";
import { toast } from "sonner";
import {
  User, Mail, CheckCircle, Clock, Layers, LogOut, ArrowRight,
  ExternalLink, Sparkles, ShieldCheck,
} from "lucide-react";

interface AccessRow {
  indicator_id: string;
  status: string;
  tv_username: string;
  granted_at: string | null;
  indicators: { name: string; category: string; tv_invite_link: string | null } | null;
}

export default function TVAccount() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState<AccessRow[]>([]);
  const [loading, setLoading] = useState(true);

  const displayName = (user as any)?.name
    ? (user as any).name.split(" ").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
    : "Trader";
  const initials = displayName.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();

  useEffect(() => {
    if (!user) return;
    supabase
      .from("indicator_access")
      .select("indicator_id,status,tv_username,granted_at,indicators(name,category,tv_invite_link)")
      .eq("user_id", user.id)
      .order("granted_at", { ascending: false })
      .then(({ data }) => {
        if (data) setRows(data as unknown as AccessRow[]);
        setLoading(false);
      });
  }, [user]);

  const granted = rows.filter(r => r.status === "granted");
  const pending = rows.filter(r => r.status === "pending");
  const tvUsername = rows[0]?.tv_username ?? null;

  return (
    <TVLayout>
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <p className="text-violet-400 text-xs font-bold uppercase tracking-widest mb-1">Account</p>
          <h1 className="text-white font-bold text-3xl">My Account</h1>
          <p className="text-violet-200/50 text-sm mt-1">Manage your profile, plan, and script access.</p>
        </div>

        {/* Profile card */}
        <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-violet-400 flex items-center justify-center shadow-lg shrink-0">
              {(user as any)?.avatarUrl
                ? <img src={(user as any).avatarUrl} alt="avatar" className="w-full h-full object-cover rounded-2xl" />
                : <span className="text-white font-black text-xl">{initials}</span>}
            </div>
            <div className="min-w-0">
              <p className="text-white font-bold text-xl truncate">{displayName}</p>
              <span className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full bg-violet-600/25 border border-violet-500/30 text-violet-300 text-[11px] font-bold">
                <Sparkles className="w-3 h-3" /> Free TV Account
              </span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-black/20 border border-violet-500/10">
              <Mail className="w-4 h-4 text-violet-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] text-violet-200/40 uppercase tracking-wide">Email</p>
                <p className="text-white text-sm truncate">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-black/20 border border-violet-500/10">
              <User className="w-4 h-4 text-violet-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] text-violet-200/40 uppercase tracking-wide">TradingView Username</p>
                <p className="text-white text-sm truncate">{tvUsername ?? "Not set yet"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Plan status */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { label: "Scripts Granted", value: loading ? "—" : granted.length.toString(), icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
            { label: "Pending Requests", value: loading ? "—" : pending.length.toString(), icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
            { label: "Plan", value: "Free", icon: ShieldCheck, color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
          ].map(s => (
            <div key={s.label} className={`rounded-2xl border p-5 ${s.bg}`}>
              <s.icon className={`w-5 h-5 ${s.color} mb-3`} />
              <p className={`font-black text-2xl ${s.color}`}>{s.value}</p>
              <p className="text-violet-200/50 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* My scripts */}
        <div>
          <p className="text-white font-bold text-lg mb-4">My Scripts</p>
          {loading ? (
            <div className="space-y-3">
              {[1, 2].map(i => <div key={i} className="h-16 rounded-xl bg-violet-500/10 animate-pulse" />)}
            </div>
          ) : rows.length === 0 ? (
            <div className="rounded-2xl border border-violet-500/20 p-10 text-center">
              <Layers className="w-10 h-10 text-violet-500/40 mx-auto mb-3" />
              <p className="text-violet-200/40 mb-4">You haven't requested any scripts yet.</p>
              <Link
                to="/indicators"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold transition-colors"
              >
                Browse Scripts <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {rows.map(r => {
                const isGranted = r.status === "granted";
                return (
                  <div
                    key={r.indicator_id}
                    className="flex items-center gap-4 px-4 py-3 rounded-xl border border-violet-500/20 bg-violet-500/5"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isGranted ? "bg-emerald-500/15" : "bg-amber-500/15"}`}>
                      {isGranted ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : <Clock className="w-5 h-5 text-amber-400" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-white text-sm font-semibold truncate">{r.indicators?.name ?? "Script"}</p>
                      <p className="text-violet-200/40 text-xs">{r.indicators?.category ?? ""} · {isGranted ? "Access granted" : "Awaiting invite (within 24h)"}</p>
                    </div>
                    {isGranted && r.indicators?.tv_invite_link && (
                      <a
                        href={r.indicators.tv_invite_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-violet-400 hover:text-violet-300"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Open
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Upgrade CTA */}
        <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-primary font-bold text-sm uppercase tracking-widest mb-1">Upgrade</p>
            <p className="text-white font-bold text-xl">Unlock MQTRADE PRO</p>
            <p className="text-white/50 text-sm mt-1">Live signals, MT5 journal, prop firm prep &amp; full community.</p>
          </div>
          <Link
            to="/payment"
            className="shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm transition-colors shadow-lg shadow-primary/25"
          >
            Upgrade — $50/mo <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Sign out */}
        <div className="pt-2">
          <button
            onClick={() => { signOut(); toast.success("Signed out"); navigate("/"); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-violet-400/70 hover:text-red-400 hover:bg-red-500/10 border border-violet-500/20 transition-all text-sm font-medium"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>

      </div>
    </TVLayout>
  );
}
