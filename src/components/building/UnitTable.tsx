import { CARD, STATUS_DOT_LABEL, TEAL, Unit } from "./data";

interface Props {
  units: Unit[];
  selectedUnitId: string | null;
  onSelectUnit: (id: string) => void;
}

const formatPLN = (v?: number) => (v == null ? "—" : `PLN ${v.toLocaleString()}`);

export function UnitTable({ units, selectedUnitId, onSelectUnit }: Props) {
  return (
    <div
      className="rounded-xl border border-white/5 h-full flex flex-col overflow-hidden"
      style={{ background: CARD }}
    >
      <div className="px-5 py-4 border-b border-white/5">
        <h2 className="text-sm font-semibold text-white">Units on Floor</h2>
        <p className="text-xs text-slate-400">Click a row for full lease detail</p>
      </div>
      <div className="flex-1 overflow-auto">
        <table className="w-full text-xs">
          <thead className="sticky top-0" style={{ background: CARD }}>
            <tr className="text-slate-400 text-left">
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
              const meta = STATUS_DOT_LABEL[u.status];
              return (
                <tr
                  key={u.id}
                  onClick={() => onSelectUnit(u.id)}
                  className="cursor-pointer transition-colors"
                  style={{
                    background: selected
                      ? "rgba(8,145,178,0.15)"
                      : i % 2
                        ? "rgba(255,255,255,0.015)"
                        : "transparent",
                    borderLeft: `3px solid ${selected ? TEAL : "transparent"}`,
                  }}
                >
                  <td className="px-3 py-2.5 text-white font-medium">{u.id}</td>
                  <td className="px-3 py-2.5 text-slate-200">{u.tenant}</td>
                  <td className="px-3 py-2.5 text-slate-300">{u.sqm.toLocaleString()}</td>
                  <td className="px-3 py-2.5 text-slate-300">{formatPLN(u.annualRent)}</td>
                  <td className="px-3 py-2.5 text-slate-300">{formatPLN(u.rentPerM2)}</td>
                  <td className="px-3 py-2.5 text-slate-300 whitespace-nowrap">
                    {u.expiry ?? "—"}
                  </td>
                  <td className="px-3 py-2.5 text-slate-300">{u.wault}</td>
                  <td className="px-3 py-2.5 whitespace-nowrap text-slate-200">
                    <span className="mr-1">{meta.emoji}</span>
                    {u.statusLabel}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}