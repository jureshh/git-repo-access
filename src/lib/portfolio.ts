// Portfolio-wide synthetic dataset (5 CPI Property Group Poland shopping centres).
// Galeria Verano is the only LIVE building — the others are headline KPIs only.
// Building/tenant names are fictionalised to avoid coincidental resemblance to
// real, fact-checkable assets. GRI figures assume a €26/sqm/month blended base
// rent applied to occupied GLA (approx €312/sqm/yr). NOI = GRI × 0.72. All
// monetary fields are stored in PLN using an assumed FX rate of 4.30 PLN/EUR
// so the existing currency conversion utilities continue to work unchanged.

export interface PortfolioBuilding {
  id: string;
  name: string;
  city: string;
  live: boolean;
  gla: number;            // sqm
  occupied: number;       // fraction 0–1
  wault: number;          // years
  griPln: number;         // annual gross rental income (PLN)
  noiPln: number;         // net operating income (PLN)
  nextMajorExpiry: string;
}

export const PORTFOLIO: PortfolioBuilding[] = [
  {
    id: "galeria-orkana",
    name: "Galeria Verano",
    city: "Lublin",
    live: true,
    gla: 18_450,
    occupied: 0.932,
    wault: 4.2,
    griPln: 23_650_000,
    noiPln: 17_028_000,
    nextMajorExpiry: "Jun 2026",
  },
  {
    id: "vivo-pila",
    name: "Aster! Piła",
    city: "Piła",
    live: false,
    gla: 27_800,
    occupied: 0.985,
    wault: 2.5,
    griPln: 36_722_000,
    noiPln: 26_445_000,
    nextMajorExpiry: "Sep 2027",
  },
  {
    id: "vivo-krosno",
    name: "Aster! Krosno",
    city: "Krosno",
    live: false,
    gla: 24_200,
    occupied: 0.991,
    wault: 2.3,
    griPln: 32_164_000,
    noiPln: 23_177_000,
    nextMajorExpiry: "Mar 2028",
  },
  {
    id: "vivo-stalowa-wola",
    name: "Aster! Stalowa Wola",
    city: "Stalowa Wola",
    live: false,
    gla: 19_600,
    occupied: 0.897,
    wault: 1.0,
    griPln: 23_607_000,
    noiPln: 16_985_000,
    nextMajorExpiry: "Feb 2026",
  },
  {
    id: "ogrody",
    name: "Bulwary",
    city: "Elbląg",
    live: false,
    gla: 33_500,
    occupied: 0.914,
    wault: 6.0,
    griPln: 41_065_000,
    noiPln: 29_584_000,
    nextMajorExpiry: "Nov 2027",
  },
];

export interface PortfolioTotals {
  gla: number;
  occupiedGla: number;
  occupancy: number;
  griPln: number;
  noiPln: number;
  waultGriWeighted: number;
  noiYield: number; // assumes a simple PLN 780M portfolio asset value
}

export function portfolioTotals(items: PortfolioBuilding[] = PORTFOLIO): PortfolioTotals {
  const gla = items.reduce((s, b) => s + b.gla, 0);
  const occupiedGla = items.reduce((s, b) => s + b.gla * b.occupied, 0);
  const griPln = items.reduce((s, b) => s + b.griPln, 0);
  const noiPln = items.reduce((s, b) => s + b.noiPln, 0);
  const waultGriWeighted =
    items.reduce((s, b) => s + b.wault * b.griPln, 0) / griPln;
  // Portfolio value implied by a 6% cap rate on aggregate NOI. NOI yield is
  // therefore fixed at ~6.0% by construction, per market-benchmark assumption.
  const assetValue = noiPln / 0.06;
  return {
    gla,
    occupiedGla,
    occupancy: occupiedGla / gla,
    griPln,
    noiPln,
    waultGriWeighted,
    noiYield: noiPln / assetValue,
  };
}

// Portfolio-wide lease expiry distribution by year (sqm). Roughly 3× the
// single-building shape; heavier in 2027–2028 and 2031+, lighter in 2030.
export const portfolioExpiryByYear = [
  { year: "2026", sqm: 850 },
  { year: "2027", sqm: 2_800 },
  { year: "2028", sqm: 2_100 },
  { year: "2029", sqm: 1_100 },
  { year: "2030", sqm: 400 },
  { year: "2031+", sqm: 5_800 },
];

export interface PortfolioAlert {
  tone: "red" | "amber";
  tenant: string;
  building: string;
  desc: string;
  days: number;
  source: string;
}

export const portfolioAlerts: PortfolioAlert[] = [
  { tone: "red", tenant: "Café Roma", building: "Galeria Verano", desc: "Break option notice window opens in", days: 38, source: "§8.2 p.24" },
  { tone: "red", tenant: "Jewellery Co", building: "Galeria Verano", desc: "Bank guarantee expires in", days: 63, source: "§14.1 p.31" },
  { tone: "red", tenant: "Mercato Anchor", building: "Aster! Piła", desc: "Bank guarantee expires in", days: 95, source: "§14.2 p.33" },
  { tone: "amber", tenant: "Sport Zone", building: "Galeria Verano", desc: "Bank guarantee expires in", days: 187, source: "§12.3 p.29" },
  { tone: "amber", tenant: "Modeva", building: "Bulwary", desc: "Tenant break option exercisable in", days: 145, source: "§8.4 p.27" },
  { tone: "amber", tenant: "Cinema Town", building: "Aster! Stalowa Wola", desc: "Lease expiry in", days: 320, source: "§3.1 p.8" },
  { tone: "amber", tenant: "Electronics Plus", building: "Galeria Verano", desc: "Landlord break option exercisable in", days: 365, source: "§8.5 p.26" },
  { tone: "amber", tenant: "Kids World", building: "Galeria Verano", desc: "Lease expiry in", days: 540, source: "§3.1 p.6" },
];