"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  Download, 
  Calculator,
  Search,
  Building2,
  AlertTriangle
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  lookupBusiness, 
  computeEligibility, 
  formatRWF,
  EligibilityResult,
  BusinessLookup
} from "@/lib/loanEligibility"

function EligibilityDashboardContent() {
  const searchParams = useSearchParams()
  const tin = searchParams.get("tin")
  
  const [data, setData] = useState<BusinessLookup | null>(null)
  const [eligibility, setEligibility] = useState<EligibilityResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (tin) {
      setIsLoading(true)
      const lookup = lookupBusiness(tin)
      if (lookup) {
        setData(lookup)
        setEligibility(computeEligibility(lookup))
      }
      setIsLoading(false)
    } else {
      setIsLoading(false)
    }
  }, [tin])

  const containerVariants: any = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-brand-blue animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Loading your business profile...</p>
      </div>
    )
  }

  if (!tin || !data || !eligibility) {
    return (
      <div className="flex-1 w-full p-4 md:p-8 lg:p-12 mb-20 max-w-4xl mx-auto">
        <Card className="border-dashed border-2 border-slate-200 bg-background/50 p-12 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
            <Search className="w-10 h-10 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">No Business Data Found</h2>
          <p className="text-slate-500 mb-8 max-w-md">
            We couldn&apos;t find a business profile linked to your session. Please complete the application form to link your TIN.
          </p>
          <Button onClick={() => window.location.href='/application-form'} className="bg-brand-blue hover:bg-brand-darkblue h-12 px-8 rounded-xl shadow-lg group">
            Go to Application Form
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex-1 w-full p-4 md:p-8 lg:p-12 mb-20 max-w-7xl mx-auto">
      
      {/* Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full bg-gradient-to-r from-brand-blue to-brand-darkblue rounded-3xl p-8 mb-8 text-white shadow-xl shadow-brand-blue/10 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <Badge variant="secondary" className="mb-4 bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-md">
              <ShieldCheck className="w-4 h-4 mr-1" />
              Verified Business
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">{data.rdb.Business_Name}</h1>
            <p className="text-brand-lightblue/90 flex items-center">
              TIN: {data.rdb.Business_ID}
              <span className="mx-2">•</span>
              {data.rdb.Business_Field}
            </p>
          </div>
          <Button className="bg-white text-brand-blue hover:bg-background font-semibold h-12 px-6 rounded-xl shadow-lg border-0 group">
            Download Form Report
            <Download className="w-4 h-4 ml-2 group-hover:-translate-y-1 transition-transform" />
          </Button>
        </div>
      </motion.div>

      {/* Main Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        
        {/* Core Eligibility Card */}
        <motion.div variants={itemVariants} className="md:col-span-2">
          <Card className="h-full border-slate-200 shadow-lg shadow-slate-200/50 rounded-2xl overflow-hidden relative">
            <div className={`absolute top-0 w-full h-1 bg-gradient-to-r ${
              eligibility.status === "Approved" ? "from-emerald-400 to-brand-success" :
              eligibility.status === "Conditional" ? "from-amber-400 to-brand-warning" :
              "from-red-400 to-brand-error"
            }`} />
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center mb-2">
                <CardTitle className="text-xl font-semibold text-slate-800">Eligible Loan Amount</CardTitle>
                <Badge className={`${
                  eligibility.status === "Approved" ? "bg-brand-success/10 text-brand-success border-brand-success/20" :
                  eligibility.status === "Conditional" ? "bg-brand-warning/10 text-brand-warning border-brand-warning/20" :
                  "bg-brand-error/10 text-brand-error border-brand-error/20"
                } hover:bg-opacity-20 px-3 py-1 text-sm font-medium border`}>
                  {eligibility.status === "Approved" ? <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> :
                   eligibility.status === "Conditional" ? <AlertTriangle className="w-3.5 h-3.5 mr-1" /> :
                   <AlertCircle className="w-3.5 h-3.5 mr-1" />}
                  {eligibility.status}
                </Badge>
              </div>
              <CardDescription className="text-base text-slate-500">
                {eligibility.reasons[0]}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="my-6">
                {eligibility.status === "Rejected" ? (
                  <h2 className="text-4xl font-bold tracking-tighter text-red-600">
                    Maximum Risk Level
                  </h2>
                ) : (
                  <h2 className="text-6xl font-bold tracking-tighter text-slate-900">
                    <span className="text-4xl text-slate-400 font-medium align-top mr-1">RWF</span>
                    {eligibility.maxLoanAmount.toLocaleString()}
                  </h2>
                )}
              </div>
              
              <div className="space-y-6 mt-8">
                <div>
                  <div className="flex justify-between text-sm font-medium mb-2">
                    <span className="text-slate-600">DTI Compliance (Debt-to-Income)</span>
                    <span className={`${eligibility.debtToIncomeRatio > 35 ? "text-red-500" : "text-brand-blue"} font-bold`}>
                      {eligibility.debtToIncomeRatio.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={Math.min(eligibility.debtToIncomeRatio * 2, 100)} className="h-2.5 bg-slate-100" />
                  <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">Capped at 35% for maximum safety</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-background p-4 rounded-xl border border-slate-100">
                    <p className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">Monthly Revenue</p>
                    <p className="text-lg font-bold text-slate-800">{formatRWF(data.rra.Monthly_Income)}</p>
                  </div>
                  <div className="bg-background p-4 rounded-xl border border-slate-100">
                    <p className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">Tax Status</p>
                    <p className={`text-lg font-bold ${data.rra.Tax_Compliance_Status === "Compliant" ? "text-brand-success" : "text-brand-error"}`}>
                      {data.rra.Tax_Compliance_Status}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Panel */}
        <motion.div variants={itemVariants} className="space-y-6">
          <Card className="border-brand-blue/20 bg-brand-lightblue/30 shadow-md rounded-2xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calculator className="w-5 h-5 text-brand-blue" />
                Configure Loan
              </CardTitle>
              <CardDescription>
                {eligibility.status === "Rejected" 
                  ? "We recommend improving your credit score before applying for a new loan."
                  : "Ready to proceed? Configure your exact loan amount and timeline."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                  <Clock className="w-4 h-4 text-brand-blue" />
                  <span>Estimated decision in 24 hours</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                  <ShieldCheck className="w-4 h-4 text-brand-success" />
                  <span>Verified via RRA & RDB</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                disabled={eligibility.status === "Rejected"}
                className="w-full bg-brand-blue hover:bg-brand-darkblue h-12 rounded-xl font-medium shadow-md group" 
                onClick={() => window.location.href='/loan-purpose'}
              >
                Continue to Configuration
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-slate-200 shadow-sm rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-slate-800">Verification Integrity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-success mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">RRA Metadata</p>
                  <p className="text-xs text-slate-500">Tax Category: {data.rra.Tax_Category}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-success mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">RDB Registration</p>
                  <p className="text-xs text-slate-500">Authenticated via API</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                {data.crb ? (
                  <CheckCircle2 className="w-5 h-5 text-brand-success mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-brand-warning mt-0.5" />
                )}
                <div>
                  <p className="text-sm font-semibold text-slate-900">CRB Credit History</p>
                  <p className="text-xs text-slate-500">
                    {data.crb ? `Score: ${data.crb.Credit_Score}` : "No history found"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-slate-800">Linked Credit Report</CardTitle>
              <CardDescription>Financial history from CRB</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {data.crb && data.crb.Has_Loan ? (
                  <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-slate-100">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Reference: {data.crb.Loan_Status}</p>
                      <p className="text-xs text-slate-500">{formatRWF(data.crb.Loan_Amount)}</p>
                    </div>
                    <Badge className={`${
                      data.crb.Loan_Status === "Paid" ? "bg-green-100 text-green-800" :
                      data.crb.Loan_Status === "Ongoing" ? "bg-emerald-100 text-emerald-800" :
                      "bg-red-100 text-red-800"
                    } px-2 py-1 text-xs font-medium border-0`}>
                      {data.crb.Loan_Status}
                    </Badge>
                  </div>
                ) : (
                  <div className="p-4 text-center rounded-xl bg-background border border-slate-100">
                    <Building2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs text-slate-500">No active or past loans recorded in CRB for this business.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </motion.div>
    </div>
  )
}

export default function EligibilityDashboard() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-brand-blue animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Loading dashboard...</p>
      </div>
    }>
      <EligibilityDashboardContent />
    </Suspense>
  )
}
