import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, ArrowRight, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

type Mode = "signin" | "signup" | "forgot";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<Mode>(searchParams.get("mode") === "signup" ? "signup" : "signin");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const [googleLoading, setGoogleLoading] = useState(false);

  const { user, subscription, isLoading: authLoading, login, register, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      // Redirect handled by Supabase; on return, the auth effect routes the user.
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Google sign-in failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  useEffect(() => {
    setMode(searchParams.get("mode") === "signup" ? "signup" : "signin");
  }, [searchParams]);

  useEffect(() => {
    if (authLoading) return;
    if (user && subscription?.active) navigate("/dashboard");
    else if (user) navigate("/payment");
  }, [user, subscription, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (mode === "forgot") {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw new Error(error.message);
        setResetSent(true);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to send reset email");
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      if (mode === "signup") {
        await register(email, password);
        navigate("/payment");
      } else {
        const { hasSubscription } = await login(email, password);
        navigate(hasSubscription ? "/dashboard" : "/payment");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  const headings: Record<Mode, { title: string; sub: string }> = {
    signin: { title: "Welcome Back", sub: "Sign in to access your trading dashboard" },
    signup: { title: "Start Trading Better", sub: "Create your account to access premium signals" },
    forgot: { title: "Reset Password", sub: "Enter your email and we'll send you a reset link" },
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="hero-glow top-0 left-1/2 -translate-x-1/2" />

      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px),
                            linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="w-full max-w-md relative z-10">
        <Link to="/" className="flex items-center justify-center gap-3 mb-8">
          <img src="/logo2.png.png" alt="MQTRADE PRO" className="h-20 w-auto" />
          <span className="font-display font-bold text-2xl text-foreground tracking-wide">MQTRADE PRO</span>
        </Link>

        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <h1 className="font-display text-2xl font-bold mb-2">{headings[mode].title}</h1>
            <p className="text-muted-foreground">{headings[mode].sub}</p>
          </div>

          {/* ── Continue with Google (sign in / sign up only) ── */}
          {mode !== "forgot" && (
            <>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full gap-3"
                onClick={handleGoogle}
                disabled={googleLoading || isLoading}
              >
                {googleLoading ? (
                  <div className="w-5 h-5 border-2 border-muted-foreground/30 border-t-foreground rounded-full animate-spin" />
                ) : (
                  <>
                    <FcGoogle className="w-5 h-5" />
                    Continue with Google
                  </>
                )}
              </Button>

              <div className="flex items-center gap-3 my-6">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground uppercase tracking-wide">or</span>
                <div className="h-px flex-1 bg-border" />
              </div>
            </>
          )}

          {/* ── Forgot password — success state ── */}
          {mode === "forgot" && resetSent ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">
                A password reset link has been sent to <span className="text-foreground font-medium">{email}</span>.
                Check your inbox and click the link to set a new password.
              </p>
              <Button variant="outline" className="w-full" onClick={() => { setMode("signin"); setResetSent(false); }}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Sign In
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="pl-10 bg-secondary border-border"
                    required
                  />
                </div>
              </div>

              {/* Password (hidden on forgot mode) */}
              {mode !== "forgot" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    {mode === "signin" && (
                      <button
                        type="button"
                        onClick={() => setMode("forgot")}
                        className="text-xs text-primary hover:underline"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="pl-10 pr-10 bg-secondary border-border"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              <Button type="submit" variant="hero" size="lg" className="w-full group" disabled={isLoading}>
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <>
                    {mode === "signup" ? "Create Account" : mode === "forgot" ? "Send Reset Link" : "Sign In"}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>

              {mode === "forgot" && (
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className="w-full text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-1"
                >
                  <ArrowLeft className="w-3 h-3" /> Back to Sign In
                </button>
              )}
            </form>
          )}

          {mode === "signup" && (
            <p className="text-center text-sm text-muted-foreground mt-6">
              <span className="text-primary font-medium">$50/month</span> subscription required after signup
            </p>
          )}

          {mode !== "forgot" && (
            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-sm text-muted-foreground">
                {mode === "signup" ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
                  className="text-primary font-medium hover:underline"
                >
                  {mode === "signup" ? "Sign In" : "Sign Up"}
                </button>
              </p>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Auth;
