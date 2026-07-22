import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { TrendingUp, CheckCircle, Clock, BarChart2, Layers, ChevronRight, X } from "lucide-react";

interface Indicator {
  id: string;
  name: string;
  short_desc: string;
  description: string;
  category: string;
  preview_image: string | null;
  is_active: boolean;
  created_at: string;
}

interface AccessRequest {
  indicator_id: string;
  status: string;
  tv_username: string;
  granted_at: string | null;
}

const CATEGORY_COLORS: Record<string, string> = {
  Forex:       "bg-blue-500/15 text-blue-400 border-blue-500/30",
  Indices:     "bg-violet-500/15 text-violet-400 border-violet-500/30",
  Crypto:      "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Commodities: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  "All Markets": "bg-primary/15 text-primary border-primary/30",
};

export default function Indicators() {
  const { user } = useAuth();
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [myAccess, setMyAccess] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState<Indicator | null>(null);
  const [tvUsername, setTvUsername] = useState("");
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    Promise.all([
      supabase.from("indicators").select("*").eq("is_active", true).order("created_at", { ascending: false }),
      user ? supabase.from("indicator_access").select("indicator_id,status,tv_username,granted_at").eq("user_id", user.id) : Promise.resolve({ data: [] }),
    ]).then(([ind, acc]) => {
      if (ind.data) setIndicators(ind.data);
      if (acc.data) setMyAccess(acc.data as AccessRequest[]);
      setLoading(false);
    });
  }, [user]);

  const getAccess = (id: string) => myAccess.find(a => a.indicator_id === id);

  const requestAccess = async () => {
    if (!user || !selected) return;
    if (!tvUsername.trim()) { toast.error("Enter your TradingView username"); return; }
    setRequesting(true);
    const { error } = await supabase.from("indicator_access").upsert({
      user_id: user.id,
      indicator_id: selected.id,
      tv_username: tvUsername.trim(),
      status: "pending",
    }, { onConflict: "user_id,indicator_id" });
    if (error) { toast.error(error.message); setRequesting(false); return; }
    setMyAccess(prev => {
      const filtered = prev.filter(a => a.indicator_id !== selected.id);
      return [...filtered, { indicator_id: selected.id, status: "pending", tv_username: tvUsername.trim(), granted_at: null }];
    });
    toast.success("Access requested! You'll be added within 24 hours.");
    setSelected(null);
    setTvUsername("");
    setRequesting(false);
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto p-6 space-y-8">

        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-black mb-1">TradingView Indicators</h1>
          <p className="text-muted-foreground">Exclusive indicators included with your MQTRADE PRO subscription. Request access and get added within 24 hours.</p>
        </div>

        {/* How it works */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: TrendingUp, title: "1. Request Access", desc: "Click any indicator and enter your TradingView username" },
            { icon: CheckCircle, title: "2. Get Invited", desc: "We manually add you to the private script within 24 hours" },
            { icon: BarChart2, title: "3. Use on TradingView", desc: "Find the indicator under Invite-Only Scripts in TradingView" },
          ].map(step => (
            <div key={step.title} className="glass-card p-4 flex gap-3 items-start">
              <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                <step.icon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">{step.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Indicators grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3].map(i => <div key={i} className="glass-card h-52 animate-pulse" />)}
          </div>
        ) : indicators.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Layers className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No indicators available yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {indicators.map(ind => {
              const access = getAccess(ind.id);
              return (
                <div key={ind.id} className="glass-card overflow-hidden flex flex-col group hover:border-primary/40 transition-all">
                  {/* Preview image */}
                  <div className="h-36 bg-secondary/50 relative overflow-hidden">
                    {ind.preview_image
                      ? <img src={ind.preview_image} alt={ind.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      : <div className="w-full h-full flex items-center justify-center">
                          <TrendingUp className="w-12 h-12 text-primary/30" />
                        </div>
                    }
                    <div className="absolute top-2 left-2">
                      <Badge variant="outline" className={`text-[10px] ${CATEGORY_COLORS[ind.category] ?? CATEGORY_COLORS["All Markets"]}`}>
                        {ind.category}
                      </Badge>
                    </div>
                    {access && (
                      <div className="absolute top-2 right-2">
                        {access.status === "granted"
                          ? <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]"><CheckCircle className="w-3 h-3 mr-1" />Granted</Badge>
                          : <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-[10px]"><Clock className="w-3 h-3 mr-1" />Pending</Badge>
                        }
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-display font-bold text-sm mb-1">{ind.name}</h3>
                    <p className="text-xs text-muted-foreground flex-1 leading-relaxed">{ind.short_desc}</p>
                    <Button
                      size="sm"
                      className="mt-3 w-full"
                      variant={access?.status === "granted" ? "outline" : "hero"}
                      onClick={() => { setSelected(ind); setTvUsername(access?.tv_username ?? ""); }}
                      disabled={access?.status === "granted"}
                    >
                      {access?.status === "granted"
                        ? "Access Granted ✓"
                        : access?.status === "pending"
                        ? "Pending — Update Request"
                        : <>Request Access <ChevronRight className="w-3 h-3 ml-1" /></>
                      }
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Request modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
            <h2 className="font-display font-bold text-lg mb-1">Request Access</h2>
            <p className="text-sm text-muted-foreground mb-5">
              Enter your TradingView username to get invited to <span className="text-foreground font-semibold">{selected.name}</span>.
            </p>

            {selected.description && (
              <div className="bg-secondary/50 rounded-xl p-3 mb-5 text-sm text-muted-foreground leading-relaxed">
                {selected.description}
              </div>
            )}

            <div className="space-y-2 mb-5">
              <Label htmlFor="tv-username">TradingView Username</Label>
              <Input
                id="tv-username"
                placeholder="e.g. TonnyBett"
                value={tvUsername}
                onChange={e => setTvUsername(e.target.value)}
                className="bg-secondary border-border"
              />
              <p className="text-xs text-muted-foreground">Find your username at tradingview.com → Profile</p>
            </div>

            <Button variant="hero" className="w-full" onClick={requestAccess} disabled={requesting}>
              {requesting ? <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : "Submit Request"}
            </Button>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
