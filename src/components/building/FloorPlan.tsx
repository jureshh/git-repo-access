import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ATRIUM, BG, CARD, FLOORS, Floor, STATUS_COLORS, TEAL, Unit, unitsByFloor } from "./data";

interface Props {
  floor: Floor;
  onFloorChange: (f: Floor) => void;
  selectedUnitId: string | null;
  onSelectUnit: (id: string) => void;
}

function UnitShape({
  unit,
  selected,
  onClick,
}: {
  unit: Unit;
  selected: boolean;
  onClick: () => void;
}) {
  const fill = STATUS_COLORS[unit.status];
  return (
    <g
      onClick={onClick}
      style={{ cursor: "pointer", filter: selected ? "drop-shadow(0 0 8px #0891B2)" : undefined }}
    >
      <rect
        x={unit.x}
        y={unit.y}
        width={unit.w}
        height={unit.h}
        rx={6}
        fill={fill}
        fillOpacity={unit.status === "grey" ? 0.5 : 0.85}
        stroke={selected ? TEAL : "rgba(255,255,255,0.08)"}
        strokeWidth={selected ? 2.5 : 1}
      />
      <text
        x={unit.x + 10}
        y={unit.y + 22}
        fill="white"
        fontSize={12}
        fontWeight={700}
      >
        {unit.tenant}
      </text>
      <text x={unit.x + 10} y={unit.y + 38} fill="rgba(255,255,255,0.75)" fontSize={10}>
        {unit.sqm.toLocaleString()} sqm
      </text>
      {unit.status !== "grey" && (
        <text
          x={unit.x + unit.w - 8}
          y={unit.y + unit.h - 8}
          fill="white"
          fontSize={10}
          textAnchor="end"
        >
          {unit.wault}
        </text>
      )}
      {unit.alert && (
        <g transform={`translate(${unit.x + unit.w - 22}, ${unit.y + 6})`}>
          {/* bell icon */}
          <path
            d="M8 2 C5 2 4 4 4 7 v3 l-1 2 h10 l-1-2 V7 c0-3-1-5-4-5z M6 14 a2 2 0 0 0 4 0"
            fill="white"
            stroke="white"
            strokeWidth={0.5}
          />
        </g>
      )}
      <text x={unit.x + 10} y={unit.y + unit.h - 8} fill="rgba(255,255,255,0.6)" fontSize={9}>
        {unit.id}
      </text>
    </g>
  );
}

export function FloorPlan({ floor, onFloorChange, selectedUnitId, onSelectUnit }: Props) {
  const units = unitsByFloor[floor];
  return (
    <div
      className="rounded-xl border border-white/5 p-4 flex flex-col h-full"
      style={{ background: CARD }}
    >
      <Tabs value={floor} onValueChange={(v) => onFloorChange(v as Floor)} className="mb-4">
        <TabsList className="bg-[#0D1B2A] border border-white/5">
          {FLOORS.map((f) => (
            <TabsTrigger
              key={f}
              value={f}
              className="data-[state=active]:bg-[#0891B2] data-[state=active]:text-white text-slate-300"
            >
              {f === "GF" ? "GF" : `Floor ${f}`}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="flex-1 min-h-0 rounded-lg overflow-hidden" style={{ background: BG }}>
        <svg viewBox="0 0 800 500" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          <rect x={0} y={0} width={800} height={500} fill={BG} />
          {/* Common area */}
          <rect x={220} y={20} width={390} height={330} rx={8} fill={ATRIUM} />
          <text x={415} y={190} fill="rgba(255,255,255,0.35)" fontSize={14} textAnchor="middle">
            Common Area
          </text>

          {units.length === 0 ? (
            <text x={400} y={260} fill="rgba(255,255,255,0.4)" fontSize={16} textAnchor="middle">
              No unit data for this floor
            </text>
          ) : (
            units.map((u) => (
              <UnitShape
                key={u.id}
                unit={u}
                selected={u.id === selectedUnitId}
                onClick={() => onSelectUnit(u.id)}
              />
            ))
          )}
        </svg>
      </div>

      <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
        <LegendDot color={STATUS_COLORS.green} label="Secure" />
        <LegendDot color={STATUS_COLORS.amber} label="Watch" />
        <LegendDot color={STATUS_COLORS.red} label="Critical" />
        <LegendDot color={STATUS_COLORS.grey} label="Vacant" />
      </div>
    </div>
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