import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { FileText, ArrowRight, Download, Settings2, ChevronDown } from "lucide-react";

type PillTone = "green" | "amber" | "red" | "grey" | "purple";

const pillClasses: Record<PillTone, string> = {
  green: "bg-success/15 text-success",
  amber: "bg-warning/15 text-warning",
  red: "bg-destructive/15 text-destructive",
  grey: "bg-muted text-muted-foreground",
  purple: "bg-accent/15 text-accent",
};

function Pill({ tone, children }: { tone: PillTone; children: React.ReactNode }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap", pillClasses[tone])}>
      {children}
    </span>
  );
}

type RowTone = "red" | "amber" | "green";
type Cell = { tone: PillTone; text: string };
interface RiskRow {
  border: RowTone;
  emoji: string;
  name: string;
  sc: Cell;
  brk: Cell;
  idx: Cell;
  docs: Cell;
  amd: Cell;
  grt: Cell;
  score: string;
  scoreTone: RowTone;
}

const riskRows: RiskRow[] = [
  { border: "red", emoji: "🔴", name: "Kraków – Galeria Bronowice",
    sc: { tone: "red", text: "23% vs 8% cap" }, brk: { tone: "amber", text: "Closing Jul '26" },
    idx: { tone: "red", text: "+4.2% drift" }, docs: { tone: "red", text: "Missing POA" },
    amd: { tone: "red", text: "Conflict §6 vs Amdt 2" },
    grt: { tone: "amber", text: "Exp. Sep 2026" }, score: "9/10", scoreTone: "red" },
  { border: "red", emoji: "🔴", name: "Warszawa – Westfield Mokotów",
    sc: { tone: "purple", text: "No cap clause" }, brk: { tone: "green", text: "Opens Oct '26" },
    idx: { tone: "amber", text: "HICP vs CPI" }, docs: { tone: "green", text: "Complete" },
    amd: { tone: "red", text: "Cap removed Amdt 3" },
    grt: { tone: "red", text: "Expired" }, score: "8/10", scoreTone: "red" },
  { border: "amber", emoji: "🟡", name: "Gdańsk – Forum Gdańsk",
    sc: { tone: "amber", text: "12% cap" }, brk: { tone: "green", text: "Open now" },
    idx: { tone: "green", text: "Normal" }, docs: { tone: "green", text: "Complete" },
    amd: { tone: "green", text: "Reconciled" },
    grt: { tone: "green", text: "Valid 2028" }, score: "6/10", scoreTone: "amber" },
  { border: "amber", emoji: "🟡", name: "Wrocław – Magnolia Park",
    sc: { tone: "green", text: "8% cap" }, brk: { tone: "grey", text: "No break" },
    idx: { tone: "amber", text: "2.1% drift" }, docs: { tone: "amber", text: "Missing annex" },
    amd: { tone: "amber", text: "Amdt 4 unlinked" },
    grt: { tone: "green", text: "Valid 2027" }, score: "6/10", scoreTone: "amber" },
  { border: "green", emoji: "🟢", name: "Poznań – Galeria Malta",
    sc: { tone: "green", text: "7% cap" }, brk: { tone: "green", text: "Mar 2027" },
    idx: { tone: "green", text: "Normal" }, docs: { tone: "green", text: "Complete" },
    amd: { tone: "green", text: "Reconciled" },
    grt: { tone: "green", text: "Valid 2028" }, score: "2/10", scoreTone: "green" },
];

const borderTone: Record<RowTone, string> = {
  red: "border-l-destructive",
  amber: "border-l-warning",
  green: "border-l-success",
};
const textTone: Record<RowTone, string> = {
  red: "text-destructive",
  amber: "text-warning",
  green: "text-success",
};

type BarTone = "red" | "amber" | "green" | "purple";
const barBg: Record<BarTone, string> = {
  red: "bg-destructive",
  amber: "bg-warning",
  green: "bg-primary",
  purple: "bg-accent",
};

const scBars: { name: string; width: number; tone: BarTone; label: string }[] = [
  { name: "Kraków – Galeria", width: 76, tone: "red", label: "23%" },
  { name: "Warszawa – Westfield", width: 58, tone: "purple", label: "No cap" },
  { name: "Gdańsk – Forum", width: 46, tone: "amber", label: "12%" },
  { name: "Wrocław – Magnolia", width: 30, tone: "green", label: "8%" },
  { name: "Łódź – Manufaktura", width: 26, tone: "green", label: "7%" },
  { name: "Poznań – Malta", width: 22, tone: "green", label: "6%" },
];

type GanttSeg = { from: number; to: number; tone: "green" | "amber" | "grey"; label: string };
const ganttRows: { name: string; segs: GanttSeg[] }[] = [
  { name: "Gdańsk – Forum", segs: [
    { from: 0, to: 25, tone: "green", label: "OPEN" },
    { from: 25, to: 100, tone: "grey", label: "locked after Jul 15" },
  ]},
  { name: "Kraków – Galeria", segs: [
    { from: 0, to: 19, tone: "amber", label: "⚠ 45 days" },
    { from: 19, to: 100, tone: "grey", label: "locked until 2029" },
  ]},
  { name: "Warszawa – Westfield", segs: [
    { from: 0, to: 50, tone: "grey", label: "locked until Oct" },
    { from: 50, to: 88, tone: "green", label: "OPEN" },
  ]},
  { name: "Katowice – Silesia", segs: [
    { from: 0, to: 87, tone: "grey", label: "locked" },
    { from: 87, to: 100, tone: "green", label: "Jan" },
  ]},
  { name: "Poznań – Malta", segs: [
    { from: 0, to: 100, tone: "grey", label: "no break option in period" },
  ]},
];

const segBg: Record<GanttSeg["tone"], string> = {
  green: "bg-success/80 text-success-foreground",
  amber: "bg-warning/80 text-warning-foreground",
  grey: "bg-muted text-muted-foreground",
};

type AnomalyTone = "red" | "amber" | "purple" | "blue";
interface Anomaly {
  tone: AnomalyTone;
  store: string;
  type: string;
  desc: string;
  source: string;
  recovery?: string;
  exposure?: string;
  effective?: { label: string; value: string; valueTone: "amber" | "red" };
  note?: string;
}

interface AnomalySection {
  id: string;
  title: string;
  count: number;
  rightLabel?: string;
  rightTone?: "red" | "amber";
  defaultOpen: boolean;
  items: Anomaly[];
}

const anomalySections: AnomalySection[] = [
  {
    id: "financial",
    title: "💰 Financial Recovery",
    count: 4,
    rightLabel: "PLN 751,000 at risk",
    rightTone: "red",
    defaultOpen: true,
    items: [
      { tone: "red", store: "Kraków – Galeria Bronowice", type: "⚠ Service Charge Cap Breach",
        desc: "Landlord invoiced 23% increase. Lease cap is 8% per annum. Excess: PLN 184,000 this year.",
        source: "→ §12.4 — Base Lease, p. 23, Annex B", recovery: "Recoverable: PLN 184,000" },
      { tone: "red", store: "Kraków – Galeria Bronowice", type: "⚠ Amendment Conflict — Effective Terms Unclear",
        desc: "Base lease §6.1 sets cap at 8%. Amendment 2 §3.4 introduces a contradictory calculation basis. Current obligation is legally ambiguous.",
        effective: { label: "Current effective term:", value: "Disputed — requires legal review", valueTone: "amber" },
        source: "→ §6.1 Base Lease p.14 conflicts with Amendment 2 §3.4 p.6",
        exposure: "Dispute exposure: PLN 210,000" },
      { tone: "red", store: "Warszawa – Westfield Mokotów", type: "⚠ No Enforceable Cap Clause",
        desc: "Amendment 3 removed the cap reference. Ambiguous drafting — requires legal review before next service charge reconciliation.",
        source: "→ Amendment 3, §6.1", exposure: "Exposure: PLN 290,000/yr" },
      { tone: "amber", store: "Wrocław – Magnolia Park", type: "📊 Indexation Drift — HICP vs CPI",
        desc: "CPI applied at 6.3%. Contractual index is HICP. Cumulative difference over 3 years = PLN 67,000.",
        source: "→ §9.1 — Indexation clause", recovery: "Recoverable: PLN 67,000" },
    ],
  },
  {
    id: "deadline",
    title: "⏰ Deadline — Action Required",
    count: 2,
    rightLabel: "45 days or less",
    rightTone: "amber",
    defaultOpen: true,
    items: [
      { tone: "amber", store: "Gdańsk – Forum Gdańsk", type: "⏰ Break Option Closing in 45 Days",
        desc: "Exercise window closes 15 Jul 2026. Notice period is 90 days. Serve notice by 15 Jul or locked until 2029.",
        source: "→ §18.2 — Base Lease, p. 31" },
      { tone: "amber", store: "Kraków – Galeria Bronowice", type: "⏰ Guarantee Renewal — Expires Sep 2026",
        desc: "Bank guarantee expires September 2026 — before lease end. Renewal must be initiated now to avoid contractual breach.",
        source: "→ §14.1 — Base Lease, p. 38" },
    ],
  },
  {
    id: "legal",
    title: "⚖️ Legal & Document",
    count: 3,
    defaultOpen: false,
    items: [
      { tone: "blue", store: "Kraków – Galeria Bronowice", type: "📄 Missing Power of Attorney",
        desc: "Amendment 2 signed without documented authority. Signatory not listed in KRS extract. Legal validity uncertain.",
        source: "→ Amendment 2, signature block" },
      { tone: "blue", store: "Warszawa – Westfield Mokotów", type: "📋 Bank Guarantee Expired",
        desc: "Guarantee of PLN 450,000 expired Jan 2026. Landlord has not been notified. Contractual obligation unmet.",
        source: "→ §22.1 — Base Lease, p. 44" },
      { tone: "amber", store: "Wrocław – Magnolia Park", type: "📎 Missing Annex",
        desc: "Annex 4 (service charge schedule) referenced in §12.1 but not present in document set. Current reconciliation basis uncertain.",
        source: "→ §12.1 — Base Lease, p. 19" },
    ],
  },
  {
    id: "governance",
    title: "🔍 Governance & Patterns",
    count: 2,
    defaultOpen: false,
    items: [
      { tone: "red", store: "Warszawa – Westfield Mokotów", type: "🔍 Related-Party Pattern Detected",
        desc: "Lease term is 12 years — 4.1 years above portfolio average of 7.9 years. Lessor entity shares a registered address with a former company director.",
        effective: { label: "Lease term vs portfolio avg:", value: "12 yrs vs 7.9 yrs avg (+51%)", valueTone: "red" },
        source: "→ §2.1 Lease Term — KRS registry cross-reference",
        note: "Flagged for governance review" },
      { tone: "amber", store: "Katowice – Silesia City Center", type: "📉 Underperformance vs Feasibility",
        desc: "Store turnover is 31% below feasibility model. Rent renegotiation clause may be triggered — check §11.3.",
        source: "→ §11.3 — Turnover schedule" },
    ],
  },
];

function AnomalyLegend() {
  const items: { color: string; text: string }[] = [
    { color: "#dc2626", text: "Critical — immediate action required" },
    { color: "#d97706", text: "Warning — review within 30 days" },
    { color: "#2563eb", text: "Informational — monitor" },
  ];
  return (
    <Card className="px-4 py-2.5">
      <div className="flex items-center gap-6 flex-wrap text-[11px] text-muted-foreground">
        {items.map((i) => (
          <span key={i.text} className="inline-flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: i.color }} />
            {i.text}
          </span>
        ))}
      </div>
    </Card>
  );
}

function AnomalyGroup({ section }: { section: AnomalySection }) {
  const [open, setOpen] = useState(section.defaultOpen);
  return (
    <Card className="overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-muted/40 hover:bg-muted/60 transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-bold text-foreground">{section.title}</span>
          <span className="text-[11px] text-muted-foreground">({section.count})</span>
        </div>
        <div className="flex items-center gap-3">
          {section.rightLabel && (
            <span className={cn("text-[11px] font-semibold", section.rightTone === "red" ? "text-destructive" : "text-warning")}>
              {section.rightLabel}
            </span>
          )}
          <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", open ? "rotate-0" : "-rotate-90")} />
        </div>
      </button>
      {open && (
        <div className="p-4 space-y-3 border-t">
          {section.items.map((a, i) => (
            <Card key={i} className={cn("p-4 border-l-4", anomalyBorder[a.tone])}>
              <div className="space-y-1.5">
                <p className="font-semibold text-sm text-foreground">{a.store}</p>
                <p className={cn("text-xs font-bold", anomalyText[a.tone])}>{a.type}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{a.desc}</p>
                {a.effective && (
                  <p className="text-[11px] text-muted-foreground">
                    {a.effective.label}{" "}
                    <span className={cn("font-bold", a.effective.valueTone === "amber" ? "text-warning" : "text-destructive")}>
                      {a.effective.value}
                    </span>
                  </p>
                )}
                <p className="text-[11px] italic text-primary">{a.source}</p>
                {a.recovery && <p className="text-xs font-bold text-success">{a.recovery}</p>}
                {a.exposure && <p className="text-xs font-bold text-destructive">{a.exposure}</p>}
                {a.note && <p className="text-[11px] italic text-muted-foreground">{a.note}</p>}
              </div>
            </Card>
          ))}
        </div>
      )}
    </Card>
  );
}

const anomalyBorder: Record<AnomalyTone, string> = {
  red: "border-l-destructive",
  amber: "border-l-warning",
  purple: "border-l-accent",
  blue: "border-l-[hsl(var(--chart-5))]",
};
const anomalyText: Record<AnomalyTone, string> = {
  red: "text-destructive",
  amber: "text-warning",
  purple: "text-accent",
  blue: "text-[hsl(var(--chart-5))]",
};

function SummaryItem({ label, value, sub, tone }: { label: string; value: string; sub?: string; tone?: "teal" | "red" | "amber" }) {
  const cls = tone === "red" ? "text-destructive" : tone === "amber" ? "text-warning" : tone === "teal" ? "text-primary" : "text-foreground";
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className={cn("text-xl font-display font-bold tracking-tight", cls)}>{value}</span>
      {sub && <span className="text-xs text-muted-foreground">{sub}</span>}
    </div>
  );
}

export default function TenantIntelligence() {
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState<null | { header: string; body: string; source?: string; recovery?: string; bodyMuted?: boolean }>(null);

  const runQuery = (q: string) => {
    const s = q.toLowerCase().trim();
    if (!s) { setAnswer(null); return; }
    if (s.includes("no service charge cap") || s.includes("no cap") || s.includes("above cap")) {
      setAnswer({
        header: "3 locations have no enforceable service charge cap",
        body: "Warszawa – Westfield Mokotów: cap clause removed in Amendment 3. Gdańsk – Forum Gdańsk: cap exists at 12% but base calculation is ambiguous. Kraków – Galeria Bronowice: cap of 8% exists but contradicted by Amendment 2.",
        source: "→ Sources: Amendment 3 §6.1 · Base Lease §12.4 · Amendment 2 §3.4",
        recovery: "Combined exposure: PLN 684,000/yr",
      });
    } else if (s.includes("break option")) {
      setAnswer({
        header: "2 break option windows closing within 90 days",
        body: "Gdańsk – Forum Gdańsk: window open now, closes 15 Jul 2026 — 43 days remaining. Notice period 90 days — serve notice immediately. Kraków – Galeria Bronowice: 45 days to serve notice or locked until 2029.",
        source: "→ §18.2 Base Lease p.31 (Gdańsk) · §14.1 Base Lease p.28 (Kraków)",
      });
    } else if (s.includes("indexation") || s.includes("hicp") || s.includes("cpi")) {
      setAnswer({
        header: "2 locations with indexation anomalies — cumulative exposure PLN 134,000",
        body: "Wrocław – Magnolia Park: CPI applied at 6.3%, contractual index is HICP. Cumulative drift over 3 years = PLN 67,000. Katowice – Silesia City Center: indexation review date missed Sep 2025 — no adjustment applied. Estimated under-recovery: PLN 67,000.",
        source: "→ §9.1 Indexation clause (Wrocław) · §9.1 Indexation clause (Katowice)",
        recovery: "Recoverable: PLN 134,000",
      });
    } else if (s.includes("bank guarantee") || s.includes("missing bank guarantees") || s.includes("guarantee expired") || s.includes("guarantee")) {
      setAnswer({
        header: "2 locations have expired or at-risk bank guarantees",
        body: "Warszawa – Westfield Mokotów: guarantee of PLN 450,000 expired January 2026. Landlord has not been notified. Contractual obligation is unmet — this creates a potential default position. Kraków – Galeria Bronowice: guarantee of PLN 54,000 expires September 2026, before lease end date of June 2027. Renewal has not been initiated. Lease requires renewal no later than 30 days prior to expiry.",
        source: "→ §22.1 — Base Lease, p. 44 (Warszawa) · §14.1 — Base Lease, p. 38 (Kraków)",
        recovery: "Combined guarantee exposure: PLN 504,000",
      });
    } else {
      setAnswer({
        header: "Searching your portfolio...",
        body: "This query requires live lease data. Connect your lease documents to enable full natural language search across all 104 locations.",
        bodyMuted: true,
      });
    }
  };

  return (
    <div className="py-8 lg:py-12">
      <div className="container space-y-8">
        {/* Header */}
        <div style={{ animation: "fade-up 0.5s ease-out forwards" }}>
          <h1 className="text-3xl font-display font-bold">Tenant Intelligence Centre</h1>
          <p className="text-muted-foreground mt-1">Portfolio-wide lease risk monitoring across all store locations.</p>
        </div>

        {/* Zone 1: Summary Strip */}
        <Card className="glass">
          <div className="px-6 py-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <SummaryItem label="Locations" value="104" sub="across 6 countries" />
            <SummaryItem label="Total Rent/yr" value="PLN 47.2M" sub="avg PLN 453k per location" />
            <SummaryItem label="Portfolio WAULT" value="3.8 yrs" tone="teal" />
            <SummaryItem label="Service Charge Excess" value="PLN 1.34M" sub="vs cap provisions" tone="red" />
            <SummaryItem label="Break Options Open" value="9" sub="next 6 months" tone="amber" />
            <SummaryItem label="Anomalies Detected" value="23" sub="9 critical" tone="red" />
          </div>
        </Card>

        {/* Zone 2: Risk Matrix */}
        <div className="space-y-4">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-lg font-display font-bold">Lease Risk Matrix — All Locations</h2>
              <p className="text-sm text-muted-foreground">Sorted by risk score</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10 hover:text-primary">
                <Download className="h-4 w-4" /> Export Evidence Pack
              </Button>
              <Button variant="outline" size="sm" onClick={() => setColumnsOpen(true)}>
                <Settings2 className="h-4 w-4" /> Customise Columns
              </Button>
            </div>
          </div>
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-muted/60">
                  <tr className="text-left">
                    {["Location", "Service Charge Cap", "Break Option", "Indexation", "Documents", "Amendment Chain", "Guarantee", "Risk Score"].map((h) => (
                      <th key={h} className="px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground border-b whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {riskRows.map((r) => (
                    <tr key={r.name}
                      className={cn("border-b cursor-pointer hover:bg-muted/30 transition-colors border-l-4", borderTone[r.border])}
                      onClick={() => {}}>
                      <td className="px-3 py-3 font-medium">
                        <span className="mr-2">{r.emoji}</span>{r.name}
                      </td>
                      <td className="px-3 py-3"><Pill tone={r.sc.tone}>{r.sc.text}</Pill></td>
                      <td className="px-3 py-3"><Pill tone={r.brk.tone}>{r.brk.text}</Pill></td>
                      <td className="px-3 py-3"><Pill tone={r.idx.tone}>{r.idx.text}</Pill></td>
                      <td className="px-3 py-3"><Pill tone={r.docs.tone}>{r.docs.text}</Pill></td>
                      <td className="px-3 py-3"><Pill tone={r.amd.tone}>{r.amd.text}</Pill></td>
                      <td className="px-3 py-3"><Pill tone={r.grt.tone}>{r.grt.text}</Pill></td>
                      <td className={cn("px-3 py-3 font-bold font-mono", textTone[r.scoreTone])}>{r.score}</td>
                    </tr>
                  ))}
                  <tr className="bg-muted/20">
                    <td colSpan={7} className="px-3 py-3 italic text-muted-foreground text-xs">+ 99 more locations</td>
                    <td className="px-3 py-3 text-right">
                      <button className="text-primary text-xs font-medium hover:underline inline-flex items-center gap-1">
                        Show all <ArrowRight className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Zone 3: Two charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Service Charge Cap Comparison */}
          <Card className="p-5 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-display font-semibold">Service Charge Cap Comparison</h3>
                <p className="text-xs text-muted-foreground mt-0.5">vs portfolio average</p>
              </div>
              <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-[11px] font-semibold">104 stores</span>
            </div>

            <div className="relative pt-6">
              {/* Avg line label */}
              <div className="absolute top-0 text-[10px] font-semibold text-primary" style={{ left: "calc(140px + 8px + 37% * (100% - 140px - 50px) / 100%)" }}>
                Avg 9.3%
              </div>
              <div className="space-y-2.5">
                {scBars.map((b) => (
                  <div key={b.name} className="flex items-center gap-2">
                    <div className="w-[140px] text-right text-[11px] text-muted-foreground truncate">{b.name}</div>
                    <div className="flex-1 relative h-5 bg-muted rounded">
                      {/* dashed avg line */}
                      <div className="absolute top-[-4px] bottom-[-4px] border-l-2 border-dashed border-primary" style={{ left: "37%" }} />
                      <div className={cn("h-full rounded", barBg[b.tone])} style={{ width: `${b.width}%` }} />
                    </div>
                    <div className="w-12 text-[11px] font-semibold text-foreground">{b.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <Card className="p-3 border-l-4 border-l-destructive bg-destructive/5">
              <p className="text-xs">
                <span className="font-semibold text-destructive">Estimated excess service charge: PLN 1.34M/yr</span>
                <span className="text-muted-foreground"> — 3 locations have no enforceable cap clause</span>
              </p>
            </Card>
          </Card>

          {/* Break Option Windows */}
          <Card className="p-5 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-display font-semibold">Break Option Windows</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Next 24 months</p>
              </div>
              <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-[11px] font-semibold cursor-pointer hover:bg-primary/20">Set Alerts</span>
            </div>

            <div className="flex items-center gap-4 text-[11px] text-muted-foreground flex-wrap">
              <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-success" />Open</span>
              <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-warning" />Closing — notice due</span>
              <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-muted-foreground/50" />Locked</span>
              <span className="inline-flex items-center gap-1.5"><span className="w-0.5 h-3 bg-destructive" />Today</span>
            </div>

            {/* Month headers */}
            <div className="flex items-center gap-2">
              <div className="w-[130px]" />
              <div className="flex-1 grid grid-cols-8 text-[10px] text-muted-foreground font-medium">
                {["Jun","Jul","Aug","Sep","Oct","Nov","Dec","Q1 '27"].map((m) => (
                  <div key={m}>{m}</div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {ganttRows.map((row) => (
                <div key={row.name} className="flex items-center gap-2">
                  <div className="w-[130px] text-right text-[11px] text-muted-foreground truncate">{row.name}</div>
                  <div className="flex-1 relative h-6 bg-muted/40 rounded overflow-hidden">
                    {row.segs.map((s, i) => (
                      <div key={i}
                        className={cn("absolute top-0 bottom-0 flex items-center px-1.5 text-[9px] font-medium truncate", segBg[s.tone])}
                        style={{ left: `${s.from}%`, width: `${s.to - s.from}%` }}>
                        {s.label}
                      </div>
                    ))}
                    {/* today line */}
                    <div className="absolute top-0 bottom-0 w-0.5 bg-destructive z-10" style={{ left: "4%" }} />
                  </div>
                </div>
              ))}
            </div>

            <Card className="p-3 border-l-4 border-l-warning bg-warning/5">
              <p className="text-xs">
                <span className="font-semibold text-warning">⏰ Kraków notice deadline: 15 Jul 2026</span>
                <span className="text-muted-foreground"> — 45 days remaining. Failure to act = locked until 2029.</span>
              </p>
            </Card>
          </Card>
        </div>

        {/* Zone 4: Anomaly Feed + Chat */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Anomaly Feed */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-lg font-display font-bold">Anomaly Feed</h2>
              <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-destructive text-destructive-foreground text-[11px] font-bold">23</span>
            </div>

            <AnomalyLegend />

            <div className="flex gap-2 flex-wrap">
              <span className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold bg-destructive/15 text-destructive cursor-pointer">Critical (9)</span>
              <span className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold bg-muted text-muted-foreground cursor-pointer hover:bg-muted/80">Amber (11)</span>
              <span className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold bg-muted text-muted-foreground cursor-pointer hover:bg-muted/80">Info (5)</span>
            </div>

            <div className="space-y-3">
              {anomalySections.map((s) => (
                <AnomalyGroup key={s.id} section={s} />
              ))}
            </div>
          </div>

          {/* Ask Your Portfolio */}
          <div className="space-y-4">
            <Card className="p-5 space-y-4 sticky top-20">
              <div>
                <h3 className="text-base font-display font-bold flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Ask Your Portfolio
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Query your lease data in plain language.</p>
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="e.g. Which stores have no service charge cap?"
                  className="text-sm"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") runQuery(query); }}
                />
                <Button size="default" onClick={() => runQuery(query)}>Ask</Button>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Try asking:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Break options closing this year",
                    "Stores with indexation errors",
                    "Missing bank guarantees",
                    "All locations above cap",
                  ].map((q) => (
                    <button key={q} onClick={() => { setQuery(q); runQuery(q); }} className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors">
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {answer && (
                <Card className="p-4 space-y-2 bg-background">
                  <p className="font-semibold text-sm text-foreground">{answer.header}</p>
                  <p className={cn("text-xs leading-relaxed", answer.bodyMuted ? "italic text-muted-foreground" : "text-muted-foreground")}>
                    {answer.body}
                  </p>
                  {answer.source && <p className="text-[11px] italic text-primary">{answer.source}</p>}
                  {answer.recovery && <p className="text-xs font-bold text-success">{answer.recovery}</p>}
                </Card>
              )}

              <p className="text-[11px] italic text-muted-foreground pt-2 border-t">
                Powered by LeaseOS AI — answers link to source clauses
              </p>
            </Card>
          </div>
        </div>
      </div>
      <CustomiseColumnsDialog open={columnsOpen} onOpenChange={setColumnsOpen} />
    </div>
  );
}

const COLUMN_GROUPS: { group: string; items: { label: string; active?: boolean }[] }[] = [
  { group: "Financial", items: [
    { label: "Service Charge Cap Status", active: true },
    { label: "Indexation Anomaly", active: true },
    { label: "Missed Rent Steps" },
    { label: "Turnover Reporting Compliance" },
    { label: "CAM Pro-Rata Accuracy" },
  ]},
  { group: "Deadlines", items: [
    { label: "Break Option Window", active: true },
    { label: "Lease Expiry (<18 months)" },
    { label: "Renewal Notice Deadline" },
    { label: "Guarantee Renewal Date" },
    { label: "Rent Review Date" },
  ]},
  { group: "Documents", items: [
    { label: "Amendment Chain", active: true },
    { label: "Document Completeness", active: true },
    { label: "Guarantee Status", active: true },
    { label: "KRS Authority Match" },
    { label: "Signatory Verification" },
  ]},
  { group: "Commercial & Risk", items: [
    { label: "Exclusivity Clause Present" },
    { label: "Co-Tenancy Trigger Risk" },
    { label: "ROFR / ROFO Tracked" },
    { label: "Assignment Restrictions" },
    { label: "Related-Party Flag" },
    { label: "Fit-Out Reinstatement Clause" },
  ]},
];

function CustomiseColumnsDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const initial = new Set<string>();
  COLUMN_GROUPS.forEach((g) => g.items.forEach((i) => { if (i.active) initial.add(i.label); }));
  const [selected, setSelected] = useState<Set<string>>(initial);
  const [warn, setWarn] = useState(false);

  const toggle = (label: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
        setWarn(false);
      } else {
        if (next.size >= 8) { setWarn(true); return prev; }
        next.add(label);
        setWarn(false);
      }
      return next;
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display font-bold">Customise Risk Columns</DialogTitle>
          <DialogDescription>
            Select up to 8 risk categories to display in the matrix. Changes apply to all locations.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 py-2">
          {COLUMN_GROUPS.map((g) => (
            <div key={g.group} className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{g.group}</p>
              <div className="space-y-2">
                {g.items.map((i) => (
                  <label key={i.label} className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox checked={selected.has(i.label)} onCheckedChange={() => toggle(i.label)} />
                    <span>{i.label}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {warn && (
          <p className="text-xs text-warning">Maximum 8 columns selected.</p>
        )}

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}