import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Gift, Copy, CheckCircle, Users, DollarSign, Share2, Twitter, Send } from "lucide-react";
import { toast } from "sonner";

interface ReferralStats { referrals: number; active: number; earned: number }

export default function Referral() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [stats, setStats]   = useState<ReferralStats>({ referrals: 0, active: 0, earned: 0 });
  const [code, setCode]     = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      // Check for existing referral code in user metadata
      const existing = (user as any).user_metadata?.referral_code;
      if (existing) {
        setCode(existing);
      } else {
        // Generate new code
        const newCode = "MQT-" + user.id.slice(0, 6).toUpperCase();
        await supabase.auth.updateUser({ data: { referral_code: newCode } });
        setCode(newCode);
      }
      // Fetch referral stats from DB
      const { data } = await supabase.from("referrals")
        .select("*").eq("referrer_id", user.id);
      if (data) {
        const active = data.filter(r => r.active).length;
        setStats({ referrals: data.length, active, earned: active * 30 });
      }
      setLoading(false);
    })();
  }, [user]);

  const referralLink = `${window.location.origin}/auth?mode=signup&ref=${code}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Referral link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(`I've been trading smarter with MQTRADE PRO — real-time signals, 68%+ win rate. Use my link to get started: ${referralLink}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  const shareOnTelegram = () => {
    const text = encodeURIComponent(`Join MQTRADE PRO with my referral link: ${referralLink}`);
    window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${text}`, "_blank");
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(167,139,250,0.12)" }}>
              <Gift className="w-5 h-5 text-[#a78bfa]" />
            </div>
            <span className="font-['Geist'] text-[11px] font-black uppercase tracking-widest text-[#a78bfa]">Earn Together</span>
          </div>
          <h1 className="font-['Sora'] font-bold text-3xl text-[#dfe2eb]">Referral Program</h1>
          <p className="text-[#b9caca] font-['Geist'] text-sm mt-1">Refer friends, earn 1 free month for every 3 paying referrals</p>
        </div>

        {/* How it works */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { step: "1", title: "Share your link",    desc: "Send your unique referral link to fellow traders", color: "#00dce5" },
            { step: "2", title: "They subscribe",     desc: "Your friend signs up and activates a paid plan",   color: "#6ffbbe" },
            { step: "3", title: "You both benefit",   desc: "You earn 1 free month. They get 5-day free trial", color: "#a78bfa" },
          ].map(s => (
            <div key={s.step} className="stitch-glass rounded-2xl p-4 text-center">
              <div className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center font-['Sora'] font-black text-lg" style={{ background: s.color + "20", color: s.color }}>{s.step}</div>
              <p className="font-['Sora'] font-semibold text-sm text-[#dfe2eb] mb-1">{s.title}</p>
              <p className="font-['Geist'] text-xs text-[#b9caca] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Referrals",   value: stats.referrals.toString(), icon: Users,       color: "#00dce5" },
            { label: "Active Subscribers",value: stats.active.toString(),    icon: CheckCircle, color: "#6ffbbe" },
            { label: "Months Earned",     value: Math.floor(stats.active / 3).toString(), icon: DollarSign, color: "#a78bfa" },
          ].map(s => (
            <div key={s.label} className="stitch-glass rounded-2xl p-5 text-center">
              <s.icon className="w-6 h-6 mx-auto mb-2" style={{ color: s.color }} />
              <p className="font-['Sora'] font-bold text-3xl mb-1" style={{ color: s.color }}>{loading ? "—" : s.value}</p>
              <p className="font-['Geist'] text-xs text-[#b9caca]">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Referral link */}
        <div className="stitch-glass rounded-2xl p-6 mb-6">
          <p className="font-['Geist'] text-[11px] font-black uppercase tracking-widest text-[#b9caca] mb-4">Your Referral Link</p>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border border-white/10 overflow-hidden" style={{ background: "rgba(22,27,34,0.6)" }}>
              <span className="font-['JetBrains_Mono'] text-sm text-[#00dce5] truncate">{loading ? "Generating..." : referralLink}</span>
            </div>
            <button onClick={copyLink}
              className="flex items-center gap-2 px-4 py-3 rounded-xl font-['Geist'] font-bold text-sm flex-shrink-0 transition-all"
              style={copied ? { background: "rgba(111,251,190,0.15)", color: "#6ffbbe" } : { background: "#00dce5", color: "#003739" }}>
              {copied ? <><CheckCircle className="w-4 h-4" />Copied</> : <><Copy className="w-4 h-4" />Copy</>}
            </button>
          </div>

          {/* Referral code */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border border-white/10" style={{ background: "rgba(22,27,34,0.6)" }}>
              <span className="font-['Geist'] text-xs text-[#b9caca]">Your code:</span>
              <span className="font-['JetBrains_Mono'] font-bold text-[#00dce5]">{loading ? "..." : code}</span>
            </div>
          </div>

          {/* Share buttons */}
          <p className="font-['Geist'] text-[11px] font-black uppercase tracking-widest text-[#b9caca] mb-3">Share On</p>
          <div className="flex gap-3">
            <button onClick={shareOnTwitter}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border font-['Geist'] text-sm font-semibold transition-all hover:opacity-80"
              style={{ borderColor: "rgba(29,161,242,0.3)", background: "rgba(29,161,242,0.1)", color: "#1DA1F2" }}>
              <Twitter className="w-4 h-4" /> Twitter/X
            </button>
            <button onClick={shareOnTelegram}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border font-['Geist'] text-sm font-semibold transition-all hover:opacity-80"
              style={{ borderColor: "rgba(34,158,217,0.3)", background: "rgba(34,158,217,0.1)", color: "#229ED9" }}>
              <img src="/telegram-logo.png.jpg" alt="Telegram" className="w-4 h-4 object-contain" /> Telegram
            </button>
            <button onClick={copyLink}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border font-['Geist'] text-sm font-semibold transition-all hover:opacity-80"
              style={{ borderColor: "rgba(167,139,250,0.3)", background: "rgba(167,139,250,0.1)", color: "#a78bfa" }}>
              <Share2 className="w-4 h-4" /> Copy Link
            </button>
          </div>
        </div>

        {/* Reward tiers */}
        <div className="stitch-glass rounded-2xl p-6">
          <p className="font-['Geist'] text-[11px] font-black uppercase tracking-widest text-[#b9caca] mb-4">Reward Tiers</p>
          <div className="space-y-3">
            {[
              { range: "3 referrals",  reward: "1 month FREE",  color: "#00dce5", reached: stats.active >= 3 },
              { range: "10 referrals", reward: "4 months FREE", color: "#6ffbbe", reached: stats.active >= 10 },
              { range: "25 referrals", reward: "1 year FREE",   color: "#a78bfa", reached: stats.active >= 25 },
              { range: "50 referrals", reward: "Lifetime FREE + Revenue Share", color: "#ffb700", reached: stats.active >= 50 },
            ].map(t => (
              <div key={t.range} className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${t.reached ? "" : "opacity-60"}`}
                style={t.reached ? { borderColor: t.color + "40", background: t.color + "10" } : { borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
                <div className="flex items-center gap-3">
                  {t.reached && <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: t.color }} />}
                  {!t.reached && <div className="w-4 h-4 rounded-full border border-white/20 flex-shrink-0" />}
                  <span className="font-['JetBrains_Mono'] text-sm text-[#dfe2eb]">{t.range}</span>
                </div>
                <span className="font-['Geist'] text-sm font-bold" style={{ color: t.color }}>{t.reward}</span>
              </div>
            ))}
          </div>
          <p className="font-['JetBrains_Mono'] text-[10px] text-[#b9caca] mt-4">* Rewards apply when referred users complete active paid subscriptions. Free months credited automatically.</p>
        </div>
      </div>
    </AppLayout>
  );
}
