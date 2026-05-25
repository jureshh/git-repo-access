import { X } from "lucide-react";
import { CARD, STATUS_DOT_LABEL, TEAL, Unit } from "./data";

interface Props {
  unit: Unit;
  onClose: () => void;
}

const SourceLink = ({ children }: { children: React.ReactNode }) => (
  <a
    href="#"
    onClick={(e) => e.preventDefault()}
    className="text-[11px] hover:underline ml-1"
    style={{ color: TEAL }}
  >
    {children}
  </a>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="border-t border-white/5 pt-4 first:border-t-0 first:pt-0">
    <h3 className="text-[11px] uppercase tracking-wider text-slate-400 mb-2">{title}</h3>
    <div className="space-y-1.5 text-sm text-slate-200">{children}</div>
  </div>
);

const Field = ({
  label,
  value,
  source,
}: {
  label: string;
  value: React.ReactNode;
  source?: string;
}) => (
  <div className="flex flex-wrap items-baseline gap-x-2">
    <span className="text-slate-400 text-xs w-32 shrink-0">{label}</span>
    <span className="text-slate-100">{value}</span>
    {source && <SourceLink>Source: {source}</SourceLink>}
  </div>
);

export function LeaseDetailPanel({ unit, onClose }: Props) {
  const meta = STATUS_DOT_LABEL[unit.status];
  const isCafe = unit.id === "2-B1";

  return (
    <div
      className="rounded-xl border border-white/5 h-full flex flex-col overflow-hidden animate-in fade-in duration-200"
      style={{ background: CARD }}
    >
      <div className="px-5 py-4 border-b border-white/5 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-white">{unit.tenant}</h2>
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: "rgba(255,255,255,0.06)", color: "white" }}
            >
              {meta.emoji} {unit.statusLabel}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Unit {unit.id} · Floor 2 · GLA {unit.sqm.toLocaleString()} sqm
          </p>
        </div>
        <button
          onClick={onClose}
          className="rounded-md p-1.5 hover:bg-white/5 text-slate-300"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-auto px-5 py-5 space-y-5">
        {isCafe ? (
          <>
            <Section title="Rent Economics">
              <Field label="Base Rent" value="PLN 1,000/m² = PLN 180,000/yr" />
              <Field
                label="Effective Rent"
                value="PLN 162,000/yr (after 2-month rent-free in Annex 2)"
                source="§4.1 — Base Lease, p. 12"
              />
            </Section>

            <Section title="Lease Term">
              <Field label="Start" value="01 Jul 2021" />
              <Field label="Expiry" value="30 Jun 2026" />
              <Field label="WAULT" value="0.7 years" source="§3.1 — Base Lease, p. 6" />
            </Section>

            <Section title="Break Option">
              <Field label="Type" value="Tenant break" />
              <Field label="Exercise date" value="31 Mar 2026" />
              <Field label="Notice required" value="3 months written notice" />
              <Field
                label="Status"
                value={
                  <span className="text-[#F59E0B]">
                    ⚠️ Notice window opens 01 Jan 2026
                  </span>
                }
                source="§8.2 — Base Lease, p. 24"
              />
            </Section>

            <Section title="Bank Guarantee">
              <Field label="Amount" value="PLN 54,000 (3 months rent)" />
              <Field label="Guarantor" value="PKO Bank Polski S.A." />
              <Field label="Expiry" value="30 Apr 2026" />
              <Field
                label="Status"
                value={
                  <span className="text-[#F43F5E]">
                    🔴 Renewal required — expires before lease end
                  </span>
                }
                source="§14.1 — Base Lease, p. 38"
              />
            </Section>

            <Section title="Indexation">
              <Field label="Index" value="HICP Poland (all items)" />
              <Field label="Base" value="January 2022" />
              <Field label="Last applied" value="January 2025 at +3.2%" />
              <Field
                label="Next review"
                value="January 2026"
                source="§6.3 — Base Lease, p. 15"
              />
            </Section>

            <Section title="Documents">
              <ul className="space-y-1.5 text-sm">
                <li className="text-slate-200">
                  <span className="text-[#0891B2]">Base Lease</span> — 01 Jul 2021
                  <span className="text-slate-400"> (387 pages)</span>
                </li>
                <li className="text-slate-200">
                  <span className="text-[#0891B2]">Annex 1</span> — Fit-out specification — 15 Sep
                  2021 <span className="text-slate-400">(42 pages)</span>
                </li>
                <li className="text-slate-200">
                  <span className="text-[#0891B2]">Annex 2</span> — Rent-free amendment — 03 Jan
                  2022 <span className="text-slate-400">(6 pages)</span>
                </li>
              </ul>
            </Section>
          </>
        ) : (
          <>
            <Section title="Rent Economics">
              <Field label="Annual Rent" value={unit.annualRent ? `PLN ${unit.annualRent.toLocaleString()}` : "—"} />
              <Field label="Rent / m²" value={unit.rentPerM2 ? `PLN ${unit.rentPerM2.toLocaleString()}` : "—"} />
            </Section>
            <Section title="Lease Term">
              <Field label="Expiry" value={unit.expiry ?? "—"} />
              <Field label="WAULT" value={unit.wault} />
            </Section>
            <p className="text-xs text-slate-500 italic">
              Detailed lease data not yet ingested for this unit.
            </p>
          </>
        )}
      </div>
    </div>
  );
}