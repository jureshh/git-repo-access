import { Link, useNavigate } from "react-router-dom";

const TEAL = "#0d9488";

const templates = [
  {
    icon: "💰",
    title: "Service Charge Audit",
    description:
      "Investigate cap breaches, ambiguous clause drafting, and excess charges across your portfolio. Produces a clause-referenced dispute pack.",
    tags: ["Cap analysis", "Amendment history", "Financial recovery"],
  },
  {
    icon: "⏰",
    title: "Break Option Review",
    description:
      "Map all exercisable break options, calculate notice deadlines, and assess the cost of inaction. Produces a deadline-critical action pack.",
    tags: ["Notice periods", "Exit modelling", "Deadline alerts"],
  },
  {
    icon: "🚪",
    title: "Lease Exit Analysis",
    description:
      "Analyse exit routes across the portfolio — break options, expiry dates, assignment rights, and penalty clauses. Produces a negotiation briefing.",
    tags: ["WAULT", "Assignment rights", "Exit cost"],
  },
  {
    icon: "🔍",
    title: "Governance & Anomaly Review",
    description:
      "Detect related-party patterns, signing authority gaps, and statistical outliers across lease terms, rent levels, and procurement. Produces a governance report.",
    tags: ["Related-party flags", "KRS cross-reference", "Portfolio benchmarking"],
  },
];

export default function Investigations() {
  const navigate = useNavigate();
  const go = () => navigate("/investigations/service-charge-audit");

  return (
    <div className="container py-10 space-y-10">
      <header className="space-y-2">
        <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          Investigations
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Build evidence-backed cases from your lease portfolio. Start with a template or create a custom investigation.
        </p>
      </header>

      {/* Zone 1 — Active Investigations */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Active Investigations</h2>
          <button
            className="text-sm font-medium px-3 py-1.5 rounded-md border transition-colors hover:bg-[#0d9488]/5"
            style={{ color: TEAL, borderColor: TEAL }}
          >
            + New Investigation
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1 — Active */}
          <div className="bg-white rounded-[10px] border shadow-sm p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span
                className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full"
                style={{ color: TEAL, backgroundColor: "#0d94881a" }}
              >
                ● Active
              </span>
              <span className="text-xs text-muted-foreground">Started 29 May 2026</span>
            </div>
            <div>
              <h3 className="font-bold text-[15px] text-foreground">
                Service Charge Audit — Kraków Portfolio
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Investigating cap breaches and amendment conflicts across 3 locations
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              6 findings added · 2 annotated · 1 pending legal review
            </p>
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-muted-foreground">Template: Service Charge Audit</span>
              <button onClick={go} className="text-sm font-medium" style={{ color: TEAL }}>
                Continue →
              </button>
            </div>
          </div>

          {/* Card 2 — Draft */}
          <div className="bg-white rounded-[10px] border shadow-sm p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span
                className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full"
                style={{ color: "#b45309", backgroundColor: "#fef3c7" }}
              >
                ◐ Draft
              </span>
              <span className="text-xs text-muted-foreground">Started 01 Jun 2026</span>
            </div>
            <div>
              <h3 className="font-bold text-[15px] text-foreground">Break Option Review — Q3 2026</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Identifying exercisable break options and notice deadlines in the next 90 days
              </p>
            </div>
            <p className="text-xs text-muted-foreground">3 findings added · 0 annotated</p>
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-muted-foreground">Template: Break Option Review</span>
              <button onClick={go} className="text-sm font-medium" style={{ color: TEAL }}>
                Continue →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Zone 2 — Start a New Investigation */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">Start a New Investigation</h2>
          <p className="text-sm text-muted-foreground">
            Choose a template to pre-configure your evidence workspace.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((t) => (
            <button
              key={t.title}
              onClick={go}
              className="text-left bg-white rounded-[10px] border shadow-sm p-4 space-y-3 transition-shadow hover:shadow-md"
            >
              <div className="text-2xl leading-none">{t.icon}</div>
              <h3 className="font-bold text-sm text-foreground">{t.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{t.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {t.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="text-sm font-medium pt-1" style={{ color: TEAL }}>
                Start investigation →
              </div>
            </button>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground pt-2">
          Need a custom investigation?{" "}
          <Link to="/investigations/service-charge-audit" className="font-medium" style={{ color: TEAL }}>
            Configure from scratch →
          </Link>
        </p>
      </section>

      {/* Zone 3 — Recently Completed */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Recently Completed</h2>
          <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            View all →
          </button>
        </div>

        <div className="bg-[#f9fafb] rounded-[10px] border p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
              ✓ Completed
            </span>
            <span className="text-xs text-muted-foreground">Completed 15 May 2026</span>
          </div>
          <div>
            <h3 className="font-bold text-[15px] text-foreground">
              Indexation Review — Full Portfolio Q1 2026
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Reviewed HICP vs CPI application across 104 locations. 2 anomalies identified.
            </p>
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-muted-foreground">Template: Service Charge Audit</span>
            <div className="flex items-center gap-2">
              <button className="text-xs font-medium px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
                View report
              </button>
              <button
                className="text-xs font-medium px-3 py-1.5 rounded-md border transition-colors hover:bg-[#0d9488]/5"
                style={{ color: TEAL, borderColor: TEAL }}
              >
                Export Evidence Pack →
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}