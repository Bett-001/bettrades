import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, ChevronDown } from "lucide-react";

interface Message {
  id: number;
  from: "bot" | "user";
  text: string;
  time: string;
}

const now = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

// ── Knowledge base ──────────────────────────────────────────────────────────
const FAQ: { patterns: RegExp[]; answer: string }[] = [
  {
    patterns: [/price|cost|how much|subscription|fee|pay/i],
    answer:
      "MQTRADE PRO is **$50/month** — includes everything: live signals, TradingView indicators, VVIP Telegram, trading journal, economic calendar, and mentorship. No hidden fees. Cancel anytime.",
  },
  {
    patterns: [/signal|forex|gold|xau|indices|crypto|asset/i],
    answer:
      "We deliver real-time signals across **Forex** (EUR/USD, GBP/USD, GBP/JPY and more), **Gold (XAU/USD)**, **Indices** (NAS100, US30), and **Crypto** (BTC, ETH). Each signal includes Entry, Take Profit, and Stop Loss levels.",
  },
  {
    patterns: [/win rate|accuracy|result|performance|profit/i],
    answer:
      "Our documented win rate is **85%+ month-to-date**, tracked transparently inside the members dashboard. All historical signals are available for you to verify before joining.",
  },
  {
    patterns: [/telegram|vvip|community|group/i],
    answer:
      "All members get instant access to our **VVIP Telegram channel** where signals are posted in real-time with full analysis. You also join a community of 3,500+ serious traders.",
  },
  {
    patterns: [/tradingview|indicator|ninjatrader|strategy|tool/i],
    answer:
      "With your membership you receive exclusive **TradingView indicators** and **NinjaTrader strategies** — the same tools our analysts use daily. Setup guides are provided inside the dashboard.",
  },
  {
    patterns: [/mentor|coaching|1.on.1|one.on.one|learn|teach/i],
    answer:
      "Yes — **1-on-1 mentorship sessions** are available to members. You can also access our full prop firm preparation program to help you pass funded trader challenges.",
  },
  {
    patterns: [/journal|track|record|trade log/i],
    answer:
      "Your membership includes a built-in **Trading Journal** where you can log every trade, track your performance, and analyse your statistics — all inside the platform.",
  },
  {
    patterns: [/cancel|refund|stop|pause|quit/i],
    answer:
      "You can **cancel anytime** from your account settings — no contracts, no penalties. Access continues until the end of your current billing period.",
  },
  {
    patterns: [/mpesa|m-pesa|card|payment|pay how|pay with/i],
    answer:
      "We accept **M-Pesa** and **Debit/Credit Cards** (Visa & Mastercard). Payment is processed securely on our checkout page immediately after creating your account.",
  },
  {
    patterns: [/sign up|register|join|get started|create account|how to start/i],
    answer:
      "Getting started is simple:\n1. Click **Get Started** at the top of the page\n2. Create your account with email & phone\n3. Complete the $50/month subscription\n4. Access your dashboard instantly — signals, tools, and community all in one place.",
  },
  {
    patterns: [/prop.?firm|funded|ftmo|myforexfund|challenge/i],
    answer:
      "Our **Prop Firm Prep programme** is specifically designed to help traders pass challenges like FTMO, MyForexFunds, and others. Risk management frameworks and strategy breakdowns are included.",
  },
  {
    patterns: [/contact|support|email|help|reach|talk/i],
    answer:
      "You can reach our team via:\n• **Telegram:** t.me/TonnyFxacademy\n• **Email:** support@mqtrade.pro\n• **Instagram:** @mqtradepro\n\nWe typically respond within a few hours.",
  },
  {
    patterns: [/hi|hello|hey|good morning|good evening|sup/i],
    answer:
      "Hello! Welcome to **MQTRADE PRO** 👋 I'm here to answer any questions about our platform, signals, pricing, or how to get started. What would you like to know?",
  },
  {
    patterns: [/thank|thanks|appreciated|great|awesome/i],
    answer:
      "You're very welcome! 🙌 If you have any more questions — or are ready to join — don't hesitate to ask. We'd love to have you in the community.",
  },
];

const QUICK_REPLIES = [
  "How much does it cost?",
  "What signals do you offer?",
  "How do I sign up?",
  "What is the win rate?",
  "How do I pay?",
  "Can I cancel anytime?",
];

const WELCOME: Message = {
  id: 0,
  from: "bot",
  text: "👋 Hi there! I'm the **MQTRADE PRO** assistant.\n\nI can help you with pricing, signals, how to join, payment methods, and more. What would you like to know?",
  time: now(),
};

function getBotReply(input: string): string {
  for (const item of FAQ) {
    if (item.patterns.some(p => p.test(input))) return item.answer;
  }
  return "That's a great question! For the most accurate answer please reach out directly:\n• **Telegram:** t.me/TonnyFxacademy\n• **Email:** support@mqtrade.pro\n\nOr try one of the quick options below 👇";
}

function renderText(text: string) {
  return text.split("\n").map((line, i) => {
    const parts = line.split(/\*\*(.+?)\*\*/g);
    return (
      <span key={i} className="block">
        {parts.map((p, j) =>
          j % 2 === 1 ? <strong key={j}>{p}</strong> : p
        )}
      </span>
    );
  });
}

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(1);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (open) setUnread(0);
  }, [open]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now(), from: "user", text: text.trim(), time: now() };
    setMessages(m => [...m, userMsg]);
    setInput("");
    setTyping(true);

    const delay = 800 + Math.random() * 700;
    setTimeout(() => {
      const reply = getBotReply(text);
      setTyping(false);
      setMessages(m => [...m, { id: Date.now() + 1, from: "bot", text: reply, time: now() }]);
      if (!open) setUnread(u => u + 1);
    }, delay);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };

  return (
    <>
      {/* ── Chat window ── */}
      {open && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 flex flex-col rounded-2xl shadow-2xl border border-border overflow-hidden"
          style={{ maxHeight: "75vh" }}>

          {/* Header */}
          <div className="bg-primary px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-tight">MQTRADE PRO Assistant</p>
                <p className="text-white/70 text-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                  Online — typically replies instantly
                </p>
              </div>
            </div>
            <button onClick={() => setOpen(false)}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto bg-background p-4 space-y-3" style={{ minHeight: 0 }}>
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-2 ${msg.from === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  msg.from === "bot" ? "bg-primary/15" : "bg-secondary"
                }`}>
                  {msg.from === "bot"
                    ? <Bot className="w-4 h-4 text-primary" />
                    : <User className="w-4 h-4 text-muted-foreground" />
                  }
                </div>
                <div className={`max-w-[78%] ${msg.from === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                  <div className={`px-3 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.from === "bot"
                      ? "bg-secondary text-foreground rounded-tl-sm"
                      : "bg-primary text-primary-foreground rounded-tr-sm"
                  }`}>
                    {renderText(msg.text)}
                  </div>
                  <span className="text-[10px] text-muted-foreground px-1">{msg.time}</span>
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-secondary px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1">
                  {[0, 1, 2].map(i => (
                    <span key={i} className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick replies */}
          <div className="bg-background border-t border-border px-3 py-2 flex gap-2 overflow-x-auto shrink-0 scrollbar-none">
            {QUICK_REPLIES.map(q => (
              <button key={q} onClick={() => send(q)}
                className="text-xs px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary hover:bg-primary/15 transition-colors whitespace-nowrap shrink-0">
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit}
            className="bg-background border-t border-border px-3 py-3 flex gap-2 shrink-0">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type your question..."
              className="flex-1 bg-secondary rounded-xl px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30"
            />
            <button type="submit" disabled={!input.trim()}
              className="w-9 h-9 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-40 flex items-center justify-center transition-colors shrink-0">
              <Send className="w-4 h-4 text-primary-foreground" />
            </button>
          </form>
        </div>
      )}

      {/* ── Floating toggle button ── */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-4 sm:right-6 z-50 w-14 h-14 rounded-full bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/40 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        aria-label="Open chat"
      >
        {open
          ? <ChevronDown className="w-6 h-6 text-primary-foreground" />
          : <MessageCircle className="w-6 h-6 text-primary-foreground" />
        }
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>
    </>
  );
};

export default ChatBot;
