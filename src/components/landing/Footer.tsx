import { Link } from "react-router-dom";
import { TrendingUp, MessageSquare, Mail, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-card/30 pt-16 pb-8">
      <div className="container mx-auto px-4">

        <div className="grid md:grid-cols-4 gap-10 mb-14">

          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src="/logo2.png.png" alt="MQTRADE PRO" className="h-12 w-auto" />
              <div>
                <span className="font-display font-black text-lg text-foreground tracking-wide block leading-none">MQTRADE</span>
                <span className="text-xs font-bold text-primary tracking-widest">PRO</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Premium trading signals, tools and community for serious traders. Real-time signals across Forex, Indices, Gold and Crypto.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a href="https://t.me/TonnyFxacademy" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center hover:bg-sky-500/20 transition-colors" title="VVIP Telegram">
                <MessageSquare className="w-4 h-4 text-sky-500" />
              </a>
              <a href="mailto:support@mqtrade.pro" className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center hover:bg-primary/20 transition-colors" title="Email">
                <Mail className="w-4 h-4 text-primary" />
              </a>
              <a href="https://www.instagram.com/mqtradepro/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center hover:bg-pink-500/20 transition-colors" title="Instagram">
                <Instagram className="w-4 h-4 text-pink-500" />
              </a>
              <a href="#signals" className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center hover:bg-emerald-500/20 transition-colors" title="Signals">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-4">Services</p>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {[
                "Trading Signals",
                "TradingView Indicators",
                "NinjaTrader Strategies",
                "VVIP Telegram",
                "Trading Journal",
                "Economic Calendar",
                "1-on-1 Mentorship",
                "Prop Firm Prep",
              ].map(s => (
                <li key={s}>
                  <a href="#services" className="hover:text-foreground transition-colors">{s}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-4">Company</p>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {[
                { label: "Sign In", href: "/auth" },
                { label: "Get Started", href: "/auth?mode=signup" },
                { label: "Pricing", href: "#pricing" },
                { label: "Disclaimer", href: "/disclaimer" },
                { label: "Terms of Service", href: "/terms" },
                { label: "Privacy Policy", href: "/privacy" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link to={href} className="hover:text-foreground transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border/50 space-y-4">
          <p className="text-xs text-muted-foreground text-center max-w-4xl mx-auto leading-relaxed">
            <strong className="text-foreground">Risk Disclaimer:</strong> Trading foreign exchange, indices, and
            cryptocurrencies carries a high level of risk and may not be suitable for all investors. Past performance
            is not indicative of future results. This content is for educational purposes only and does not constitute
            financial advice. Never trade with money you cannot afford to lose.
          </p>
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} MQTRADE PRO. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
