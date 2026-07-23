import ProductLayout from "@/components/ProductLayout";
import ProductGate from "@/components/ProductGate";
import { MQTRADE_TELEGRAM } from "@/lib/constants";
import { Users, Calendar, Target, MessageSquare, Video, CheckCircle } from "lucide-react";

export default function Mentorship() {
  return (
    <ProductLayout>
      <ProductGate
        product="mentorship"
        accent="text-violet-400"
        tagline="Personal 1-on-1 coaching with a professional trader"
        highlights={[
          "Weekly 1-on-1 video sessions tailored to your trading style",
          "Personal trade reviews — your entries, exits and psychology",
          "A custom trading plan and risk framework built for you",
          "Direct chat access between sessions for questions",
          "Accountability check-ins to keep you on track",
        ]}
      >
        <MentorshipDashboard />
      </ProductGate>
    </ProductLayout>
  );
}

function MentorshipDashboard() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <p className="text-violet-400 text-xs font-bold uppercase tracking-widest mb-1">Mentorship</p>
        <h1 className="font-display text-3xl font-black">1-on-1 Mentorship</h1>
        <p className="text-muted-foreground mt-1">Your personal coaching hub — sessions, plan and progress.</p>
      </div>

      {/* Next session */}
      <div className="glass-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-violet-500/20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-violet-500/15 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6 text-violet-400" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Next Session</p>
            <p className="font-display font-bold text-lg">Book your next slot</p>
            <p className="text-sm text-muted-foreground">Pick a time that works and we'll send a calendar invite.</p>
          </div>
        </div>
        <a
          href={MQTRADE_TELEGRAM}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold transition-colors"
        >
          <Calendar className="w-4 h-4" /> Schedule Session
        </a>
      </div>

      {/* Program pillars */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { icon: Target,        title: "Your Trading Plan",   desc: "A written, personalized strategy and risk framework you can follow with confidence." },
          { icon: Video,         title: "Recorded Sessions",   desc: "Every coaching call is recorded so you can revisit the lessons any time." },
          { icon: MessageSquare, title: "Between-Session Chat", desc: "Direct line to your mentor for quick questions and trade sanity-checks." },
          { icon: Users,         title: "Trade Reviews",        desc: "We break down your real trades — what worked, what to fix, and why." },
          { icon: CheckCircle,   title: "Accountability",       desc: "Regular check-ins and goals so you actually apply what you learn." },
          { icon: Calendar,      title: "Flexible Scheduling",  desc: "Sessions arranged around your timezone and availability." },
        ].map(p => (
          <div key={p.title} className="glass-card p-5">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center mb-3">
              <p.icon className="w-5 h-5 text-violet-400" />
            </div>
            <p className="font-semibold text-sm mb-1">{p.title}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>

      {/* Contact */}
      <div className="glass-card p-6 text-center">
        <p className="font-semibold mb-1">Need to reach your mentor?</p>
        <p className="text-sm text-muted-foreground mb-4">Message us any time on Telegram for scheduling and support.</p>
        <a
          href={MQTRADE_TELEGRAM}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-violet-500/30 bg-violet-500/10 text-violet-400 text-sm font-semibold hover:bg-violet-500/20 transition-colors"
        >
          <MessageSquare className="w-4 h-4" /> Open Telegram
        </a>
      </div>
    </div>
  );
}
