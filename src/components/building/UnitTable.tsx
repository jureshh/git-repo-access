import { Card } from "@/components/ui/card";
import { STATUS_META, Unit } from "./data";

interface Props {
  units: Unit[];
  selectedUnitId: string | null;
  onSelectUnit: (id: string) => void;
}

const formatPLN = (v?: number) => (v == null ? "—" : `PLN ${v.toLocaleString()}`);

export function UnitTable({ units, selectedUnitId, onSelectUnit }: Props) {
  return (
    <Card className="glass flex flex-col overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h2 className="text-sm font-display font-bold tracking-tight">Units on Floor</h2>
        <p className="text-xs text-muted-foreground">Click a row for full lease detail</p>
      </div>
      <div className="flex-1 overflow-auto">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-card z-10">
            <tr className="text-muted-foreground text-left border-b border-border">
              {["Unit", "Tenant", "sqm", "Annual Rent", "Rent/m²", "Expiry", "WAULT", "Status"].map(
                (h) => (
                  <th key={h} className="px-3 py-2 font-medium whitespace-nowrap">
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {units.map((u, i) => {
              const selected = u.id === selectedUnitId;
              const meta = STATUS_META[u.status];
              return (
                <tr
                  key={u.id}
                  onClick={() => onSelectUnit(u.id)}
                  className={[
                    "cursor-pointer transition-colors border-l-[3px]",
                    selected
                      ? "bg-primary/10 border-primary"
                      : `border-transparent hover:bg-muted/50 ${i % 2 ? "bg-muted/20" : ""}`,
                  ].join(" ")}
                >
                  <td className="px-3 py-2.5 font-medium text-foreground">{u.id}</td>
                  <td className="px-3 py-2.5 text-foreground">{u.tenant}</td>
                  <td className="px-3 py-2.5 text-muted-foreground">{u.sqm.toLocaleString()}</td>
                  <td className="px-3 py-2.5 text-muted-foreground">{formatPLN(u.annualRent)}</td>
                  <td className="px-3 py-2.5 text-muted-foreground">{formatPLN(u.rentPerM2)}</td>
                  <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap">
                    {u.expiry ?? "—"}
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground">{u.wault}</td>
                  <td className={`px-3 py-2.5 whitespace-nowrap font-medium ${meta.className}`}>
                    <span className="mr-1">{meta.emoji}</span>
                    {u.statusLabel}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}