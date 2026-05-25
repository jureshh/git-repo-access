export type Status = "green" | "amber" | "red" | "grey";

export interface Unit {
  id: string;
  tenant: string;
  sqm: number;
  status: Status;
  wault: string;
  alert?: string;
  annualRent?: number;
  rentPerM2?: number;
  expiry?: string;
  statusLabel: string;
  // SVG coords for floor plan
  x: number;
  y: number;
  w: number;
  h: number;
}

export const FLOORS = ["GF", "1", "2", "3"] as const;
export type Floor = (typeof FLOORS)[number];

export const floor2Units: Unit[] = [
  {
    id: "2-A1",
    tenant: "Anchor – Fashion",
    sqm: 1800,
    status: "green",
    wault: "6.1 yrs",
    annualRent: 1_260_000,
    rentPerM2: 700,
    expiry: "31 Dec 2031",
    statusLabel: "Secure",
    x: 20,
    y: 20,
    w: 180,
    h: 460,
  },
  {
    id: "2-A2",
    tenant: "Electronics Plus",
    sqm: 620,
    status: "amber",
    wault: "2.3 yrs",
    annualRent: 558_000,
    rentPerM2: 900,
    expiry: "15 Mar 2028",
    statusLabel: "Watch",
    x: 220,
    y: 360,
    w: 150,
    h: 120,
  },
  {
    id: "2-B1",
    tenant: "Café Roma",
    sqm: 180,
    status: "red",
    wault: "0.7 yrs",
    alert: "break option",
    annualRent: 180_000,
    rentPerM2: 1_000,
    expiry: "30 Jun 2026",
    statusLabel: "Critical",
    x: 620,
    y: 20,
    w: 160,
    h: 110,
  },
  {
    id: "2-B2",
    tenant: "Optika Centrum",
    sqm: 95,
    status: "green",
    wault: "4.8 yrs",
    annualRent: 99_750,
    rentPerM2: 1_050,
    expiry: "20 Nov 2030",
    statusLabel: "Secure",
    x: 620,
    y: 140,
    w: 160,
    h: 100,
  },
  {
    id: "2-B3",
    tenant: "[Vacant]",
    sqm: 210,
    status: "grey",
    wault: "—",
    statusLabel: "Vacant",
    x: 620,
    y: 250,
    w: 160,
    h: 100,
  },
  {
    id: "2-C1",
    tenant: "Sport Zone",
    sqm: 850,
    status: "amber",
    wault: "1.9 yrs",
    alert: "guarantee",
    annualRent: 637_500,
    rentPerM2: 750,
    expiry: "28 Feb 2027",
    statusLabel: "Watch",
    x: 620,
    y: 360,
    w: 160,
    h: 120,
  },
  {
    id: "2-C2",
    tenant: "Kids World",
    sqm: 340,
    status: "green",
    wault: "3.6 yrs",
    annualRent: 272_000,
    rentPerM2: 800,
    expiry: "10 Sep 2029",
    statusLabel: "Secure",
    x: 380,
    y: 360,
    w: 130,
    h: 120,
  },
  {
    id: "2-C3",
    tenant: "Jewellery Co",
    sqm: 75,
    status: "red",
    wault: "0.4 yrs",
    alert: "alert",
    annualRent: 112_500,
    rentPerM2: 1_500,
    expiry: "14 Jan 2026",
    statusLabel: "Critical",
    x: 520,
    y: 360,
    w: 90,
    h: 120,
  },
];

export const unitsByFloor: Record<Floor, Unit[]> = {
  GF: [],
  "1": [],
  "2": floor2Units,
  "3": [],
};

export const STATUS_COLORS: Record<Status, string> = {
  green: "#059669",
  amber: "#D97706",
  red: "#E11D48",
  grey: "#64748B",
};

export const STATUS_DOT_LABEL: Record<Status, { dot: string; emoji: string }> = {
  green: { dot: "#059669", emoji: "🟢" },
  amber: { dot: "#D97706", emoji: "🟡" },
  red: { dot: "#E11D48", emoji: "🔴" },
  grey: { dot: "#64748B", emoji: "⬜" },
};

export const TEAL = "#0891B2";
export const BG = "#0D1B2A";
export const CARD = "#162032";
export const ATRIUM = "#1E293B";