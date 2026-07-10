# MQTRADE PRO

Premium trading signals, tools and community for serious traders. Real-time signals across Forex, Indices, Gold and Crypto.

**Live:** [bettrades.vercel.app](https://bettrades.vercel.app)

---

## Features

- Real-time trading signals (Forex, Gold, Indices, Crypto)
- TradingView indicators & NinjaTrader strategies
- VVIP Telegram signals channel
- Trading journal with performance tracking
- Economic calendar with market events
- Risk/reward calculator
- 1-on-1 mentorship & prop firm prep
- Admin panel for signal management & broadcasts
- MT5 sync via Edge Function
- Referral system with coupon codes
- $50/month subscription paywall (M-Pesa + Card)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| UI | shadcn/ui + Tailwind CSS |
| Backend | Supabase (Auth, DB, Storage, Realtime) |
| Hosting | Vercel |
| Payments | Pesapal / IntaSend (M-Pesa + Cards) |

---

## Local Development

### Prerequisites
- Node.js 18+
- npm
- Supabase project

### Setup

```sh
# Clone the repo
git clone https://github.com/Bett-001/bettrades.git
cd bettrades

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Fill in your Supabase URL and anon key

# Start dev server
npm run dev
```

App runs at `http://localhost:8080`

### Environment Variables

Create a `.env.local` file in the root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Never commit `.env.local` — it is gitignored.

---

## Database Setup

Run the following SQL files in order in your Supabase SQL Editor:

1. `supabase_setup.sql` — core tables (profiles, signals, trades, subscriptions)
2. `supabase_admin_setup.sql` — admin roles and policies
3. `supabase_missing_tables.sql` — mt5_tokens, referrals, coupons, broadcasts, user_preferences

---

## Project Structure

```
src/
├── components/
│   ├── landing/        # Landing page sections (Hero, Pricing, Footer...)
│   ├── ui/             # shadcn/ui components + PhoneInput
│   ├── AppLayout.tsx   # Sidebar + app shell
│   ├── ProtectedRoute.tsx  # Auth + subscription guard
│   └── Sidebar.tsx
├── contexts/
│   ├── AuthContext.tsx     # Auth state + subscription check
│   └── ThemeContext.tsx
├── lib/
│   └── supabase.ts         # Supabase client
└── pages/
    ├── Index.tsx           # Landing page
    ├── Auth.tsx            # Sign in / Sign up / Forgot password
    ├── Payment.tsx         # Subscription payment
    ├── Dashboard.tsx       # Main dashboard + signals
    ├── Journal.tsx         # Trading journal
    ├── Performance.tsx     # Stats and analytics
    ├── Calculator.tsx      # Risk/reward calculator
    ├── EconomicCalendar.tsx
    ├── Settings.tsx
    ├── Admin.tsx
    ├── Referral.tsx
    ├── Onboarding.tsx
    └── ...
```

---

## Authentication Flow

```
Sign Up → /payment (subscription required)
Sign In → /dashboard (if paid) or /payment (if unpaid)
Direct URL → ProtectedRoute redirects unpaid users to /payment
```

---

## Deployment

Deployed automatically to Vercel on every push to `main`.

To deploy manually:
```sh
npm run build   # builds to /dist
```

---

## Contact

- Instagram: [@mqtradepro](https://www.instagram.com/mqtradepro/)
- Telegram: [TonnyFxacademy](https://t.me/TonnyFxacademy)
- Email: support@mqtrade.pro
