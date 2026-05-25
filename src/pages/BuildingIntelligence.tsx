import { useState } from "react";
import { FloorPlan } from "@/components/building/FloorPlan";
import { LeaseDetailPanel } from "@/components/building/LeaseDetailPanel";
import { SummaryBar } from "@/components/building/SummaryBar";
import { UnitTable } from "@/components/building/UnitTable";
import { Floor, unitsByFloor } from "@/components/building/data";

export default function BuildingIntelligence() {
  const [floor, setFloor] = useState<Floor>("2");
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>("2-B1");

  const units = unitsByFloor[floor];
  const selectedUnit = units.find((u) => u.id === selectedUnitId) ?? null;

  const handleFloorChange = (f: Floor) => {
    setFloor(f);
    setSelectedUnitId(null);
  };

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
              floor={floor}
              onFloorChange={handleFloorChange}
              selectedUnitId={selectedUnitId}
              onSelectUnit={setSelectedUnitId}
            />
          </div>
          <div className="lg:col-span-2">
            {selectedUnit ? (
              <LeaseDetailPanel unit={selectedUnit} onClose={() => setSelectedUnitId(null)} />
            ) : (
              <UnitTable
                units={units}
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