## Plan: JLL Expert Feedback Updates

Apply 5 sets of changes across Dashboard, Building Intelligence, and Lease Review screens. All additive/reformatting — no layout restructuring.

### 1. Currency System (EUR primary, PLN secondary)

Create `src/lib/currency.tsx`:
- `CurrencyContext` with `displayCurrency` ("EUR"|"PLN") and `eurPlnRate` (default 4.30)
- `useCurrency()` hook
- `formatRent(plnAmount, { mode })` returning JSX: primary bold figure + smaller secondary in parens
- `formatMonthlyAnnual(plnAnnual)` returning "€X/yr (€Y/mo)" with secondary PLN line
- Wrap app in `<CurrencyProvider>` in `src/App.tsx`

Add to `src/components/Layout.tsx` nav: small dropdown "Display: EUR | PLN" + gear-style popover with editable EUR/PLN rate input.

### 2. Monthly Rent Alongside Annual

Wherever annual rent shows, add monthly (annual/12). Apply via the new `formatMonthlyAnnual` helper to:
- `src/pages/Dashboard.tsx`: GRI/NOI KPI cards, Annual Rent by Tenant chart tooltip & labels
- `src/components/building/LeaseDetailPanel.tsx`: "Base Rent" and "Effective Rent" rows show /yr and /mo, with EUR primary
- `src/pages/LeaseReview.tsx` (via DATA): "Annual Rent" and "Effective Rent" cells render with helper

### 3. Tenant Expiry Risk Matrix → 0–10 years

In `src/pages/Dashboard.tsx` scatter chart:
- X-axis domain `[0, 10]`, title "Tenant Expiry Risk Matrix (0–10 Years)"
- ReferenceAreas: red 0–1, amber 1–3, green 3–10
- ReferenceLines: dashed red at 1 ("Critical"), dashed amber at 3 ("Watch")
- Color thresholds: red <1, amber <3, green ≥3
- Add 3 new tenants: "Anchor – Grocery" (8.5 yrs, large GLA), "Flagship Electronics" (9.2 yrs, mid-large), "Pharmacy Plus" (7.1 yrs, mid)
- Y-axis (rent) formatted in EUR via currency context

### 4. Add New Clause Fields

Update `src/components/leasereview/data.ts`:
- Add `GroupKey` "Renewal" (new group between Dates & Guarantees)
- New FIELDS:
  - Break: `breakPenalty`
  - Renewal (new group): `renewalType`, `noticePeriod`
  - Guarantees: `notarialDeed`
  - Indexation: `stepRent`
  - Obligations: `nonCompete`, `greenClause` (keep existing `reinstatement`)
- Populate DATA for all 7 tenants with realistic values
- Update GROUPS array + GROUP_FILTER_MAP

Update `LeaseDetailPanel.tsx` Café Roma block + generic block to show these new fields under matching sections. Add "Renewal" section. Add "Notarial Deed" tooltip via `<span title>`.

### 5. Configurable Alert Lead Time

In `src/pages/Dashboard.tsx` "Alerts Requiring Attention" card header: add a `Select` with options 6/12/18/24 months (default 12). Filter the displayed alert list by `monthsToEvent <= leadTime`. Add `monthsAway` metadata to each alert item (synthetic).

### Files Touched

New:
- `src/lib/currency.tsx`

Modified:
- `src/App.tsx` — wrap in CurrencyProvider
- `src/components/Layout.tsx` — currency toggle + rate setting
- `src/pages/Dashboard.tsx` — KPI EUR/monthly, scatter 0–10, alert lead time
- `src/components/building/LeaseDetailPanel.tsx` — EUR/monthly + new fields + Renewal section
- `src/components/leasereview/data.ts` — new fields/groups + populated values
- `src/pages/LeaseReview.tsx` — render rent cells via formatter; new "Renewal" group will be picked up automatically

### Notes

- All rent values in source data remain PLN integers; EUR conversion happens at render time using context rate.
- Currency toggle is a simple inline `<select>` styled to match the nav (no new shadcn component needed).
- Step Rent expandable schedule: render a small inline "View schedule" popover via existing `Popover` component showing 2–3 step rows; only when `stepRent === "Yes"`.
