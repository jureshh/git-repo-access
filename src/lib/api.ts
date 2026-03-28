const BASE_URL = import.meta.env.VITE_API_URL || "https://lease-extraction-mvp-production.up.railway.app";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    credentials: "include",
    ...options,
  });
  if (!res.ok) {
    const err = await res.text().catch(() => "Unknown error");
    throw new Error(`API ${res.status}: ${err}`);
  }
  return res.json();
}

async function trpc<T>(procedure: string, input?: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}/api/trpc/${procedure}`, {
    method: input !== undefined ? "POST" : "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: input !== undefined ? JSON.stringify({ json: input }) : undefined,
  });
  if (!res.ok) throw new Error(`tRPC ${res.status}`);
  const json = await res.json();
  return json.result?.data?.json ?? json.result?.data;
}

// ---- Auth ----
export async function getUser() {
  return trpc<{ id: number; name: string; email: string } | null>("auth.me");
}

// ---- Leases ----
export async function seedSyntheticData() {
  return trpc<{ message: string }>("leases.seedSyntheticData", {});
}

export async function extractLease(file: File): Promise<void> {
  const text = await readPdfText(file);
  await trpc("leases.extract", { leaseText: text });
}

async function readPdfText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        if (!(window as any).pdfjsLib) {
          await loadScript(
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
          );
          (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        }
        const pdf = await (window as any).pdfjsLib
          .getDocument({ data: reader.result as ArrayBuffer })
          .promise;
        const pages = await Promise.all(
          Array.from({ length: pdf.numPages }, (_, i) =>
            pdf.getPage(i + 1).then((p: any) =>
              p.getTextContent().then((tc: any) =>
                tc.items.map((item: any) => item.str).join(" ")
              )
            )
          )
        );
        resolve(pages.join("\n\n"));
      } catch (e) {
        reject(e);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => resolve();
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

// ---- Dashboard ----
export interface KpiData {
  totalLeases: number;
  totalMonthlyRevenue: number;
  avgRentPerUnit: number;
  occupancyRate: number;
  expiringLeases: number;
  avgConfidence: number;
}

export interface Lease {
  id: number;
  tenantName: string;
  unitNumber: string;
  mallName: string;
  leaseStartDate: string;
  leaseEndDate: string;
  monthlyBaseRent: number;
  percentageRent: number | null;
  securityDeposit: number | null;
  camCharges: number | null;
  escalationClause: string | null;
  renewalTerms: string | null;
  terminationClause: string | null;
  exclusivityClause: string | null;
  coTenancyClause: string | null;
  operatingHours: string | null;
  tenantCategory: string | null;
  leaseType: string | null;
  status: string;
  extractionConfidence: number | null;
}

export interface DashboardData {
  leases: Lease[];
  kpis: KpiData;
}

export async function getDashboardData(): Promise<DashboardData> {
  const [portfolio, financial, tenants] = await Promise.all([
    trpc<any>("dashboard.portfolioOverview"),
    trpc<any>("dashboard.financialPerformance"),
    trpc<any>("dashboard.tenantAnalysis"),
  ]);

  const kpis: KpiData = {
    totalLeases: portfolio?.totalLeases ?? 0,
    totalMonthlyRevenue: (financial?.totalAnnualizedRent ?? 0) / 12,
    avgRentPerUnit: financial?.avgRentPerArea ?? 0,
    occupancyRate: portfolio?.occupancyRate ?? 0,
    expiringLeases: portfolio?.expiringLeases ?? 0,
    avgConfidence: portfolio?.avgDataCompleteness ?? 0,
  };

  const leases: Lease[] = (tenants?.topTenantsByRent ?? []).map((t: any) => ({
    id: t.id ?? 0,
    tenantName: t.tenantName ?? "",
    unitNumber: t.unitNumber ?? "",
    mallName: t.propertyName ?? "",
    leaseStartDate: t.leaseStartDate ?? "",
    leaseEndDate: t.leaseExpiryDate ?? "",
    monthlyBaseRent: parseFloat(t.currentBaseRent ?? "0"),
    percentageRent: t.turnoverRentPercentage ? parseFloat(t.turnoverRentPercentage) : null,
    securityDeposit: null,
    camCharges: t.serviceChargeCapValue ? parseFloat(t.serviceChargeCapValue) : null,
    escalationClause: t.indexationIndex ?? null,
    renewalTerms: null,
    terminationClause: null,
    exclusivityClause: null,
    coTenancyClause: null,
    operatingHours: null,
    tenantCategory: t.tenantCategory ?? null,
    leaseType: null,
    status: t.extractionStatus ?? "active",
    extractionConfidence: t.dataCompletenessScore ? parseFloat(t.dataCompletenessScore) : null,
  }));

  return { leases, kpis };
}

// ---- Mock data (fallback) ----
export const MOCK_KPIS: KpiData = {
  totalLeases: 147,
  totalMonthlyRevenue: 2840000,
  avgRentPerUnit: 19320,
  occupancyRate: 94.2,
  expiringLeases: 23,
  avgConfidence: 96.8,
};

export const MOCK_LEASES: Lease[] = [
  { id: 1, tenantName: "Zara", unitNumber: "A-101", mallName: "Central Mall", leaseStartDate: "2023-01-01", leaseEndDate: "2026-12-31", monthlyBaseRent: 45000, percentageRent: 5, securityDeposit: 90000, camCharges: 8500, escalationClause: "3% annual", renewalTerms: "2x5yr options", terminationClause: "6mo notice", exclusivityClause: "No competing fast-fashion", coTenancyClause: "Anchor tenant required", operatingHours: "10AM-9PM", tenantCategory: "Fashion", leaseType: "NNN", status: "active", extractionConfidence: 97 },
  { id: 2, tenantName: "Starbucks", unitNumber: "B-205", mallName: "Central Mall", leaseStartDate: "2022-06-01", leaseEndDate: "2025-05-31", monthlyBaseRent: 18000, percentageRent: 7, securityDeposit: 36000, camCharges: 4200, escalationClause: "CPI-linked", renewalTerms: "1x3yr option", terminationClause: "90 days", exclusivityClause: "No other coffee shops within 200ft", coTenancyClause: null, operatingHours: "7AM-10PM", tenantCategory: "F&B", leaseType: "Gross", status: "active", extractionConfidence: 94 },
  { id: 3, tenantName: "Apple Store", unitNumber: "C-100", mallName: "Premium Plaza", leaseStartDate: "2021-03-15", leaseEndDate: "2031-03-14", monthlyBaseRent: 95000, percentageRent: 3, securityDeposit: 285000, camCharges: 15000, escalationClause: "Fixed 2.5%", renewalTerms: "2x5yr options", terminationClause: "12mo notice", exclusivityClause: "Exclusive electronics", coTenancyClause: "Min 85% occupancy", operatingHours: "10AM-9PM", tenantCategory: "Electronics", leaseType: "NNN", status: "active", extractionConfidence: 99 },
  { id: 4, tenantName: "H&M", unitNumber: "A-201", mallName: "Central Mall", leaseStartDate: "2020-09-01", leaseEndDate: "2025-08-31", monthlyBaseRent: 38000, percentageRent: 4.5, securityDeposit: 76000, camCharges: 7200, escalationClause: "3% annual", renewalTerms: "1x5yr option", terminationClause: "6mo notice", exclusivityClause: null, coTenancyClause: null, operatingHours: "10AM-9PM", tenantCategory: "Fashion", leaseType: "Modified Gross", status: "expiring_soon", extractionConfidence: 92 },
  { id: 5, tenantName: "Sephora", unitNumber: "B-110", mallName: "Premium Plaza", leaseStartDate: "2023-04-01", leaseEndDate: "2028-03-31", monthlyBaseRent: 32000, percentageRent: 6, securityDeposit: 64000, camCharges: 6100, escalationClause: "CPI + 1%", renewalTerms: "2x3yr options", terminationClause: "90 days", exclusivityClause: "Exclusive beauty retailer", coTenancyClause: null, operatingHours: "10AM-9PM", tenantCategory: "Beauty", leaseType: "NNN", status: "active", extractionConfidence: 96 },
  { id: 6, tenantName: "Nike", unitNumber: "C-301", mallName: "Sports Center", leaseStartDate: "2022-01-01", leaseEndDate: "2027-12-31", monthlyBaseRent: 52000, percentageRent: 4, securityDeposit: 104000, camCharges: 9800, escalationClause: "3.5% annual", renewalTerms: "1x5yr option", terminationClause: "6mo notice", exclusivityClause: "No competing athletic brands", coTenancyClause: "Anchor required", operatingHours: "10AM-9PM", tenantCategory: "Sports", leaseType: "NNN", status: "active", extractionConfidence: 98 },
];
