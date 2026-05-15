"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, ShieldCheck, Sparkles, Clock, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-emerald-50">
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-800 mb-6">
              <ShieldCheck className="w-4 h-4" />
              Secure, fast loan applications for Rwandan businesses
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 mb-6">
              Start with REACH, then sign in to apply for the loan you need.
            </h1>
            <p className="text-lg leading-8 text-slate-600 mb-8">
              Build your business with confidence. Sign up quickly, sign in securely, and continue to your dashboard where your loan eligibility, tracker, and next steps are all in one place.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Link href="/signin" className="w-full sm:w-auto">
                <Button className="w-full bg-brand-blue text-white hover:bg-brand-darkblue h-14 px-8">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full border-brand-blue text-brand-blue hover:bg-brand-lightblue h-14 px-8">
                  Sign Up
                </Button>
              </Link>
              <Link href="/signin?redirect=/dashboard" className="w-full sm:w-auto">
                <Button className="w-full bg-brand-success text-white hover:bg-emerald-700 h-14 px-8">
                  Apply for a Loan
                </Button>
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                { title: "Quick onboarding", description: "Just the information we need to get you started." },
                { title: "Fast decisions", description: "See loan eligibility and track progress in one dashboard." },
                { title: "Verified security", description: "Built for Rwanda’s entrepreneurs with trusted data sources." },
              ].map((item) => (
                <div key={item.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm font-semibold text-slate-900 mb-2">{item.title}</p>
                  <p className="text-sm leading-6 text-slate-500">{item.description}</p>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.aside
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60"
          >
            <div className="mb-8 rounded-3xl bg-emerald-50 p-6">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-800">
                <Sparkles className="w-4 h-4" /> Why REACH?
              </div>
              <div className="space-y-4">
                <div className="rounded-3xl border border-emerald-100 bg-white p-4">
                  <p className="text-sm font-semibold text-slate-900">Complete forms at your pace</p>
                  <p className="text-sm text-slate-500">We guide you through each data point clearly and simply.</p>
                </div>
                <div className="rounded-3xl border border-emerald-100 bg-white p-4">
                  <p className="text-sm font-semibold text-slate-900">Designed for entrepreneurs</p>
                  <p className="text-sm text-slate-500">Minimal fields, maximum clarity, fast approvals.</p>
                </div>
                <div className="rounded-3xl border border-emerald-100 bg-white p-4">
                  <p className="text-sm font-semibold text-slate-900">Stay on top of progress</p>
                  <p className="text-sm text-slate-500">Your dashboard shows everything after signing in.</p>
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-brand-lightblue/80 p-6">
              <div className="mb-4 flex items-center gap-3 text-slate-900">
                <Clock className="w-5 h-5 text-brand-success" />
                <span className="font-semibold">Start in under 2 minutes</span>
              </div>
              <p className="text-sm leading-6 text-slate-600">
                Click Apply to sign in, or create a new account first. After signing in, you will go straight to the dashboard with all your loan information available.
              </p>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  )
}
