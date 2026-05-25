import { X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { STATUS_META, Unit } from "./data";

interface Props {
  unit: Unit;
  onClose: () => void;
}

const SourceLink = ({ children }: { children: React.ReactNode }) => (
  <a
    href="#"
    onClick={(e) => e.preventDefault()}
    className="text-[11px] text-primary hover:underline ml-1"
  >
    {children}
  </a>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="border-t border-border pt-4 first:border-t-0 first:pt-0">
    <h3 className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2 font-semibold">
      {title}
    </h3>
    <div className="space-y-1.5 text-sm text-foreground">{children}</div>
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
    <span className="text-muted-foreground text-xs w-32 shrink-0">{label}</span>
    <span className="text-foreground">{value}</span>
    {source && <SourceLink>Source: {source}</SourceLink>}
  </div>
);

export function LeaseDetailPanel({ unit, onClose }: Props) {
  const meta = STATUS_META[unit.status];
  const isCafe = unit.id === "2-B1";

  return (
    <Card className="glass h-full flex flex-col overflow-hidden animate-in fade-in duration-200">
      <div className="px-5 py-4 border-b border-border flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-display font-bold tracking-tight">{unit.tenant}</h2>
            <Badge variant="secondary" className={`gap-1 ${meta.className}`}>
              <span>{meta.emoji}</span>
              {unit.statusLabel}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Unit {unit.id} · Floor 2 · GLA {unit.sqm.toLocaleString()} sqm
          </p>
        </div>
        <button
          onClick={onClose}
          className="rounded-md p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
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
                  <span className="text-warning">
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
                  <span className="text-destructive">
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
                <li>
                  <a href="#" onClick={(e) => e.preventDefault()} className="text-primary hover:underline">Base Lease</a>
                  <span className="text-foreground"> — 01 Jul 2021</span>
                  <span className="text-muted-foreground"> (387 pages)</span>
                </li>
                <li>
                  <a href="#" onClick={(e) => e.preventDefault()} className="text-primary hover:underline">Annex 1</a>
                  <span className="text-foreground"> — Fit-out specification — 15 Sep 2021</span>
                  <span className="text-muted-foreground"> (42 pages)</span>
                </li>
                <li>
                  <a href="#" onClick={(e) => e.preventDefault()} className="text-primary hover:underline">Annex 2</a>
                  <span className="text-foreground"> — Rent-free amendment — 03 Jan 2022</span>
                  <span className="text-muted-foreground"> (6 pages)</span>
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
            <p className="text-xs text-muted-foreground italic">
              Detailed lease data not yet ingested for this unit.
            </p>
          </>
        )}
      </div>
    </Card>
  );
}