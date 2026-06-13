import { ArrowUpRight, ArrowDownRight, Clock, TrendingUp, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useInView } from "@/hooks/use-in-view";

const mockSignals = [
  {
    id: 1, asset: "EUR/USD", type: "BUY", entry: "1.0850", sl: "1.0820",
    tp: ["1.0880", "1.0910", "1.0940"], status: "active",
    timeframe: "H4", time: "2h ago", pips: "+30 pips", session: "London",
  },
  {
    id: 2, asset: "NAS100", type: "SELL", entry: "18,450", sl: "18,520",
    tp: ["18,380", "18,300"], status: "tp_hit",
    timeframe: "H1", time: "5h ago", pips: "+150 pts", session: "New York",
  },
  {
    id: 3, asset: "XAU/USD", type: "BUY", entry: "2,035", sl: "2,020",
    tp: ["2,050", "2,065", "2,080"], status: "active",
    timeframe: "H4", time: "8h ago", pips: "+15 pips", session: "London",
  },
  {
    id: 4, asset: "GBP/USD", type: "SELL", entry: "1.2680", sl: "1.2720",
    tp: ["1.2640", "1.2600"], status: "tp_hit",
    timeframe: "H1", time: "12h ago", pips: "+40 pips", session: "Overlap",
  },
  {
    id: 5, asset: "US30", type: "BUY", entry: "38,250", sl: "38,050",
    tp: ["38,450", "38,650", "38,900"], status: "active",
    timeframe: "D1", time: "1d ago", pips: "+200 pts", session: "New York",
  },
  {
    id: 6, asset: "BTC/USD", type: "BUY", entry: "67,500", sl: "66,200",
    tp: ["68,800", "70,000"], status: "active",
    timeframe: "H4", time: "3h ago", pips: "+$820", session: "Asian",
  },
];

const SignalsPreview = () => {
  const { ref: headRef, inView: headIn } = useInView(0.2);
  const { ref: cardsRef, inView: cardsIn } = useInView(0.05);

  return (
    <section id="signals" className="py-28 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px]" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-primary/5 rounded-full blur-[80px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">

        {/* Header */}
        <div ref={headRef} className={`text-center mb-16 transition-all duration-700 ${headIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 mb-5">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <TrendingUp className="w-3 h-3 text-emerald-500" />
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-widest">Live Signals Feed</span>
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-black mb-5">
            Real Signals.{" "}
            <span style={{ background: "var(--gradient-gold)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Real Results.</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A preview of what our members receive. Entry, SL, multiple TPs — every signal, every time.
          </p>
        </div>

        {/* Signal cards grid */}
        <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {mockSignals.map((signal, i) => {
            const isBuy = signal.type === "BUY";
            const isBlurred = i >= 4;
            return (
              <div
                key={signal.id}
                className={`relative rounded-2xl border overflow-hidden transition-all duration-700 ${
                  isBuy ? "border-emerald-500/25" : "border-red-500/25"
                } bg-card/80 hover:scale-[1.02] hover:shadow-2xl`}
                style={{
                  opacity: cardsIn ? 1 : 0,
                  transform: cardsIn ? "translateY(0)" : "translateY(40px)",
                  transition: `opacity 0.6s ease ${i * 100}ms, transform 0.6s ease ${i * 100}ms, scale 0.3s`,
                }}
              >
                {/* Top color bar */}
                <div className={`h-1 w-full ${isBuy ? "bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600" : "bg-gradient-to-r from-red-600 via-red-400 to-red-600"}`} />

                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${isBuy ? "bg-emerald-500/15" : "bg-red-500/15"}`}>
                        {isBuy
                          ? <ArrowUpRight className="w-6 h-6 text-emerald-400" />
                          : <ArrowDownRight className="w-6 h-6 text-red-400" />}
                      </div>
                      <div>
                        <p className="font-display font-black text-foreground text-lg">{signal.asset}</p>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{signal.timeframe} · {signal.session} · {signal.time}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                      signal.status === "active"
                        ? "bg-primary/15 text-primary border border-primary/25"
                        : "bg-emerald-500/15 text-emerald-500 border border-emerald-500/25"
                    }`}>
                      {signal.status === "active" ? "● Active" : "✓ TP Hit"}
                    </span>
                  </div>

                  {/* Direction + pips */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1.5 rounded-lg text-sm font-black ${isBuy ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`}>
                      {signal.type}
                    </span>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                      {signal.pips}
                    </span>
                  </div>

                  {/* Price levels */}
                  <div className="space-y-2 text-sm bg-secondary/50 dark:bg-secondary/30 rounded-xl p-3.5">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-xs">Entry</span>
                      <span className="font-mono font-bold text-foreground">{signal.entry}</span>
                    </div>
                    <div className="h-px bg-border/40" />
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-xs">Stop Loss</span>
                      <span className="font-mono font-bold text-red-400">{signal.sl}</span>
                    </div>
                    <div className="h-px bg-border/40" />
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-xs">Take Profit</span>
                      <div className="flex gap-1.5 flex-wrap justify-end">
                        {signal.tp.map((t, ti) => (
                          <span key={ti} className="font-mono font-bold text-emerald-400 text-xs bg-emerald-500/10 px-1.5 py-0.5 rounded">
                            TP{ti + 1}: {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Blur overlay for last 2 cards */}
                {isBlurred && (
                  <div className="absolute inset-0 backdrop-blur-sm bg-background/60 flex flex-col items-center justify-center gap-3 z-10">
                    <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                      <Lock className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-sm font-semibold text-foreground">Members Only</p>
                    <Link to="/auth?mode=signup">
                      <Button variant="hero" size="sm">Unlock Access</Button>
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className={`text-center mt-12 transition-all duration-700 delay-500 ${cardsIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <Link to="/auth?mode=signup">
            <Button variant="hero" size="lg" className="px-10 shadow-xl shadow-primary/20">
              Get Full Access — $50/month
              <ArrowUpRight className="w-4 h-4" />
            </Button>
          </Link>
          <p className="text-sm text-muted-foreground mt-3">Cancel anytime · Instant access · No hidden fees</p>
        </div>
      </div>
    </section>
  );
};

export default SignalsPreview;
