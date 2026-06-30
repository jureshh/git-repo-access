import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useFormatRent, useFormatAnnualMonthly, useFormatCompact, useCurrency, useCurrencySymbol } from "@/lib/currency";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LabelList, Cell, ReferenceLine, ScatterChart, Scatter, ZAxis, ReferenceArea,
} from "recharts";
import { AlertTriangle, ArrowRight, ArrowUp, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { BuildingNavBar, BUILDINGS } from "@/components/dashboard/BuildingNavBar";
import { FloorPlan } from "@/components/building/FloorPlan";
import { LeaseDetailPanel } from "@/components/building/LeaseDetailPanel";
import { UnitTable } from "@/components/building/UnitTable";
import { Floor, unitsByFloor } from "@/components/building/data";
import { Badge } from "@/components/ui/badge";

const C = {
  teal: "hsl(var(--primary))",
  green: "hsl(var(--success))",
  amber: "hsl(var(--warning))",
  red: "hsl(var(--destructive))",
  neutral: "hsl(var(--muted-foreground))",
  blue: "#3b82f6",
};

interface KpiProps {
  label: string; value: string; sub: string; tone: string; onClick?: () => void; detail?: string;
}
function KpiTile({ label, value, sub, tone, onClick, detail }: KpiProps) {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "relative overflow-hidden p-5 transition-all hover:shadow-md",
        onClick && "cursor-pointer hover:-translate-y-0.5"
      )}
    >
      <div className="absolute inset-x-0 top-0 h-1" style={{ background: tone }} />
      <p className="text-xs font-medium text-muted-foreground mt-1">{label}</p>
      <p className="text-2xl font-display font-bold mt-1.5 tracking-tight">{value}</p>
      <p className="text-[11px] text-muted-foreground mt-1 leading-snug">{sub}</p>
      {detail && <p className="text-[11px] font-medium mt-1" style={{ color: tone }}>{detail}</p>}
    </Card>
  );
}

const expiryData = [
  { year: "2026", sqm: 255, color: C.red },
  { year: "2027", sqm: 850, color: C.amber },
  { year: "2028", sqm: 620, color: C.amber },
  { year: "2029", sqm: 340, color: C.teal },
  { year: "2030", sqm: 0, color: C.teal },
  { year: "2031+", sqm: 1800, color: C.teal },
];

const rentData = [
  { tenant: "Anchor – Fashion", value: 1_260_000, color: C.green },
  { tenant: "Sport Zone", value: 637_500, color: C.amber },
  { tenant: "Electronics Plus", value: 558_000, color: C.amber },
  { tenant: "Kids World", value: 272_000, color: C.green },
  { tenant: "Café Roma", value: 180_000, color: C.red },
  { tenant: "Jewellery Co", value: 112_500, color: C.red },
  { tenant: "Optika Centrum", value: 99_750, color: C.green },
];

const bubbleColor = (years: number) =>
  years < 1 ? "#ef4444" : years < 3 ? "#f59e0b" : "#22c55e";

const expiryRiskData = [
  { tenant: "Jewellery Co", years: 0.4, actualYears: 0.4, rent: 112_500, gla: 75 },
  { tenant: "Café Roma", years: 0.7, actualYears: 0.7, rent: 180_000, gla: 180 },
  { tenant: "Flower Boutique", years: 0.3, actualYears: 0.3, rent: 48_000, gla: 60 },
  { tenant: "Sport Zone", years: 1.9, actualYears: 1.9, rent: 637_500, gla: 850 },
  { tenant: "Electronics Plus", years: 2.3, actualYears: 2.3, rent: 558_000, gla: 620 },
  { tenant: "Coffee Corner", years: 1.5, actualYears: 1.5, rent: 96_000, gla: 120 },
  { tenant: "Mobile Tech", years: 1.2, actualYears: 1.2, rent: 180_000, gla: 200 },
  { tenant: "Kids World", years: 3.6, actualYears: 3.6, rent: 272_000, gla: 340 },
  { tenant: "Book Store", years: 3.2, actualYears: 3.2, rent: 320_000, gla: 400 },
  { tenant: "Home & Living", years: 4.1, actualYears: 4.1, rent: 450_000, gla: 550 },
  { tenant: "Optika Centrum", years: 4.8, actualYears: 4.8, rent: 99_750, gla: 95 },
  { tenant: "Anchor – Fashion", years: 6.1, actualYears: 6.1, rent: 1_260_000, gla: 1800 },
  { tenant: "Fashion Outlet", years: 5.4, actualYears: 5.4, rent: 840_000, gla: 1200 },
  { tenant: "Pharmacy Plus", years: 7.1, actualYears: 7.1, rent: 410_000, gla: 480 },
  { tenant: "Anchor – Grocery", years: 8.5, actualYears: 8.5, rent: 1_050_000, gla: 1600 },
  { tenant: "Flagship Electronics", years: 9.2, actualYears: 9.2, rent: 720_000, gla: 900 },
].map((d) => ({ ...d, color: bubbleColor(d.actualYears) }));

const alerts = [
  { tone: "red", tenant: "Café Roma", desc: "Break option notice window opens in", days: 38, source: "§8.2 p.24" },
  { tone: "red", tenant: "Jewellery Co", desc: "Bank guarantee expires in", days: 63, source: "§14.1 p.31" },
  { tone: "amber", tenant: "Sport Zone", desc: "Bank guarantee expires in", days: 187, source: "§12.3 p.29" },
  { tone: "amber", tenant: "Electronics Plus", desc: "Landlord break option exercisable in", days: 365, source: "§8.5 p.26" },
  { tone: "amber", tenant: "Kids World", desc: "Lease expiry in", days: 540, source: "§3.1 p.6" },
  { tone: "amber", tenant: "Optika Centrum", desc: "Indexation review in", days: 705, source: "§6.3 p.18" },
];

const financialRows = [
  { t: "Anchor – Fashion", gla: 1800, head: 1_260_000, perM2: 700, eff: 1_260_000, var: 0, nxt: "Jan 2026", w: 6.1 },
  { t: "Electronics Plus", gla: 620, head: 558_000, perM2: 900, eff: 558_000, var: 0, nxt: "Sep 2025", w: 2.3 },
  { t: "Café Roma", gla: 180, head: 180_000, perM2: 1000, eff: 162_000, var: -18_000, nxt: "Jan 2026", w: 0.7 },
  { t: "Optika Centrum", gla: 95, head: 99_750, perM2: 1050, eff: 99_750, var: 0, nxt: "Nov 2025", w: 4.8 },
  { t: "Sport Zone", gla: 850, head: 637_500, perM2: 750, eff: 637_500, var: 0, nxt: "Jan 2026", w: 1.9 },
  { t: "Kids World", gla: 340, head: 272_000, perM2: 800, eff: 272_000, var: 0, nxt: "Oct 2025", w: 3.6 },
  { t: "Jewellery Co", gla: 75, head: 112_500, perM2: 1500, eff: 112_500, var: 0, nxt: "Jan 2026", w: 0.4 },
];

const fmt = (n: number) => n.toLocaleString();

export default function Dashboard() {
  const navigate = useNavigate();
  const alertsRef = useRef<HTMLDivElement>(null);
  const fmtRent = useFormatRent();
  const fmtAM = useFormatAnnualMonthly();
  const fmtCompact = useFormatCompact();
  const { display } = useCurrency();
  const curSym = useCurrencySymbol();
  const { rate } = useCurrency();
  const convCur = (pln: number) => (display === "EUR" ? pln / rate : pln);
  const [leadMonths, setLeadMonths] = useState<number>(12);

  // Building drill-down state
  const [selectedBuilding, setSelectedBuilding] = useState<string>("galeria-orkana");
  const [floor, setFloor] = useState<Floor>("2");
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>("2-B1");
  const buildingSectionRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const liveBuilding = BUILDINGS.find((b) => b.id === selectedBuilding && b.live);
  const units = unitsByFloor[floor];
  const selectedUnit = units.find((u) => u.id === selectedUnitId) ?? null;
  const filteredUnits = selectedUnit ? units.filter((u) => u.id === selectedUnit.id) : units;

  const handleSelectBuilding = (id: string) => {
    setSelectedBuilding(id);
    // Auto-scroll to the building detail section
    setTimeout(() => {
      buildingSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  };

  const handleSelectTenantFromChart = (tenantName: string) => {
    const match = units.find((u) => u.tenant === tenantName);
    if (match) {
      setSelectedUnitId(match.id);
      setTimeout(() => {
        buildingSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 60);
    }
  };

  const visibleAlerts = useMemo(
    () => alerts.filter((a) => a.days <= leadMonths * 30),
    [leadMonths]
  );

  // GRI / NOI in PLN
  const griPln = 11_680_000;
  const noiPln = 8_410_000;
  const griFmt = fmtRent(griPln, { compact: true });
  const griMonthly = fmtRent(griPln / 12, { compact: true });
  const noiFmt = fmtRent(noiPln, { compact: true });
  const noiMonthly = fmtRent(noiPln / 12, { compact: true });

  return (
    <div className="py-8 lg:py-12">
      <div className="container space-y-8" ref={topRef}>
        <div style={{ animation: "fade-up 0.5s ease-out forwards" }}>
          <h1 className="text-3xl font-display font-bold">Portfolio Dashboard</h1>
          <p className="text-muted-foreground mt-1">Portfolio financial summary and lease risk overview.</p>
        </div>

        {/* Building navigation bar */}
        <BuildingNavBar selectedId={selectedBuilding} onSelect={handleSelectBuilding} />

        {/* Portfolio scope notice */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="text-[11px] font-medium">
            Portfolio-level KPIs
          </Badge>
          <span className="text-xs text-muted-foreground">
            Reflects 1 of 5 properties (Galeria Orkana) — additional properties pending integration.
          </span>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <KpiTile label="WAULT" value="4.2 yrs" sub="Weighted avg unexpired lease term" tone={C.teal} />
          <KpiTile label="Current NOI Yield" value="6.3%" sub="NOI at PLN 134.5M asset value" tone={C.teal} />
          <KpiTile
            label="GRI"
            value={griFmt.primary}
            sub={griFmt.secondary}
            detail={`${griMonthly.primary}/mo · Base + turnover + SC`}
            tone={C.green}
          />
          <KpiTile
            label="NOI"
            value={noiFmt.primary}
            sub={noiFmt.secondary}
            detail={`${noiMonthly.primary}/mo · 72.0% NOI margin`}
            tone={C.blue}
          />
          <KpiTile label="Occupied GLA" value="93.2%" sub="17,200 of 18,450 sqm" tone={C.green} />
        </div>

        {/* Charts row 1 */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-5">
            <h3 className="text-base font-display font-semibold mb-4">Lease Expiry by Year (sqm)</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={expiryData} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip cursor={{ fill: "hsl(var(--muted))" }} formatter={(v: number) => [`${v} sqm`, "Expiring"]} />
                <Bar dataKey="sqm" radius={[6, 6, 0, 0]}>
                  {expiryData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  <LabelList dataKey="sqm" position="top" style={{ fontSize: 11, fill: "hsl(var(--foreground))" }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-5">
            <h3 className="text-base font-display font-semibold mb-1">
              Annual Rent by Tenant ({display})
            </h3>
            <p className="text-xs text-muted-foreground mb-3">Hover for monthly equivalent.</p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={rentData} layout="vertical" margin={{ top: 5, right: 60, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => fmtCompact(v)} />
                <YAxis dataKey="tenant" type="category" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" width={110} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload as { tenant: string; value: number };
                    const a = fmtAM(d.value);
                    return (
                      <div className="rounded-md border bg-background px-3 py-2 text-xs shadow-md">
                        <div className="font-semibold mb-1">{d.tenant}</div>
                        <div>{a.primary}</div>
                        <div className="text-muted-foreground">{a.secondary}</div>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {rentData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  <LabelList dataKey="value" position="right" formatter={(v: number) => fmtCompact(v)} style={{ fontSize: 10, fill: "hsl(var(--foreground))" }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* WAULT + Alerts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-5">
            <h3 className="text-base font-display font-semibold">Tenant Expiry Risk Matrix (0–10 Years)</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Bubble size = GLA. Position = years until lease expiry vs annual rent.
            </p>
            <ResponsiveContainer width="100%" height={320}>
              <ScatterChart margin={{ top: 16, right: 30, left: 10, bottom: 28 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  type="number"
                  dataKey="years"
                  name="WAULT"
                  domain={[0, 10]}
                  ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                  tick={{ fontSize: 11 }}
                  stroke="hsl(var(--muted-foreground))"
                  label={{ value: "Years Remaining", position: "insideBottom", offset: -12, style: { fontSize: 11, fill: "hsl(var(--muted-foreground))" } }}
                />
                <YAxis
                  type="number"
                  dataKey="rent"
                  name="Annual Rent"
                  tick={{ fontSize: 10 }}
                  stroke="hsl(var(--muted-foreground))"
                  tickFormatter={(v) => fmtCompact(v)}
                  label={{ value: `Annual Rent (${display})`, angle: -90, position: "insideLeft", style: { fontSize: 11, fill: "hsl(var(--muted-foreground))", textAnchor: "middle" } }}
                />
                <ZAxis type="number" dataKey="gla" domain={[50, 2000]} range={[60, 1600]} name="GLA" />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload as typeof expiryRiskData[number];
                    const waultLabel = `${d.actualYears} yrs`;
                    const tier = d.actualYears < 1 ? "Critical" : d.actualYears < 3 ? "Watch" : "Stable";
                    const am = fmtAM(d.rent);
                    return (
                      <div className="rounded-md border bg-background px-3 py-2 text-xs shadow-md">
                        <div className="font-semibold mb-1">{d.tenant}</div>
                        <div>WAULT: {waultLabel}</div>
                        <div>{am.primary}</div>
                        <div className="text-muted-foreground">{am.secondary}</div>
                        <div>GLA: {d.gla.toLocaleString()} m²</div>
                        <div>Risk tier: {tier}</div>
                      </div>
                    );
                  }}
                />
                <ReferenceArea x1={0} x2={1} fill="#ef4444" fillOpacity={0.08} />
                <ReferenceArea x1={1} x2={3} fill="#f59e0b" fillOpacity={0.08} />
                <ReferenceArea x1={3} x2={10} fill="#22c55e" fillOpacity={0.08} />
                <ReferenceLine
                  x={1}
                  stroke="#ef4444"
                  strokeDasharray="4 4"
                  label={{ value: "Critical", position: "top", fill: "#ef4444", fontSize: 10 }}
                />
                <ReferenceLine
                  x={3}
                  stroke="#f59e0b"
                  strokeDasharray="4 4"
                  label={{ value: "Watch", position: "top", fill: "#f59e0b", fontSize: 10 }}
                />
                <Scatter data={expiryRiskData}>
                  {expiryRiskData.map((d, i) => (
                    <Cell key={i} fill={d.color} fillOpacity={0.7} stroke={d.color} />
                  ))}
                  <LabelList
                    dataKey="tenant"
                    position="right"
                    offset={10}
                    style={{ fontSize: 11, fill: "hsl(var(--foreground))" }}
                  />
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </Card>

          <div ref={alertsRef} className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-base font-display font-semibold">Alerts Requiring Attention</h3>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-muted-foreground">Lead time</span>
                <Select value={String(leadMonths)} onValueChange={(v) => setLeadMonths(Number(v))}>
                  <SelectTrigger className="h-8 w-[110px] text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6 months</SelectItem>
                    <SelectItem value="12">12 months</SelectItem>
                    <SelectItem value="18">18 months</SelectItem>
                    <SelectItem value="24">24 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {visibleAlerts.length === 0 && (
              <Card className="p-4 text-xs text-muted-foreground">
                No alerts within the next {leadMonths} months.
              </Card>
            )}
            {visibleAlerts.map((a, i) => {
              const isRed = a.tone === "red";
              return (
                <Card
                  key={i}
                  onClick={() => navigate("/lease-review")}
                  className={cn(
                    "p-4 cursor-pointer transition-all hover:shadow-md border-l-4",
                    isRed ? "border-l-destructive" : "border-l-warning"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle className={cn("h-4 w-4 mt-0.5", isRed ? "text-destructive" : "text-warning")} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn(
                          "text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded",
                          isRed ? "bg-destructive/15 text-destructive" : "bg-warning/15 text-warning",
                        )}>
                          {isRed ? "Critical" : "Watch"}
                        </span>
                        <span className="font-semibold text-sm">{a.tenant}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {a.desc} <span className={cn("font-semibold", isRed ? "text-destructive" : "text-warning")}>{a.days} days</span>
                      </p>
                      <a href="#" onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1 text-xs text-primary font-medium mt-1.5 hover:underline">
                        Source: {a.source} <ArrowRight className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Financial Summary */}
        <div className="space-y-4">
          <h3 className="text-base font-display font-semibold">Financial Summary</h3>
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-muted/60">
                   <tr className="text-left">
                     {["Tenant", "GLA (sqm)", `Headline Rent (${curSym}/yr)`, `Rent/m² (${curSym})`, `Effective Rent (${curSym}/yr)`, `Variance (${curSym})`, "Next Indexation", "WAULT"].map((h) => (
                       <th key={h} className="px-3 py-2.5 font-semibold border-b whitespace-nowrap">{h}</th>
                     ))}
                   </tr>
                </thead>
                <tbody>
                  {financialRows.map((r, i) => (
                     <tr key={r.t} className={cn(i % 2 === 1 ? "bg-muted/20" : "bg-card", "border-b")}>
                       <td className="px-3 py-2 font-medium">{r.t}</td>
                       <td className="px-3 py-2 font-mono">{fmt(r.gla)}</td>
                       <td className="px-3 py-2 font-mono">{fmt(convCur(r.head))}</td>
                       <td className="px-3 py-2 font-mono">{fmt(convCur(r.perM2))}</td>
                       <td className="px-3 py-2 font-mono">{fmt(convCur(r.eff))}</td>
                       <td className={cn("px-3 py-2 font-mono", r.var < 0 && "text-destructive font-semibold")}>
                         {r.var === 0 ? "—" : (
                           <span className="inline-flex items-center gap-1">
                             <AlertTriangle className="h-3 w-3" /> {fmt(convCur(r.var))}
                           </span>
                         )}
                       </td>
                      <td className="px-3 py-2">{r.nxt}</td>
                      <td className="px-3 py-2 font-mono">{r.w}</td>
                    </tr>
                  ))}
                   <tr className="bg-muted/60 font-semibold border-t-2">
                     <td className="px-3 py-2.5">Total</td>
                     <td className="px-3 py-2.5 font-mono">3,960</td>
                     <td className="px-3 py-2.5 font-mono">{fmt(convCur(3_119_750))}</td>
                     <td className="px-3 py-2.5 font-mono">{fmt(convCur(788))}</td>
                     <td className="px-3 py-2.5 font-mono">{fmt(convCur(3_101_750))}</td>
                     <td className="px-3 py-2.5 font-mono text-destructive">{fmt(convCur(-18_000))}</td>
                     <td className="px-3 py-2.5">—</td>
                     <td className="px-3 py-2.5 font-mono">4.2</td>
                   </tr>
                </tbody>
              </table>
            </div>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-4 border-l-4 border-l-primary">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">Current NOI Yield</p>
              <p className="text-sm">6.3% — NOI at assumed asset value of PLN 134.5M</p>
            </Card>
            <Card className="p-4 border-l-4 border-l-primary">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">Identified Leakage</p>
              <p className="text-sm">PLN 18,000/yr — Café Roma effective rent below headline (Annex 2 rent-free)</p>
            </Card>
          </div>

          <p className="text-right text-[11px] text-muted-foreground">
            Data extracted: 22 May 2026 · LeaseOS Demo Mode
          </p>
        </div>
      </div>
    </div>
  );
}
