import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KpiCard } from "@/components/KpiCard";
import { MOCK_KPIS, MOCK_LEASES, getDashboardData, type KpiData, type Lease } from "@/lib/api";
import {
  FileText, DollarSign, TrendingUp, Building2, AlertTriangle, Users, ShieldCheck, Percent
} from "lucide-react";
import { PortfolioTab } from "@/components/dashboard/PortfolioTab";
import { FinancialTab } from "@/components/dashboard/FinancialTab";
import { RiskTab } from "@/components/dashboard/RiskTab";
import { TenantTab } from "@/components/dashboard/TenantTab";

export default function Dashboard() {
  const [kpis, setKpis] = useState<KpiData>(MOCK_KPIS);
  const [leases, setLeases] = useState<Lease[]>(MOCK_LEASES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardData()
      .then((data) => {
        setKpis(data.kpis);
        setLeases(data.leases);
      })
      .catch(() => {
        // fallback to mock data (already set)
      })
      .finally(() => setLoading(false));
  }, []);

  const fmt = (n: number) =>
    n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : `$${(n / 1_000).toFixed(0)}K`;

  return (
    <div className="py-8 lg:py-12">
      <div className="container space-y-8">
        <div style={{ animation: "fade-up 0.5s ease-out forwards" }}>
          <h1 className="text-3xl font-display font-bold">Portfolio Dashboard</h1>
          <p className="text-muted-foreground mt-1">Real-time lease intelligence across your properties.</p>
        </div>

        {/* KPI row */}
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          style={{ animation: "fade-up 0.6s ease-out 0.1s forwards", opacity: 0 }}
        >
          <KpiCard title="Total Leases" value={kpis.totalLeases.toString()} icon={FileText} trend={{ value: "+12 this quarter", positive: true }} />
          <KpiCard title="Monthly Revenue" value={fmt(kpis.totalMonthlyRevenue)} icon={DollarSign} trend={{ value: "+4.2%", positive: true }} />
          <KpiCard title="Occupancy Rate" value={`${kpis.occupancyRate}%`} icon={Building2} trend={{ value: "+1.8%", positive: true }} />
          <KpiCard title="Expiring Soon" value={kpis.expiringLeases.toString()} icon={AlertTriangle} subtitle="Next 6 months" />
        </div>

        {/* Tabs */}
        <Tabs
          defaultValue="portfolio"
          className="space-y-6"
          style={{ animation: "fade-up 0.6s ease-out 0.2s forwards", opacity: 0 }}
        >
          <TabsList className="bg-muted/50 p-1 h-auto flex-wrap">
            <TabsTrigger value="portfolio" className="gap-2 data-[state=active]:bg-card">
              <Building2 className="h-4 w-4" /> Portfolio
            </TabsTrigger>
            <TabsTrigger value="financial" className="gap-2 data-[state=active]:bg-card">
              <TrendingUp className="h-4 w-4" /> Financial
            </TabsTrigger>
            <TabsTrigger value="risk" className="gap-2 data-[state=active]:bg-card">
              <ShieldCheck className="h-4 w-4" /> Risk
            </TabsTrigger>
            <TabsTrigger value="tenants" className="gap-2 data-[state=active]:bg-card">
              <Users className="h-4 w-4" /> Tenants
            </TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio">
            <PortfolioTab leases={leases} />
          </TabsContent>
          <TabsContent value="financial">
            <FinancialTab leases={leases} kpis={kpis} />
          </TabsContent>
          <TabsContent value="risk">
            <RiskTab leases={leases} />
          </TabsContent>
          <TabsContent value="tenants">
            <TenantTab leases={leases} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
