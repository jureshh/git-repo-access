import { AskPortfolio } from "@/components/leasereview/AskPortfolio";

export default function AskPortfolioPage() {
  return (
    <div className="py-8 lg:py-12">
      <div className="container space-y-6 max-w-7xl">
        <div style={{ animation: "fade-up 0.5s ease-out forwards" }}>
          <h1 className="text-3xl font-display font-bold">Ask Portfolio</h1>
          <p className="text-muted-foreground mt-1">
            Conversational answers about your leases — break options, guarantees, indexation, and more.
          </p>
        </div>
        <AskPortfolio />
      </div>
    </div>
  );
}