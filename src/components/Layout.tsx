import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Building2, LayoutDashboard, LayoutGrid, Upload, FileSearch } from "lucide-react";

const navItems = [
  { to: "/", label: "Home", icon: Building2 },
  { to: "/upload", label: "Upload", icon: Upload },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/building", label: "Building", icon: LayoutGrid },
  { to: "/lease-review", label: "Lease Review", icon: FileSearch },
];

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
              </Link>
            ))}
          </nav>

          <div className="hidden sm:block text-xs font-medium text-muted-foreground">
            Demo Mode
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
