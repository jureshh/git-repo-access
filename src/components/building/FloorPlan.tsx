import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FLOORS, Floor, STATUS_FILL, Unit, unitsByFloor } from "./data";

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
  const fill = STATUS_FILL[unit.status];
  const isVacant = unit.status === "grey";
  return (
    <g
      onClick={onClick}
      style={{
        cursor: "pointer",
        filter: selected ? "drop-shadow(0 0 8px hsl(var(--primary)))" : undefined,
      }}
    >
      {/* Unit fill */}
      <rect
        x={unit.x}
        y={unit.y}
        width={unit.w}
        height={unit.h}
        rx={2}
        fill={fill}
        fillOpacity={isVacant ? 0.18 : 0.18}
        stroke={selected ? "hsl(var(--primary))" : fill}
        strokeWidth={selected ? 3 : 2}
      />
      {/* Status accent bar on top */}
      <rect
        x={unit.x}
        y={unit.y}
        width={unit.w}
        height={6}
        fill={fill}
        fillOpacity={isVacant ? 0.4 : 1}
      />
      <text
        x={unit.x + 10}
        y={unit.y + 26}
        fill="hsl(var(--foreground))"
        fontSize={12}
        fontWeight={700}
      >
        {unit.tenant}
      </text>
      <text x={unit.x + 10} y={unit.y + 42} fill="hsl(var(--muted-foreground))" fontSize={10}>
        {unit.sqm.toLocaleString()} sqm
      </text>
      {!isVacant && (
        <text
          x={unit.x + unit.w - 8}
          y={unit.y + unit.h - 8}
          fill={fill}
          fontSize={10}
          fontWeight={600}
          textAnchor="end"
        >
          {unit.wault}
        </text>
      )}
      {unit.alert && (
        <g transform={`translate(${unit.x + unit.w - 18}, ${unit.y + 14})`}>
          <circle cx={0} cy={0} r={8} fill={fill} />
          <path
            d="M-3 -3 a3 3 0 0 1 6 0 v2 l1 2 h-8 l1 -2 z M-1.5 2 a1.5 1.5 0 0 0 3 0"
            fill="none"
            stroke="white"
            strokeWidth={1.2}
            strokeLinejoin="round"
          />
        </g>
      )}
      <text
        x={unit.x + 10}
        y={unit.y + unit.h - 8}
        fill="hsl(var(--muted-foreground))"
        fontSize={9}
        fontWeight={500}
      >
        {unit.id}
      </text>
    </g>
  );
}

export function FloorPlan({ floor, onFloorChange, selectedUnitId, onSelectUnit }: Props) {
  const units = unitsByFloor[floor];
  return (
    <Card className="glass p-3 flex flex-col h-full">
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

      <div className="flex-1 min-h-0 rounded-lg overflow-hidden border border-border bg-muted/30">
        <svg
          viewBox="0 0 900 480"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <pattern
              id="floorGrid"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>

          {/* Building outline / shell */}
          <rect
            x={8}
            y={8}
            width={884}
            height={464}
            rx={4}
            fill="hsl(var(--card))"
            stroke="hsl(var(--foreground))"
            strokeWidth={3}
          />
          <rect x={8} y={8} width={884} height={464} fill="url(#floorGrid)" />

          {/* Corridor (Common Area) — horizontal spine + small offshoots */}
          <g>
            <rect
              x={250}
              y={192}
              width={634}
              height={104}
              fill="hsl(var(--muted))"
              stroke="hsl(var(--border))"
              strokeWidth={1}
            />
            <text
              x={567}
              y={248}
              fill="hsl(var(--muted-foreground))"
              fontSize={12}
              fontWeight={500}
              textAnchor="middle"
              letterSpacing="2"
            >
              COMMON AREA
            </text>

            {/* Escalator markers */}
            <g transform="translate(420, 218)">
              <rect width={56} height={52} fill="hsl(var(--card))" stroke="hsl(var(--border))" />
              <path
                d="M6 46 L50 6 M14 46 L50 14 M22 46 L50 22"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth={1.5}
                fill="none"
              />
              <text x={28} y={62} fontSize={7} fill="hsl(var(--muted-foreground))" textAnchor="middle">
                ESC
              </text>
            </g>

            {/* Restrooms / utility */}
            <g transform="translate(680, 218)">
              <rect width={44} height={52} fill="hsl(var(--card))" stroke="hsl(var(--border))" />
              <text x={22} y={32} fontSize={11} fill="hsl(var(--muted-foreground))" textAnchor="middle">
                WC
              </text>
            </g>

            {/* Stairs */}
            <g transform="translate(800, 218)">
              <rect width={44} height={52} fill="hsl(var(--card))" stroke="hsl(var(--border))" />
              <path
                d="M4 48 H40 M4 40 H40 M4 32 H40 M4 24 H40 M4 16 H40 M4 8 H40"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth={0.8}
                fill="none"
              />
            </g>
          </g>

          {/* Units */}
          {units.length === 0 ? (
            <text
              x={450}
              y={240}
              fill="hsl(var(--muted-foreground))"
              fontSize={16}
              textAnchor="middle"
            >
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

          {/* Compass + scale */}
          <g transform="translate(840, 36)">
            <circle cx={0} cy={0} r={14} fill="hsl(var(--card))" stroke="hsl(var(--border))" />
            <path d="M0 -10 L4 4 L0 0 L-4 4 Z" fill="hsl(var(--foreground))" />
            <text x={0} y={-16} fontSize={8} fill="hsl(var(--muted-foreground))" textAnchor="middle">
              N
            </text>
          </g>
        </svg>
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