import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Badge } from "@/components/ui/badge";
import type { Lease } from "@/lib/api";

export function TenantTab({ leases }: { leases: Lease[] }) {
  const categoryCount = Object.entries(
    leases.reduce<Record<string, number>>((acc, l) => {
      const cat = l.tenantCategory || "Other";
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {})
  )
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const leaseTypes = Object.entries(
    leases.reduce<Record<string, number>>((acc, l) => {
      const t = l.leaseType || "Unknown";
      acc[t] = (acc[t] || 0) + 1;
      return acc;
    }, {})
  );

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tenant Mix by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryCount} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis type="number" tick={{ fontSize: 12 }} className="fill-muted-foreground" />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={80} className="fill-muted-foreground" />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(250, 80%, 62%)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lease Type Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leaseTypes.map(([type, count]) => (
              <div key={type} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="font-medium">{type}</span>
                <Badge variant="secondary">{count} leases</Badge>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground">Exclusivity Clauses</h4>
            {leases.filter((l) => l.exclusivityClause).map((l) => (
              <div key={l.id} className="text-sm p-3 rounded-lg bg-muted/30">
                <span className="font-medium">{l.tenantName}:</span>{" "}
                <span className="text-muted-foreground">{l.exclusivityClause}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
