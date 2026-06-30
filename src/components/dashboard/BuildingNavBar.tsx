import { Building2, Store, Warehouse, LandPlot, Castle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export interface BuildingMeta {
  id: string;
  name: string;
  city: string;
  icon: React.ComponentType<{ className?: string }>;
  live: boolean;
}

export const BUILDINGS: BuildingMeta[] = [
  { id: "galeria-orkana", name: "Galeria Orkana", city: "Lublin", icon: Store, live: true },
  { id: "vivo-krosno", name: "Vivo! Krosno", city: "Krosno", icon: Warehouse, live: false },
  { id: "vivo-pila", name: "Vivo! Piła", city: "Piła", icon: Building2, live: false },
  { id: "ogrody", name: "Ogrody", city: "Elbląg", icon: LandPlot, live: false },
  { id: "myhive-spire", name: "myhive Warsaw Spire", city: "Warsaw", icon: Castle, live: false },
];

interface Props {
  selectedId: string;
  onSelect: (id: string) => void;
}

export function BuildingNavBar({ selectedId, onSelect }: Props) {
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Portfolio Buildings
        </h2>
        <span className="text-[11px] text-muted-foreground">
          1 of {BUILDINGS.length} integrated · scroll for more
        </span>
      </div>
      <div className="relative">
        <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mx-1 px-1">
          {BUILDINGS.map((b) => {
            const Icon = b.icon;
            const selected = selectedId === b.id && b.live;
            return (
              <button
                key={b.id}
                onClick={() => {
                  if (b.live) {
                    setNotice(null);
                    onSelect(b.id);
                  } else {
                    setNotice(`${b.name} — live data not yet connected`);
                  }
                }}
                title={b.live ? `${b.name} (${b.city})` : `${b.name} — Coming Soon`}
                className={cn(
                  "snap-start shrink-0 w-40 rounded-xl border bg-card p-3 text-left transition-all",
                  "flex flex-col gap-2",
                  b.live
                    ? "hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                    : "opacity-50 cursor-not-allowed grayscale",
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
                    {b.live ? "● Live" : "Coming Soon"}
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