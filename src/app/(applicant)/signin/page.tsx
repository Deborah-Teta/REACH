"use client"

import { useState } from "react"
import { ShieldCheck, Shield, FileText, Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type UserRole = 'applicant' | 'approver' | 'admin'

const roleConfig = {
  applicant: {
    label: 'Applicant',
    description: 'Apply for loans and track your applications',
    icon: ShieldCheck,
    color: 'emerald',
    bgGradient: 'from-emerald-600 to-emerald-700',
    accentBg: 'bg-emerald-100',
    accentText: 'text-emerald-600',
    focusRing: 'focus-visible:ring-emerald-500',
    buttonBg: 'bg-emerald-600 hover:bg-emerald-700',
    redirect: '/verify-tin',
    storageKey: 'reach_user_email',
    authKey: 'applicantAuth',
  },
  approver: {
    label: 'Loan Approver',
    description: 'Review and approve loan applications',
    icon: FileText,
    color: 'blue',
    bgGradient: 'from-emerald-600 to-emerald-700',
    accentBg: 'bg-emerald-100',
    accentText: 'text-emerald-600',
    focusRing: 'focus-visible:ring-brand-blue',
    buttonBg: 'bg-emerald-600 hover:bg-emerald-700',
    redirect: '/approver/dashboard',
    storageKey: 'loanApproverAuth',
    authKey: 'loanApproverAuth',
  },
  admin: {
    label: 'System Admin',
    description: 'Manage system settings, backups & alerts',
    icon: Shield,
    color: 'rose',
    bgGradient: 'from-slate-800 to-slate-900',
    accentBg: 'bg-rose-100',
    accentText: 'text-rose-600',
    focusRing: 'focus-visible:ring-rose-500',
    buttonBg: 'bg-rose-600 hover:bg-rose-700',
    redirect: '/admin/dashboard',
    storageKey: 'systemAdminAuth',
    authKey: 'systemAdminAuth',
  },
}

const inferRoleFromEmail = (email: string): UserRole => {
  const normalized = email.trim().toLowerCase()

  if (
    normalized === 'admin@reach.com' ||
    normalized.endsWith('@admin.reach.com') ||
    normalized.startsWith('admin@') ||
    normalized.includes('@admin')
  ) {
    return 'admin'
  }

  if (
    normalized === 'approver@reach.com' ||
    normalized.endsWith('@approver.reach.com') ||
    normalized.startsWith('approver@') ||
    normalized.includes('@approver')
  ) {
    return 'approver'
  }

  return 'applicant'
}

export default function UnifiedSignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const role = email.trim() ? inferRoleFromEmail(email) : 'applicant'
  const config = roleConfig[role]
  const IconComponent = config.icon

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const selectedRole = inferRoleFromEmail(email)

    setTimeout(() => {
      if (selectedRole === 'applicant') {
        localStorage.setItem('reach_user_email', email)
        localStorage.setItem('applicantAuth', JSON.stringify({
          email,
          role: 'applicant',
          loginTime: new Date().toISOString(),
        }))
        router.push('/verify-tin')
      } else if (selectedRole === 'approver') {
        const userData = {
          email,
          role: 'approver',
          loginTime: new Date().toISOString(),
        }
        localStorage.setItem('loanApproverAuth', JSON.stringify(userData))

        const accessRequests = JSON.parse(localStorage.getItem('accessRequests') || '[]')
        const userRequest = accessRequests.find((req: any) => req.email === email)

        if (userRequest && userRequest.status === 'granted') {
          router.push('/approver/dashboard')
        } else {
          router.push('/approver/request-access')
        }
      } else if (selectedRole === 'admin') {
        const userData = {
          email,
          role: 'admin',
          loginTime: new Date().toISOString(),
        }
        localStorage.setItem('systemAdminAuth', JSON.stringify(userData))
        router.push('/admin/dashboard')
      }

      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 via-emerald-50/30 to-emerald-50/20 flex items-center justify-center py-12 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl"
      >
        <div className="rounded-[2rem] bg-white shadow-2xl border border-slate-200 overflow-hidden">
          <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
            {/* Left Panel — Dynamic based on role */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={`bg-gradient-to-br ${config.bgGradient} p-10 text-white sm:p-14 flex flex-col justify-between min-h-[540px]`}
              >
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur-sm">
                    <IconComponent className="w-4 h-4" />
                    {config.label} Portal
                  </div>
                  <h1 className="mt-8 text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
                    {role === 'applicant' && 'Continue your loan application'}
                    {role === 'approver' && 'Review pending applications'}
                    {role === 'admin' && 'System administration panel'}
                  </h1>
                  <p className="mt-4 text-base leading-7 text-white/80">
                    {role === 'applicant' &&
                      'Sign in with your business details to access your dashboard, view your eligibility, and complete your application with confidence.'}
                    {role === 'approver' &&
                      'Access the loan approval dashboard to review submitted applications, send approvals, and manage your review queue.'}
                    {role === 'admin' &&
                      'Monitor system health, manage backups, respond to alerts, and control user access across the platform.'}
                  </p>
                </div>

                <div className="mt-8 space-y-3">
                  <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-4">
                    <p className="text-sm font-semibold text-white">
                      {role === 'applicant' && 'Fast access'}
                      {role === 'approver' && 'Real-time notifications'}
                      {role === 'admin' && 'Full control'}
                    </p>
                    <p className="mt-1.5 text-sm text-white/70">
                      {role === 'applicant' && 'One place for all your loan status updates and documents.'}
                      {role === 'approver' && 'Get instantly notified when new applications are submitted.'}
                      {role === 'admin' && 'Manage backups, alerts, access control and system monitoring.'}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-4">
                    <p className="text-sm font-semibold text-white">
                      {role === 'applicant' && 'Verified data'}
                      {role === 'approver' && 'Approve or reject'}
                      {role === 'admin' && 'Audit trail'}
                    </p>
                    <p className="mt-1.5 text-sm text-white/70">
                      {role === 'applicant' && 'Your account connects your RDB and RRA information securely.'}
                      {role === 'approver' && 'Send approval or rejection notes directly to applicants.'}
                      {role === 'admin' && 'Every system action is logged for compliance and security.'}
                    </p>
                  </div>
                </div>
              </motion.div>

            {/* Right Panel — Form */}
            <div className="p-8 sm:p-12 flex flex-col justify-center">
              <div className="mb-8">
                <p className="text-sm uppercase tracking-[0.24em] text-emerald-700 font-semibold">Sign in</p>
                <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-slate-900">Welcome to REACH</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Enter your email and password. The system will route you to the correct dashboard based on your email domain.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-medium">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="hello@business.rw"
                      className={`h-12 pl-11 border-slate-200 ${config.focusRing}`}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`h-12 pl-11 pr-12 border-slate-200 ${config.focusRing}`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full h-14 ${config.buttonBg} text-white shadow-lg font-semibold text-base rounded-xl flex items-center justify-center gap-2 transition-all`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in as {config.label}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-background p-4 text-sm text-slate-600">
                <p className="font-semibold text-slate-700 mb-1">One account, every role</p>
                <p className="text-xs text-slate-500">
                  Use your admin or approver email to access the right panel automatically. Applicants can use their business email to continue the loan application process.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
