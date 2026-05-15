"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { UserPlus, ClipboardCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      router.push("/dashboard")
    }, 1400)
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-emerald-50 flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-5xl rounded-[2rem] bg-white shadow-2xl border border-slate-200 overflow-hidden">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="p-10 sm:p-16">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-800">
              <UserPlus className="w-4 h-4" />
              Create your account
            </div>
            <h1 className="mt-8 text-4xl font-bold tracking-tight text-slate-900">Register for your loan dashboard</h1>
            <p className="mt-4 text-base leading-7 text-slate-600">
              We only ask for the necessary business and contact information so you can apply quickly and securely.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5">
                <p className="text-sm font-semibold text-slate-900">Business ready</p>
                <p className="mt-2 text-sm text-slate-600">Register with the details used for your RDB account.</p>
              </div>
              <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5">
                <p className="text-sm font-semibold text-slate-900">Application support</p>
                <p className="mt-2 text-sm text-slate-600">Your dashboard will show every step after signup.</p>
              </div>
            </div>
          </div>
          <div className="bg-emerald-600 p-8 sm:p-12 text-white">
            <div className="mb-8">
              <p className="text-sm uppercase tracking-[0.24em] text-emerald-100 font-semibold">Signup form</p>
              <h2 className="mt-3 text-3xl font-bold">Start your loan journey</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full-name" className="text-emerald-100">Full Name</Label>
                <Input id="full-name" placeholder="John Doe" className="h-11 border-slate-200 focus-visible:ring-emerald-400" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-emerald-100">Contact Email</Label>
                <Input id="email" type="email" placeholder="hello@business.rw" className="h-11 border-slate-200 focus-visible:ring-emerald-400" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-emerald-100">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="+250 788 123 456" className="h-11 border-slate-200 focus-visible:ring-emerald-400" required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-emerald-100">Password</Label>
                  <Input id="password" type="password" placeholder="••••••••" className="h-11 border-slate-200 focus-visible:ring-emerald-400" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-emerald-100">Confirm Password</Label>
                  <Input id="confirm-password" type="password" placeholder="••••••••" className="h-11 border-slate-200 focus-visible:ring-emerald-400" required />
                </div>
              </div>
              <Button type="submit" className="w-full h-13 mt-2 bg-brand-blue text-white hover:bg-brand-darkblue shadow-lg shadow-brand-blue/20">
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>
            <div className="mt-4 rounded-2xl border border-emerald-500/30 bg-white/10 p-4 text-xs text-emerald-100">
              <div className="flex items-center gap-2 font-semibold">
                <ClipboardCheck className="w-3.5 h-3.5" />
                Required information
              </div>
              <p className="mt-1.5 text-slate-100/90">Full name, phone, email, and a secure password are required to open your REACH account.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
