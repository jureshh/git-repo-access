import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FLOORS, Floor, STATUS_FILL, STATUS_META, Unit, unitsByFloor } from "./data";

interface Props {
  /** Legacy prop — ignored in stacking plan (kept for API compat). */
  floor?: Floor;
  /** Legacy prop — ignored. */
  onFloorChange?: (f: Floor) => void;
  selectedUnitId: string | null;
  onSelectUnit: (id: string) => void;
}

const floorLabel = (f: Floor) => (f === "GF" ? "Ground Floor" : `Floor ${f}`);
const anchorId = (f: Floor) => `stack-floor-${f}`;

function Segment({
  unit,
  widthPct,
  selected,
  onClick,
}: {
  unit: Unit;
  widthPct: number;
  selected: boolean;
  onClick: () => void;
}) {
  const fill = STATUS_FILL[unit.status];
  const isVacant = unit.status === "grey";
  const showText = widthPct >= 8;
  const wide = widthPct >= 18;

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={onClick}
            style={{
              width: `${widthPct}%`,
              backgroundColor: isVacant ? "transparent" : fill,
              backgroundImage: isVacant
                ? "repeating-linear-gradient(45deg, hsl(var(--muted-foreground) / 0.25) 0 4px, transparent 4px 10px)"
                : undefined,
              borderColor: selected ? "hsl(var(--primary))" : fill,
              boxShadow: selected ? "0 0 0 2px hsl(var(--primary) / 0.5)" : undefined,
            }}
            className={[
              "relative h-full border-2 first:rounded-l-md last:rounded-r-md text-left",
              "transition-transform hover:z-10 hover:scale-[1.01] focus:outline-none focus:z-10",
              isVacant ? "bg-muted/40" : "",
            ].join(" ")}
          >
            {/* Top status accent */}
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{ backgroundColor: fill, opacity: isVacant ? 0.5 : 1 }}
            />

            {/* Center label */}
            {showText ? (
              <div
                className={[
                  "absolute inset-0 flex flex-col items-start justify-center px-2 pt-2 pb-4 overflow-hidden",
                  isVacant ? "text-muted-foreground" : "text-foreground",
                ].join(" ")}
              >
                <span
                  className={[
                    "font-semibold leading-tight truncate w-full",
                    wide ? "text-xs" : "text-[10px]",
                  ].join(" ")}
                >
                  {unit.tenant}
                </span>
                {wide && (
                  <span className="text-[10px] opacity-80 leading-tight">
                    {unit.sqm.toLocaleString()} sqm
                  </span>
                )}
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[9px] font-semibold text-foreground/80">{unit.id}</span>
              </div>
            )}

            {/* Alert bell */}
            {unit.alert && (
              <div
                className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full flex items-center justify-center text-white text-[9px] font-bold"
                style={{ backgroundColor: fill }}
                aria-label="alert"
              >
                !
              </div>
            )}

            {/* Unit code bottom-left */}
            {showText && (
              <span className="absolute bottom-1 left-2 text-[9px] font-medium text-muted-foreground">
                {unit.id}
              </span>
            )}

            {/* WAULT bottom-right */}
            {showText && !isVacant && wide && (
              <span
                className="absolute bottom-1 right-2 text-[9px] font-semibold"
                style={{ color: fill }}
              >
                {unit.wault}
              </span>
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">
          <div className="font-semibold">{unit.tenant}</div>
          <div className="text-muted-foreground">
            {unit.sqm.toLocaleString()} sqm · {widthPct.toFixed(1)}% of floor
          </div>
          <div className="text-muted-foreground">
            WAULT: {unit.wault} · {STATUS_META[unit.status].label}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function FloorRow({
  floor,
  units,
  selectedUnitId,
  onSelectUnit,
}: {
  floor: Floor;
  units: Unit[];
  selectedUnitId: string | null;
  onSelectUnit: (id: string) => void;
}) {
  const totalSqm = units.reduce((s, u) => s + u.sqm, 0);
  return (
    <div id={anchorId(floor)} className="flex items-stretch gap-3 scroll-mt-20">
      <div className="w-32 shrink-0 flex flex-col justify-center text-right pr-1">
        <span className="text-xs font-semibold text-foreground">{floorLabel(floor)}</span>
        <span className="text-[10px] text-muted-foreground">
          {totalSqm.toLocaleString()} sqm GLA
        </span>
      </div>
      <div className="flex-1 h-16 flex rounded-md overflow-hidden bg-muted/30 border border-border">
        {units.length === 0 ? (
          <div className="w-full flex items-center justify-center text-[11px] text-muted-foreground">
            No units
          </div>
        ) : (
          units.map((u) => (
            <Segment
              key={u.id}
              unit={u}
              widthPct={totalSqm ? (u.sqm / totalSqm) * 100 : 0}
              selected={u.id === selectedUnitId}
              onClick={() => onSelectUnit(u.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export function FloorPlan({ selectedUnitId, onSelectUnit }: Props) {
  // Highest floor first, GF at bottom
  const ordered = [...FLOORS].sort((a, b) => {
    if (a === "GF") return 1;
    if (b === "GF") return -1;
    return Number(b) - Number(a);
  });

  return (
    <Card className="glass p-4 flex flex-col">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className="font-medium text-foreground">Jump to:</span>
          {ordered.map((f, i) => (
            <span key={f} className="flex items-center gap-2">
              {i > 0 && <span className="text-border">·</span>}
              <a
                href={`#${anchorId(f)}`}
                className="hover:text-primary transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById(anchorId(f))
                    ?.scrollIntoView({ behavior: "smooth", block: "center" });
                }}
              >
                {f === "GF" ? "GF" : `F${f}`}
              </a>
            </span>
          ))}
        </div>
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <LegendDot color={STATUS_FILL.green} label="Secure" />
          <LegendDot color={STATUS_FILL.amber} label="Watch" />
          <LegendDot color={STATUS_FILL.red} label="Critical" />
          <LegendDot color={STATUS_FILL.grey} label="Vacant" hatched />
        </div>
      </div>

      <div className="max-h-[520px] overflow-y-auto pr-1 space-y-2.5">
        {ordered.map((f) => (
          <FloorRow
            key={f}
            floor={f}
            units={unitsByFloor[f]}
            selectedUnitId={selectedUnitId}
            onSelectUnit={onSelectUnit}
          />
        ))}
      </div>
    </Card>
  );
}

function LegendDot({ color, label, hatched }: { color: string; label: string; hatched?: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="inline-block h-2.5 w-2.5 rounded-sm"
        style={{
          background: hatched
            ? `repeating-linear-gradient(45deg, ${color} 0 2px, transparent 2px 4px)`
            : color,
          border: hatched ? `1px solid ${color}` : undefined,
        }}
      />
      <span>{label}</span>
    </div>
  );
}