import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, Shield, FileWarning } from "lucide-react";
import type { Lease } from "@/lib/api";

interface RiskItem {
  tenant: string;
  type: string;
  severity: "high" | "medium" | "low";
  detail: string;
  icon: typeof AlertTriangle;
}

export function RiskTab({ leases }: { leases: Lease[] }) {
  const risks: RiskItem[] = [];

  leases.forEach((l) => {
    // Expiring soon
    const endDate = new Date(l.leaseEndDate);
    const monthsLeft = (endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30);
    if (monthsLeft < 6 && monthsLeft > 0) {
      risks.push({
        tenant: l.tenantName,
        type: "Expiring Lease",
        severity: monthsLeft < 3 ? "high" : "medium",
        detail: `Expires ${endDate.toLocaleDateString()} — ${Math.round(monthsLeft)} months remaining`,
        icon: Clock,
      });
    }

    // Co-tenancy risk
    if (l.coTenancyClause) {
      risks.push({
        tenant: l.tenantName,
        type: "Co-Tenancy Clause",
        severity: "medium",
        detail: l.coTenancyClause,
        icon: Shield,
      });
    }

    // Low confidence
    if (l.extractionConfidence && l.extractionConfidence < 95) {
      risks.push({
        tenant: l.tenantName,
        type: "Low Extraction Confidence",
        severity: "low",
        detail: `${l.extractionConfidence}% confidence — manual review recommended`,
        icon: FileWarning,
      });
    }
  });

  const severityColor = (s: string) => {
    if (s === "high") return "bg-destructive/10 text-destructive border-destructive/20";
    if (s === "medium") return "bg-warning/10 text-warning border-warning/20";
    return "bg-muted text-muted-foreground";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Risk Alerts ({risks.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {risks.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No risks detected. Your portfolio looks healthy.</p>
          ) : (
            <div className="space-y-3">
              {risks.map((risk, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-muted/30 transition-colors">
                  <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <risk.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">{risk.tenant}</span>
                      <Badge variant="outline" className={severityColor(risk.severity)}>
                        {risk.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{risk.type}: {risk.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
