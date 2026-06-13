import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CreditCard,
  Smartphone,
  Check,
  Shield,
  ArrowRight,
  Lock,
} from "lucide-react";
import { toast } from "sonner";

type PaymentMethod = "card" | "mpesa";
type PaymentState = "idle" | "processing" | "waiting" | "success";

const Payment = () => {
  const { user, subscription, isLoading, activateSubscription } = useAuth();
  const navigate = useNavigate();
  const [method, setMethod] = useState<PaymentMethod>("card");
  const [payState, setPayState] = useState<PaymentState>("idle");

  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (isLoading) return;
    if (!user) { navigate("/auth"); return; }
    if (subscription?.active) { navigate("/dashboard"); return; }
  }, [user, subscription, isLoading, navigate]);

  const formatCardNumber = (val: string) =>
    val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

  const formatExpiry = (val: string) => {
    const d = val.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d;
  };

  const busy = payState !== "idle";

  const handleCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cardNumber.replace(/\s/g, "").length < 16) {
      toast.error("Enter a valid 16-digit card number");
      return;
    }
    setPayState("processing");
    await new Promise(r => setTimeout(r, 2500));
    await activateSubscription("card");
    setPayState("success");
    toast.success("Payment successful! Welcome to MQTRADE PRO.");
    await new Promise(r => setTimeout(r, 1200));
    navigate("/dashboard");
  };

  const handleMpesaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 9) {
      toast.error("Enter a valid M-Pesa phone number");
      return;
    }
    setPayState("processing");
    await new Promise(r => setTimeout(r, 1500));
    setPayState("waiting");
    await new Promise(r => setTimeout(r, 4000));
    await activateSubscription("mpesa");
    setPayState("success");
    toast.success("M-Pesa payment confirmed! Welcome to MQTRADE PRO.");
    await new Promise(r => setTimeout(r, 1200));
    navigate("/dashboard");
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

      <div className="w-full max-w-lg relative z-10">
        <Link to="/" className="flex items-center justify-center gap-3 mb-8">
          <img src="/logo2.png.png" alt="MQTRADE PRO" className="h-20 w-auto" />
          <span className="font-display font-bold text-2xl text-foreground tracking-wide">MQTRADE PRO</span>
        </Link>

        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <h1 className="font-display text-2xl font-bold mb-3">Activate Your Subscription</h1>
            <div className="flex items-baseline justify-center gap-1 mb-2">
              <span className="font-display text-5xl font-bold text-foreground">$50</span>
              <span className="text-muted-foreground text-lg">/month</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Billed monthly &middot; Cancel anytime from your account settings
            </p>
          </div>

          {/* Method Tabs */}
          <div className="flex gap-2 p-1 bg-secondary rounded-xl mb-6">
            <button
              onClick={() => setMethod("card")}
              disabled={busy}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-sm transition-all ${
                method === "card"
                  ? "bg-card text-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <CreditCard className="w-4 h-4" />
              Debit / Credit Card
            </button>
            <button
              onClick={() => setMethod("mpesa")}
              disabled={busy}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-sm transition-all ${
                method === "mpesa"
                  ? "bg-card text-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Smartphone className="w-4 h-4" />
              M-Pesa
            </button>
          </div>

          {/* Card Form */}
          {method === "card" && (
            <form onSubmit={handleCardSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Card Number</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                    className="pl-10 bg-secondary border-border font-mono tracking-wider"
                    maxLength={19}
                    disabled={busy}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Cardholder Name</Label>
                <Input
                  placeholder="John Doe"
                  value={cardName}
                  onChange={e => setCardName(e.target.value)}
                  className="bg-secondary border-border"
                  disabled={busy}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Expiry Date</Label>
                  <Input
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={e => setExpiry(formatExpiry(e.target.value))}
                    className="bg-secondary border-border font-mono"
                    maxLength={5}
                    disabled={busy}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>CVV</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="CVV"
                      type="password"
                      value={cvv}
                      onChange={e => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      className="pl-10 bg-secondary border-border font-mono"
                      maxLength={4}
                      disabled={busy}
                      required
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full group mt-2"
                disabled={busy}
              >
                {payState === "processing" ? (
                  <>
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Processing payment...
                  </>
                ) : payState === "success" ? (
                  <>
                    <Check className="w-5 h-5" />
                    Payment successful!
                  </>
                ) : (
                  <>
                    Subscribe - $50 / month
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </form>
          )}

          {/* M-Pesa Form */}
          {method === "mpesa" && (
            <form onSubmit={handleMpesaSubmit} className="space-y-4">
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                <p className="text-sm font-medium text-green-400 mb-1">How M-Pesa works</p>
                <p className="text-sm text-muted-foreground">
                  Enter your M-Pesa number and we'll send an STK push directly to your phone.
                  Approve the prompt on your phone to activate your subscription.
                </p>
              </div>

              <div className="space-y-2">
                <Label>M-Pesa Phone Number</Label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-muted-foreground text-sm select-none">+254</span>
                  <Input
                    placeholder="7XX XXX XXX"
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/[^\d]/g, "").slice(0, 9))}
                    className="pl-14 bg-secondary border-border"
                    disabled={busy}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-between items-center p-3 rounded-lg bg-secondary">
                <span className="text-sm text-muted-foreground">Monthly subscription</span>
                <span className="font-bold">$50 / month</span>
              </div>

              {payState === "waiting" && (
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin flex-shrink-0" />
                  <p className="text-sm text-primary">
                    STK push sent to +254{phone}. Check your phone and enter your M-Pesa PIN to confirm.
                  </p>
                </div>
              )}

              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full group mt-2"
                disabled={busy}
              >
                {payState === "processing" ? (
                  <>
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Sending M-Pesa prompt...
                  </>
                ) : payState === "waiting" ? (
                  <>
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Waiting for approval...
                  </>
                ) : payState === "success" ? (
                  <>
                    <Check className="w-5 h-5" />
                    Payment confirmed!
                  </>
                ) : (
                  <>
                    Send M-Pesa Prompt
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-border flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Shield className="w-4 h-4 flex-shrink-0" />
            <span>256-bit SSL encryption &middot; Charged $50 monthly until cancelled</span>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By subscribing you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Payment;




