import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import TVLayout from "@/components/TVLayout";
import { ArrowRight, Layers, CheckCircle, Clock, TrendingUp, Tag, ExternalLink } from "lucide-react";

interface Indicator {
  id: string;
  name: string;
  short_desc: string;
  category: string;
  preview_image: string | null;
  price: number | null;
  is_active: boolean;
}

interface AccessRequest {
  indicator_id: string;
  status: string;
}

export default function TVDashboard() {
  const { user } = useAuth();
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [myAccess, setMyAccess] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const displayName = (user as any)?.name?.split(" ")[0] ?? "Trader";

  useEffect(() => {
    Promise.all([
      supabase.from("indicators").select("id,name,short_desc,category,preview_image,price,is_active")
        .eq("is_active", true).order("created_at", { ascending: false }).limit(6),
      user
        ? supabase.from("indicator_access").select("indicator_id,status").eq("user_id", user.id)
        : Promise.resolve({ data: [] }),
    ]).then(([ind, acc]) => {
      if (ind.data) setIndicators(ind.data as Indicator[]);
      if (acc.data) setMyAccess(acc.data as AccessRequest[]);
      setLoading(false);
    });
  }, [user]);

  const granted = myAccess.filter(a => a.status === "granted").length;
  const pending = myAccess.filter(a => a.status === "pending").length;

  return (
    <TVLayout>
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Welcome header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-violet-400 text-xs font-bold uppercase tracking-widest mb-1">TradingView Strategies</p>
            <h1 className="text-white font-bold text-3xl">Welcome back, {displayName} 👋</h1>
            <p className="text-violet-200/50 text-sm mt-1">Browse and access exclusive invite-only Pine Script strategies & indicators.</p>
          </div>
          <Link
            to="/indicators"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold transition-colors"
          >
            Browse All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { label: "Available Scripts",  value: loading ? "—" : indicators.length.toString() + "+", icon: Layers,       color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
            { label: "Access Granted",     value: loading ? "—" : granted.toString(),                 icon: CheckCircle,  color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
            { label: "Pending Requests",   value: loading ? "—" : pending.toString(),                 icon: Clock,        color: "text-amber-400",   bg: "bg-amber-500/10 border-amber-500/20" },
          ].map(s => (
            <div key={s.label} className={`rounded-2xl border p-5 ${s.bg}`}>
              <s.icon className={`w-5 h-5 ${s.color} mb-3`} />
              <p className={`font-black text-2xl ${s.color}`}>{s.value}</p>
              <p className="text-violet-200/50 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6">
          <p className="text-violet-400 text-xs font-black uppercase tracking-widest mb-4">How It Works</p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: Tag,          step: "01", title: "Pick a Script",       desc: "Browse our exclusive Pine Script strategies and indicators." },
              { icon: CheckCircle,  step: "02", title: "Request Access",      desc: "Enter your TradingView username — we'll invite you within 24h." },
              { icon: ExternalLink, step: "03", title: "Use on TradingView",  desc: "Find it under Invite-Only Scripts on your TradingView account." },
            ].map(s => (
              <div key={s.step} className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-xl bg-violet-600/30 flex items-center justify-center shrink-0">
                  <s.icon className="w-4 h-4 text-violet-400" />
                </div>
                <div>
                  <p className="text-[10px] text-violet-400/60 font-black uppercase tracking-widest">{s.step}</p>
                  <p className="text-white text-sm font-semibold">{s.title}</p>
                  <p className="text-violet-200/50 text-xs mt-0.5 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured indicators */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-white font-bold text-lg">Featured Scripts</p>
            <Link to="/indicators" className="text-violet-400 text-xs font-semibold hover:text-violet-300 flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1,2,3].map(i => <div key={i} className="h-44 rounded-2xl bg-violet-500/10 animate-pulse" />)}
            </div>
          ) : indicators.length === 0 ? (
            <div className="rounded-2xl border border-violet-500/20 p-12 text-center">
              <Layers className="w-10 h-10 text-violet-500/40 mx-auto mb-3" />
              <p className="text-violet-200/40">No scripts available yet — check back soon.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {indicators.map(ind => {
                const access = myAccess.find(a => a.indicator_id === ind.id);
                const isGranted = access?.status === "granted";
                const isPending = access?.status === "pending";
                return (
                  <Link
                    key={ind.id}
                    to="/indicators"
                    className="rounded-2xl border border-violet-500/20 bg-violet-500/5 hover:border-violet-400/50 hover:bg-violet-500/10 transition-all overflow-hidden group"
                  >
                    <div className="h-32 bg-violet-900/30 relative overflow-hidden">
                      {ind.preview_image
                        ? <img src={ind.preview_image} alt={ind.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        : <div className="w-full h-full flex items-center justify-center">
                            <TrendingUp className="w-10 h-10 text-violet-500/30" />
                          </div>
                      }
                      <div className="absolute top-2 right-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-white border border-white/10">
                          {!ind.price || ind.price === 0 ? "Free" : `$${ind.price.toFixed(0)}`}
                        </span>
                      </div>
                      {isGranted && (
                        <div className="absolute top-2 left-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                            <CheckCircle className="w-2.5 h-2.5" /> Granted
                          </span>
                        </div>
                      )}
                      {isPending && (
                        <div className="absolute top-2 left-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" /> Pending
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-white font-semibold text-sm truncate">{ind.name}</p>
                      <p className="text-violet-200/50 text-xs mt-0.5 line-clamp-2 leading-relaxed">{ind.short_desc}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Upgrade CTA */}
        <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-primary font-bold text-sm uppercase tracking-widest mb-1">Want More?</p>
            <p className="text-white font-bold text-xl">Unlock MQTRADE PRO</p>
            <p className="text-white/50 text-sm mt-1">Live signals, MT5 journal, prop firm prep &amp; full community access.</p>
          </div>
          <Link
            to="/payment"
            className="shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm transition-colors shadow-lg shadow-primary/25"
          >
            Upgrade — $50/mo <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </TVLayout>
  );
}
