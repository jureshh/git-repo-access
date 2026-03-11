

## Migration and Redesign Plan: Lease Extraction MVP

### Overview

Rebuild the frontend in this Lovable project with a full visual overhaul, pointing API calls to your existing backend server. The backend (tRPC, Drizzle, Gemini) stays where it is -- Lovable handles only the UI.

---

### Architecture

```text
┌─────────────────────────┐       ┌──────────────────────┐
│   Lovable (Frontend)    │       │  Your Existing Server │
│                         │       │                       │
│  Landing Page           │──────▶│  tRPC API             │
│  Upload Page            │  HTTP │  Drizzle/DB           │
│  Dashboard (4 tabs)     │◀──────│  Gemini AI            │
│                         │       │  Auth                 │
└─────────────────────────┘       └──────────────────────┘
```

**Key difference from MVP**: Replace `wouter` with `react-router-dom` (already installed), replace `trpc` client with `fetch`-based API calls to your backend URL, and replace `framer-motion` with CSS animations (Lovable doesn't support framer-motion).

---

### Implementation Steps

#### 1. API Layer Setup
- Create `src/lib/api.ts` with a base fetch client configured to call your backend URL (stored as env variable)
- Create typed API functions mirroring your tRPC routes: `seedSyntheticData`, `extractLease`, `getDashboardData`
- Create `src/hooks/useAuth.ts` to handle authentication against your existing auth system

#### 2. Landing Page (Full Redesign)
- Hero section with bold headline, animated stats (CSS keyframes instead of framer-motion), CTA button
- Discovery section with stats grid and dashboard preview
- Transformation section with feature cards (risk detection, financial insights, etc.)
- CTA section linking to upload
- Modern color scheme, professional typography, clean spacing

#### 3. Upload Page (Full Redesign)
- Clean drag-and-drop zone with file validation (PDF only)
- Upload progress indicator with extraction status
- Synthetic data seeding option
- Navigation to dashboard on success

#### 4. Dashboard (Full Redesign)
- Tabbed layout with 4 tabs: Portfolio Overview, Financial Performance, Operational Risk, Tenant Analysis
- Each tab gets its own component with KPI cards, charts (using recharts, already installed)
- Auth gate: redirect to login if unauthenticated
- Responsive grid layouts for all chart/card arrangements

#### 5. Shared Components
- App layout with navigation header (logo, nav links, auth status)
- KPI card component (reusable across all dashboard tabs)
- Chart wrapper components for consistent styling

---

### What Changes vs. Your MVP

| Aspect | MVP (Current) | Lovable (New) |
|--------|--------------|---------------|
| Router | wouter | react-router-dom |
| API client | tRPC | fetch-based wrapper |
| Animations | framer-motion | CSS/Tailwind animations |
| Styling | Mixed | Tailwind + shadcn/ui |
| Charts | recharts | recharts (same) |

### What You Need to Do First

1. **Deploy your backend** somewhere accessible (or confirm it's already running at a URL)
2. **Share the backend URL** so I can configure the API calls
3. Optionally: share the tRPC route definitions so I can match the exact API contract

---

### Build Order

1. API layer + auth hook
2. Landing page
3. Upload page
4. Dashboard shell + Portfolio Overview tab
5. Remaining 3 dashboard tabs
6. Polish, responsive design, animations

