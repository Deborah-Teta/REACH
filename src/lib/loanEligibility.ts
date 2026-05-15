// ─────────────────────────────────────────────────────────────────────────────
//  REACH – Loan Eligibility Engine
//  Cross-references RDB · RRA · CRB to produce an eligibility decision.
// ─────────────────────────────────────────────────────────────────────────────

import { rdbData, rraData, crbData, RDBRecord, RRARecord, CRBRecord } from "./mockData";

export type EligibilityStatus = "Approved" | "Conditional" | "Rejected";

export interface EligibilityResult {
  status: EligibilityStatus;
  maxLoanAmount: number;          // RWF
  maxMonthlyRepayment: number;    // 35% of monthly income
  debtToIncomeRatio: number;      // percentage (0–100)
  loanTermMonths: number;         // assumed 36 months
  reasons: string[];
  conditions: string[];
}

export interface BusinessLookup {
  rdb: RDBRecord;
  rra: RRARecord;
  crb: CRBRecord | null;         // null = no CRB record (new business)
}

// ─── Lookup ───────────────────────────────────────────────────────────────────
export function lookupBusiness(businessId: string): BusinessLookup | null {
  const id = businessId.trim().toUpperCase();
  const rdb = rdbData.find((r) => r.Business_ID === id);
  if (!rdb) return null;

  const rra = rraData.find((r) => r.Business_ID === id);
  if (!rra) return null; // Every RDB business has an RRA record

  const crb = crbData.find((r) => r.Business_ID === id) ?? null;

  return { rdb, rra, crb };
}

// ─── Eligibility Calculation ──────────────────────────────────────────────────
const LOAN_TERM_MONTHS = 36;
const MAX_DEBT_TO_INCOME = 0.35; // 35%

export function computeEligibility(lookup: BusinessLookup): EligibilityResult {
  const { rra, crb } = lookup;
  const reasons: string[] = [];
  const conditions: string[] = [];

  const maxMonthlyRepayment = rra.Monthly_Income * MAX_DEBT_TO_INCOME;
  // Max loan = max monthly repayment × loan term (simple flat calculation)
  const absoluteMaxLoan = maxMonthlyRepayment * LOAN_TERM_MONTHS;

  // ── Determine base score tier ─────────────────────────────────────────────
  let baseTier: EligibilityStatus;
  let multiplier: number; // of monthly income for max loan cap

  if (crb === null) {
    // New business – no credit history
    baseTier = "Conditional";
    multiplier = 12; // 1 year of monthly income
    reasons.push("No CRB record found – new or unregistered business.");
    conditions.push("First-time borrower assessment required.");
    conditions.push("Provide a detailed business plan and cash-flow projections.");
  } else if (crb.Loan_Status === "Defaulted") {
    baseTier = "Rejected";
    multiplier = 0;
    reasons.push(`Previous loan of RWF ${crb.Loan_Amount.toLocaleString()} is in default.`);
    reasons.push(`Credit score: ${crb.Credit_Score} (High Risk – below 500).`);
  } else if (crb.Credit_Score > 700) {
    baseTier = "Approved";
    multiplier = 60; // 5 years of monthly income
    reasons.push(`Strong credit score: ${crb.Credit_Score} (Excellent).`);
    if (crb.Loan_Status === "Paid") reasons.push("All previous loans fully settled.");
  } else if (crb.Credit_Score >= 500) {
    baseTier = "Conditional";
    multiplier = 24; // 2 years of monthly income
    reasons.push(`Moderate credit score: ${crb.Credit_Score} (Average).`);
    if (crb.Loan_Status === "Ongoing") {
      conditions.push("Existing active loan detected – additional collateral may be required.");
    }
  } else {
    // Score < 500, not defaulted (e.g. no-loan neutral may land here)
    baseTier = "Conditional";
    multiplier = 12;
    reasons.push(`Low-moderate credit score: ${crb.Credit_Score}.`);
    conditions.push("Enhanced due diligence required before disbursement.");
  }

  // ── Tax compliance downgrade ──────────────────────────────────────────────
  if (rra.Tax_Compliance_Status === "Non-compliant") {
    if (baseTier === "Approved") baseTier = "Conditional";
    else if (baseTier === "Conditional") baseTier = "Rejected";
    reasons.push("RRA tax compliance status: Non-compliant.");
    conditions.push("Settle all outstanding tax obligations before application can proceed.");
  } else if (rra.Tax_Compliance_Status === "Partial") {
    if (baseTier === "Approved") baseTier = "Conditional";
    reasons.push("RRA tax compliance status: Partial.");
    conditions.push("Provide evidence of tax payment arrangement with RRA.");
  }

  // ── Compute max loan amount ───────────────────────────────────────────────
  let maxLoanByScore = rra.Monthly_Income * multiplier;
  // Cap by 35% debt-to-income rule
  let maxLoanAmount = Math.min(maxLoanByScore, absoluteMaxLoan);

  if (baseTier === "Rejected") maxLoanAmount = 0;

  // ── Debt-to-income ratio for display (based on proposed max) ─────────────
  const proposedMonthlyRepayment = maxLoanAmount / LOAN_TERM_MONTHS;
  const dti =
    rra.Monthly_Income > 0
      ? (proposedMonthlyRepayment / rra.Monthly_Income) * 100
      : 0;

  // Friendly reasons for compliant businesses
  if (rra.Tax_Compliance_Status === "Compliant") {
    reasons.push("Tax compliance status: Compliant ✓");
  }

  return {
    status: baseTier,
    maxLoanAmount,
    maxMonthlyRepayment,
    debtToIncomeRatio: Math.min(dti, 100),
    loanTermMonths: LOAN_TERM_MONTHS,
    reasons,
    conditions,
  };
}

// ─── Formatting Helpers ───────────────────────────────────────────────────────
export function formatRWF(amount: number): string {
  return `RWF ${amount.toLocaleString("en-RW")}`;
}

export function creditScoreLabel(score: number): string {
  if (score >= 800) return "Excellent";
  if (score >= 700) return "Good";
  if (score >= 600) return "Fair";
  if (score >= 500) return "Average";
  if (score >= 400) return "Poor";
  return "Very Poor";
}

export function creditScoreColor(score: number): string {
  if (score >= 700) return "text-emerald-600";
  if (score >= 500) return "text-amber-600";
  return "text-red-600";
}
