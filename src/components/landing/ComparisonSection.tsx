import { Check, X, Minus } from "lucide-react";

const features = [
  "Real-time Buy/Sell signals",
  "Entry, SL & TP on every signal",
  "Win rate track record (verified)",
  "VVIP Telegram community",
  "TradingView Pine indicators",
  "NinjaTrader NT8 strategies",
  "MT5 auto-sync journal",
  "Live economic calendar",
  "Risk management on every trade",
  "Position size calculator",
  "Market sessions clock",
  "1-on-1 mentorship available",
  "Prop firm prep program",
  "Weekly live webinars",
  "Signal history & analytics",
  "Free 5-day trial",
];

type Status = true | false | "partial";

interface CompetitorCol {
  name: string;
  price: string;
  accent: string;
  highlight: boolean;
  values: Status[];
}

const columns: CompetitorCol[] = [
  {
    name: "MQTRADE PRO",
    price: "From $30/mo",
    accent: "#00dce5",
    highlight: true,
    values: [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],
  },
  {
    name: "Free Telegram Groups",
    price: "Free",
    accent: "#b9caca",
    highlight: false,
    values: [true,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false],
  },
  {
    name: "Typical Signal Services",
    price: "$50–200/mo",
    accent: "#b9caca",
    highlight: false,
    values: [true,true,"partial",false,false,false,false,false,"partial",false,false,false,false,false,"partial",false],
  },
  {
    name: "Trading Courses",
    price: "$200–2000 once",
    accent: "#b9caca",
    highlight: false,
    values: [false,false,false,false,"partial","partial",false,false,true,true,false,true,"partial",true,false,false],
  },
];

const StatusIcon = ({ value }: { value: Status }) => {
  if (value === true) return <Check className="w-4 h-4 mx-auto text-[#6ffbbe]" />;
  if (value === false) return <X className="w-4 h-4 mx-auto text-[#ffb4ab]/50" />;
  return <Minus className="w-4 h-4 mx-auto text-[#ffb700]" />;
};

export default function ComparisonSection() {
  return (
    <section className="py-28 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/25 mb-5">
            <span className="text-xs text-primary font-semibold uppercase tracking-widest">vs. The Competition</span>
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-black mb-4">
            Why Traders Choose{" "}
            <span style={{ background: "var(--gradient-gold)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>MQTRADE PRO</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See how we stack up against the alternatives.
          </p>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto max-w-5xl mx-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left pb-6 pr-4 font-display font-bold text-foreground text-base w-48">Feature</th>
                {columns.map(col => (
                  <th key={col.name} className={`pb-6 px-2 text-center w-40 ${col.highlight ? "relative" : ""}`}>
                    {col.highlight && (
                      <div className="absolute inset-x-1 inset-y-0 rounded-t-2xl border-x border-t border-primary/30 bg-primary/5" />
                    )}
                    <div className="relative">
                      <p className={`font-display font-black text-sm mb-1 ${col.highlight ? "text-primary" : "text-muted-foreground"}`}>{col.name}</p>
                      <p className={`font-mono text-xs ${col.highlight ? "text-foreground" : "text-muted-foreground/60"}`}>{col.price}</p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feat, fi) => (
                <tr key={fi} className="border-t border-border/30">
                  <td className="py-3 pr-4 text-sm text-muted-foreground">{feat}</td>
                  {columns.map(col => (
                    <td key={col.name} className={`py-3 px-2 text-center relative ${col.highlight ? "bg-primary/5 border-x border-primary/20" : ""}`}>
                      <StatusIcon value={col.values[fi]} />
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="border-t border-border/50">
                <td className="pt-5 pb-2" />
                {columns.map(col => (
                  <td key={col.name} className={`pt-5 pb-2 px-2 text-center relative ${col.highlight ? "bg-primary/5 border-x border-b border-primary/30 rounded-b-2xl" : ""}`}>
                    {col.highlight && (
                      <a href="/auth?mode=signup"
                        className="inline-flex items-center justify-center px-5 py-2.5 rounded-full font-display font-bold text-sm transition-all hover:scale-[1.02]"
                        style={{ background: "var(--gradient-gold)", color: "white", boxShadow: "var(--shadow-gold)" }}>
                        Start Free Trial
                      </a>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Mobile: simplified */}
        <div className="md:hidden space-y-4 max-w-sm mx-auto">
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5">
            <p className="font-display font-black text-primary text-lg mb-1">MQTRADE PRO</p>
            <p className="text-muted-foreground text-sm mb-4">From $30/month</p>
            <div className="space-y-2">
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#6ffbbe] flex-shrink-0" />
                  <span className="text-foreground text-sm">{f}</span>
                </div>
              ))}
            </div>
            <a href="/auth?mode=signup" className="block text-center mt-5 px-6 py-3 rounded-full font-display font-bold text-sm"
              style={{ background: "var(--gradient-gold)", color: "white" }}>
              Start Free Trial
            </a>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-10 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5"><Check className="w-4 h-4 text-[#6ffbbe]" /> Fully included</div>
          <div className="flex items-center gap-1.5"><Minus className="w-4 h-4 text-amber-400" /> Partial / limited</div>
          <div className="flex items-center gap-1.5"><X className="w-4 h-4 text-red-400/50" /> Not available</div>
        </div>
      </div>
    </section>
  );
}
