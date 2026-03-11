import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Lease } from "@/lib/api";

export function PortfolioTab({ leases }: { leases: Lease[] }) {
  const statusColor = (s: string) => {
    if (s === "active") return "bg-success/10 text-success border-success/20";
    if (s === "expiring_soon") return "bg-warning/10 text-warning border-warning/20";
    return "bg-muted text-muted-foreground";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lease Overview</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Mall</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Monthly Rent</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Confidence</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leases.map((l) => (
                  <TableRow key={l.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{l.tenantName}</TableCell>
                    <TableCell>{l.unitNumber}</TableCell>
                    <TableCell>{l.mallName}</TableCell>
                    <TableCell>{l.tenantCategory || "—"}</TableCell>
                    <TableCell className="text-right font-mono">${l.monthlyBaseRent.toLocaleString()}</TableCell>
                    <TableCell>{new Date(l.leaseEndDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusColor(l.status)}>
                        {l.status === "expiring_soon" ? "Expiring" : l.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">{l.extractionConfidence}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
