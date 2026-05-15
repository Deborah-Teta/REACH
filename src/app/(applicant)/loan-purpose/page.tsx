"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calculator, CheckCircle2, Factory, Store, Briefcase, Landmark, AlertCircle, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { lookupBusiness, computeEligibility } from "@/lib/loanEligibility"

export default function LoanPurpose() {
  const [tin, setTin] = useState<string | null>(null)
  const [maxAmount, setMaxAmount] = useState(0)
  const [amount, setAmount] = useState([0])
  const [duration, setDuration] = useState("12")
  const [category, setCategory] = useState("inventory")
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const storedTin = localStorage.getItem("reach_tin")
    if (storedTin) {
      setTin(storedTin)
      const lookup = lookupBusiness(storedTin)
      if (lookup) {
        const eligibility = computeEligibility(lookup)
        setMaxAmount(eligibility.maxLoanAmount)
        setAmount([Math.min(5000000, eligibility.maxLoanAmount)])
      }
    }
  }, [])

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value.replace(/\D/g, "")) || 0
    if (val > maxAmount) {
      setIsError(true)
    } else {
      setIsError(false)
    }
    setAmount([val])
  }

  const handleSubmit = () => {
    if (amount[0] > maxAmount || amount[0] <= 0) return
    localStorage.setItem("reach_requested_amount", amount[0].toString())
    window.location.href = `/application-form?tin=${tin}&amount=${amount[0]}`
  }

  const categories = [
    { id: "inventory", icon: Store, title: "Inventory & Stock", description: "Purchase goods to sell" },
    { id: "equipment", icon: Factory, title: "Equipment", description: "Machinery, computers, tools" },
    { id: "operations", icon: Briefcase, title: "Operations", description: "Marketing, hiring, rent" },
  ]

  // Mock calculation: 15% annual interest
  const rate = 0.15
  const durationInYears = parseInt(duration) / 12
  const totalRepayment = amount[0] + (amount[0] * rate * durationInYears)
  const monthlyPayment = totalRepayment / parseInt(duration)

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF', maximumFractionDigits: 0 }).format(val)
  }

  return (
    <div className="flex-1 w-full p-4 md:p-8 lg:p-12 mb-20 max-w-6xl mx-auto space-y-8">
      
      <div className="text-center md:text-left border-b border-slate-200 pb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Loan Configuration</h1>
          <p className="text-slate-500">Configure your parameters based on your RWF {maxAmount.toLocaleString()} pre-qualification.</p>
        </div>
        <div className="bg-brand-lightblue text-brand-blue font-bold px-6 py-3 rounded-xl border border-brand-blue/20">
          Max Eligible: {formatCurrency(maxAmount)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Configuration Controls */}
        <div className="lg:col-span-2 space-y-8">
          
          <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
            <div className="bg-background border-b border-slate-100 p-6">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-blue text-xs text-white">1</span>
                Loan Amount
              </h2>
            </div>
            <CardContent className="p-6 md:p-8 space-y-8">
              <div className="space-y-4">
                <div className="relative max-w-md mx-auto">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">RWF</span>
                  <Input 
                    type="text" 
                    value={amount[0].toLocaleString()} 
                    onChange={handleAmountChange}
                    className={`h-20 pl-20 text-4xl font-bold text-center border-2 rounded-2xl ${isError ? 'border-red-500 focus-visible:ring-red-500' : 'border-brand-blue focus-visible:ring-brand-blue'}`}
                  />
                </div>
                
                <AnimatePresence>
                  {isError && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-500 text-sm font-semibold flex items-center justify-center gap-2"
                    >
                      <AlertCircle className="w-4 h-4" />
                      Requested amount cannot exceed your limit of {formatCurrency(maxAmount)}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              
              <Slider 
                max={maxAmount} 
                step={500000} 
                min={0}
                value={amount}
                onValueChange={(val) => { setAmount(val); setIsError(false); }}
                className="my-6"
              />
              
              <div className="flex flex-wrap gap-2 justify-center">
                {[1000000, 2000000, 5000000, maxAmount].filter(p => p <= maxAmount).map((preset) => (
                  <Button 
                    key={preset}
                    variant={amount[0] === preset ? "default" : "outline"}
                    className={amount[0] === preset ? "bg-brand-blue text-white" : "text-slate-600 hover:text-brand-blue hover:bg-brand-lightblue hover:border-brand-blue/50"}
                    onClick={() => { setAmount([preset]); setIsError(false); }}
                  >
                    {formatCurrency(preset)}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
            <div className="bg-background border-b border-slate-100 p-6">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-300 text-xs text-white">2</span>
                Primary Purpose
              </h2>
            </div>
            <CardContent className="p-6">
              <RadioGroup value={category} onValueChange={setCategory} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {categories.map((cat) => (
                  <Label 
                    key={cat.id} 
                    htmlFor={cat.id}
                    className={`flex flex-col items-center justify-center text-center p-6 border-2 rounded-xl cursor-pointer transition-all ${
                      category === cat.id 
                        ? 'border-brand-blue bg-brand-lightblue/30 shadow-md shadow-brand-blue/10' 
                        : 'border-slate-100 hover:border-slate-300 hover:bg-background'
                    }`}
                  >
                    <RadioGroupItem value={cat.id} id={cat.id} className="sr-only" />
                    <cat.icon className={`w-8 h-8 mb-3 ${category === cat.id ? 'text-brand-blue' : 'text-slate-400'}`} />
                    <span className="font-semibold text-slate-900 mb-1">{cat.title}</span>
                    <span className="text-xs text-slate-500 font-normal">{cat.description}</span>
                  </Label>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
            <div className="bg-background border-b border-slate-100 p-6">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs text-slate-500">3</span>
                Repayment Timeline
              </h2>
            </div>
            <CardContent className="p-6">
              <RadioGroup value={duration} onValueChange={setDuration} className="grid grid-cols-3 gap-2 md:gap-4">
                {[
                  { val: "6", label: "6 Months" },
                  { val: "12", label: "12 Months" },
                  { val: "24", label: "24 Months" }
                ].map((term) => (
                  <Label 
                    key={term.val} 
                    htmlFor={`term-${term.val}`}
                    className={`flex items-center justify-center py-4 border-2 rounded-xl cursor-pointer transition-all font-semibold ${
                      duration === term.val 
                        ? 'border-brand-blue bg-white text-brand-blue shadow-sm' 
                        : 'border-slate-100 text-slate-500 hover:border-slate-300 hover:bg-background'
                    }`}
                  >
                    <RadioGroupItem value={term.val} id={`term-${term.val}`} className="sr-only" />
                    {term.label}
                  </Label>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

        </div>

        {/* Right Side: Calculation Summary Panel */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="sticky top-24"
          >
            <Card className="border-brand-blue border-2 shadow-2xl rounded-3xl overflow-hidden relative">
              <div className="bg-brand-blue text-white p-6 relative overflow-hidden">
                <div className="absolute right-0 top-0 opacity-10">
                  <Calculator className="w-48 h-48 -mr-10 -mt-10" />
                </div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Landmark className="w-5 h-5" /> BRD Summary
                </h3>
              </div>
              
              <CardContent className="p-0">
                <div className="p-6 border-b border-slate-100 bg-brand-lightblue/20">
                  <p className="text-sm text-slate-500 mb-1 font-medium">Estimated Monthly Payment</p>
                  <p className="text-4xl font-bold text-slate-900 tracking-tight">
                    {formatCurrency(monthlyPayment)}
                  </p>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Principal</span>
                    <span className="font-semibold text-slate-900">{formatCurrency(amount[0])}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Total Interest (est)</span>
                    <span className="font-semibold text-slate-900">{formatCurrency(totalRepayment - amount[0])}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Duration</span>
                    <span className="font-semibold text-slate-900">{duration} Months</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-t border-slate-100 pt-4 mt-4">
                    <span className="font-bold text-slate-900">Total Repayment</span>
                    <span className="font-bold text-brand-blue text-lg">{formatCurrency(totalRepayment)}</span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="p-6 pt-0 bg-white">
                <Button 
                  disabled={isError || amount[0] <= 0}
                  className="w-full h-14 text-base font-bold bg-brand-success hover:bg-emerald-600 text-white rounded-xl shadow-lg shadow-brand-success/30 group" 
                  onClick={handleSubmit}
                >
                  Continue to Narrative Form
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardFooter>
            </Card>
            
            <div className="mt-6 text-center text-xs text-slate-500 flex flex-col items-center gap-2">
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-brand-success" /> Secure 256-bit encryption</span>
              <p>By submitting, you agree to the REACH terms of service and permit BRD to begin loan processing.</p>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  )
}
