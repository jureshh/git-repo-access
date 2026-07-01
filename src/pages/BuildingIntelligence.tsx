import { useMemo, useState } from "react";
import { FloorPlan } from "@/components/building/FloorPlan";
import { LeaseDetailPanel } from "@/components/building/LeaseDetailPanel";
import { SummaryBar } from "@/components/building/SummaryBar";
import { UnitTable } from "@/components/building/UnitTable";
import { FLOORS, unitsByFloor } from "@/components/building/data";

export default function BuildingIntelligence() {
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>("2-B1");

  const allUnits = useMemo(() => FLOORS.flatMap((f) => unitsByFloor[f]), []);
  const selectedUnit = allUnits.find((u) => u.id === selectedUnitId) ?? null;
  const sideUnits = selectedUnit
    ? unitsByFloor[
        (FLOORS.find((f) => unitsByFloor[f].some((u) => u.id === selectedUnit.id)) ?? "2")
      ]
    : allUnits;

  return (
    <div className="py-4 lg:py-6">
      <div className="container space-y-4">
        <div style={{ animation: "fade-up 0.5s ease-out forwards" }}>
          <h1 className="text-2xl font-display font-bold">Building Intelligence Centre</h1>
          <p className="text-sm text-muted-foreground">
            Visual floor plan and lease portfolio overview.
          </p>
        </div>
        <SummaryBar />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-start">
          <div className="lg:col-span-3">
            <FloorPlan
              selectedUnitId={selectedUnitId}
              onSelectUnit={setSelectedUnitId}
            />
          </div>
          <div className="lg:col-span-2">
            {selectedUnit ? (
              <LeaseDetailPanel unit={selectedUnit} onClose={() => setSelectedUnitId(null)} />
            ) : (
              <UnitTable
                units={sideUnits}
                selectedUnitId={selectedUnitId}
                onSelectUnit={setSelectedUnitId}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}