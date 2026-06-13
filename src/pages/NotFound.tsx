import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft, TrendingUp } from "lucide-react";

export default function NotFound() {
  const location = useLocation();
  useEffect(() => {
    console.error("404:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: "#0d1117", color: "#dfe2eb" }}>

      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl" style={{ background: "rgba(0,220,229,0.06)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl" style={{ background: "rgba(111,251,190,0.04)" }} />
      </div>

      <div className="relative z-10 text-center px-6 max-w-lg">
        {/* Glowing 404 */}
        <div className="mb-6">
          <span className="font-['Sora'] font-black text-[120px] leading-none select-none"
            style={{ color: "transparent", WebkitTextStroke: "2px rgba(0,220,229,0.4)", textShadow: "0 0 80px rgba(0,220,229,0.15)" }}>
            404
          </span>
        </div>

        <div className="flex items-center justify-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-[#00dce5]" />
          <span className="font-['Geist'] text-[11px] font-black uppercase tracking-widest text-[#00dce5]">Page Not Found</span>
        </div>

        <h1 className="font-['Sora'] font-bold text-2xl text-[#dfe2eb] mb-3">
          This page doesn't exist
        </h1>
        <p className="text-[#b9caca] font-['Geist'] mb-8 leading-relaxed">
          Looks like you took a bad trade. The page at <span className="font-['JetBrains_Mono'] text-[#00dce5] text-sm">{location.pathname}</span> doesn't exist.
          Head back to safety.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/"
            className="flex items-center gap-2 px-6 py-3 rounded-full font-['Geist'] font-bold text-sm transition-all hover:scale-[1.02]"
            style={{ background: "#00dce5", color: "#003739", boxShadow: "0 0 24px rgba(0,245,255,0.25)" }}>
            <Home className="w-4 h-4" /> Back to Home
          </Link>
          <Link to="/dashboard"
            className="flex items-center gap-2 px-6 py-3 rounded-full font-['Geist'] font-bold text-sm border border-[#00dce5]/40 text-[#00dce5] hover:bg-[#00dce5]/10 transition-all">
            <ArrowLeft className="w-4 h-4" /> Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
