# Building Intelligence Centre — Plan

A new route `/building` rendered inside the existing `Layout`, added to the top nav as "Building". Dark navy theme matching the app, built with Tailwind + semantic tokens (extended for the spec's exact hex values where needed).

## Route & navigation

- Add `BuildingIntelligence.tsx` page in `src/pages/`.
- Register `<Route path="/building" element={<BuildingIntelligence />} />` in `src/App.tsx`.
- Add nav item `{ to: "/building", label: "Building", icon: LayoutGrid }` in `src/components/Layout.tsx`.

## File structure

```
src/pages/BuildingIntelligence.tsx          orchestrator + state
src/components/building/
  SummaryBar.tsx                            Zone 1 — 6 KPIs
  FloorPlan.tsx                             Zone 2A — SVG plan + floor tabs
  UnitTable.tsx                             Zone 2B — table
  LeaseDetailPanel.tsx                      Zone 3 — slide-out detail
  data.ts                                   typed units, floor list, detail content
  colors.ts                                 status hex constants
```

## State (in page component)

- `selectedFloor: "GF" | "1" | "2" | "3"` (default `"2"`)
- `selectedUnitId: string | null` (default `"2-B1"` so detail panel shows on load)
- Selecting a unit (from plan or table) sets `selectedUnitId` and swaps right panel from table → detail. Close button on detail clears selection back to table.
- The selected unit gets a white ring/glow on the floor plan and a highlighted row in the table.

## Zone 1 — Summary Bar

Single dark card, horizontal flex with 6 stat blocks (label above, value below):
Total GLA · Occupied (sqm + %) · WAULT · Annual Rent · Active Alerts (amber) · Guarantees Expiring (red).

## Zone 2A — Floor Plan

- Floor tabs (GF / 1 / 2 / 3) using existing `Tabs` component. Only Floor 2 has unit data; other floors render a "No data" placeholder over the same atrium shell.
- SVG canvas (responsive `viewBox`, e.g. `0 0 800 500`) containing:
  - Background rect `#0D1B2A`
  - Central atrium rect `#1E293B` labelled "Common Area"
  - Unit rectangles positioned around the perimeter. Layout sketch for Floor 2:

```text
+------------------------------------------------+
| 2-A1  |        Common Area         | 2-B1 2-B2|
| Anchor|                            |----------|
| (tall)|                            | 2-B3 2-C1|
|       |                            |----------|
|       |   2-A2     2-C2     2-C3   |          |
+------------------------------------------------+
```
   (Final pixel coords chosen so 2-A1 spans ~2× height of others; sizes loosely scaled by sqm.)
  - Each unit `<g>` is clickable, fill = status color, white text for tenant name, smaller grey for sqm, WAULT in bottom-right, bell icon (lucide `Bell` inlined as SVG path) top-right when `alert` is set.
  - Selected unit gets `stroke="#0891B2"` (teal) + subtle `drop-shadow` glow.
  - Vacant unit shows `[Vacant]` and no WAULT.

## Zone 2B — Unit Table

- Uses existing `Table` primitives. Columns per spec; status cell shows colored dot + label.
- Row click → select unit. Selected row: teal left border + `bg-primary/10`.
- Scroll inside panel; panel height matches floor plan panel.

## Zone 3 — Lease Detail Panel

- Conditionally rendered in place of `UnitTable` when `selectedUnitId` is set.
- Back/close button (X) top-right returns to table view.
- Sections per spec for Café Roma (Header, Rent Economics, Lease Term, Break Option, Bank Guarantee, Indexation, Documents). Other units render a minimal header + "Detailed lease data not yet ingested" stub so clicks elsewhere still work gracefully.
- Each `Source: §X.X — Document, p. XX` rendered as inline teal link (`text-[#0891B2] hover:underline`), `href="#"` with `onClick` preventDefault.

## Color tokens

Use spec hex values directly via Tailwind arbitrary classes for status colors (`bg-[#059669]` etc.) to keep the existing global theme untouched. Page-level background `bg-[#0D1B2A]`, cards `bg-[#162032]`, teal accent `#0891B2`.

## Layout sizing

```
<page bg #0D1B2A, container, py-6, space-y-4>
  <SummaryBar />                              // full width card
  <div grid grid-cols-5 gap-4 h-[calc(100vh-220px)]>
     <FloorPlan className="col-span-3" />     // 60%
     {selectedUnitId
        ? <LeaseDetailPanel className="col-span-2" />
        : <UnitTable className="col-span-2" />}
  </div>
```

Both right-hand variants share the same outer card so the swap feels like a slide-in (add `transition-opacity` / simple fade — no extra deps).

## Out of scope

- No backend wiring; data is static in `data.ts`.
- No real PDF navigation from source links.
- Only Floor 2 is populated with units; other floor tabs are placeholders.
