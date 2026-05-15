"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search, Building2, TrendingUp, CreditCard, ShieldCheck,
  AlertTriangle, XCircle, CheckCircle2, Clock, ChevronRight,
  Banknote, BarChart3, FileWarning, Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  lookupBusiness,
  computeEligibility,
  formatRWF,
  creditScoreLabel,
  creditScoreColor,
  BusinessLookup,
  EligibilityResult,
} from "@/lib/loanEligibility"

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Compliant: "bg-emerald-100 text-emerald-800 border-emerald-200",
    "Non-compliant": "bg-red-100 text-red-800 border-red-200",
    Partial: "bg-amber-100 text-amber-800 border-amber-200",
    Paid: "bg-emerald-100 text-emerald-800 border-emerald-200",
    Defaulted: "bg-red-100 text-red-800 border-red-200",
    Ongoing: "bg-emerald-100 text-emerald-800 border-emerald-200",
    "No record": "bg-slate-100 text-slate-600 border-slate-200",
    Good: "bg-emerald-100 text-emerald-800 border-emerald-200",
    Average: "bg-amber-100 text-amber-800 border-amber-200",
    Poor: "bg-red-100 text-red-800 border-red-200",
    Small: "bg-sky-100 text-sky-800 border-sky-200",
    Medium: "bg-violet-100 text-violet-800 border-violet-200",
    Large: "bg-indigo-100 text-indigo-800 border-indigo-200",
  }
  const cls = map[status] ?? "bg-slate-100 text-slate-600 border-slate-200"
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${cls}`}>
      {status}
    </span>
  )
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-slate-100 last:border-0">
      <span className="text-sm text-slate-500 shrink-0">{label}</span>
      <span className="text-sm font-medium text-slate-800 text-right">{value}</span>
    </div>
  )
}

// ─── Sample IDs hint ─────────────────────────────────────────────────────────
const SAMPLE_IDS = [
  { id: "RW-TIN-000001", label: "Paid loan ✓" },
  { id: "RW-TIN-000010", label: "Defaulted" },
  { id: "RW-TIN-000005", label: "Ongoing loan" },
  { id: "RW-TIN-000041", label: "New (no CRB)" },
  { id: "RW-TIN-000019", label: "Non-compliant" },
]

// ─── Main Component ───────────────────────────────────────────────────────────
export default function EligibilityPage() {
  const [query, setQuery] = useState("")
  const [result, setResult] = useState<{ lookup: BusinessLookup; eligibility: EligibilityResult } | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [searched, setSearched] = useState(false)

  function handleSearch(id?: string) {
    const searchId = id ?? query
    if (!searchId.trim()) return
    const lookup = lookupBusiness(searchId)
    setSearched(true)
    if (!lookup) {
      setResult(null)
      setNotFound(true)
      return
    }
    setNotFound(false)
    const eligibility = computeEligibility(lookup)
    setResult({ lookup, eligibility })
    if (id) setQuery(id)
  }

  const { lookup, eligibility } = result ?? {}

  const statusConfig = {
    Approved: {
      bg: "bg-emerald-50 border-emerald-200",
      icon: <CheckCircle2 className="w-8 h-8 text-emerald-600" />,
      badge: "bg-emerald-600 text-white",
      title: "text-emerald-800",
    },
    Conditional: {
      bg: "bg-amber-50 border-amber-200",
      icon: <AlertTriangle className="w-8 h-8 text-amber-600" />,
      badge: "bg-amber-500 text-white",
      title: "text-amber-800",
    },
    Rejected: {
      bg: "bg-red-50 border-red-200",
      icon: <XCircle className="w-8 h-8 text-red-600" />,
      badge: "bg-red-600 text-white",
      title: "text-red-800",
    },
  } as const

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-emerald-50 via-white to-slate-50">
      {/* ── Header ── */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-2 text-emerald-700 text-sm font-semibold mb-2">
              <ShieldCheck className="w-4 h-4" />
              Multi-Database Eligibility Engine
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Loan Eligibility Dashboard</h1>
            <p className="text-slate-500 mt-1 max-w-2xl">
              Enter a Business TIN / ID to cross-reference RDB, RRA, and CRB records and compute real-time loan
              eligibility.
            </p>
          </motion.div>

          {/* ── Search ── */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 flex flex-col sm:flex-row gap-3 max-w-2xl"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="business-id-input"
                className="pl-10 h-12 text-sm border-slate-200 focus:border-emerald-400 focus:ring-emerald-300"
                placeholder="e.g. RW-TIN-000001"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button
              id="check-eligibility-btn"
              onClick={() => handleSearch()}
              className="h-12 px-6 bg-brand-blue text-white hover:bg-brand-darkblue font-semibold"
            >
              Check Eligibility
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </motion.div>

          {/* ── Sample IDs ── */}
          <div className="mt-4 flex flex-wrap gap-2 items-center">
            <span className="text-xs text-slate-400 font-medium">Try:</span>
            {SAMPLE_IDS.map((s) => (
              <button
                key={s.id}
                onClick={() => handleSearch(s.id)}
                className="text-xs rounded-full border border-slate-200 bg-background hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 px-3 py-1 transition-colors font-mono"
              >
                {s.id} <span className="font-sans text-slate-400">· {s.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* ── Not found ── */}
          {searched && notFound && (
            <motion.div
              key="not-found"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
                <Search className="w-7 h-7 text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Business Not Found</h2>
              <p className="text-slate-500 max-w-sm">
                No business with ID <span className="font-mono font-semibold text-slate-700">&quot;{query}&quot;</span> exists
                in the RDB registry. Please verify the TIN and try again.
              </p>
            </motion.div>
          )}

          {/* ── Results ── */}
          {result && lookup && eligibility && !notFound && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* ── Eligibility Banner ── */}
              <div
                className={`rounded-2xl border-2 p-6 mb-8 ${statusConfig[eligibility.status].bg}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {statusConfig[eligibility.status].icon}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-bold ${statusConfig[eligibility.status].badge}`}>
                        {eligibility.status === "Approved" && "✓ Approved"}
                        {eligibility.status === "Conditional" && "⚠ Conditional Approval"}
                        {eligibility.status === "Rejected" && "✕ Rejected"}
                      </span>
                      <span className={`text-sm font-semibold ${statusConfig[eligibility.status].title}`}>
                        {eligibility.status === "Approved" && "This business qualifies for a loan."}
                        {eligibility.status === "Conditional" && "Loan may be granted with additional requirements."}
                        {eligibility.status === "Rejected" && "This business does not qualify at this time."}
                      </span>
                    </div>
                    <ul className="mt-2 space-y-1">
                      {eligibility.reasons.map((r, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                          <Info className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400" />
                          {r}
                        </li>
                      ))}
                    </ul>
                    {eligibility.conditions.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-200/60">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Conditions</p>
                        <ul className="space-y-1">
                          {eligibility.conditions.map((c, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                              <FileWarning className="w-3.5 h-3.5 mt-0.5 shrink-0 text-amber-500" />
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Max Loan */}
                  <div className="shrink-0 rounded-xl bg-white/80 border border-slate-200/80 px-6 py-4 text-center min-w-[200px]">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Max Loan Amount</p>
                    {eligibility.maxLoanAmount > 0 ? (
                      <>
                        <p className="text-2xl font-extrabold text-slate-900">
                          {formatRWF(eligibility.maxLoanAmount)}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          ~{formatRWF(Math.round(eligibility.maxLoanAmount / eligibility.loanTermMonths))}/mo
                          over {eligibility.loanTermMonths} months
                        </p>
                      </>
                    ) : (
                      <p className="text-xl font-bold text-red-500">Not Eligible</p>
                    )}
                  </div>
                </div>

                {/* DTI Bar */}
                {eligibility.maxLoanAmount > 0 && (
                  <div className="mt-5 pt-4 border-t border-slate-200/60">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-slate-500">Debt-to-Income Ratio</span>
                      <span className="text-xs font-bold text-slate-700">
                        {eligibility.debtToIncomeRatio.toFixed(1)}% of monthly income
                        <span className="text-slate-400 font-normal"> (max 35%)</span>
                      </span>
                    </div>
                    <Progress
                      value={eligibility.debtToIncomeRatio}
                      className="h-2"
                    />
                  </div>
                )}
              </div>

              {/* ── 3-column cards ── */}
              <div className="grid gap-6 lg:grid-cols-3">

                {/* RDB Card */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <Card className="h-full border-slate-200 shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                          <Building2 className="w-4 h-4 text-emerald-700" />
                        </div>
                        <div>
                          <span className="text-slate-900">RDB</span>
                          <span className="block text-xs font-normal text-slate-400">Business Registry</span>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1">
                      <div className="rounded-xl bg-emerald-50 px-4 py-3 mb-4">
                        <p className="font-bold text-slate-800 text-sm leading-tight">{lookup.rdb.Business_Name}</p>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{lookup.rdb.Business_Description}</p>
                      </div>
                      <InfoRow label="Business ID" value={<span className="font-mono text-xs">{lookup.rdb.Business_ID}</span>} />
                      <InfoRow label="Sector" value={<StatusBadge status={lookup.rdb.Business_Field} />} />
                    </CardContent>
                  </Card>
                </motion.div>

                {/* RRA Card */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                  <Card className="h-full border-slate-200 shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                          <TrendingUp className="w-4 h-4 text-emerald-700" />
                        </div>
                        <div>
                          <span className="text-slate-900">RRA</span>
                          <span className="block text-xs font-normal text-slate-400">Tax & Income Records</span>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1">
                      <div className="rounded-xl bg-emerald-50 px-4 py-3 mb-4">
                        <p className="text-xs text-slate-500 mb-0.5">Annual Income</p>
                        <p className="font-bold text-slate-800">{formatRWF(lookup.rra.Annual_Income)}</p>
                      </div>
                      <InfoRow label="Monthly Income" value={formatRWF(lookup.rra.Monthly_Income)} />
                      <InfoRow label="Tax Category" value={<StatusBadge status={lookup.rra.Tax_Category} />} />
                      <InfoRow label="Tax Compliance" value={<StatusBadge status={lookup.rra.Tax_Compliance_Status} />} />
                      <InfoRow
                        label="Max Monthly Repayment"
                        value={<span className="text-emerald-700 font-semibold">{formatRWF(eligibility.maxMonthlyRepayment)}</span>}
                      />
                    </CardContent>
                  </Card>
                </motion.div>

                {/* CRB Card */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <Card className="h-full border-slate-200 shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                          <CreditCard className="w-4 h-4 text-violet-700" />
                        </div>
                        <div>
                          <span className="text-slate-900">CRB</span>
                          <span className="block text-xs font-normal text-slate-400">Credit & Loan History</span>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {lookup.crb === null ? (
                        <div className="rounded-xl bg-background border border-dashed border-slate-300 px-4 py-6 text-center">
                          <Clock className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                          <p className="text-sm font-semibold text-slate-600">No CRB Record</p>
                          <p className="text-xs text-slate-400 mt-1">
                            This is a new or recently registered business with no credit history.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {/* Score gauge */}
                          <div className="rounded-xl bg-violet-50 px-4 py-3 mb-4">
                            <div className="flex items-end justify-between mb-1.5">
                              <div>
                                <p className="text-xs text-slate-500">Credit Score</p>
                                <p className={`text-2xl font-extrabold ${creditScoreColor(lookup.crb.Credit_Score)}`}>
                                  {lookup.crb.Credit_Score}
                                </p>
                              </div>
                              <span className={`text-sm font-semibold ${creditScoreColor(lookup.crb.Credit_Score)}`}>
                                {creditScoreLabel(lookup.crb.Credit_Score)}
                              </span>
                            </div>
                            <Progress value={(lookup.crb.Credit_Score / 1000) * 100} className="h-1.5" />
                            <div className="flex justify-between text-xs text-slate-400 mt-1">
                              <span>0</span><span>500</span><span>1000</span>
                            </div>
                          </div>
                          <InfoRow label="Has Loan" value={lookup.crb.Has_Loan} />
                          {lookup.crb.Has_Loan === "Yes" && (
                            <InfoRow label="Loan Amount" value={formatRWF(lookup.crb.Loan_Amount)} />
                          )}
                          <InfoRow label="Loan Status" value={<StatusBadge status={lookup.crb.Loan_Status} />} />
                          <InfoRow label="Payment History" value={<StatusBadge status={lookup.crb.Payment_History} />} />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* ── Stats row ── */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4"
              >
                {[
                  { label: "Annual Revenue", value: formatRWF(lookup.rra.Annual_Income), icon: <Banknote className="w-4 h-4" />, color: "text-emerald-700 bg-emerald-50" },
                  { label: "Credit Score", value: lookup.crb ? lookup.crb.Credit_Score : "N/A", icon: <BarChart3 className="w-4 h-4" />, color: "text-violet-700 bg-violet-50" },
                  { label: "Loan Status", value: lookup.crb ? lookup.crb.Loan_Status : "No Record", icon: <CreditCard className="w-4 h-4" />, color: "text-emerald-700 bg-emerald-50" },
                  { label: "Tax Status", value: lookup.rra.Tax_Compliance_Status, icon: <ShieldCheck className="w-4 h-4" />, color: lookup.rra.Tax_Compliance_Status === "Compliant" ? "text-emerald-700 bg-emerald-50" : "text-amber-700 bg-amber-50" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl bg-white border border-slate-200 p-4 flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${stat.color}`}>
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">{stat.label}</p>
                      <p className="text-sm font-bold text-slate-800">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* ── Empty state ── */}
          {!searched && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-6 border-2 border-emerald-100">
                <Search className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-slate-700 mb-2">Search for a Business</h2>
              <p className="text-slate-400 max-w-sm text-sm">
                Enter a Business TIN to retrieve data from RDB, RRA, and CRB and calculate loan eligibility.
              </p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl w-full">
                {[
                  { icon: <Building2 className="w-5 h-5 text-emerald-600" />, title: "RDB Registry", desc: "Business identity, sector, and registration status.", color: "bg-emerald-50 border-emerald-100" },
                  { icon: <TrendingUp className="w-5 h-5 text-emerald-600" />, title: "RRA Tax Records", desc: "Annual income, tax category, and compliance status.", color: "bg-emerald-50 border-emerald-100" },
                  { icon: <CreditCard className="w-5 h-5 text-violet-600" />, title: "CRB Credit History", desc: "Loan history, credit score, and payment behaviour.", color: "bg-violet-50 border-violet-100" },
                ].map((card) => (
                  <div key={card.title} className={`rounded-2xl border p-5 text-left ${card.color}`}>
                    <div className="mb-3">{card.icon}</div>
                    <p className="text-sm font-bold text-slate-800 mb-1">{card.title}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">{card.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
