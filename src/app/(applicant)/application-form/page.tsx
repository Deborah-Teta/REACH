"use client"

import { useState, useEffect, Suspense } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, FileText, ChevronRight, ChevronLeft, AlertTriangle, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useSearchParams } from "next/navigation"
import {
  lookupBusiness,
  computeEligibility,
  formatRWF,
  EligibilityResult
} from "@/lib/loanEligibility"
import { addSubmittedApplication } from "@/lib/notificationStore"

function NarrativeFormContent() {
  const searchParams = useSearchParams()
  const urlTin = searchParams.get("tin")
  const urlAmount = searchParams.get("amount")

  const [currentStep, setCurrentStep] = useState(1)
  
  const totalSteps = 4
  const progressValue = (currentStep / totalSteps) * 100

  // Form State
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    businessTin: "",
    marketDescription: "",
    loanPurpose: "",
    requestedAmount: "",
    repaymentPlan: ""
  })

  // Eligibility State
  const [eligibilityResult, setEligibilityResult] = useState<EligibilityResult | null>(null)

  // Initialization & Pre-fill
  useEffect(() => {
    const tin = urlTin || localStorage.getItem("reach_tin") || ""
    const amount = urlAmount || localStorage.getItem("reach_requested_amount") || ""
    
    if (tin) {
      const lookup = lookupBusiness(tin)
      if (lookup) {
        const result = computeEligibility(lookup)
        setEligibilityResult(result)
        setFormData(prev => ({
          ...prev,
          businessTin: tin,
          requestedAmount: amount ? `RWF ${parseInt(amount).toLocaleString()}` : "",
          businessName: lookup.rdb.Business_Name,
          businessType: lookup.rdb.Business_Field,
          loanPurpose: lookup.rdb.Business_Description // Pre-fill with description as a starting point
        }))
        // If we have TIN and amount, we can skip verification step
        setCurrentStep(2)
      }
    }
  }, [urlTin, urlAmount])

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const nextStep = () => currentStep < totalSteps && setCurrentStep(prev => prev + 1)
  const prevStep = () => currentStep > 1 && setCurrentStep(prev => prev - 1)

  const submitApplication = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      // Persist the application into the notification store
      // so the approver gets a notification and sees it in reviews
      const userEmail = localStorage.getItem('reach_user_email') || 'applicant@business.rw';
      addSubmittedApplication({
        fullName: formData.businessName ? `${formData.businessName} Owner` : 'Applicant',
        email: userEmail,
        businessName: formData.businessName || 'Unknown Business',
        businessTin: formData.businessTin || '',
        category: formData.businessType || 'General',
        amountRange: formData.requestedAmount || 'Not specified',
        loanPurpose: formData.loanPurpose || '',
        repaymentPlan: formData.repaymentPlan || '',
        marketDescription: formData.marketDescription || '',
      });
      setIsSubmitting(false)
      setIsSubmitted(true)
    }, 1400)
  }

  const slideVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.4 } },
    exit: { x: -50, opacity: 0, transition: { duration: 0.3 } }
  }

  const CharacterCounter = ({ text, max }: { text: string, max: number }) => (
    <div className={`text-xs mt-1 text-right ${text.length > max ? 'text-brand-error font-medium' : 'text-slate-400'}`}>
      {text.length} / {max} characters
    </div>
  )

  const [countdown, setCountdown] = useState(5)

  // Auto-redirect after submission
  useEffect(() => {
    if (isSubmitted && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (isSubmitted && countdown <= 0) {
      window.location.href = `/tracker?tin=${formData.businessTin}`
    }
    return
  }, [isSubmitted, countdown, formData.businessTin])

  if (isSubmitted) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 md:p-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
        >
          <div className="h-2 bg-brand-green w-full" />
          <div className="p-8 md:p-12 text-center space-y-6">
            <div className="relative inline-block">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-24 h-24 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto"
              >
                <CheckCircle2 className="w-12 h-12 text-brand-green" />
              </motion.div>
              <motion.div 
                animate={{ opacity: [0, 1, 0], scale: [1, 1.5, 2] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 border-2 border-brand-green rounded-full"
              />
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-slate-900">Application Sent!</h1>
              <p className="text-slate-500">
                Your loan application for <span className="font-bold text-slate-900">{formData.requestedAmount}</span> has been successfully submitted to the BRD review team.
              </p>
            </div>

            <div className="bg-background rounded-2xl p-6 border border-slate-100 text-left">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Reference ID</span>
                <span className="text-xs font-mono font-bold text-brand-blue">REACH-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-green" />
                  RDB Status Verified
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-green" />
                  Electronic Documents Uploaded
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-blue" />
                  Assigned to Review Officer
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-4">
              <Button 
                onClick={() => window.location.href = `/tracker?tin=${formData.businessTin}`}
                className="w-full h-14 bg-brand-blue hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-brand-blue/20 flex items-center justify-center gap-2"
              >
                Go to Application Tracker
                <ChevronRight className="w-5 h-5" />
              </Button>
              <p className="text-xs text-slate-400">
                Redirecting you automatically in <span className="font-bold text-slate-600">{countdown}</span> seconds...
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex-1 w-full p-4 md:p-8 max-w-4xl mx-auto mb-20 space-y-8">
      
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Loan Application Form</h1>
        <p className="text-slate-500">Provide your business details and TIN to verify your loan eligibility automatically.</p>
      </div>

      <Card className="border-slate-200 shadow-xl overflow-hidden rounded-2xl relative">
        <div className="bg-background border-b border-slate-100 p-4 md:p-6 pb-0 flex flex-col gap-4">
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="text-slate-500">Step {currentStep} of {totalSteps}</span>
          </div>
          <Progress value={progressValue} className="h-2 bg-slate-200 rounded-none -mx-4 md:-mx-6 mb-[-1px]" />
        </div>

        <CardContent className="p-0 overflow-hidden relative min-h-[400px]">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div key="step1" variants={slideVariants} initial="hidden" animate="visible" exit="exit" className="p-6 md:p-8 space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-1">Business Verification</h2>
                  <p className="text-sm text-slate-500 mb-6 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> 
                    Injiza numero iranga ubucuruzi bwawe (TIN)
                  </p>
                </div>
                
                <div className="space-y-5">
                  <div className="space-y-3">
                    <Label htmlFor="businessTin" className="text-base font-bold">Business Registration Number (TIN)</Label>
                    <div className="relative">
                      <Input 
                        id="businessTin" 
                        placeholder="e.g. RW-TIN-000001" 
                        className="h-14 font-mono uppercase text-lg border-brand-blue/30 focus-visible:ring-brand-blue"
                        value={formData.businessTin}
                        onChange={e => setFormData({...formData, businessTin: e.target.value.toUpperCase()})}
                      />
                    </div>
                    <p className="text-xs text-slate-400 italic">This will securely link your RDB, RRA, and CRB reports for real-time verification.</p>
                  </div>

                  {/* Real-time Eligibility Summary */}
                  {eligibilityResult && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }} 
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-xl border flex items-start gap-4 ${
                        eligibilityResult.status === "Approved" ? "bg-emerald-50 border-emerald-200" :
                        eligibilityResult.status === "Conditional" ? "bg-amber-50 border-amber-200" :
                        "bg-red-50 border-red-200"
                      }`}
                    >
                      {eligibilityResult.status === "Approved" ? <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" /> :
                       eligibilityResult.status === "Conditional" ? <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" /> :
                       <XCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />}
                      
                      <div className="space-y-1 text-sm">
                        <div className="font-bold flex items-center gap-2">
                          <span className={
                            eligibilityResult.status === "Approved" ? "text-emerald-800" :
                            eligibilityResult.status === "Conditional" ? "text-amber-800" :
                            "text-red-800"
                          }>
                            {eligibilityResult.status === "Approved" ? "Eligible" : 
                             eligibilityResult.status === "Conditional" ? "Conditional Eligibility" : 
                             "High Risk / Ineligible"}
                          </span>
                          <span className="text-slate-400 font-normal">| Max Loan: {formatRWF(eligibilityResult.maxLoanAmount)}</span>
                        </div>
                        <p className="text-slate-600 text-xs">{eligibilityResult.reasons[0]}</p>
                      </div>
                    </motion.div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name / Izina ry&apos;ubucuruzi</Label>
                    <Input 
                      id="businessName" 
                      placeholder="e.g. Kigali Fresh Produce" 
                      className="h-12"
                      value={formData.businessName}
                      onChange={e => setFormData({...formData, businessName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessType">Business Type / Ubwoko bw&#39;ubucuruzi</Label>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                      {['Agriculture', 'Retail', 'Technology', 'Services'].map(type => (
                        <Button 
                          key={type} 
                          type="button"
                          variant={formData.businessType === type ? 'default' : 'outline'}
                          className={`h-12 border-slate-200 ${formData.businessType === type ? 'bg-brand-blue text-white hover:bg-brand-darkblue' : 'hover:bg-background text-slate-600'}`}
                          onClick={() => setFormData({...formData, businessType: type})}
                        >
                          {type}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div key="step2" variants={slideVariants} initial="hidden" animate="visible" exit="exit" className="p-6 md:p-8 space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-1">Market & Customers</h2>
                  <p className="text-sm text-slate-500 mb-6 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> 
                    Isoko n&#39;abakiriya bawe
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="marketDescription">Describe your target market and existing customers</Label>
                  <Textarea 
                    id="marketDescription" 
                    placeholder="Describe who buys your product/service and why they choose you over competitors..." 
                    className="min-h-[150px] resize-none"
                    value={formData.marketDescription}
                    onChange={e => setFormData({...formData, marketDescription: e.target.value})}
                    required
                  />
                  <CharacterCounter text={formData.marketDescription} max={500} />
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div key="step3" variants={slideVariants} initial="hidden" animate="visible" exit="exit" className="p-6 md:p-8 space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-1">Loan Purpose</h2>
                  <p className="text-sm text-slate-500 mb-6 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> 
                    Impamvu z&#39;inguzanyo
                  </p>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="requestedAmount">Requested loan amount</Label>
                    <Input
                      id="requestedAmount"
                      placeholder="RWF 12,500,000"
                      className="h-12"
                      value={formData.requestedAmount}
                      onChange={e => setFormData({...formData, requestedAmount: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="repaymentPlan">Repayment plan</Label>
                    <Textarea
                      id="repaymentPlan"
                      placeholder="Example: Repay over 12 months with monthly installments after the pilot season..."
                      className="min-h-[150px] resize-none"
                      value={formData.repaymentPlan}
                      onChange={e => setFormData({...formData, repaymentPlan: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loanPurpose">How exactly will this loan increase your revenue?</Label>
                  <div className="mb-2 p-3 bg-brand-lightblue/50 text-brand-blue text-sm rounded-lg border border-brand-blue/20">
                    <strong>Tip:</strong> Be specific. e.g. &quot;Buying 2 new sewing machines (RWF 1,000,000) will double our daily output.&quot;
                  </div>
                  <Textarea 
                    id="loanPurpose" 
                    placeholder="Provide a detailed breakdown of how you will spend the funds..." 
                    className="min-h-[150px] resize-none focus-visible:ring-brand-blue"
                    value={formData.loanPurpose}
                    onChange={e => setFormData({...formData, loanPurpose: e.target.value})}
                    required
                  />
                  <CharacterCounter text={formData.loanPurpose} max={800} />
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div key="step4" variants={slideVariants} initial="hidden" animate="visible" exit="exit" className="p-6 md:p-8 space-y-6">
                <div className="text-center pb-6 border-b border-slate-100">
                  <div className="w-16 h-16 bg-brand-success/10 text-brand-success rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Final Review</h2>
                  <p className="text-slate-500">Review everything you provided before submitting your loan application.</p>
                </div>

                <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
                  <p className="text-sm font-semibold text-emerald-700 uppercase tracking-[0.24em] mb-3">Requested amount</p>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Loan amount</p>
                      <p className="text-3xl font-bold text-slate-900">{formData.requestedAmount || "RWF 0"}</p>
                    </div>
                    <div className="rounded-3xl bg-white border border-slate-200 p-4 text-sm text-slate-600">
                      {formData.repaymentPlan ? formData.repaymentPlan : "Add a repayment plan for clear next steps."}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 text-sm bg-background p-6 rounded-xl border border-slate-100">
                  <div>
                    <span className="font-semibold text-slate-700 block mb-1">Business Name:</span>
                    <span className="text-slate-600">{formData.businessName || "Not provided"} ({formData.businessType || "Not provided"})</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700 block mb-1">Market Description:</span>
                    <span className="text-slate-600 whitespace-pre-line">{formData.marketDescription || "Not provided"}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700 block mb-1">Loan Purpose:</span>
                    <span className="text-slate-600 whitespace-pre-line">{formData.loanPurpose || "Not provided"}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>

        <CardFooter className="bg-white border-t border-slate-100 flex justify-between p-4 md:p-6">
          <Button 
            variant="outline" 
            onClick={isSubmitted ? () => setIsSubmitted(false) : prevStep} 
            disabled={isSubmitting || currentStep === 1}
            className="h-12 px-6"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            {isSubmitted ? "Edit narrative" : "Back"}
          </Button>
          
          <Button 
            onClick={isSubmitted ? () => window.location.href = '/tracker' : currentStep === totalSteps ? submitApplication : nextStep}
            className="bg-brand-blue hover:bg-brand-darkblue h-12 px-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : isSubmitted ? (
              <>View tracker <ChevronRight className="w-4 h-4 ml-2" /></>
            ) : currentStep === totalSteps ? (
              <>Send Application <CheckCircle2 className="w-4 h-4 ml-2" /></>
            ) : (
              <>Next Step <ChevronRight className="w-4 h-4 ml-2" /></>
            )}
          </Button>
        </CardFooter>
      </Card>

      {isSubmitted && (
        <div className="rounded-3xl border border-brand-success/20 bg-brand-success/10 p-6 text-center text-brand-success shadow-sm">
          <p className="text-sm uppercase tracking-[0.24em] font-semibold mb-3">Application sent</p>
          <h2 className="text-2xl font-bold">Your narrative has been submitted</h2>
          <p className="mt-3 text-sm text-brand-success/90">We have received your application details. You can now track progress in the application tracker.</p>
          <div className="mt-5 flex flex-col sm:flex-row justify-center gap-3">
            <Button onClick={() => window.location.href='/tracker'} className="bg-brand-blue text-white hover:bg-brand-darkblue h-12 px-6">
              Go to Tracker
            </Button>
            <Button variant="outline" onClick={() => setIsSubmitted(false)} className="h-12 px-6">
              Review again
            </Button>
          </div>
        </div>
      )}
      
    </div>
  )
}

export default function NarrativeForm() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-brand-blue animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Loading form...</p>
      </div>
    }>
      <NarrativeFormContent />
    </Suspense>
  )
}
