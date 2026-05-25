import { CARD } from "./data";

interface Metric {
  label: string;
  value: string;
  sub?: string;
  tone?: "default" | "amber" | "red";
}

const metrics: Metric[] = [
  { label: "Total GLA", value: "18,450 sqm" },
  { label: "Occupied", value: "17,200 sqm", sub: "93.2%" },
  { label: "Portfolio WAULT", value: "4.2 years" },
  { label: "Annual Rent", value: "PLN 8,340,000" },
  { label: "Active Alerts", value: "3", tone: "amber" },
  { label: "Guarantees Expiring <90d", value: "2", tone: "red" },
];

const toneColor = (t?: Metric["tone"]) =>
  t === "amber" ? "text-[#F59E0B]" : t === "red" ? "text-[#F43F5E]" : "text-white";

export function SummaryBar() {
  return (
    <div
      className="rounded-xl border border-white/5 px-6 py-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
      style={{ background: CARD }}
    >
      {metrics.map((m) => (
        <div key={m.label} className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-wide text-slate-400">{m.label}</span>
          <span className={`text-xl font-semibold ${toneColor(m.tone)}`}>{m.value}</span>
          {m.sub && <span className="text-xs text-slate-400">{m.sub}</span>}
        </div>
      ))}
    </div>
  );
}