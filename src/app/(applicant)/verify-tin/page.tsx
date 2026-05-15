"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ShieldCheck, 
  Search, 
  ArrowRight, 
  AlertCircle,
  Building2,
  CheckCircle2,
  X
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { lookupBusiness } from "@/lib/loanEligibility"

export default function VerifyTinPage() {
  const router = useRouter()
  const [tin, setTin] = useState("")
  const [ownerName, setOwnerName] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault()
    if (!tin.trim() || !ownerName.trim()) return

    setIsVerifying(true)
    setError(null)

    // Simulate API delay
    setTimeout(() => {
      const lookup = lookupBusiness(tin)
      
      if (!lookup) {
        setError("Invalid Business TIN. No records found in RDB or RRA systems.")
        setIsVerifying(false)
      } else if (lookup.rdb.Owner_Name.toLowerCase() !== ownerName.trim().toLowerCase()) {
        setError(`The Owner Name "${ownerName}" does not match the registered owner for TIN ${tin}.`)
        setIsVerifying(false)
      } else if (!lookup.crb) {
        setError("This Business TIN was not found in CRB database. Verification failed.")
        setIsVerifying(false)
      } else {
        localStorage.setItem("reach_tin", tin)
        setSuccess(true)
        setTimeout(() => {
          router.push(`/dashboard?tin=${tin}`)
        }, 1500)
      }
    }, 2000)
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-emerald-50 flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-slate-200 shadow-2xl rounded-3xl overflow-hidden bg-white">
            <div className="h-2 bg-emerald-600 w-full" />
            <CardHeader className="p-8 pb-4 text-center">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100">
                <ShieldCheck className="w-10 h-10 text-emerald-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-slate-900">Business Verification</CardTitle>
              <CardDescription className="text-slate-500 mt-2">
                Enter your Rwanda Business TIN to link your RDB, RRA, and CRB records before continuing to the dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-4">
              <form onSubmit={handleVerify} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="tin" className="text-slate-700 font-semibold flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-600" />
                    Business TIN / ID
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="tin"
                      type="text"
                      placeholder="e.g. RW-TIN-000001"
                      className="h-14 pl-12 font-mono text-lg border-slate-200 focus-visible:ring-emerald-500 rounded-2xl transition-all"
                      value={tin}
                      onChange={(e) => setTin(e.target.value.toUpperCase())}
                      disabled={isVerifying || success}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ownerName" className="text-slate-700 font-semibold flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Business Owner Name
                  </Label>
                  <Input
                    id="ownerName"
                    type="text"
                    placeholder="Enter your full name as registered"
                    className="h-14 border-slate-200 focus-visible:ring-emerald-500 rounded-2xl transition-all"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    disabled={isVerifying || success}
                    required
                  />
                </div>

                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-xl flex items-start gap-3"
                    >
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <div className="flex-1 text-sm leading-relaxed">
                        <p className="font-bold mb-0.5">Verification Failed</p>
                        <p>{error}</p>
                      </div>
                      <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}

                  {success && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="bg-emerald-50 border border-emerald-100 text-emerald-700 p-4 rounded-xl flex items-start gap-3"
                    >
                      <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                      <div className="flex-1 text-sm leading-relaxed">
                        <p className="font-bold mb-0.5">Verified Successfully</p>
                        <p>Business profile found. Redirecting to your dashboard...</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button 
                  type="submit" 
                  disabled={isVerifying || success || !tin.trim()}
                  className="w-full h-14 bg-emerald-600 text-white hover:bg-emerald-700 rounded-2xl shadow-lg shadow-emerald-600/20 text-lg font-bold transition-all relative overflow-hidden group"
                >
                  {isVerifying ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Verifying...
                    </div>
                  ) : success ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      Secure Verification
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </Button>
              </form>

              <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-10 h-10 bg-background rounded-full flex items-center justify-center mx-auto mb-2 text-slate-400 font-bold text-xs">RDB</div>
                  <p className="text-[10px] text-slate-500 uppercase font-medium">Registry</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 bg-background rounded-full flex items-center justify-center mx-auto mb-2 text-slate-400 font-bold text-xs">RRA</div>
                  <p className="text-[10px] text-slate-500 uppercase font-medium">Taxation</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 bg-background rounded-full flex items-center justify-center mx-auto mb-2 text-slate-400 font-bold text-xs">CRB</div>
                  <p className="text-[10px] text-slate-500 uppercase font-medium">Credit</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <p className="text-center text-slate-400 text-xs mt-8">
            REACH uses encrypted secure connections to government registries. <br />
            © 2026 REACH Rwanda. All rights reserved.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
