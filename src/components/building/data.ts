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
    x: 16,
    y: 16,
    w: 230,
    h: 448,
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
    x: 537,
    y: 16,
    w: 347,
    h: 168,
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
    x: 250,
    y: 16,
    w: 100,
    h: 168,
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
    x: 350,
    y: 16,
    w: 70,
    h: 168,
  },
  {
    id: "2-B3",
    tenant: "[Vacant]",
    sqm: 210,
    status: "grey",
    wault: "—",
    statusLabel: "Vacant",
    x: 420,
    y: 16,
    w: 117,
    h: 168,
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
    x: 411,
    y: 296,
    w: 403,
    h: 168,
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
    x: 250,
    y: 296,
    w: 161,
    h: 168,
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
    x: 814,
    y: 296,
    w: 70,
    h: 168,
  },
];

export const unitsByFloor: Record<Floor, Unit[]> = {
  GF: [
    {
      id: "GF-A1",
      tenant: "Carrefour Hypermarket",
      sqm: 6500,
      status: "green",
      wault: "7.4 yrs",
      annualRent: 3_900_000,
      rentPerM2: 600,
      expiry: "31 Dec 2032",
      statusLabel: "Secure",
      x: 0, y: 0, w: 0, h: 0,
    },
  ],
  "1": [
    {
      id: "1-A1",
      tenant: "Multikino Cinema",
      sqm: 6740,
      status: "green",
      wault: "8.2 yrs",
      annualRent: 4_044_000,
      rentPerM2: 600,
      expiry: "30 Jun 2033",
      statusLabel: "Secure",
      x: 0, y: 0, w: 0, h: 0,
    },
  ],
  "2": floor2Units,
  "3": [
    {
      id: "3-V1",
      tenant: "[Vacant]",
      sqm: 1040,
      status: "grey",
      wault: "—",
      statusLabel: "Vacant",
      x: 0, y: 0, w: 0, h: 0,
    },
  ],
};

// Status colors map to design tokens (resolved via CSS vars) for SVG use.
// hsl(var(--token)) works inside inline style fills.
export const STATUS_FILL: Record<Status, string> = {
  green: "hsl(var(--success))",
  amber: "hsl(var(--warning))",
  red: "hsl(var(--destructive))",
  grey: "hsl(var(--muted-foreground))",
};

export const STATUS_META: Record<Status, { className: string; emoji: string; label: string }> = {
  green: { className: "text-success", emoji: "🟢", label: "Secure" },
  amber: { className: "text-warning", emoji: "🟡", label: "Watch" },
  red: { className: "text-destructive", emoji: "🔴", label: "Critical" },
  grey: { className: "text-muted-foreground", emoji: "⬜", label: "Vacant" },
};