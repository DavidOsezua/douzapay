# 💳 Duozapay

Duozapay is a modern digital wallet platform built with **Vite + React**. It allows users to manage stablecoins, create virtual cards, and spend globally via Apple Pay and Google Pay — all in seconds.

---

## ✨ Key Features

- **Instant Card Creation** — No support tickets, no delays. Create and activate your Duozapay instantly.
- **24/7 Stablecoin Loading** — Top up your wallet anytime.
- **Global Spending** — Use your card with Apple Pay & Google Pay worldwide.
- **Modular Architecture** — Built for scalability and whitelabeling.

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18.x
- npm (preferred) or yarn/pnpm
- Git

### Installation

```bash
npm install
npm run dev
```

### 🧱 Project Structure

```
src/
├── App.tsx              # Route definitions (react-router-dom)
├── main.tsx             # App entry point (Sentry init, root render)
├── index.css            # Tailwind v4 + design token CSS variables
├── assets/              # Static images bundled by Vite
├── components/
│   ├── ui/              # ShadCN UI components
│   ├── skeletons/       # Skeleton loaders
│   ├── icons/           # SVG icons with dynamic className support
│   ├── modals/          # User-facing modal content + modal manager (index.tsx)
│   ├── sheets/          # User-facing side sheet content + sheet manager
│   ├── admin-sheets/    # Admin-only side sheet content + manager
│   └── ...              # Other shared components (sidebar, mobile nav, etc.)
│
├── hooks/               # Custom React hooks, incl. TanStack Query wrappers
├── lib/                 # API client, auth provider, helpers, utils
├── pages/
│   ├── admin-dashboard/
│   │   ├── cards/
│   │   ├── referrals/
│   │   ├── settlements/
│   │   ├── transactions/
│   │   ├── users/
│   │   ├── _misc/       # Page-local helpers, e.g. TanStack column defs
│   │   ├── page.tsx
│   │   └── layout.tsx
│   │
│   ├── dashboard/
│   │   ├── account/
│   │   ├── cards/
│   │   ├── partners/
│   │   ├── shop/
│   │   ├── transactions/
│   │   ├── wallet/
│   │   ├── page.tsx
│   │   └── layout.tsx
│   │
│   └── ...              # Top-level auth pages: Login, Signup, Index, AdminLogin, ResetPassword
│
├── types/               # Global ambient TypeScript types (no imports needed)
└── zustand/             # Zustand state stores (modals, sheets, user, cards, admin, etc.)
```

### Development Notes

- Migrated from JavaScript to TypeScript in v2
- Some legacy components are still in JS due to migration errors
- TanStack Table is used for data grids
- Zustand is used for global state management
- Routing structure mimics Next.js file-based routing

### Scripts

```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
npm run lint        # Run ESLint
npm run typecheck   # Run TypeScript compiler checks (tsc --noEmit)
```

### 📄 License

Proprietary — Licensed exclusively for use by Duozapay company. Not open source. All rights reserved.
