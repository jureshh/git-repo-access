import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  FileSearch, Shield, TrendingUp, Users, ArrowRight, BarChart3,
  Zap, Clock, CheckCircle2, Building2
} from "lucide-react";

const stats = [
  { value: "98.2%", label: "Extraction Accuracy", icon: CheckCircle2 },
  { value: "<30s", label: "Per Document", icon: Clock },
  { value: "147+", label: "Lease Fields", icon: FileSearch },
  { value: "50%", label: "Time Saved", icon: Zap },
];

const features = [
  {
    icon: FileSearch,
    title: "AI Lease Extraction",
    description: "Upload any PDF lease and our AI extracts every clause, date, and financial term with near-perfect accuracy.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Shield,
    title: "Risk Detection",
    description: "Automatically flag unfavorable clauses, co-tenancy risks, and upcoming lease expirations across your portfolio.",
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
  {
    icon: TrendingUp,
    title: "Financial Analytics",
    description: "Track revenue streams, escalation clauses, and rent benchmarks across all properties in real-time.",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: Users,
    title: "Tenant Intelligence",
    description: "Analyze tenant mix, category distribution, and identify optimization opportunities across your malls.",
    color: "text-warning",
    bg: "bg-warning/10",
  },
];

export default function Landing() {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 lg:py-36">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl" />

        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center space-y-8" style={{ animation: "fade-up 0.8s ease-out forwards" }}>
            <div className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground">
              <Zap className="h-3.5 w-3.5 text-primary" />
              AI-Powered Lease Intelligence
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold tracking-tight leading-[1.1]">
              Turn Lease Documents Into{" "}
              <span className="text-gradient">Strategic Insights</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Extract, analyze, and monitor your entire shopping center portfolio.
              AI reads every clause so your team can focus on decisions that matter.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button asChild size="lg" className="h-13 px-8 text-base rounded-xl shadow-lg animate-pulse-glow">
                <Link to="/upload">
                  Upload a Lease <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-13 px-8 text-base rounded-xl">
                <Link to="/dashboard">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="text-center space-y-2"
                style={{ animation: `fade-up 0.6s ease-out ${i * 0.1}s forwards`, opacity: 0 }}
              >
                <stat.icon className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-3xl sm:text-4xl font-display font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-display font-bold">
              Everything You Need to Manage Leases
            </h2>
            <p className="text-lg text-muted-foreground">
              From document extraction to portfolio analytics — one platform for your entire leasing workflow.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {features.map((feature, i) => (
              <Card
                key={feature.title}
                className="group hover:shadow-xl transition-all duration-300 border-border/60 hover:border-primary/30"
                style={{ animation: `fade-up 0.6s ease-out ${i * 0.12}s forwards`, opacity: 0 }}
              >
                <CardContent className="p-8 space-y-4">
                  <div className={`h-12 w-12 rounded-xl ${feature.bg} flex items-center justify-center`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-display font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <Building2 className="h-10 w-10 text-primary mx-auto" />
            <h2 className="text-3xl sm:text-4xl font-display font-bold">
              Ready to Transform Your Portfolio?
            </h2>
            <p className="text-lg text-muted-foreground">
              Upload your first lease document and see AI extraction in action.
            </p>
            <Button asChild size="lg" className="h-13 px-10 text-base rounded-xl">
              <Link to="/upload">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
