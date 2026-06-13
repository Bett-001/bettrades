import { Link } from "react-router-dom";
import { ArrowLeft, AlertTriangle } from "lucide-react";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-8">
    <h2 className="font-['Sora'] font-semibold text-lg text-[#dfe2eb] mb-3">{title}</h2>
    <div className="text-[#b9caca] font-['Geist'] text-sm leading-relaxed space-y-2">{children}</div>
  </div>
);

export default function Disclaimer() {
  return (
    <div className="min-h-screen" style={{ background: "#0d1117", color: "#dfe2eb" }}>
      <div className="max-w-3xl mx-auto px-5 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-[#00dce5] text-sm mb-8 hover:opacity-80 transition-opacity font-['JetBrains_Mono']">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,180,171,0.1)" }}>
            <AlertTriangle className="w-5 h-5 text-[#ffb4ab]" />
          </div>
          <span className="font-['Geist'] text-[11px] font-black uppercase tracking-widest text-[#ffb4ab]">Risk Disclaimer</span>
        </div>
        <h1 className="font-['Sora'] font-bold text-3xl text-[#dfe2eb] mb-2">Trading Risk Disclaimer</h1>
        <p className="text-[#b9caca] text-sm font-['JetBrains_Mono'] mb-10">Last updated: June 2026</p>

        <div className="stitch-glass rounded-2xl p-8">
          <Section title="High Risk Warning">
            <p>Trading foreign exchange (Forex), contracts for difference (CFDs), indices, commodities, and cryptocurrencies on margin carries a high level of risk and may not be suitable for all investors. The high degree of leverage available in Forex and CFD trading can work against you as well as for you.</p>
            <p>Before deciding to trade, you should carefully consider your investment objectives, level of experience, and risk appetite. The possibility exists that you could sustain a loss of some or all of your initial investment and therefore you should not invest money that you cannot afford to lose.</p>
          </Section>

          <Section title="No Financial Advice">
            <p>MQTRADE PRO is an educational and informational platform. All content provided — including trading signals, market analysis, strategies, indicators, and commentary — is for educational and informational purposes only.</p>
            <p>Nothing on this platform constitutes financial advice, investment advice, trading advice, or any other form of advice. You should not treat any content on this platform as such. MQTRADE PRO does not recommend that any financial instrument should be bought, sold, or held by you.</p>
          </Section>

          <Section title="Past Performance">
            <p>Past performance of any trading signal, strategy, or system is not necessarily indicative of future results. Any performance data quoted represents past performance and is not a guarantee of future results. Actual results will vary.</p>
            <p>Win rates and profit figures shown on this platform are historical examples only. They do not represent the results you will or are likely to achieve.</p>
          </Section>

          <Section title="Independent Research">
            <p>All trading decisions are made solely by you. You are entirely responsible for your own investment decisions. We strongly recommend that you seek independent financial advice from a qualified financial adviser before making any trading decisions.</p>
            <p>You should conduct your own due diligence and consult with professional advisors before entering any financial markets.</p>
          </Section>

          <Section title="Technology Risk">
            <p>Trading signals are delivered electronically and are subject to delays, interruptions, and errors beyond our control. MQTRADE PRO shall not be liable for any losses incurred as a result of delayed, missed, or erroneous signal delivery.</p>
          </Section>

          <Section title="Regulatory Notice">
            <p>MQTRADE PRO is not a regulated financial institution, broker, or investment advisor. Our services are intended for traders who understand the risks involved in financial market trading and who accept full responsibility for their own trading decisions.</p>
          </Section>
        </div>
      </div>
    </div>
  );
}
