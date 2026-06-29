import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LabelList, Cell, ReferenceLine, ScatterChart, Scatter, ZAxis, ReferenceArea,
} from "recharts";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const C = {
  teal: "hsl(var(--primary))",
  green: "hsl(var(--success))",
  amber: "hsl(var(--warning))",
  red: "hsl(var(--destructive))",
  neutral: "hsl(var(--muted-foreground))",
};

interface KpiProps {
  label: string; value: string; sub: string; tone: string; onClick?: () => void;
}
function KpiTile({ label, value, sub, tone, onClick }: KpiProps) {
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
  years < 1.5 ? "#ef4444" : years < 3 ? "#f59e0b" : "#22c55e";

const expiryRiskData = [
  { tenant: "Anchor – Fashion", years: 6.1, rent: 1_260_000, gla: 1800 },
  { tenant: "Optika Centrum", years: 4.8, rent: 99_750, gla: 95 },
  { tenant: "Kids World", years: 3.6, rent: 272_000, gla: 340 },
  { tenant: "Electronics Plus", years: 2.3, rent: 558_000, gla: 620 },
  { tenant: "Sport Zone", years: 1.9, rent: 637_500, gla: 850 },
  { tenant: "Café Roma", years: 0.7, rent: 180_000, gla: 180 },
  { tenant: "Jewellery Co", years: 0.4, rent: 112_500, gla: 75 },
].map((d) => ({ ...d, color: bubbleColor(d.years) }));

const alerts = [
  { tone: "red", tenant: "Café Roma", desc: "Break option notice window opens in", days: 38, source: "§8.2 p.24" },
  { tone: "red", tenant: "Jewellery Co", desc: "Bank guarantee expires in", days: 63, source: "§14.1 p.31" },
  { tone: "amber", tenant: "Sport Zone", desc: "Bank guarantee expires in", days: 187, source: "§12.3 p.29" },
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
  const financialRef = useRef<HTMLDivElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLDivElement>) =>
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="py-8 lg:py-12">
      <div className="container space-y-8">
        <div style={{ animation: "fade-up 0.5s ease-out forwards" }}>
          <h1 className="text-3xl font-display font-bold">Portfolio Dashboard</h1>
          <p className="text-muted-foreground mt-1">Portfolio financial summary and lease risk overview.</p>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <KpiTile label="Portfolio WAULT" value="4.2 yrs" sub="Weighted avg unexpired lease term" tone={C.teal} />
          <KpiTile label="Gross Yield" value="6.2%" sub="Headline rent at PLN 134.5M asset value" tone={C.teal} />
          <KpiTile label="Annual Rent" value="PLN 8.34M" sub="7 active leases" tone={C.neutral} />
          <KpiTile label="Occupied GLA" value="93.2%" sub="17,200 of 18,450 sqm" tone={C.green} />
          <KpiTile label="Active Alerts" value="3" sub="Requires attention" tone={C.amber} onClick={() => scrollTo(alertsRef)} />
          <KpiTile label="Guarantees at Risk" value="2" sub="Expiring within 90 days" tone={C.red} onClick={() => scrollTo(financialRef)} />
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
            <h3 className="text-base font-display font-semibold mb-4">Annual Rent by Tenant (PLN)</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={rentData} layout="vertical" margin={{ top: 5, right: 60, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} />
                <YAxis dataKey="tenant" type="category" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" width={110} />
                <Tooltip formatter={(v: number) => [`PLN ${v.toLocaleString()}`, "Annual"]} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {rentData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  <LabelList dataKey="value" position="right" formatter={(v: number) => v.toLocaleString()} style={{ fontSize: 10, fill: "hsl(var(--foreground))" }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* WAULT + Alerts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-5">
            <h3 className="text-base font-display font-semibold">Tenant Expiry Risk Matrix</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Bubble size = GLA. Tenants in the red zone require immediate action.
            </p>
            <ResponsiveContainer width="100%" height={320}>
              <ScatterChart margin={{ top: 16, right: 30, left: 10, bottom: 28 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  type="number"
                  dataKey="years"
                  name="WAULT"
                  domain={[0, 8]}
                  ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8]}
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
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                  label={{ value: "Annual Rent (PLN)", angle: -90, position: "insideLeft", style: { fontSize: 11, fill: "hsl(var(--muted-foreground))", textAnchor: "middle" } }}
                />
                <ZAxis type="number" dataKey="gla" range={[200, 2400]} name="GLA" />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload as typeof expiryRiskData[number];
                    return (
                      <div className="rounded-md border bg-background px-3 py-2 text-xs shadow-md">
                        <div className="font-semibold mb-1">{d.tenant}</div>
                        <div>WAULT: {d.years} yrs</div>
                        <div>Annual Rent: PLN {d.rent.toLocaleString()}</div>
                        <div>GLA: {d.gla.toLocaleString()} m²</div>
                      </div>
                    );
                  }}
                />
                <ReferenceArea x1={0} x2={1} fill="#ef4444" fillOpacity={0.08} />
                <ReferenceLine
                  x={1}
                  stroke="#ef4444"
                  strokeDasharray="4 4"
                  label={{ value: "Critical", position: "top", fill: "#ef4444", fontSize: 10 }}
                />
                <ReferenceLine
                  x={2.5}
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
                    style={{ fontSize: 10, fill: "hsl(var(--foreground))" }}
                  />
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </Card>

          <div ref={alertsRef} className="space-y-3">
            <h3 className="text-base font-display font-semibold">Alerts Requiring Attention</h3>
            {alerts.map((a, i) => {
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
        <div ref={financialRef} className="space-y-4">
          <h3 className="text-base font-display font-semibold">Financial Summary</h3>
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-muted/60">
                  <tr className="text-left">
                    {["Tenant", "GLA (sqm)", "Headline Rent (PLN/yr)", "Rent/m²", "Effective Rent (PLN/yr)", "Variance", "Next Indexation", "WAULT"].map((h) => (
                      <th key={h} className="px-3 py-2.5 font-semibold border-b whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {financialRows.map((r, i) => (
                    <tr key={r.t} className={cn(i % 2 === 1 ? "bg-muted/20" : "bg-card", "border-b")}>
                      <td className="px-3 py-2 font-medium">{r.t}</td>
                      <td className="px-3 py-2 font-mono">{fmt(r.gla)}</td>
                      <td className="px-3 py-2 font-mono">{fmt(r.head)}</td>
                      <td className="px-3 py-2 font-mono">{fmt(r.perM2)}</td>
                      <td className="px-3 py-2 font-mono">{fmt(r.eff)}</td>
                      <td className={cn("px-3 py-2 font-mono", r.var < 0 && "text-destructive font-semibold")}>
                        {r.var === 0 ? "—" : (
                          <span className="inline-flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" /> {r.var.toLocaleString()}
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
                    <td className="px-3 py-2.5 font-mono">3,119,750</td>
                    <td className="px-3 py-2.5 font-mono">788</td>
                    <td className="px-3 py-2.5 font-mono">3,101,750</td>
                    <td className="px-3 py-2.5 font-mono text-destructive">-18,000</td>
                    <td className="px-3 py-2.5">—</td>
                    <td className="px-3 py-2.5 font-mono">4.2</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-4 border-l-4 border-l-primary">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">Gross Yield</p>
              <p className="text-sm">6.2% — headline rent at assumed asset value of PLN 134.5M</p>
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
