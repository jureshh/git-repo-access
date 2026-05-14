import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Upload, BarChart3, ArrowRight, FileSearch, Zap, Shield } from "lucide-react";

const steps = [
  { icon: Upload, title: "Upload", desc: "Drop a lease PDF into the uploader." },
  { icon: Zap, title: "Extract", desc: "AI parses every clause in seconds." },
  { icon: BarChart3, title: "Analyze", desc: "Explore the data in the dashboard." },
];

export default function Landing() {
  return (
    <div className="relative">
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-primary/5 blur-3xl" />

        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center space-y-8" style={{ animation: "fade-up 0.8s ease-out forwards" }}>
            <div className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground">
              <Zap className="h-3.5 w-3.5 text-primary" />
              Lease Intelligence Demo
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold tracking-tight leading-[1.1]">
              Lease Documents to{" "}
              <span className="text-gradient">Insights</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Upload a lease, let AI extract every clause, and explore the results in a clean dashboard.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button asChild size="lg" className="h-13 px-8 text-base rounded-xl shadow-lg">
                <Link to="/upload">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload a Lease
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-13 px-8 text-base rounded-xl">
                <Link to="/dashboard">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 border-t bg-muted/30">
        <div className="container max-w-4xl">
          <div className="grid sm:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <div
                key={s.title}
                className="rounded-2xl border bg-card p-6 space-y-3"
                style={{ animation: `fade-up 0.6s ease-out ${i * 0.1}s forwards`, opacity: 0 }}
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <s.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-muted-foreground">0{i + 1}</span>
                  <h3 className="font-display font-semibold">{s.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
