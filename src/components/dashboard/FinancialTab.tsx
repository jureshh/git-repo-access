import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import type { Lease, KpiData } from "@/lib/api";

const COLORS = [
  "hsl(172, 66%, 40%)",
  "hsl(250, 80%, 62%)",
  "hsl(35, 92%, 55%)",
  "hsl(340, 75%, 55%)",
  "hsl(200, 80%, 50%)",
];

export function FinancialTab({ leases, kpis }: { leases: Lease[]; kpis: KpiData }) {
  const rentByCategory = Object.entries(
    leases.reduce<Record<string, number>>((acc, l) => {
      const cat = l.tenantCategory || "Other";
      acc[cat] = (acc[cat] || 0) + l.monthlyBaseRent;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const rentByMall = Object.entries(
    leases.reduce<Record<string, number>>((acc, l) => {
      acc[l.mallName] = (acc[l.mallName] || 0) + l.monthlyBaseRent;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Revenue by Property</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={rentByMall}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} className="fill-muted-foreground" />
              <YAxis tick={{ fontSize: 12 }} className="fill-muted-foreground" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, "Monthly Rent"]} />
              <Bar dataKey="value" fill="hsl(172, 66%, 40%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Revenue by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={rentByCategory} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value" label={({ name }) => name}>
                {rentByCategory.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, "Monthly Rent"]} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
