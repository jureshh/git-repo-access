import { Building2, Store, Warehouse, LandPlot, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { PORTFOLIO } from "@/lib/portfolio";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "galeria-orkana": Store,
  "vivo-pila": Building2,
  "vivo-krosno": Warehouse,
  "vivo-stalowa-wola": Building2,
  "ogrody": LandPlot,
};

export const BUILDINGS = PORTFOLIO.map((b) => ({
  id: b.id,
  name: b.name,
  city: b.city,
  live: b.live,
  icon: ICONS[b.id] ?? Building2,
}));

interface Props {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export function BuildingNavBar({ selectedId, onSelect }: Props) {
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Portfolio Buildings
        </h2>
        {selectedId && (
          <button
            onClick={() => { setNotice(null); onSelect(null); }}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium hover:bg-primary/15 transition-colors"
          >
            <ArrowLeft className="h-3 w-3" /> All Buildings
          </button>
        )}
      </div>
      <div className="relative">
        <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mx-1 px-1">
          {BUILDINGS.map((b) => {
            const Icon = b.icon;
            const selected = selectedId === b.id;
            return (
              <button
                key={b.id}
                onClick={() => {
                  setNotice(null);
                  if (selectedId === b.id) {
                    onSelect(null);
                  } else {
                    onSelect(b.id);
                  }
                }}
                title={b.live ? `${b.name} (${b.city})` : `${b.name} — Summary only`}
                className={cn(
                  "snap-start shrink-0 w-40 rounded-xl border bg-card p-3 text-left transition-all",
                  "flex flex-col gap-2",
                  "hover:shadow-md hover:-translate-y-0.5 cursor-pointer",
                  !b.live && "opacity-80",
                  selected && "border-primary ring-2 ring-primary/30 bg-primary/5"
                )}
              >
                <div
                  className={cn(
                    "h-10 w-10 rounded-lg flex items-center justify-center",
                    b.live ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-tight truncate">{b.name}</p>
                  <p className="text-[11px] text-muted-foreground">{b.city}</p>
                  <p
                    className={cn(
                      "text-[10px] font-semibold uppercase mt-1",
                      b.live ? "text-success" : "text-muted-foreground"
                    )}
                  >
                    {b.live ? "● Live" : "Summary only"}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
        {notice && (
          <p className="text-[11px] text-muted-foreground italic mt-1">{notice}</p>
        )}
      </div>
    </div>
  );
}