import { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, FileText, GripVertical, X } from "lucide-react";
import { cn } from "@/lib/utils";

const TEAL = "#0d9488";

type Severity = "red" | "amber" | "blue";

interface Finding {
  id: string;
  severity: Severity;
  store: string;
  typeIcon: string;
  typeLabel: string;
  desc: string;
  source: string;
  recovery?: string;
  exposure?: string;
  confidence: number;
  reviewed: boolean;
  annotation?: string;
}

const findings: Finding[] = [
  {
    id: "f1",
    severity: "red",
    store: "Kraków – Galeria Bronowice",
    typeIcon: "⚠",
    typeLabel: "Service Charge Cap Breach",
    desc: "Landlord invoiced 23% increase. Lease cap is 8% per annum.",
    source: "→ §12.4 — Base Lease, p. 23, Annex B",
    recovery: "PLN 184,000",
    confidence: 94,
    reviewed: true,
  },
  {
    id: "f2",
    severity: "red",
    store: "Kraków – Galeria Bronowice",
    typeIcon: "⚠",
    typeLabel: "Amendment Conflict — Effective Terms Unclear",
    desc: "Base lease §6.1 conflicts with Amendment 2 §3.4. Current effective obligation is legally ambiguous.",
    source: "→ §6.1 Base Lease p.14 conflicts with Amendment 2 §3.4 p.6",
    exposure: "PLN 210,000",
    confidence: 78,
    reviewed: false,
    annotation:
      "Confirmed with Wardyński — recommend formal notice before next reconciliation date. JG 30/05/26",
  },
  {
    id: "f3",
    severity: "red",
    store: "Warszawa – Westfield Mokotów",
    typeIcon: "⚠",
    typeLabel: "No Enforceable Cap Clause",
    desc: "Amendment 3 removed the cap reference. Ambiguous drafting.",
    source: "→ Amendment 3, §6.1",
    exposure: "PLN 290,000/yr",
    confidence: 81,
    reviewed: false,
  },
  {
    id: "f4",
    severity: "amber",
    store: "Wrocław – Magnolia Park",
    typeIcon: "📊",
    typeLabel: "Indexation Drift — HICP vs CPI",
    desc: "Cumulative difference over 3 years = PLN 67,000.",
    source: "→ §9.1 — Indexation clause",
    recovery: "PLN 67,000",
    confidence: 91,
    reviewed: true,
  },
  {
    id: "f5",
    severity: "amber",
    store: "Gdańsk – Forum Gdańsk",
    typeIcon: "⏰",
    typeLabel: "Break Option Closing in 45 Days",
    desc: "Window closes 15 Jul 2026. Notice period 90 days.",
    source: "→ §18.2 — Base Lease, p. 31",
    confidence: 97,
    reviewed: true,
  },
  {
    id: "f6",
    severity: "blue",
    store: "Kraków – Galeria Bronowice",
    typeIcon: "📄",
    typeLabel: "Missing Power of Attorney",
    desc: "Amendment 2 signed without documented authority.",
    source: "→ Amendment 2, signature block",
    confidence: 88,
    reviewed: true,
  },
];

const severityBorder: Record<Severity, string> = {
  red: "border-l-destructive",
  amber: "border-l-warning",
  blue: "border-l-primary",
};

const severityText: Record<Severity, string> = {
  red: "text-destructive",
  amber: "text-warning",
  blue: "text-primary",
};

function confidenceBarColor(v: number) {
  if (v >= 85) return "#10b981";
  if (v >= 70) return "#d97706";
  return "#ef4444";
}

function FindingCard({ f }: { f: Finding }) {
  return (
    <div
      className={cn(
        "bg-white rounded-lg border shadow-sm p-4 border-l-4 flex gap-3 items-start",
        severityBorder[f.severity]
      )}
    >
      <button className="text-muted-foreground/60 hover:text-muted-foreground cursor-grab mt-0.5">
        <GripVertical className="h-4 w-4" />
      </button>
      <div className="flex-1 min-w-0 space-y-1.5">
        <p className="text-[11px] text-muted-foreground">{f.store}</p>
        <p className={cn("text-sm font-bold", severityText[f.severity])}>
          {f.typeIcon} {f.typeLabel}
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
        <p className="text-[11px] italic text-primary">{f.source}</p>
        {f.recovery && <p className="text-xs font-bold text-success">{f.recovery}</p>}
        {f.exposure && <p className="text-xs font-bold text-destructive">{f.exposure}</p>}

        <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#f3f4f6]">
          <div className="flex-1 flex items-center gap-2">
            <div className="flex-1 h-1 rounded-sm bg-muted overflow-hidden">
              <div
                className="h-full"
                style={{
                  width: `${f.confidence}%`,
                  backgroundColor: confidenceBarColor(f.confidence),
                }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground tabular-nums">
              {f.confidence}%
            </span>
          </div>
          {f.reviewed ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-success">
              <CheckCircle2 className="h-3 w-3" /> Human reviewed
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-warning">
              <Clock className="h-3 w-3" /> Pending review
            </span>
          )}
        </div>

        {f.annotation ? (
          <div className="space-y-1 pt-1">
            <div className="bg-yellow-50 border border-yellow-200 rounded-md px-3 py-2 text-[11px] text-foreground leading-relaxed">
              {f.annotation}
            </div>
            <button className="text-[11px] font-medium" style={{ color: TEAL }}>
              Edit annotation
            </button>
          </div>
        ) : (
          <button className="text-[11px] font-medium pt-1" style={{ color: TEAL }}>
            Add annotation +
          </button>
        )}
      </div>
      <button className="text-muted-foreground/60 hover:text-destructive">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

const anomalySuggestions = [
  { store: "Warszawa", label: "Bank Guarantee Expired", source: "→ §22.1 p.44" },
  { store: "Katowice", label: "Underperformance vs Feasibility", source: "→ §11.3" },
  { store: "Warszawa", label: "Related-Party Pattern", source: "→ §2.1" },
];

const chips = [
  "Break options closing this year",
  "Stores with indexation errors",
  "Missing bank guarantees",
  "All locations above cap",
];

function runQueryLogic(q: string) {
  const s = q.toLowerCase().trim();
  if (!s) return null;
  if (s.includes("no service charge cap") || s.includes("no cap") || s.includes("above cap")) {
    return {
      header: "3 locations have no enforceable service charge cap",
      body: "Warszawa – Westfield Mokotów: cap clause removed in Amendment 3. Gdańsk – Forum Gdańsk: cap exists at 12% but base calculation is ambiguous. Kraków – Galeria Bronowice: cap of 8% exists but contradicted by Amendment 2.",
      source: "→ Sources: Amendment 3 §6.1 · Base Lease §12.4 · Amendment 2 §3.4",
      recovery: "Combined exposure: PLN 684,000/yr",
    };
  }
  if (s.includes("break option")) {
    return {
      header: "2 break option windows closing within 90 days",
      body: "Gdańsk – Forum Gdańsk: window open now, closes 15 Jul 2026 — 43 days remaining. Notice period 90 days — serve notice immediately. Kraków – Galeria Bronowice: 45 days to serve notice or locked until 2029.",
      source: "→ §18.2 Base Lease p.31 (Gdańsk) · §14.1 Base Lease p.28 (Kraków)",
    };
  }
  if (s.includes("indexation") || s.includes("hicp") || s.includes("cpi")) {
    return {
      header: "2 locations with indexation anomalies — cumulative exposure PLN 134,000",
      body: "Wrocław – Magnolia Park: CPI applied at 6.3%, contractual index is HICP. Cumulative drift over 3 years = PLN 67,000. Katowice – Silesia City Center: indexation review date missed Sep 2025.",
      source: "→ §9.1 Indexation clause (Wrocław) · §9.1 Indexation clause (Katowice)",
      recovery: "Recoverable: PLN 134,000",
    };
  }
  if (s.includes("guarantee")) {
    return {
      header: "2 locations have expired or at-risk bank guarantees",
      body: "Warszawa – Westfield Mokotów: guarantee of PLN 450,000 expired January 2026. Kraków – Galeria Bronowice: guarantee of PLN 54,000 expires September 2026, before lease end date of June 2027.",
      source: "→ §22.1 — Base Lease, p. 44 (Warszawa) · §14.1 — Base Lease, p. 38 (Kraków)",
      exposure: "Combined guarantee exposure: PLN 504,000",
    };
  }
  return {
    header: "Searching your portfolio...",
    body: "This query requires live lease data. Connect your lease documents to enable full natural language search.",
    bodyMuted: true,
  };
}

export default function ServiceChargeAudit() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState<ReturnType<typeof runQueryLogic>>(null);

  const ask = (q: string) => setAnswer(runQueryLogic(q));

  return (
    <div className="container py-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <p className="text-[11px] text-muted-foreground">
          <Link to="/investigations" className="hover:underline">
            Investigations
          </Link>{" "}
          → Service Charge Audit — Kraków Portfolio
        </p>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Service Charge Audit — Kraków Portfolio
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Template: Service Charge Audit · Started 29 May 2026 · 6 findings
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-sm font-medium px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
              Save draft
            </button>
            <button
              className="text-sm font-medium px-3 py-1.5 rounded-md text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: TEAL }}
            >
              Generate Evidence Pack →
            </button>
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* LEFT — flex 3 */}
        <div className="lg:col-span-3 space-y-6">
          {/* Findings */}
          <section className="space-y-3">
            <div>
              <h2 className="text-lg font-bold text-foreground">Evidence Findings</h2>
              <p className="text-xs text-muted-foreground">
                Drag to reorder · Click to annotate · Remove to exclude from pack
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              6 findings · 2 annotated · PLN 684,000 total exposure identified
            </p>

            <div className="space-y-3">
              {findings.map((f) => (
                <FindingCard key={f.id} f={f} />
              ))}

              <button className="w-full border border-dashed rounded-lg py-4 text-xs text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                + Add finding from Anomaly Feed
              </button>
            </div>
          </section>

          {/* Benchmarking */}
          <Card className="p-5 space-y-4">
            <div>
              <h3 className="text-base font-bold text-foreground">Portfolio Benchmarking</h3>
              <p className="text-xs text-muted-foreground">
                Contextualise your findings against portfolio norms.
              </p>
            </div>

            <div className="space-y-2">
              {[
                {
                  label: "Average service charge cap across portfolio:",
                  value: "9.3%",
                  pill: "Kraków at 23% is +148% above average",
                  tone: "red" as const,
                },
                {
                  label: "Average lease term across portfolio:",
                  value: "7.9 years",
                  pill: "Warszawa at 12 years is +51% above average",
                  tone: "red" as const,
                },
                {
                  label: "Locations with no cap clause:",
                  value: "3 of 104",
                  pill: "2.9% of portfolio — above typical 0–1% threshold",
                  tone: "amber" as const,
                },
              ].map((r) => (
                <div
                  key={r.label}
                  className="flex items-center justify-between gap-3 text-xs py-1.5"
                >
                  <span className="text-muted-foreground">{r.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-foreground tabular-nums">
                      {r.value}
                    </span>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
                        r.tone === "red"
                          ? "bg-destructive/15 text-destructive"
                          : "bg-warning/15 text-warning"
                      )}
                    >
                      {r.pill}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[11px] italic text-muted-foreground pt-2 border-t">
              Benchmarking based on this client's own portfolio. Cross-portfolio anonymised
              benchmarking available in Phase 2.
            </p>
          </Card>

          {/* Generate Evidence Pack callout */}
          <div
            className="rounded-[10px] border p-4 flex items-start justify-between gap-4 flex-wrap"
            style={{ backgroundColor: "#f0fdfa", borderColor: TEAL }}
          >
            <div className="flex-1 min-w-[260px] space-y-1">
              <p className="font-bold text-sm text-foreground">
                Ready to generate your Evidence Pack
              </p>
              <p className="text-xs text-muted-foreground">
                6 findings · PLN 684,000 exposure identified · 2 annotated · 1 pending legal review
              </p>
              <p className="text-[11px] text-warning">
                ⚠ 3 findings have confidence below 85% or are pending human review. Consider reviewing before generating.
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <button
                className="text-sm font-medium px-4 py-2 rounded-md text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: TEAL }}
              >
                Generate Evidence Pack →
              </button>
              <p className="text-[11px] text-muted-foreground max-w-[260px] text-right">
                Generates a PDF with clause references, financial summary, and amendment chain.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT — flex 1 */}
        <div className="lg:col-span-1 space-y-4">
          {/* Ask Your Portfolio */}
          <Card className="p-5 space-y-4">
            <div>
              <h3 className="text-base font-display font-bold flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Query Portfolio
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Query your lease data in plain language.
              </p>
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="e.g. Which stores have no service charge cap?"
                className="text-sm"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") ask(query);
                }}
              />
              <Button size="default" onClick={() => ask(query)}>
                Ask
              </Button>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {chips.map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      setQuery(q);
                      ask(q);
                    }}
                    className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {answer && (
              <>
                <Card className="p-4 space-y-2 bg-background">
                  <p className="font-semibold text-sm text-foreground">{answer.header}</p>
                  <p
                    className={cn(
                      "text-xs leading-relaxed",
                      (answer as any).bodyMuted
                        ? "italic text-muted-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {answer.body}
                  </p>
                  {(answer as any).source && (
                    <p className="text-[11px] italic text-primary">{(answer as any).source}</p>
                  )}
                  {(answer as any).recovery && (
                    <p className="text-xs font-bold text-success">{(answer as any).recovery}</p>
                  )}
                  {(answer as any).exposure && (
                    <p className="text-xs font-bold text-destructive">{(answer as any).exposure}</p>
                  )}
                </Card>
                <button
                  className="w-full text-xs font-medium px-3 py-1.5 rounded-md border transition-colors hover:bg-[#0d9488]/5"
                  style={{ color: TEAL, borderColor: TEAL }}
                >
                  Add to investigation +
                </button>
              </>
            )}
          </Card>

          {/* Add from Anomaly Feed */}
          <Card className="p-5 space-y-3">
            <h3 className="text-base font-bold text-foreground">Add from Anomaly Feed</h3>
            <div className="space-y-2">
              {anomalySuggestions.map((a, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-2 border rounded-md p-3"
                >
                  <div className="min-w-0">
                    <p className="text-[11px] text-muted-foreground">{a.store}</p>
                    <p className="text-xs font-semibold text-foreground truncate">{a.label}</p>
                    <p className="text-[11px] italic text-primary">{a.source}</p>
                  </div>
                  <button
                    className="text-[11px] font-medium px-2 py-1 rounded-md border transition-colors hover:bg-[#0d9488]/5 shrink-0"
                    style={{ color: TEAL, borderColor: TEAL }}
                  >
                    + Add
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}