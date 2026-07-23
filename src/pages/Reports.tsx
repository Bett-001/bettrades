import { useState, useEffect } from "react";
import ProductLayout from "@/components/ProductLayout";
import { supabase } from "@/lib/supabase";
import { BarChart2, TrendingUp, TrendingDown, Minus, Calendar, X } from "lucide-react";

interface Report {
  id: string;
  title: string;
  summary: string | null;
  body: string | null;
  market: string | null;
  bias: string | null;
  image_url: string | null;
  published_at: string;
}

const BIAS_STYLE: Record<string, { cls: string; icon: typeof TrendingUp }> = {
  Bullish: { cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30", icon: TrendingUp },
  Bearish: { cls: "bg-red-500/15 text-red-400 border-red-500/30", icon: TrendingDown },
  Neutral: { cls: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30", icon: Minus },
};

export default function Reports() {
  const [items, setItems] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Report | null>(null);

  useEffect(() => {
    supabase
      .from("reports")
      .select("*")
      .order("published_at", { ascending: false })
      .then(({ data }) => {
        if (data) setItems(data as Report[]);
        setLoading(false);
      });
  }, []);

  return (
    <ProductLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">Market Intelligence</p>
          <h1 className="font-display text-3xl font-black">Market Analysis Reports</h1>
          <p className="text-muted-foreground mt-1">Daily &amp; weekly breakdowns — key levels, bias and opportunities across major markets.</p>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-40 rounded-2xl bg-secondary/50 animate-pulse" />)}
          </div>
        ) : items.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <BarChart2 className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No reports published yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {items.map(r => {
              const bias = r.bias ? BIAS_STYLE[r.bias] : null;
              return (
                <button
                  key={r.id}
                  onClick={() => setSelected(r)}
                  className="glass-card overflow-hidden text-left flex flex-col group hover:border-blue-500/40 transition-all"
                >
                  {r.image_url && (
                    <div className="h-40 bg-secondary/50 overflow-hidden">
                      <img src={r.image_url} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {r.market && <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">{r.market}</span>}
                      {bias && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${bias.cls}`}>
                          <bias.icon className="w-3 h-3" />{r.bias}
                        </span>
                      )}
                    </div>
                    <p className="font-display font-bold text-base mb-1">{r.title}</p>
                    {r.summary && <p className="text-sm text-muted-foreground line-clamp-2 flex-1">{r.summary}</p>}
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-3">
                      <Calendar className="w-3 h-3" />
                      {new Date(r.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Report modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl">
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 z-10 w-8 h-8 rounded-lg bg-background/80 flex items-center justify-center text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
            {selected.image_url && (
              <div className="h-56 bg-secondary/50 overflow-hidden rounded-t-2xl">
                <img src={selected.image_url} alt={selected.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                {selected.market && <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">{selected.market}</span>}
                {selected.bias && BIAS_STYLE[selected.bias] && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${BIAS_STYLE[selected.bias].cls}`}>{selected.bias}</span>
                )}
              </div>
              <h2 className="font-display text-2xl font-black mb-2">{selected.title}</h2>
              <p className="text-xs text-muted-foreground mb-4">
                {new Date(selected.published_at).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              </p>
              {selected.summary && <p className="text-sm font-medium mb-4">{selected.summary}</p>}
              {selected.body && <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{selected.body}</div>}
            </div>
          </div>
        </div>
      )}
    </ProductLayout>
  );
}
