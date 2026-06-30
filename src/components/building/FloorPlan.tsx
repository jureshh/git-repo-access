import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { FLOORS, Floor, STATUS_FILL, Unit, unitsByFloor } from "./data";

interface Props {
  floor: Floor;
  onFloorChange: (f: Floor) => void;
  selectedUnitId: string | null;
  onSelectUnit: (id: string) => void;
}

// Clean architectural ring layout: rectangular slots around a central atrium.
// Slots are ordered LARGEST → SMALLEST and assigned to units sorted by sqm,
// so footprint visually reflects unit size. No overlaps.
interface Slot {
  x: number; y: number; w: number; h: number;
}

const SLOTS: Slot[] = [
  { x: 60,  y: 40,  w: 780, h: 160 }, // 1. Top band (anchor)
  { x: 560, y: 200, w: 280, h: 160 }, // 2. Right wing
  { x: 60,  y: 200, w: 260, h: 160 }, // 3. Left wing
  { x: 60,  y: 360, w: 280, h: 160 }, // 4. Bottom-1
  { x: 340, y: 360, w: 175, h: 160 }, // 5. Bottom-2
  { x: 515, y: 360, w: 150, h: 160 }, // 6. Bottom-3
  { x: 665, y: 360, w: 100, h: 160 }, // 7. Bottom-4
  { x: 765, y: 360, w: 75,  h: 160 }, // 8. Bottom-5
];

// Hatch pattern stripe color per status
const HATCH: Record<string, { stripe: string; outline: string; bg: string }> = {
  green:  { stripe: "hsl(var(--success))",            outline: "hsl(var(--success))",            bg: "hsl(var(--success) / 0.10)" },
  amber:  { stripe: "hsl(var(--warning))",            outline: "hsl(var(--warning))",            bg: "hsl(var(--warning) / 0.10)" },
  red:    { stripe: "hsl(var(--destructive))",        outline: "hsl(var(--destructive))",        bg: "hsl(var(--destructive) / 0.10)" },
  grey:   { stripe: "hsl(var(--muted-foreground))",   outline: "hsl(var(--muted-foreground))",   bg: "hsl(var(--muted) / 0.40)" },
};

function UnitZone({
  unit,
  slot,
  index,
  selected,
  onClick,
}: {
  unit: Unit;
  slot: Slot;
  index: number;
  selected: boolean;
  onClick: () => void;
}) {
  const h = HATCH[unit.status];
  const patternId = `hatch-${unit.status}-${index}`;
  const cx = slot.x + slot.w / 2;
  const cy = slot.y + slot.h / 2;
  const showTenant = slot.w >= 110;
  return (
    <HoverCard openDelay={80} closeDelay={50}>
      <HoverCardTrigger asChild>
        <g
          onClick={onClick}
          style={{
            cursor: "pointer",
            filter: selected ? "drop-shadow(0 0 10px hsl(var(--primary) / 0.7))" : undefined,
          }}
        >
          <defs>
            <pattern id={patternId} patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
              <rect width="8" height="8" fill={h.bg} />
              <line x1="0" y1="0" x2="0" y2="8" stroke={h.stripe} strokeWidth="2.5" strokeOpacity="0.8" />
            </pattern>
          </defs>
          <rect
            x={slot.x}
            y={slot.y}
            width={slot.w}
            height={slot.h}
            rx={6}
            fill={`url(#${patternId})`}
            stroke={selected ? "hsl(var(--primary))" : h.outline}
            strokeWidth={selected ? 3 : 2}
          />
          {/* Numbered badge */}
          <circle cx={slot.x + 18} cy={slot.y + 18} r={13} fill="hsl(var(--card))" stroke={h.outline} strokeWidth={1.5} />
          <text
            x={slot.x + 18}
            y={slot.y + 22}
            textAnchor="middle"
            fontSize={12}
            fontWeight={700}
            fill="hsl(var(--foreground))"
          >
            {index + 1}
          </text>
          {showTenant && (
            <text
              x={cx}
              y={cy + 4}
              textAnchor="middle"
              fontSize={13}
              fontWeight={600}
              fill="hsl(var(--foreground))"
              style={{ pointerEvents: "none" }}
            >
              {unit.tenant}
            </text>
          )}
          {showTenant && (
            <text
              x={cx}
              y={cy + 22}
              textAnchor="middle"
              fontSize={11}
              fill="hsl(var(--muted-foreground))"
              style={{ pointerEvents: "none" }}
            >
              {unit.sqm.toLocaleString()} m²
            </text>
          )}
        </g>
      </HoverCardTrigger>
      <HoverCardContent className="w-64 p-3">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="font-semibold text-sm truncate">{unit.tenant}</span>
            <span
              className="text-[10px] font-medium px-1.5 py-0.5 rounded"
              style={{ background: `${HATCH[unit.status].bg}`, color: HATCH[unit.status].outline }}
            >
              {unit.statusLabel}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
            <span className="text-muted-foreground">Unit</span>
            <span className="text-right font-medium">{unit.id}</span>
            <span className="text-muted-foreground">Area</span>
            <span className="text-right font-medium">{unit.sqm.toLocaleString()} m²</span>
            <span className="text-muted-foreground">WAULT</span>
            <span className="text-right font-medium">{unit.wault}</span>
            {unit.expiry && (<><span className="text-muted-foreground">Expiry</span><span className="text-right font-medium">{unit.expiry}</span></>)}
            {unit.annualRent && (<><span className="text-muted-foreground">Annual rent</span><span className="text-right font-medium">€{unit.annualRent.toLocaleString()}</span></>)}
            {unit.rentPerM2 && (<><span className="text-muted-foreground">Rent / m²</span><span className="text-right font-medium">€{unit.rentPerM2.toLocaleString()}</span></>)}
          </div>
          {unit.alert && (
            <div className="text-[11px] mt-1 px-2 py-1 rounded bg-destructive/10 text-destructive font-medium">
              ⚠ {unit.alert}
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

export function FloorPlan({ floor, onFloorChange, selectedUnitId, onSelectUnit }: Props) {
  const units = unitsByFloor[floor];
  // Map units to slots ordered largest → smallest by sqm so footprint reflects size.
  const sortedUnits = [...units].sort((a, b) => b.sqm - a.sqm);
  const slotByUnitId: Record<string, { slot: Slot; index: number }> = {};
  sortedUnits.forEach((u, i) => {
    if (SLOTS[i]) slotByUnitId[u.id] = { slot: SLOTS[i], index: i };
  });
  return (
    <Card className="glass p-3 flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <Tabs value={floor} onValueChange={(v) => onFloorChange(v as Floor)}>
          <TabsList className="bg-muted/50">
            {FLOORS.map((f) => (
              <TabsTrigger
                key={f}
                value={f}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {f === "GF" ? "GF" : `Floor ${f}`}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground pr-1">
          <LegendDot color={STATUS_FILL.green} label="Secure" />
          <LegendDot color={STATUS_FILL.amber} label="Watch" />
          <LegendDot color={STATUS_FILL.red} label="Critical" />
          <LegendDot color={STATUS_FILL.grey} label="Vacant" />
        </div>
      </div>

      <div className="rounded-lg overflow-hidden border border-border bg-muted/30">
        <svg
          viewBox="0 0 900 560"
          className="w-full h-auto block"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Building zone labels */}
          <text x={840} y={28} fontSize={11} fontWeight={600} fill="hsl(var(--muted-foreground))" textAnchor="end" letterSpacing="1.5">
            EAST WING
          </text>
          <text x={60} y={28} fontSize={11} fontWeight={600} fill="hsl(var(--muted-foreground))" textAnchor="start" letterSpacing="1.5">
            WEST WING
          </text>
          <text x={450} y={550} fontSize={11} fontWeight={600} fill="hsl(var(--muted-foreground))" textAnchor="middle" letterSpacing="1.5">
            SOUTH PROMENADE
          </text>

          {/* Units (architectural zones) */}
          {units.length === 0 ? (
            <text
              x={450}
              y={290}
              fill="hsl(var(--muted-foreground))"
              fontSize={16}
              textAnchor="middle"
            >
              No unit data for this floor
            </text>
          ) : (
            units.map((u) => {
              const placement = slotByUnitId[u.id];
              if (!placement) return null;
              return (
                <UnitZone
                  key={u.id}
                  unit={u}
                  slot={placement.slot}
                  index={placement.index}
                  selected={u.id === selectedUnitId}
                  onClick={() => onSelectUnit(u.id)}
                />
              );
            })
          )}

          {/* Central atrium */}
          <g>
            <rect
              x={330}
              y={210}
              width={220}
              height={140}
              rx={10}
              fill="hsl(var(--card))"
              stroke="hsl(var(--border))"
              strokeWidth={1.5}
              strokeDasharray="5 4"
            />
            <text x={440} y={275} textAnchor="middle" fontSize={11} fontWeight={600} fill="hsl(var(--muted-foreground))" letterSpacing="2">
              CENTRAL
            </text>
            <text x={440} y={292} textAnchor="middle" fontSize={11} fontWeight={600} fill="hsl(var(--muted-foreground))" letterSpacing="2">
              ATRIUM
            </text>
          </g>

          {/* Compass */}
          <g transform="translate(870, 540)">
            <circle cx={0} cy={0} r={16} fill="hsl(var(--card))" stroke="hsl(var(--border))" />
            <path d="M0 -12 L5 5 L0 1 L-5 5 Z" fill="hsl(var(--foreground))" />
            <text x={0} y={-20} fontSize={9} fill="hsl(var(--muted-foreground))" textAnchor="middle" fontWeight={600}>
              N
            </text>
          </g>
        </svg>

        {/* Legend: unit number → tenant */}
        <div className="border-t border-border bg-card/50 px-3 py-2 grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-1 text-[11px]">
          {[...units].sort((a, b) => b.sqm - a.sqm).map((u, i) => (
            <button
              key={u.id}
              onClick={() => onSelectUnit(u.id)}
              className={`flex items-center gap-1.5 text-left hover:text-foreground transition-colors ${
                u.id === selectedUnitId ? "text-foreground font-medium" : "text-muted-foreground"
              }`}
            >
              <span
                className="inline-flex items-center justify-center h-4 w-4 rounded-full text-[9px] font-bold border"
                style={{ borderColor: STATUS_FILL[u.status], color: "hsl(var(--foreground))" }}
              >
                {i + 1}
              </span>
              <span className="truncate">{u.tenant}</span>
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: color }} />
      <span>{label}</span>
    </div>
  );
}