import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { signInWithGoogle } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Google sign-in failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? "bg-background/95 backdrop-blur-2xl border-b border-border/60 shadow-lg shadow-background/20"
        : "bg-background/70 backdrop-blur-xl border-b border-transparent"
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img src="/logo2.png.png" alt="MQTRADE PRO" className="h-14 w-auto" />
            <div className="hidden sm:block">
              <span className="font-display font-black text-lg text-foreground tracking-wide leading-none block">MQTRADE</span>
              <span className="text-[10px] font-bold text-primary tracking-widest">PRO</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { label: "Services", href: "#services" },
              { label: "Signals", href: "#signals" },
              { label: "Pricing", href: "#pricing" },
            ].map(({ label, href }) => (
              <a key={label} href={href}
                className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all">
                {label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="outline"
              className="text-sm gap-2"
              onClick={handleGoogle}
              disabled={googleLoading}
            >
              {googleLoading ? (
                <div className="w-4 h-4 border-2 border-muted-foreground/30 border-t-foreground rounded-full animate-spin" />
              ) : (
                <FcGoogle className="w-4 h-4" />
              )}
              Google
            </Button>
            <Link to="/auth">
              <Button variant="ghost" className="text-sm">Sign In</Button>
            </Link>
            <Link to="/auth?mode=signup">
              <Button variant="hero" className="text-sm shadow-lg shadow-primary/20">Get Started</Button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2 rounded-xl hover:bg-foreground/5 transition-colors text-foreground"
            onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            <div className="flex flex-col gap-1">
              {[
                { label: "Services", href: "#services" },
                { label: "Signals", href: "#signals" },
                { label: "Pricing", href: "#pricing" },
              ].map(({ label, href }) => (
                <a key={label} href={href} onClick={() => setIsOpen(false)}
                  className="px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all">
                  {label}
                </a>
              ))}
              <div className="flex flex-col gap-2 pt-3 mt-2 border-t border-border/50">
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => { setIsOpen(false); handleGoogle(); }}
                  disabled={googleLoading}
                >
                  {googleLoading ? (
                    <div className="w-4 h-4 border-2 border-muted-foreground/30 border-t-foreground rounded-full animate-spin" />
                  ) : (
                    <FcGoogle className="w-4 h-4" />
                  )}
                  Continue with Google
                </Button>
                <Link to="/auth" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full">Sign In</Button>
                </Link>
                <Link to="/auth?mode=signup" onClick={() => setIsOpen(false)}>
                  <Button variant="hero" className="w-full">Get Started</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
