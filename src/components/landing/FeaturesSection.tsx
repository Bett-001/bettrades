import { useInView } from "@/hooks/use-in-view";
import {
  TrendingUp, MessageSquare, BookOpen, Calendar,
  Bell, Shield, Users, Trophy, Video, BarChart2, ArrowRight,
} from "lucide-react";

const NinjaIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 3h4.5L12 10.5 16.5 3H21v18h-4V9.9l-5 7.6-5-7.6V21H3V3z" />
  </svg>
);

const TVIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 4h16v12H4V4zm8 14l-4 2h8l-4-2z M9 8l6 4-6 4V8z" />
  </svg>
);

const services = [
  {
    icon: TrendingUp,
    title: "Premium Trading Signals",
    description: "Real-time buy/sell signals with precise entry, stop loss, and multiple take profit levels across Forex, Indices, Commodities & Crypto.",
    tag: "Core",
    color: "text-emerald-500",
    bg: "from-emerald-500/20 to-emerald-500/5",
    border: "border-emerald-500/25",
    glow: "shadow-emerald-500/10",
    featured: true,
  },
  {
    icon: TVIcon,
    title: "TradingView Strategies",
    description: "Professional Pine Script strategies with automated Buy/Sell signals, dynamic stop loss, and multi-level take profits — backtested and ready to deploy on any chart.",
    tag: "Tools",
    color: "text-blue-500",
    bg: "from-blue-500/20 to-blue-500/5",
    border: "border-blue-500/25",
    glow: "shadow-blue-500/10",
    featured: true,
    chartPreview: "/tv-strategy-sample.png",
  },
  {
    icon: MessageSquare,
    title: "VVIP Telegram Channel",
    description: "Join our exclusive community for live trade discussions, market analysis, signal alerts and member-only content 24/7.",
    tag: "Community",
    color: "text-sky-500",
    bg: "from-sky-500/20 to-sky-500/5",
    border: "border-sky-500/25",
    glow: "shadow-sky-500/10",
    featured: true,
  },
  {
    icon: NinjaIcon,
    logoImage: "/ninjatrader-logo.png.png",
    title: "NinjaTrader Strategies",
    description: "Professional NT8 indicators and fully automated strategies for futures and CFD traders. Plug-and-play setup.",
    tag: "Tools",
    color: "text-purple-500",
    bg: "from-purple-500/20 to-purple-500/5",
    border: "border-purple-500/25",
    glow: "shadow-purple-500/10",
  },
  {
    icon: BookOpen,
    logoImage: "/mt5-logo.png",
    title: "MT5 Trading Journal",
    description: "Log trades manually or auto-sync from MetaTrader 5 via our Expert Advisor. Analytics, equity curve, and psychology tracking.",
    tag: "Included",
    color: "text-amber-500",
    bg: "from-amber-500/20 to-amber-500/5",
    border: "border-amber-500/25",
    glow: "shadow-amber-500/10",
  },
  {
    icon: Calendar,
    title: "Economic Calendar",
    description: "Live Forex Factory-powered calendar with High/Medium/Low impact events. Filter by currency, sorted by impact level.",
    tag: "Included",
    color: "text-rose-500",
    bg: "from-rose-500/20 to-rose-500/5",
    border: "border-rose-500/25",
    glow: "shadow-rose-500/10",
  },
  {
    icon: Users,
    title: "1-on-1 Mentorship",
    description: "Personal coaching sessions tailored to your trading style, challenges and goals. Learn directly from a professional trader.",
    tag: "$150/session",
    color: "text-violet-500",
    bg: "from-violet-500/20 to-violet-500/5",
    border: "border-violet-500/25",
    glow: "shadow-violet-500/10",
  },
  {
    icon: Trophy,
    title: "Prop Firm Preparation",
    description: "Structured program to pass FTMO, MyForexFunds and other prop firm challenges with proven risk management rules.",
    tag: "$79/mo",
    color: "text-orange-500",
    bg: "from-orange-500/20 to-orange-500/5",
    border: "border-orange-500/25",
    glow: "shadow-orange-500/10",
  },
  {
    icon: Video,
    title: "Live Webinars",
    description: "Weekly live sessions covering market analysis, trade setups, Q&A, and educational deep-dives. All sessions recorded.",
    tag: "Included",
    color: "text-cyan-500",
    bg: "from-cyan-500/20 to-cyan-500/5",
    border: "border-cyan-500/25",
    glow: "shadow-cyan-500/10",
  },
  {
    icon: BarChart2,
    title: "Market Analysis Reports",
    description: "Daily and weekly professional reports covering key levels, bias, and trade opportunities across major markets.",
    tag: "Included",
    color: "text-indigo-500",
    bg: "from-indigo-500/20 to-indigo-500/5",
    border: "border-indigo-500/25",
    glow: "shadow-indigo-500/10",
  },
  {
    icon: Bell,
    title: "Instant Alerts",
    description: "Push, email, and Telegram notifications the moment a new signal drops. Never miss a high-probability setup again.",
    tag: "Included",
    color: "text-yellow-500",
    bg: "from-yellow-500/20 to-yellow-500/5",
    border: "border-yellow-500/25",
    glow: "shadow-yellow-500/10",
  },
  {
    icon: Shield,
    title: "Risk Management Suite",
    description: "Every signal includes position sizing, risk-to-reward ratios, and clear invalidation levels to protect your capital.",
    tag: "Included",
    color: "text-teal-500",
    bg: "from-teal-500/20 to-teal-500/5",
    border: "border-teal-500/25",
    glow: "shadow-teal-500/10",
  },
];

const FeaturesSection = () => {
  const { ref: headRef, inView: headIn } = useInView(0.2);
  const { ref: gridRef, inView: gridIn } = useInView(0.05);

  const featured = services.filter(s => s.featured);
  const rest = services.filter(s => !s.featured);

  return (
    <section id="services" className="py-28 relative overflow-hidden">

      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px]" />
      </div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container mx-auto px-4 relative z-10">

        {/* Header */}
        <div ref={headRef} className={`text-center mb-20 transition-all duration-700 ${headIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/25 mb-5">
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
            <span className="text-xs text-primary font-semibold uppercase tracking-widest">Everything Included</span>
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-black mb-5 leading-tight">
            All the Tools You Need{" "}
            <span style={{ background: "var(--gradient-gold)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              to Win
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            One subscription unlocks signals, tools, community, education and live support — everything a professional trader needs.
          </p>
        </div>

        {/* Featured 3 — large cards */}
        <div ref={gridRef} className="grid md:grid-cols-3 gap-6 mb-6">
          {featured.map((s: any, i: number) => (
            <div
              key={s.title}
              className={`relative rounded-2xl border ${s.border} bg-gradient-to-br ${s.bg} group hover:scale-[1.02] hover:shadow-2xl ${s.glow} transition-all duration-300 overflow-hidden ${s.chartPreview ? "flex flex-col" : "p-7"}`}
              style={{
                opacity: gridIn ? 1 : 0,
                transform: gridIn ? "translateY(0)" : "translateY(40px)",
                transition: `opacity 0.6s ease ${i * 120}ms, transform 0.6s ease ${i * 120}ms, box-shadow 0.3s, scale 0.3s`,
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-30" />

              {s.chartPreview ? (
                /* ── TradingView showcase card ── */
                <>
                  {/* Top section — text */}
                  <div className="p-7 pb-4">
                    <div className="flex items-center justify-between mb-5">
                      <div className={`w-12 h-12 rounded-xl bg-background/60 border ${s.border} flex items-center justify-center`}>
                        <s.icon className={`w-6 h-6 ${s.color}`} />
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-background/60 border ${s.border} ${s.color}`}>{s.tag}</span>
                    </div>
                    <h3 className="font-display text-xl font-bold text-foreground mb-3">{s.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">{s.description}</p>
                    {/* Feature badges */}
                    <div className="flex flex-wrap gap-2 mb-2">
                      {["Auto Buy/Sell Signals","Multi-Level TP","Smart Stop Loss","Backtested","Live Alerts"].map(badge => (
                        <span key={badge} className={`text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ${s.border} ${s.color} bg-background/50`}>
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Chart preview window */}
                  <div className="mx-4 mb-4 rounded-xl overflow-hidden border border-blue-500/20 shadow-xl shadow-blue-500/10 flex-1">
                    {/* Mock TradingView toolbar */}
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-[#131722] border-b border-white/10">
                      <div className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                      </div>
                      <span className="font-mono text-[10px] text-blue-300/70 ml-1">XAU/USD • 1H • MQTRADE PRO Strategy</span>
                      <div className="ml-auto flex items-center gap-1.5">
                        <span className="text-[9px] text-emerald-400 font-mono">● LIVE</span>
                      </div>
                    </div>
                    {/* Chart image */}
                    <div className="relative">
                      <img
                        src={s.chartPreview}
                        alt="TradingView Strategy Sample"
                        className="w-full h-48 object-cover object-top"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                          (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
                        }}
                      />
                      {/* Fallback placeholder shown if image missing */}
                      <div className="hidden w-full h-48 bg-[#131722] flex items-center justify-center">
                        <div className="text-center">
                          <TVIcon className="w-10 h-10 text-blue-500/40 mx-auto mb-2" />
                          <p className="text-[11px] text-blue-400/60 font-mono">Strategy chart loading…</p>
                          <p className="text-[9px] text-blue-400/40 font-mono mt-1">Save image as public/tv-strategy-sample.png</p>
                        </div>
                      </div>
                      {/* Gradient overlay bottom */}
                      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#131722] to-transparent" />
                      {/* Sample watermark */}
                      <div className="absolute top-2 right-2 bg-blue-500/90 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
                        Sample
                      </div>
                    </div>
                  </div>

                  <div className={`flex items-center gap-1.5 text-xs font-semibold ${s.color} px-7 pb-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                    <span>View all strategies</span><ArrowRight className="w-3 h-3" />
                  </div>
                </>
              ) : (
                /* ── Standard featured card ── */
                <>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-xl bg-background/60 border ${s.border} flex items-center justify-center`}>
                      <s.icon className={`w-6 h-6 ${s.color}`} />
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-background/60 border ${s.border} ${s.color}`}>{s.tag}</span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground mb-3">{s.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-5">{s.description}</p>
                  <div className={`flex items-center gap-1.5 text-xs font-semibold ${s.color} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                    <span>Learn more</span><ArrowRight className="w-3 h-3" />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Remaining services — 4 cols on lg */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {rest.map((s, i) => (
            <div
              key={s.title}
              className={`relative rounded-xl border ${s.border} bg-card/60 hover:bg-gradient-to-br hover:${s.bg} p-5 group hover:scale-[1.02] transition-all duration-300 overflow-hidden`}
              style={{
                opacity: gridIn ? 1 : 0,
                transform: gridIn ? "translateY(0)" : "translateY(30px)",
                transition: `opacity 0.6s ease ${(i + 3) * 80}ms, transform 0.6s ease ${(i + 3) * 80}ms, scale 0.3s`,
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${s.bg} border ${s.border} flex items-center justify-center flex-shrink-0 overflow-hidden`}>
                  {(s as any).logoImage
                    ? <img src={(s as any).logoImage} alt="" className="w-8 h-8 object-contain" />
                    : <s.icon className={`w-5 h-5 ${s.color}`} />}
                </div>
                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${s.border} ${s.color} bg-background/80`}>{s.tag}</span>
              </div>
              <h3 className="font-display text-sm font-bold text-foreground mb-1.5">{s.title}</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeaturesSection;
