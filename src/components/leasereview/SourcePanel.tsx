import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { FieldKey, Tenant } from "./data";

interface Props {
  fieldKey: FieldKey | null;
  fieldLabel: string | null;
  tenant: Tenant | null;
  value: string | null;
}

export function SourcePanel({ fieldKey, fieldLabel, tenant, value }: Props) {
  if (!fieldKey || !tenant) {
    return (
      <Card className="p-10 flex flex-col items-center justify-center text-center min-h-[420px]">
        <div className="h-14 w-14 rounded-xl bg-muted flex items-center justify-center mb-4">
          <FileText className="h-7 w-7 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground max-w-xs">
          Select any cell to view the source clause
        </p>
      </Card>
    );
  }

  // For the demo, show a rich clause for guaranteeStatus + Café Roma; generic for others.
  const isCafeGuarantee = fieldKey === "guaranteeStatus" && tenant === "Café Roma";

  const clauseText = isCafeGuarantee
    ? "§14.1 — The Tenant shall maintain a bank guarantee in favour of the Landlord in the amount equal to three (3) months of Base Rent (PLN 54,000), issued by a first-class Polish bank acceptable to the Landlord. The guarantee shall remain valid for the entire Lease Term plus thirty (30) days thereafter and shall be renewed no later than thirty (30) days prior to its expiry date."
    : `Extracted from ${tenant} lease — clause governing "${fieldLabel}". Full source text available in linked document.`;

  const docLine = `Base Lease · ${tenant} · 387 pages`;
  const sourceRef = isCafeGuarantee ? "§14.1 — Base Lease, p. 38" : "§ — Base Lease";
  const confidence = isCafeGuarantee ? 84 : 92;

  return (
    <Card className="p-6 space-y-5 min-h-[420px]">
      <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Field</p>
        <h3 className="text-lg font-display font-bold leading-tight">{fieldLabel}</h3>
        <p className="text-sm text-muted-foreground">Tenant: <span className="text-foreground font-medium">{tenant}</span></p>
        <p className="text-xs text-muted-foreground">{docLine}</p>
      </div>

      <div className="rounded-lg border bg-primary/5 border-l-4 border-l-primary p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-primary mb-1">Extracted value</p>
        <p className="text-sm font-medium text-foreground leading-snug">
          {isCafeGuarantee
            ? "⚠ Expires before lease end — Guarantee expiry 30 Apr 2026 / Lease expiry 30 Jun 2026"
            : value}
        </p>
      </div>

      <div className="rounded-lg bg-muted/60 border p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Source clause</p>
        <p className="font-mono text-[12.5px] leading-relaxed text-foreground/90 whitespace-pre-wrap">
          {clauseText}
        </p>
        <a href="#" className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-primary hover:underline">
          → {sourceRef}
        </a>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Extraction confidence</span>
          <span className="font-mono font-semibold">{confidence}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div className="h-full bg-primary rounded-full" style={{ width: `${confidence}%` }} />
        </div>
        <div className="flex items-center gap-1.5 text-xs text-success font-medium pt-1">
          <CheckCircle2 className="h-3.5 w-3.5" /> Human reviewed
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-2 border-t">
        <Link to="/building" className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1">
          View full lease detail <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <Button className="w-full gap-2">
          View in document <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}