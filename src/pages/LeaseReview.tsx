import { Fragment, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  GROUPS, FIELDS, TENANTS, DATA, GROUP_FILTER_MAP,
  type GroupKey, type Tenant, type FieldKey,
} from "@/components/leasereview/data";
import { SourcePanel } from "@/components/leasereview/SourcePanel";
import { useFormatRent } from "@/lib/currency";
import { AskPortfolio } from "@/components/leasereview/AskPortfolio";

const RENT_FIELDS = new Set<FieldKey>(["annualRent", "effectiveRent", "guaranteeAmount"]);
const PER_M2_FIELDS = new Set<FieldKey>(["baseRent"]);

type ViewMode = "portfolio" | "lease" | "ask";

function cellTone(field: FieldKey, value: string): string {
  if (value === "None" || value === "—" || value === "") return "text-muted-foreground";
  return "";
}

function cellBgTint(field: FieldKey, value: string): string {
  if (field === "wault") {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      if (num < 1) return "bg-destructive/10";
      if (num < 3) return "bg-warning/10";
    }
  }
  if (field === "guaranteeStatus" && value.includes("⚠")) return "bg-destructive/10";
  if (field === "breakOption" && value !== "None") return "bg-warning/10";
  return "";
}

export default function LeaseReview() {
  const fmtRent = useFormatRent();
  const renderCell = (field: FieldKey, raw: string): React.ReactNode => {
    if (!raw) return raw;
    const num = Number(raw.replace(/[^\d.-]/g, ""));
    if (Number.isNaN(num) || num === 0) return raw;
    if (RENT_FIELDS.has(field)) {
      const r = fmtRent(num);
      return (
        <span>
          <span className="font-medium">{r.primary}</span>
          <span className="block text-[10px] text-muted-foreground">{r.secondary}</span>
        </span>
      );
    }
    if (PER_M2_FIELDS.has(field)) {
      const r = fmtRent(num, { suffix: "/m²" });
      return (
        <span>
          <span className="font-medium">{r.primary}</span>
          <span className="block text-[10px] text-muted-foreground">{r.secondary}</span>
        </span>
      );
    }
    return raw;
  };

  const [view, setView] = useState<ViewMode>("portfolio");
  const [filter, setFilter] = useState<string>("All Fields");
  const [collapsed, setCollapsed] = useState<Record<GroupKey, boolean>>({
    Financial: false, Dates: false, Renewal: false, Guarantees: false, Indexation: false, Obligations: false,
  });
  const [selected, setSelected] = useState<{ field: FieldKey; tenant: Tenant } | null>({
    field: "guaranteeStatus", tenant: "Café Roma",
  });
  const [activeTenant, setActiveTenant] = useState<Tenant>("Anchor – Fashion");

  const visibleGroups = useMemo(() => GROUP_FILTER_MAP[filter] ?? GROUPS, [filter]);

  const toggleGroup = (g: GroupKey) =>
    setCollapsed((c) => ({ ...c, [g]: !c[g] }));

  const selectedField = selected ? FIELDS.find((f) => f.key === selected.field) : null;
  const selectedValue = selected ? DATA[selected.field][selected.tenant] : null;

  return (
    <div className="py-8 lg:py-12">
      <div className="container space-y-6">
        <div style={{ animation: "fade-up 0.5s ease-out forwards" }}>
          <h1 className="text-3xl font-display font-bold">Lease Review</h1>
          <p className="text-muted-foreground mt-1">
            Portfolio-wide clause extraction with source-linked citations.
          </p>
        </div>

        <div className={cn(
          "grid grid-cols-1 gap-6 items-start",
          view !== "ask" && "lg:grid-cols-[63fr_37fr]"
        )}>
          {/* Left: table */}
          <div className="space-y-3 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex rounded-lg border bg-card p-1">
                <button
                  onClick={() => setView("portfolio")}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                    view === "portfolio" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Portfolio View
                </button>
                <button
                  onClick={() => setView("lease")}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                    view === "lease" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Lease View
                </button>
                <button
                  onClick={() => setView("ask")}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                    view === "ask" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Ask Portfolio
                </button>
              </div>
              <div className="flex items-center gap-2">
                {view === "lease" && (
                  <Select value={activeTenant} onValueChange={(v) => setActiveTenant(v as Tenant)}>
                    <SelectTrigger className="w-[180px] h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TENANTS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
                {view !== "ask" && (
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-[150px] h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(GROUP_FILTER_MAP).map((k) => (
                      <SelectItem key={k} value={k}>{k}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                )}
              </div>
            </div>

            {/* Table or chat */}
            {view === "ask" ? (
              <AskPortfolio />
            ) : (
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead className="bg-muted/60">
                    <tr>
                      <th className="sticky left-0 z-10 bg-muted/60 text-left font-semibold px-3 py-2.5 border-b border-r min-w-[170px]">
                        Clause
                      </th>
                      {(view === "portfolio" ? TENANTS : [activeTenant]).map((t) => (
                        <th key={t} className="text-left font-semibold px-3 py-2.5 border-b min-w-[120px]">
                          {t}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {GROUPS.filter((g) => visibleGroups.includes(g)).map((group) => {
                      const groupFields = FIELDS.filter((f) => f.group === group);
                      const isOpen = !collapsed[group];
                      const tenants = view === "portfolio" ? [...TENANTS] : [activeTenant];
                      return (
                        <Fragment key={group}>
                          <tr className="bg-muted/40 hover:bg-muted/60 cursor-pointer" onClick={() => toggleGroup(group)}>
                            <td
                              colSpan={tenants.length + 1}
                              className="px-3 py-2 font-semibold text-foreground border-b"
                            >
                              <div className="flex items-center gap-2">
                                {isOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                                {group}
                              </div>
                            </td>
                          </tr>
                          {isOpen && groupFields.map((f, i) => (
                            <tr key={f.key} className={cn(i % 2 === 1 ? "bg-muted/20" : "bg-card")}>
                              <td className="sticky left-0 z-10 bg-inherit px-3 py-2 text-muted-foreground border-r border-b font-medium whitespace-nowrap">
                                {f.label}
                              </td>
                              {tenants.map((t) => {
                                const val = DATA[f.key][t];
                                const isSel = selected?.field === f.key && selected?.tenant === t;
                                return (
                                  <td
                                    key={t}
                                    onClick={() => setSelected({ field: f.key, tenant: t })}
                                    className={cn(
                                      "px-3 py-2 border-b cursor-pointer transition-colors hover:border-l-2 hover:border-l-primary",
                                      cellTone(f.key, val),
                                      cellBgTint(f.key, val),
                                      isSel && "border-l-2 border-l-primary bg-primary/10 text-foreground font-medium",
                                    )}
                                  >
                                    {renderCell(f.key, val)}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
            )}
          </div>

          {/* Right: source panel - sticky (hidden in chat mode) */}
          {view !== "ask" && (
          <div className="lg:sticky lg:top-24">
            <SourcePanel
              fieldKey={selected?.field ?? null}
              fieldLabel={selectedField?.label ?? null}
              tenant={selected?.tenant ?? null}
              value={selectedValue}
            />
          </div>
          )}
        </div>
      </div>
    </div>
  );
}