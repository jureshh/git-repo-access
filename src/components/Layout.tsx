import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Building2, LayoutDashboard, Upload, FileSearch, Users, Search, MessageSquare } from "lucide-react";
import { useCurrency } from "@/lib/currency";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Settings } from "lucide-react";

// Demo-mode visibility flags. Flip to re-enable a nav item — routes remain intact.
const NAV_VISIBILITY = {
  showTenantsTab: false,
  showInvestigationsTab: false,
};

const allNavItems = [
  { to: "/", label: "Home", icon: Building2, key: "home" },
  { to: "/upload", label: "Upload", icon: Upload, key: "upload" },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, key: "dashboard" },
  { to: "/tenant-intelligence", label: "Tenants", icon: Users, badge: "9", key: "tenants" },
  { to: "/investigations", label: "Investigations", icon: Search, key: "investigations" },
  { to: "/lease-review", label: "Review", icon: FileSearch, key: "review" },
  { to: "/ask-portfolio", label: "Ask Portfolio", icon: MessageSquare, key: "ask" },
];

const navItems = allNavItems.filter((i) => {
  if (i.key === "tenants") return NAV_VISIBILITY.showTenantsTab;
  if (i.key === "investigations") return NAV_VISIBILITY.showInvestigationsTab;
  return true;
});

export function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 glass border-b">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
              <Building2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold tracking-tight">
              Lease<span className="text-primary">OS</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === item.to
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
                {item.badge && (
                  <span className="ml-1 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          <div className="hidden sm:flex items-center gap-3">
            <CurrencyToggle />
            <span className="text-xs font-medium text-muted-foreground">Demo Mode</span>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t bg-muted/30 py-8">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} LeaseOS — AI-Powered Lease Intelligence
        </div>
      </footer>
    </div>
  );
}

function CurrencyToggle() {
  const { display, setDisplay, rate, setRate } = useCurrency();
  return (
    <div className="flex items-center gap-1.5 rounded-md border bg-card px-1 py-1">
      <span className="text-[10px] font-semibold uppercase text-muted-foreground pl-1.5">Display</span>
      <div className="inline-flex rounded-sm bg-muted/50 p-0.5">
        {(["EUR", "PLN"] as const).map((c) => (
          <button
            key={c}
            onClick={() => setDisplay(c)}
            className={cn(
              "px-2 py-0.5 text-[11px] font-semibold rounded-sm transition-colors",
              display === c ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {c}
          </button>
        ))}
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <button className="p-1 text-muted-foreground hover:text-foreground" aria-label="Currency settings">
            <Settings className="h-3.5 w-3.5" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-60">
          <p className="text-xs font-semibold mb-2">Exchange rate</p>
          <label className="text-[11px] text-muted-foreground">EUR / PLN</label>
          <input
            type="number"
            step="0.01"
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
            className="mt-1 w-full rounded-md border px-2 py-1 text-sm"
          />
          <p className="mt-2 text-[10px] text-muted-foreground">
            1 EUR = {rate.toFixed(2)} PLN. Editable for demo.
          </p>
        </PopoverContent>
      </Popover>
    </div>
  );
}
