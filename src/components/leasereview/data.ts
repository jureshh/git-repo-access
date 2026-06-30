export type FieldKey = string;

export interface FieldDef {
  key: FieldKey;
  label: string;
  group: GroupKey;
}

export type GroupKey =
  | "Financial"
  | "Dates"
  | "Renewal"
  | "Guarantees"
  | "Indexation"
  | "Obligations";

export const GROUPS: GroupKey[] = [
  "Financial",
  "Dates",
  "Renewal",
  "Guarantees",
  "Indexation",
  "Obligations",
];

export const FIELDS: FieldDef[] = [
  { key: "baseRent", label: "Base Rent (PLN/m²)", group: "Financial" },
  { key: "annualRent", label: "Annual Rent (PLN)", group: "Financial" },
  { key: "effectiveRent", label: "Effective Rent (PLN)", group: "Financial" },
  { key: "gla", label: "GLA (sqm)", group: "Financial" },
  { key: "leaseStart", label: "Lease Start", group: "Dates" },
  { key: "leaseExpiry", label: "Lease Expiry", group: "Dates" },
  { key: "wault", label: "WAULT", group: "Dates" },
  { key: "breakOption", label: "Break Option", group: "Dates" },
  { key: "breakPenalty", label: "Break Penalty", group: "Dates" },
  { key: "renewalType", label: "Renewal Type", group: "Renewal" },
  { key: "noticePeriod", label: "Notice Period", group: "Renewal" },
  { key: "guaranteeAmount", label: "Guarantee (PLN)", group: "Guarantees" },
  { key: "guaranteeExpiry", label: "Guarantee Expiry", group: "Guarantees" },
  { key: "guaranteeStatus", label: "Status", group: "Guarantees" },
  { key: "notarialDeed", label: "Notarial Deed (Art. 777 KPC)", group: "Guarantees" },
  { key: "index", label: "Index", group: "Indexation" },
  { key: "lastApplied", label: "Last Applied", group: "Indexation" },
  { key: "nextReview", label: "Next Review", group: "Indexation" },
  { key: "stepRent", label: "Step Rent", group: "Indexation" },
  { key: "serviceCharge", label: "Service Charge", group: "Obligations" },
  { key: "turnoverRent", label: "Turnover Rent", group: "Obligations" },
  { key: "permittedUse", label: "Permitted Use", group: "Obligations" },
  { key: "reinstatement", label: "Reinstatement", group: "Obligations" },
  { key: "nonCompete", label: "Non-Compete / Exclusivity", group: "Obligations" },
  { key: "greenClause", label: "Green Clause", group: "Obligations" },
];

export const TENANTS = [
  "Anchor – Fashion",
  "Café Roma",
  "Sport Zone",
  "Electronics Plus",
  "Kids World",
  "Jewellery Co",
  "Optika Centrum",
] as const;

export type Tenant = (typeof TENANTS)[number];

export const DATA: Record<FieldKey, Record<Tenant, string>> = {
  baseRent: { "Anchor – Fashion": "700", "Café Roma": "1,000", "Sport Zone": "750", "Electronics Plus": "900", "Kids World": "800", "Jewellery Co": "1,500", "Optika Centrum": "1,050" },
  annualRent: { "Anchor – Fashion": "1,260,000", "Café Roma": "180,000", "Sport Zone": "637,500", "Electronics Plus": "558,000", "Kids World": "272,000", "Jewellery Co": "112,500", "Optika Centrum": "99,750" },
  effectiveRent: { "Anchor – Fashion": "1,260,000", "Café Roma": "162,000", "Sport Zone": "637,500", "Electronics Plus": "558,000", "Kids World": "272,000", "Jewellery Co": "112,500", "Optika Centrum": "99,750" },
  gla: { "Anchor – Fashion": "1,800", "Café Roma": "180", "Sport Zone": "850", "Electronics Plus": "620", "Kids World": "340", "Jewellery Co": "75", "Optika Centrum": "95" },
  leaseStart: { "Anchor – Fashion": "01 Jan 2020", "Café Roma": "01 Jul 2021", "Sport Zone": "01 Mar 2022", "Electronics Plus": "15 Sep 2019", "Kids World": "10 Oct 2020", "Jewellery Co": "14 Jan 2022", "Optika Centrum": "20 Nov 2018" },
  leaseExpiry: { "Anchor – Fashion": "31 Dec 2031", "Café Roma": "30 Jun 2026", "Sport Zone": "28 Feb 2027", "Electronics Plus": "15 Mar 2028", "Kids World": "10 Sep 2029", "Jewellery Co": "14 Jan 2026", "Optika Centrum": "20 Nov 2030" },
  wault: { "Anchor – Fashion": "6.1 yrs", "Café Roma": "0.7 yrs", "Sport Zone": "1.9 yrs", "Electronics Plus": "2.3 yrs", "Kids World": "3.6 yrs", "Jewellery Co": "0.4 yrs", "Optika Centrum": "4.8 yrs" },
  breakOption: { "Anchor – Fashion": "None", "Café Roma": "Tenant 31 Mar 2026", "Sport Zone": "None", "Electronics Plus": "Landlord 15 Sep 2026", "Kids World": "None", "Jewellery Co": "None", "Optika Centrum": "None" },
  guaranteeAmount: { "Anchor – Fashion": "315,000", "Café Roma": "54,000", "Sport Zone": "159,375", "Electronics Plus": "139,500", "Kids World": "68,000", "Jewellery Co": "28,125", "Optika Centrum": "24,938" },
  guaranteeExpiry: { "Anchor – Fashion": "31 Jan 2032", "Café Roma": "30 Apr 2026", "Sport Zone": "31 Mar 2027", "Electronics Plus": "30 Apr 2028", "Kids World": "30 Oct 2029", "Jewellery Co": "28 Feb 2026", "Optika Centrum": "30 Dec 2030" },
  guaranteeStatus: { "Anchor – Fashion": "Valid", "Café Roma": "⚠ Expires before lease end", "Sport Zone": "Valid", "Electronics Plus": "Valid", "Kids World": "Valid", "Jewellery Co": "⚠ Expires in 63 days", "Optika Centrum": "Valid" },
  index: { "Anchor – Fashion": "HICP Poland", "Café Roma": "HICP Poland", "Sport Zone": "HICP Poland", "Electronics Plus": "CPI Poland", "Kids World": "HICP Poland", "Jewellery Co": "HICP Poland", "Optika Centrum": "CPI Poland" },
  lastApplied: { "Anchor – Fashion": "Jan 2025 +3.2%", "Café Roma": "Jan 2025 +3.2%", "Sport Zone": "Jan 2025 +3.2%", "Electronics Plus": "Sep 2024 +4.1%", "Kids World": "Oct 2024 +3.8%", "Jewellery Co": "Jan 2025 +3.2%", "Optika Centrum": "Nov 2024 +4.1%" },
  nextReview: { "Anchor – Fashion": "Jan 2026", "Café Roma": "Jan 2026", "Sport Zone": "Jan 2026", "Electronics Plus": "Sep 2025", "Kids World": "Oct 2025", "Jewellery Co": "Jan 2026", "Optika Centrum": "Nov 2025" },
  serviceCharge: { "Anchor – Fashion": "Proportional", "Café Roma": "Proportional", "Sport Zone": "Proportional", "Electronics Plus": "Fixed PLN 85/m²", "Kids World": "Proportional", "Jewellery Co": "Proportional", "Optika Centrum": "Fixed PLN 90/m²" },
  turnoverRent: { "Anchor – Fashion": ">8% revenue", "Café Roma": "None", "Sport Zone": ">6% revenue", "Electronics Plus": "None", "Kids World": ">7% revenue", "Jewellery Co": "None", "Optika Centrum": "None" },
  permittedUse: { "Anchor – Fashion": "Fashion retail", "Café Roma": "Food & beverage", "Sport Zone": "Sporting goods", "Electronics Plus": "Electronics", "Kids World": "Children's goods", "Jewellery Co": "Jewellery", "Optika Centrum": "Optical" },
  reinstatement: { "Anchor – Fashion": "Full", "Café Roma": "Partial", "Sport Zone": "Full", "Electronics Plus": "Full", "Kids World": "Partial", "Jewellery Co": "Full", "Optika Centrum": "Partial" },
  breakPenalty: { "Anchor – Fashion": "None", "Café Roma": "3 months base rent", "Sport Zone": "None", "Electronics Plus": "6 months base rent", "Kids World": "None", "Jewellery Co": "None", "Optika Centrum": "None" },
  renewalType: { "Anchor – Fashion": "Notice Required", "Café Roma": "Notice Required", "Sport Zone": "Automatic", "Electronics Plus": "Notice Required", "Kids World": "Automatic", "Jewellery Co": "Notice Required", "Optika Centrum": "Notice Required" },
  noticePeriod: { "Anchor – Fashion": "6 months", "Café Roma": "6 months", "Sport Zone": "—", "Electronics Plus": "9 months", "Kids World": "—", "Jewellery Co": "3 months", "Optika Centrum": "6 months" },
  notarialDeed: { "Anchor – Fashion": "Yes · valid 31 Jan 2032", "Café Roma": "Yes · valid 30 Jun 2026", "Sport Zone": "Yes · valid 28 Feb 2027", "Electronics Plus": "No", "Kids World": "Yes · valid 10 Sep 2029", "Jewellery Co": "No", "Optika Centrum": "Yes · valid 20 Nov 2030" },
  stepRent: { "Anchor – Fashion": "No", "Café Roma": "Yes · +3% Yr3, +3% Yr5", "Sport Zone": "No", "Electronics Plus": "Yes · +2.5% Yr3", "Kids World": "No", "Jewellery Co": "No", "Optika Centrum": "No" },
  nonCompete: { "Anchor – Fashion": "Exclusive fashion retail within 200m", "Café Roma": "None", "Sport Zone": "Exclusive sporting goods within 150m", "Electronics Plus": "None", "Kids World": "None", "Jewellery Co": "None", "Optika Centrum": "Exclusive optical within centre" },
  greenClause: { "Anchor – Fashion": "Yes · ESG compliance", "Café Roma": "Not present", "Sport Zone": "Not present", "Electronics Plus": "Yes · energy reporting", "Kids World": "Not present", "Jewellery Co": "Not present", "Optika Centrum": "Not present" },
};

export const GROUP_FILTER_MAP: Record<string, GroupKey[]> = {
  "All Fields": ["Financial", "Dates", "Renewal", "Guarantees", "Indexation", "Obligations"],
  Financial: ["Financial"],
  Dates: ["Dates"],
  Renewal: ["Renewal"],
  Guarantees: ["Guarantees"],
  Indexation: ["Indexation"],
  Obligations: ["Obligations"],
};