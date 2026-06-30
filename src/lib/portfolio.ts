// Portfolio-wide synthetic dataset (5 CPI Property Group Poland shopping centres).
// Galeria Orkana is the only LIVE building — the others are headline KPIs only.

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
    name: "Galeria Orkana",
    city: "Lublin",
    live: true,
    gla: 18_450,
    occupied: 0.932,
    wault: 4.2,
    griPln: 11_680_000,
    noiPln: 8_410_000,
    nextMajorExpiry: "Jun 2026",
  },
  {
    id: "vivo-pila",
    name: "Vivo! Piła",
    city: "Piła",
    live: false,
    gla: 27_800,
    occupied: 0.985,
    wault: 4.6,
    griPln: 17_200_000,
    noiPln: 12_400_000,
    nextMajorExpiry: "Sep 2027",
  },
  {
    id: "vivo-krosno",
    name: "Vivo! Krosno",
    city: "Krosno",
    live: false,
    gla: 24_200,
    occupied: 0.991,
    wault: 5.1,
    griPln: 15_600_000,
    noiPln: 11_300_000,
    nextMajorExpiry: "Mar 2028",
  },
  {
    id: "vivo-stalowa-wola",
    name: "Vivo! Stalowa Wola",
    city: "Stalowa Wola",
    live: false,
    gla: 19_600,
    occupied: 0.897,
    wault: 2.8,
    griPln: 10_400_000,
    noiPln: 7_100_000,
    nextMajorExpiry: "Feb 2026",
  },
  {
    id: "ogrody",
    name: "Ogrody",
    city: "Elbląg",
    live: false,
    gla: 33_500,
    occupied: 0.914,
    wault: 3.4,
    griPln: 19_800_000,
    noiPln: 13_900_000,
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
  // Assumed aggregate asset value for demo purposes (PLN ~780M ≈ 6.8% NOI yield).
  const assetValue = 780_000_000;
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
  { tone: "red", tenant: "Café Roma", building: "Galeria Orkana", desc: "Break option notice window opens in", days: 38, source: "§8.2 p.24" },
  { tone: "red", tenant: "Jewellery Co", building: "Galeria Orkana", desc: "Bank guarantee expires in", days: 63, source: "§14.1 p.31" },
  { tone: "red", tenant: "Mercato Anchor", building: "Vivo! Piła", desc: "Bank guarantee expires in", days: 95, source: "§14.2 p.33" },
  { tone: "amber", tenant: "Sport Zone", building: "Galeria Orkana", desc: "Bank guarantee expires in", days: 187, source: "§12.3 p.29" },
  { tone: "amber", tenant: "H&M", building: "Ogrody", desc: "Tenant break option exercisable in", days: 145, source: "§8.4 p.27" },
  { tone: "amber", tenant: "Cinema City", building: "Vivo! Stalowa Wola", desc: "Lease expiry in", days: 320, source: "§3.1 p.8" },
  { tone: "amber", tenant: "Electronics Plus", building: "Galeria Orkana", desc: "Landlord break option exercisable in", days: 365, source: "§8.5 p.26" },
  { tone: "amber", tenant: "Kids World", building: "Galeria Orkana", desc: "Lease expiry in", days: 540, source: "§3.1 p.6" },
];