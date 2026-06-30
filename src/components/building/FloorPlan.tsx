import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FLOORS, Floor, STATUS_FILL, Unit, unitsByFloor } from "./data";

interface Props {
  floor: Floor;
  onFloorChange: (f: Floor) => void;
  selectedUnitId: string | null;
  onSelectUnit: (id: string) => void;
}

// Architectural site-plan slots arranged around a central circular atrium.
// Slots are ordered LARGEST → SMALLEST so the largest unit gets the largest
// footprint regardless of array order in data.ts.
interface Slot {
  points: string;       // polygon points
  cx: number; cy: number; // centroid for number badge + labels
  textAnchor?: "start" | "middle" | "end";
}

const SLOTS: Slot[] = [
  // 1. Largest east wing
  { points: "590,110 870,140 880,470 575,470 535,355 535,205", cx: 715, cy: 295, textAnchor: "middle" },
  // 2. Bottom-east wedge
  { points: "535,355 575,470 760,540 870,540 870,470 575,470", cx: 705, cy: 495, textAnchor: "middle" },
  // 3. Top spanning band above atrium
  { points: "320,40 760,40 720,150 540,150 460,180 365,180", cx: 540, cy: 100, textAnchor: "middle" },
  // 4. Lower-left wing
  { points: "60,360 195,335 235,425 295,540 60,540", cx: 145, cy: 460, textAnchor: "middle" },
  // 5. Top-left chunk
  { points: "60,40 320,40 365,180 320,235 180,240 60,175", cx: 195, cy: 135, textAnchor: "middle" },
  // 6. Mid-left slim band (yellow #6 in reference)
  { points: "60,175 180,240 180,335 60,355", cx: 120, cy: 270, textAnchor: "middle" },
  // 7. Bottom band between wings
  { points: "295,540 575,470 575,540", cx: 460, cy: 520, textAnchor: "middle" },
  // 8. Tiny atrium-adjacent wedge (lower-mid)
  { points: "235,425 320,395 365,460 295,540", cx: 305, cy: 455, textAnchor: "middle" },
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
  return (
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
          <line x1="0" y1="0" x2="0" y2="8" stroke={h.stripe} strokeWidth="2.5" strokeOpacity="0.75" />
        </pattern>
      </defs>
      {/* Hatched fill */}
      <polygon
        points={slot.points}
        fill={`url(#${patternId})`}
        stroke={selected ? "hsl(var(--primary))" : h.outline}
        strokeWidth={selected ? 3 : 2}
        strokeLinejoin="round"
      />
      {/* Numbered badge */}
      <g>
        <circle cx={slot.cx} cy={slot.cy} r={14} fill="hsl(var(--card))" stroke={h.outline} strokeWidth={1.5} />
        <text
          x={slot.cx}
          y={slot.cy + 4}
          textAnchor="middle"
          fontSize={13}
          fontWeight={700}
          fill="hsl(var(--foreground))"
        >
          {index + 1}
        </text>
      </g>
    </g>
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
          viewBox="0 0 900 580"
          className="w-full h-auto block"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Building zone labels */}
          <text x={760} y={28} fontSize={13} fontWeight={600} fill="hsl(var(--muted-foreground))" textAnchor="end" letterSpacing="1">
            EAST WING
          </text>
          <text x={140} y={28} fontSize={13} fontWeight={600} fill="hsl(var(--muted-foreground))" textAnchor="start" letterSpacing="1">
            WEST WING
          </text>
          <text x={450} y={570} fontSize={13} fontWeight={600} fill="hsl(var(--muted-foreground))" textAnchor="middle" letterSpacing="1">
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
            <ellipse
              cx={440}
              cy={290}
              rx={108}
              ry={88}
              fill="hsl(var(--card))"
              stroke="hsl(var(--border))"
              strokeWidth={1.5}
              strokeDasharray="4 3"
            />
            <text x={440} y={285} textAnchor="middle" fontSize={11} fontWeight={600} fill="hsl(var(--muted-foreground))" letterSpacing="2">
              CENTRAL
            </text>
            <text x={440} y={302} textAnchor="middle" fontSize={11} fontWeight={600} fill="hsl(var(--muted-foreground))" letterSpacing="2">
              ATRIUM
            </text>
          </g>

          {/* Compass */}
          <g transform="translate(845, 50)">
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