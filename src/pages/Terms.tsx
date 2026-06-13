import { Link } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-8">
    <h2 className="font-['Sora'] font-semibold text-lg text-[#dfe2eb] mb-3">{title}</h2>
    <div className="text-[#b9caca] font-['Geist'] text-sm leading-relaxed space-y-2">{children}</div>
  </div>
);

export default function Terms() {
  return (
    <div className="min-h-screen" style={{ background: "#0d1117", color: "#dfe2eb" }}>
      <div className="max-w-3xl mx-auto px-5 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-[#00dce5] text-sm mb-8 hover:opacity-80 transition-opacity font-['JetBrains_Mono']">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(0,220,229,0.1)" }}>
            <FileText className="w-5 h-5 text-[#00dce5]" />
          </div>
          <span className="font-['Geist'] text-[11px] font-black uppercase tracking-widest text-[#00dce5]">Legal</span>
        </div>
        <h1 className="font-['Sora'] font-bold text-3xl text-[#dfe2eb] mb-2">Terms of Service</h1>
        <p className="text-[#b9caca] text-sm font-['JetBrains_Mono'] mb-10">Last updated: June 2026</p>

        <div className="stitch-glass rounded-2xl p-8 space-y-0">
          <Section title="1. Acceptance of Terms">
            <p>By accessing or using MQTRADE PRO ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use the Service. These terms apply to all visitors, users, and subscribers.</p>
          </Section>
          <Section title="2. Subscription & Billing">
            <p>MQTRADE PRO offers subscription-based access. By subscribing, you authorise us to charge your payment method on a recurring basis (monthly or annually, depending on your chosen plan).</p>
            <p>You may cancel your subscription at any time. Cancellation takes effect at the end of your current billing period. No refunds are issued for partial periods unless required by applicable law.</p>
            <p>Free trial periods, if offered, automatically convert to paid subscriptions unless cancelled before the trial ends. A valid payment method is required to start a trial.</p>
          </Section>
          <Section title="3. Permitted Use">
            <p>You may use the Service solely for your personal, non-commercial trading education and decision-making. You may not resell, redistribute, share, or republish any content, signals, strategies, or materials provided through the Service without prior written consent.</p>
            <p>Sharing your account credentials with others is strictly prohibited and may result in immediate account termination without refund.</p>
          </Section>
          <Section title="4. Intellectual Property">
            <p>All content, including but not limited to signals, indicators, strategies, analysis, and written materials, is the exclusive intellectual property of MQTRADE PRO. Unauthorised reproduction or distribution is prohibited.</p>
          </Section>
          <Section title="5. Limitation of Liability">
            <p>MQTRADE PRO, its owners, employees, and affiliates shall not be liable for any trading losses, consequential damages, or any other losses arising from the use of our services. You trade at your own risk.</p>
          </Section>
          <Section title="6. Account Termination">
            <p>We reserve the right to terminate or suspend your account at any time for violations of these terms, fraudulent activity, or any behaviour deemed harmful to other users or the platform.</p>
          </Section>
          <Section title="7. Changes to Terms">
            <p>We may update these Terms of Service at any time. Continued use of the Service after changes are posted constitutes acceptance of the updated terms. We will notify subscribers of material changes via email.</p>
          </Section>
          <Section title="8. Governing Law">
            <p>These terms shall be governed by and construed in accordance with applicable laws. Any disputes shall be resolved through arbitration before resorting to litigation.</p>
          </Section>
          <Section title="Contact">
            <p>For any questions about these Terms, contact us at <a href="mailto:support@mqtrade.pro" className="text-[#00dce5] hover:underline">support@mqtrade.pro</a></p>
          </Section>
        </div>
      </div>
    </div>
  );
}
