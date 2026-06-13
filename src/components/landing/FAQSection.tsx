import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    q: "Do I need trading experience to use MQTRADE PRO?",
    a: "No experience required. Our signals come with full entry, stop loss, and take profit levels, plus the rationale behind each trade. Beginners follow along while learning. Experienced traders get institutional-grade setups to layer into their own strategy.",
  },
  {
    q: "How are signals delivered?",
    a: "Instantly via our VVIP Telegram channel with push notification alerts. You also receive email alerts if enabled. Signals appear on your dashboard in real time. You'll never miss a setup.",
  },
  {
    q: "What markets do you cover?",
    a: "We cover Forex majors and crosses (EUR/USD, GBP/USD, USD/JPY, GBP/JPY etc.), Gold (XAU/USD), US Indices (NAS100, US30, US500), and major Crypto pairs (BTC/USD, ETH/USD). Coverage depends on market conditions and highest-probability setups.",
  },
  {
    q: "Can I cancel my subscription anytime?",
    a: "Yes, absolutely. Cancel with one click from your Settings page. No questions asked, no cancellation fees. Your access continues until the end of your paid billing period.",
  },
  {
    q: "Is the 5-day free trial really free?",
    a: "Yes. You get full access to your chosen plan for 5 days at zero cost. A payment method is required to start — you won't be charged if you cancel before day 5. If you forget, billing starts automatically after the trial.",
  },
  {
    q: "How does the MT5 auto-sync work?",
    a: "Download our free Expert Advisor (BetTradesSync.mq5), install it in MetaTrader 5, and attach it to any chart. It monitors your closed trades and instantly syncs them to your Trading Journal. No manual logging needed.",
  },
  {
    q: "What's included in the TradingView indicators?",
    a: "You get custom Pine Script indicators that identify supply/demand zones, trend direction, momentum, and potential entry points. They work on any TradingView plan and are continuously updated based on market conditions.",
  },
  {
    q: "Is my trading data private?",
    a: "Completely private. Your trading journal entries and account data are secured with row-level security — only you can access your data. We never share or sell subscriber trading data.",
  },
  {
    q: "Do you offer refunds?",
    a: "Given the digital nature of the service and the live signal access provided, we do not offer refunds for used subscription periods. The 5-day free trial is specifically offered so you can evaluate the service risk-free.",
  },
  {
    q: "What happens after I sign up?",
    a: "After payment, you'll be guided through a 2-minute onboarding that connects you to Telegram, walks you through the dashboard, and sets up your preferences. Everything is live within minutes.",
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-28 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/25 mb-5">
            <HelpCircle className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs text-primary font-semibold uppercase tracking-widest">FAQ</span>
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-black mb-4">
            Common{" "}
            <span style={{ background: "var(--gradient-gold)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Questions</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know before joining.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, i) => (
            <div key={i}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${open === i ? "border-primary/30 bg-primary/5" : "border-border/50 bg-card/40 hover:border-border"}`}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left gap-4">
                <span className="font-display font-semibold text-sm md:text-base text-foreground">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 flex-shrink-0 text-muted-foreground transition-transform duration-200 ${open === i ? "rotate-180 text-primary" : ""}`} />
              </button>
              {open === i && (
                <div className="px-6 pb-5">
                  <p className="text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-3">Still have questions?</p>
          <a href="mailto:support@mqtrade.pro" className="text-primary font-semibold hover:underline">
            Contact us at support@mqtrade.pro →
          </a>
        </div>
      </div>
    </section>
  );
}
