import { createContext, useContext, useState, type ReactNode } from "react";

type Display = "EUR" | "PLN";

interface Ctx {
  display: Display;
  setDisplay: (d: Display) => void;
  rate: number; // PLN per 1 EUR
  setRate: (n: number) => void;
}

const CurrencyCtx = createContext<Ctx | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [display, setDisplay] = useState<Display>("EUR");
  const [rate, setRate] = useState<number>(4.3);
  return (
    <CurrencyCtx.Provider value={{ display, setDisplay, rate, setRate }}>
      {children}
    </CurrencyCtx.Provider>
  );
}

export function useCurrency() {
  const v = useContext(CurrencyCtx);
  if (!v) throw new Error("useCurrency outside CurrencyProvider");
  return v;
}

const nf0 = (n: number) => Math.round(n).toLocaleString("en-US");
const nfK = (n: number) => {
  if (Math.abs(n) >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
  if (Math.abs(n) >= 1_000) return (n / 1_000).toFixed(0) + "K";
  return n.toFixed(0);
};

/** Format a PLN amount as primary EUR (or PLN) with secondary in parens. */
export function useFormatRent() {
  const { display, rate } = useCurrency();
  return (pln: number, opts?: { compact?: boolean; suffix?: string }) => {
    const compact = opts?.compact;
    const suffix = opts?.suffix ?? "";
    const eur = pln / rate;
    if (display === "EUR") {
      const primary = `€${compact ? nfK(eur) : nf0(eur)}${suffix}`;
      const secondary = `PLN ${compact ? nfK(pln) : nf0(pln)}${suffix}`;
      return { primary, secondary };
    }
    const primary = `PLN ${compact ? nfK(pln) : nf0(pln)}${suffix}`;
    const secondary = `€${compact ? nfK(eur) : nf0(eur)}${suffix}`;
    return { primary, secondary };
  };
}

/** Format an ANNUAL PLN amount as "X/yr (Y/mo)" in primary currency, plus secondary line. */
export function useFormatAnnualMonthly() {
  const fmt = useFormatRent();
  return (plnAnnual: number) => {
    const annual = fmt(plnAnnual, { compact: false, suffix: "/yr" });
    const monthly = fmt(plnAnnual / 12, { compact: false, suffix: "/mo" });
    return {
      primary: `${annual.primary} (${monthly.primary})`,
      secondary: `${annual.secondary} (${monthly.secondary})`,
    };
  };
}

/** Plain string formatter for axis ticks / tooltips. */
export function useFormatCompact() {
  const { display, rate } = useCurrency();
  return (pln: number) => {
    const v = display === "EUR" ? pln / rate : pln;
    const sym = display === "EUR" ? "€" : "PLN ";
    return `${sym}${nfK(v)}`;
  };
}

export function useCurrencySymbol() {
  const { display } = useCurrency();
  return display === "EUR" ? "€" : "PLN ";
}