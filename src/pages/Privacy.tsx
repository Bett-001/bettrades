import { Link } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-8">
    <h2 className="font-['Sora'] font-semibold text-lg text-[#dfe2eb] mb-3">{title}</h2>
    <div className="text-[#b9caca] font-['Geist'] text-sm leading-relaxed space-y-2">{children}</div>
  </div>
);

export default function Privacy() {
  return (
    <div className="min-h-screen" style={{ background: "#0d1117", color: "#dfe2eb" }}>
      <div className="max-w-3xl mx-auto px-5 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-[#00dce5] text-sm mb-8 hover:opacity-80 font-['JetBrains_Mono']">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(111,251,190,0.1)" }}>
            <Shield className="w-5 h-5 text-[#6ffbbe]" />
          </div>
          <span className="font-['Geist'] text-[11px] font-black uppercase tracking-widest text-[#6ffbbe]">Privacy</span>
        </div>
        <h1 className="font-['Sora'] font-bold text-3xl text-[#dfe2eb] mb-2">Privacy Policy</h1>
        <p className="text-[#b9caca] text-sm font-['JetBrains_Mono'] mb-10">Last updated: June 2026</p>

        <div className="stitch-glass rounded-2xl p-8">
          <Section title="1. Information We Collect">
            <p><strong className="text-[#dfe2eb]">Account data:</strong> Name, email address, and payment information when you register or subscribe.</p>
            <p><strong className="text-[#dfe2eb]">Usage data:</strong> Pages visited, features used, session duration, and device/browser information collected automatically.</p>
            <p><strong className="text-[#dfe2eb]">Trading journal data:</strong> Trade records you manually enter or sync from MetaTrader 5 are stored securely and are only accessible to you.</p>
            <p><strong className="text-[#dfe2eb]">Profile data:</strong> Profile pictures and display names you choose to set.</p>
          </Section>
          <Section title="2. How We Use Your Information">
            <p>We use your data to provide and improve the Service, process payments, send important account notifications and signal alerts (if opted in), and personalise your dashboard experience.</p>
            <p>We do not sell, rent, or trade your personal information to third parties for their marketing purposes.</p>
          </Section>
          <Section title="3. Data Storage & Security">
            <p>All data is stored securely using Supabase infrastructure with industry-standard encryption at rest and in transit. Access is protected by row-level security ensuring users can only access their own data.</p>
            <p>Profile pictures are stored in secure cloud storage with private access controls.</p>
          </Section>
          <Section title="4. Cookies">
            <p>We use essential cookies for authentication session management. We do not use tracking or advertising cookies. You can clear cookies at any time through your browser settings.</p>
          </Section>
          <Section title="5. Third-Party Services">
            <p>We use the following third-party services: Supabase (database and authentication), Stripe (payment processing), and Telegram (optional notification delivery). Each has their own privacy policy governing their data use.</p>
          </Section>
          <Section title="6. Your Rights">
            <p>You have the right to access, correct, export, or delete your personal data at any time. To exercise these rights, contact us at <a href="mailto:support@mqtrade.pro" className="text-[#00dce5] hover:underline">support@mqtrade.pro</a>. Account deletion removes all your data within 30 days.</p>
          </Section>
          <Section title="7. Children's Privacy">
            <p>The Service is not intended for individuals under 18 years of age. We do not knowingly collect personal information from minors.</p>
          </Section>
          <Section title="8. Contact">
            <p>For privacy concerns: <a href="mailto:support@mqtrade.pro" className="text-[#00dce5] hover:underline">support@mqtrade.pro</a></p>
          </Section>
        </div>
      </div>
    </div>
  );
}
