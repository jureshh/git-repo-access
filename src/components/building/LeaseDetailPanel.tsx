import { X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { STATUS_META, Unit } from "./data";
import { useFormatRent, useFormatAnnualMonthly } from "@/lib/currency";

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
  <div className="grid grid-cols-[9rem_1fr] gap-x-3 items-start py-1">
    <span className="text-sm text-muted-foreground leading-5">{label}</span>
    <div className="text-sm text-foreground leading-5 min-w-0">
      <div>{value}</div>
      {source && (
        <div className="text-sm text-muted-foreground leading-5">
          <SourceLink>Source: {source}</SourceLink>
        </div>
      )}
    </div>
  </div>
);

export function LeaseDetailPanel({ unit, onClose }: Props) {
  const meta = STATUS_META[unit.status];
  const isCafe = unit.id === "2-B1";
  const fmtRent = useFormatRent();
  const fmtAM = useFormatAnnualMonthly();

  const stack = (primary: string, secondary: string, note?: string) => (
    <div className="flex flex-col">
      <span className="tabular-nums leading-5">{primary}</span>
      <span className="tabular-nums leading-5 text-muted-foreground">
        {secondary}
        {note ? ` · ${note}` : ""}
      </span>
    </div>
  );

  const rentLine = (pln: number, note?: string) => {
    const am = fmtAM(pln);
    return stack(am.primary, am.secondary, note);
  };

  const perM2Line = (pln: number) => {
    const r = fmtRent(pln, { suffix: "/m²" });
    return stack(r.primary, r.secondary);
  };

  const amountLine = (pln: number, note?: string) => {
    const r = fmtRent(pln);
    return stack(r.primary, r.secondary, note);
  };

  return (
    <Card className="glass flex flex-col overflow-hidden animate-in fade-in duration-200">
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
              <Field label="Base Rent / m²" value={perM2Line(1000)} />
              <Field label="Annual Rent" value={rentLine(180_000)} />
              <Field
                label="Effective Rent"
                value={rentLine(162_000, "after 2-mo rent-free, Annex 2")}
                source="§4.1 — Base Lease, p. 12"
              />
              <Field label="Step Rent" value="Yes — +3% in Year 3, +3% in Year 5" source="§4.3 — Base Lease, p. 13" />
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
              <Field label="Break Penalty" value="3 months base rent payable on exercise" source="§8.3 — Base Lease, p. 25" />
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

            <Section title="Renewal">
              <Field label="Renewal Type" value="Notice Required" />
              <Field label="Notice Period" value="6 months prior to expiry" source="§9.1 — Base Lease, p. 27" />
            </Section>

            <Section title="Bank Guarantee">
              <Field label="Amount" value={amountLine(54_000, "3 months rent")} />
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
              <Field
                label={"Notarial Deed"}
                value={
                  <span title="Poddanie się egzekucji — Art. 777 KPC enforcement submission deed">
                    Yes (Art. 777 KPC) · valid through 30 Jun 2026
                  </span>
                }
                source="§14.4 — Base Lease, p. 39"
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

            <Section title="Obligations">
              <Field label="Non-Compete / Exclusivity" value="None" />
              <Field label="Reinstatement" value="Partial — fit-out removal, surfaces reinstated" source="§17.2 — Base Lease, p. 44" />
              <Field label="Green Clause" value={<span className="text-muted-foreground">Not present</span>} />
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
              <Field label="Annual Rent" value={unit.annualRent ? rentLine(unit.annualRent) : "—"} />
              <Field label="Rent / m²" value={unit.rentPerM2 ? perM2Line(unit.rentPerM2) : "—"} />
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