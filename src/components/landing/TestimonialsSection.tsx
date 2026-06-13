import { Star, TrendingUp, Quote } from "lucide-react";

const testimonials = [
  {
    name: "James K.",
    role: "Prop Trader • FTMO Funded",
    avatar: "JK",
    color: "#00dce5",
    stars: 5,
    text: "I passed my FTMO challenge in 3 weeks using MQTRADE PRO signals. The risk management on every signal is what set it apart — I knew exactly where my stop was before taking any trade. Best investment I've made as a trader.",
    stats: { label: "Challenge result", value: "+8.4% in 3 weeks" },
  },
  {
    name: "Amara D.",
    role: "Full-Time Forex Trader",
    avatar: "AD",
    color: "#6ffbbe",
    stars: 5,
    text: "The VVIP Telegram channel is insane value. Not just signals but real-time commentary, market analysis, and a community that actually knows what they're talking about. I've tripled my account in 6 months.",
    stats: { label: "Account growth", value: "+312% in 6 months" },
  },
  {
    name: "Michael T.",
    role: "Gold & Indices Trader",
    avatar: "MT",
    color: "#a78bfa",
    stars: 5,
    text: "The XAU/USD signals alone are worth the subscription. Consistently precise entries. The TradingView indicators are also phenomenal — I use them on every single trade. Can't imagine trading without MQTRADE PRO now.",
    stats: { label: "Monthly average", value: "+680 pips / month" },
  },
  {
    name: "Fatima H.",
    role: "NAS100 Specialist",
    avatar: "FH",
    color: "#ffb700",
    stars: 5,
    text: "I was sceptical at first — tried too many signal services that overpromised. MQTRADE PRO is the real deal. The 1-on-1 mentorship session I booked changed my entire approach to risk management.",
    stats: { label: "Win rate (60 days)", value: "72% win rate" },
  },
  {
    name: "David O.",
    role: "Part-Time Trader",
    avatar: "DO",
    color: "#6ffbbe",
    stars: 5,
    text: "I work a full-time job and trade on the side. The instant Telegram alerts mean I never miss a signal. MT5 auto-sync with the journal has made tracking my trades effortless. Highly recommend to busy traders.",
    stats: { label: "Since joining", value: "+$2,800 profit" },
  },
  {
    name: "Sofia R.",
    role: "Beginner Trader",
    avatar: "SR",
    color: "#00dce5",
    stars: 5,
    text: "I started trading just 4 months ago and MQTRADE PRO gave me the confidence and tools to actually be profitable. The educational content and the community support are unmatched. Learning while earning!",
    stats: { label: "Since joining", value: "Profitable from month 2" },
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-28 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-primary/4 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/25 mb-5">
            <Star className="w-3.5 h-3.5 text-primary fill-primary" />
            <span className="text-xs text-primary font-semibold uppercase tracking-widest">Member Results</span>
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-black mb-4">
            Real Traders,{" "}
            <span style={{ background: "var(--gradient-gold)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Real Results</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Don't take our word for it. Here's what our members are saying.
          </p>
        </div>

        {/* Stars row */}
        <div className="flex items-center justify-center gap-1 mb-12">
          {[...Array(5)].map((_, i) => <Star key={i} className="w-6 h-6 text-amber-400 fill-amber-400" />)}
          <span className="ml-3 font-display font-black text-2xl text-foreground">4.9</span>
          <span className="text-muted-foreground ml-1">/ 5.0 • 3,500+ members</span>
        </div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <div key={i} className="relative rounded-2xl border border-border/50 bg-card/60 p-6 flex flex-col hover:border-border hover:bg-card/80 hover:scale-[1.01] transition-all duration-300 group overflow-hidden">
              {/* Quote icon */}
              <Quote className="absolute top-4 right-4 w-8 h-8 opacity-10" style={{ color: t.color }} />

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(t.stars)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
              </div>

              {/* Text */}
              <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">"{t.text}"</p>

              {/* Stats pill */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border mb-4 w-fit"
                style={{ borderColor: t.color + "30", background: t.color + "10" }}>
                <TrendingUp className="w-3 h-3" style={{ color: t.color }} />
                <span className="font-['JetBrains_Mono'] text-[10px] font-bold" style={{ color: t.color }}>{t.stats.value}</span>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
                  style={{ background: t.color + "20", color: t.color }}>
                  {t.avatar}
                </div>
                <div>
                  <p className="font-display font-bold text-sm text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-14">
          <p className="text-muted-foreground text-lg mb-6">Join 3,500+ traders already winning with MQTRADE PRO</p>
          <a href="/auth?mode=signup"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-display font-black text-base transition-all hover:scale-[1.02]"
            style={{ background: "var(--gradient-gold)", color: "white", boxShadow: "var(--shadow-gold)" }}>
            Start Your Free Trial Today
          </a>
        </div>
      </div>
    </section>
  );
}
