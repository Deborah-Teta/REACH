"use client"

import { useState, useEffect, useMemo } from "react"
import { CheckCircle2, PhoneCall, Mail } from "lucide-react"
import { motion } from "framer-motion"

import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getSubmittedApplications, type SubmittedApplication } from "@/lib/notificationStore"

type ApplicationStep = {
  title: string
  description: string
  completed: boolean
  active?: boolean
  date: string
}

const formatTimeAgo = (timestamp: string) => {
  const diff = Date.now() - new Date(timestamp).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "Just now"
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

const getApplicationSteps = (status: SubmittedApplication['status']): ApplicationStep[] => {
  const isPending = status === 'pending'
  const isApproved = status === 'approved'
  const isRejected = status === 'rejected'

  return [
    {
      title: 'Application Submitted',
      description: 'Your application has been sent to the review queue.',
      completed: true,
      date: 'Submitted',
    },
    {
      title: 'Verification',
      description: 'RDB and RRA records are being verified.',
      completed: true,
      date: 'Completed',
    },
    {
      title: 'Risk Assessment',
      description: 'Credit model is calculating your eligibility.',
      completed: !isPending,
      active: isPending,
      date: isPending ? 'In Progress' : 'Completed',
    },
    {
      title: 'Loan Approval Review',
      description: 'A loan approver is reviewing the application.',
      completed: isApproved || isRejected,
      active: isPending,
      date: isPending ? 'Pending' : 'Completed',
    },
    {
      title: 'Final Decision',
      description: 'You receive the final decision and feedback.',
      completed: isApproved || isRejected,
      active: isApproved || isRejected,
      date: isApproved || isRejected ? 'Done' : 'Pending',
    },
  ]
}

const getStatusTile = (app: SubmittedApplication | null) => {
  if (!app) return { label: 'No Active Application', value: 'Start your application', tone: 'bg-slate-100 text-slate-700' }

  if (app.status === 'approved') {
    return { label: 'Approved', value: 'Congratulations! Your loan is approved.', tone: 'bg-emerald-100 text-emerald-700' }
  }
  if (app.status === 'rejected') {
    return { label: 'Rejected', value: 'Your application was not approved.', tone: 'bg-rose-100 text-rose-700' }
  }
  return { label: 'Under Review', value: 'Your application is being assessed.', tone: 'bg-amber-100 text-amber-700' }
}

export default function RealTimeTracker() {
  const [application, setApplication] = useState<SubmittedApplication | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [elapsed, setElapsed] = useState('Just now')

  useEffect(() => {
    const savedEmail = localStorage.getItem('reach_user_email') || (() => {
      const auth = localStorage.getItem('applicantAuth')
      if (!auth) return null
      try {
        return JSON.parse(auth).email
      } catch {
        return null
      }
    })()

    setEmail(savedEmail)
  }, [])

  useEffect(() => {
    const refreshApplication = () => {
      if (!email) {
        setApplication(null)
        return
      }

      const apps = getSubmittedApplications()
      const matched = apps.find((app) => app.email === email) || null
      setApplication(matched)
    }

    refreshApplication()
    const interval = window.setInterval(refreshApplication, 3000)
    return () => window.clearInterval(interval)
  }, [email])

  useEffect(() => {
    if (!application) return

    const updateElapsed = () => {
      setElapsed(formatTimeAgo(application.createdAt))
    }

    updateElapsed()
    const interval = window.setInterval(updateElapsed, 60000)
    return () => window.clearInterval(interval)
  }, [application])

  const steps = useMemo<ApplicationStep[]>(() => getApplicationSteps(application?.status ?? 'pending'), [application])
  const statusTile = getStatusTile(application)

  return (
    <div className="flex-1 w-full p-4 md:p-8 lg:p-12 mb-20 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl tracking-tight font-bold text-slate-900 mb-2">Application Tracker</h1>
          <p className="text-slate-500">Track your loan application progress live and view the approver feedback.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-500 font-medium">Last update</p>
          <p className="text-xl font-mono font-bold text-brand-blue tracking-wider">{elapsed}</p>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-slate-500">Current Status</p>
            <p className="text-lg font-bold text-slate-900 mt-3">{statusTile.label}</p>
            <p className={`mt-4 inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold ${statusTile.tone}`}>{statusTile.value}</p>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-slate-500">Application ID</p>
            <p className="text-lg font-bold text-slate-900 mt-3">{application?.id ?? 'Not available'}</p>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-slate-500">Submitted</p>
            <p className="text-lg font-bold text-slate-900 mt-3">{application ? new Date(application.createdAt).toLocaleString() : 'No submission yet'}</p>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-slate-500">Last Action</p>
            <p className="text-lg font-bold text-slate-900 mt-3">{application?.status === 'approved' ? 'Approved' : application?.status === 'rejected' ? 'Rejected' : 'In progress'}</p>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        <div className="lg:col-span-2">
          <Card className="shadow-lg border-slate-200 rounded-2xl overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-brand-blue to-emerald-400" />
            <CardHeader className="pb-8">
              <CardTitle className="text-xl">Progress Timeline</CardTitle>
              <CardDescription>Live updates are fetched automatically from your submitted application.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative border-l-2 border-slate-100 ml-4 md:ml-6 pb-4">
                {steps.map((step, index) => (
                  <div key={index} className="mb-10 ml-8 relative">
                    <span className="absolute -left-10 md:-left-12 flex h-5 w-5 items-center justify-center">
                      {step.completed ? (
                        <span className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center ring-8 ring-white z-10">
                          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        </span>
                      ) : step.active ? (
                        <span className="relative flex h-6 w-6 ring-8 ring-white z-10">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-blue opacity-40"></span>
                          <span className="relative inline-flex rounded-full h-6 w-6 bg-brand-blue border-[4px] border-white shadow-sm"></span>
                        </span>
                      ) : (
                        <span className="h-4 w-4 rounded-full bg-slate-200 ring-8 ring-white z-10" />
                      )}
                    </span>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-1 md:gap-4 -mt-1.5">
                      <div className="flex-1">
                        <h3 className={`text-base font-semibold ${step.active ? 'text-brand-blue' : step.completed ? 'text-slate-900' : 'text-slate-400'}`}>
                          {step.title}
                        </h3>
                        <p className="text-slate-500 mt-1 max-w-md">{step.description}</p>
                      </div>
                      <time className={`text-xs font-medium px-2 py-1 rounded bg-background text-slate-500 whitespace-nowrap mt-2 md:mt-0 ${step.active ? 'bg-brand-lightblue text-brand-blue' : ''}`}>
                        {step.date}
                      </time>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm rounded-2xl mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Approver Feedback</CardTitle>
              <CardDescription>See the exact message from your loan approver once a decision is made.</CardDescription>
            </CardHeader>
            <CardContent>
              {application?.responseMessage ? (
                <div className="rounded-3xl border border-slate-200 bg-background p-6">
                  <p className="text-slate-700 text-sm leading-7">{application.responseMessage}</p>
                </div>
              ) : (
                <div className="rounded-3xl border border-slate-200 bg-background p-6">
                  <p className="text-slate-500 text-sm leading-7">No decision has been published yet. Check back soon for live updates.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-brand-blue text-white shadow-xl rounded-2xl border-0 overflow-hidden relative">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <CardHeader>
              <CardTitle className="text-white text-lg">What&apos;s happening now?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-brand-lightblue/90 leading-relaxed text-sm">
                {application?.status === 'approved'
                  ? 'Your application is approved. Please follow the next steps provided by the approver.'
                  : application?.status === 'rejected'
                    ? 'The application has been rejected. Review the feedback above and update your documents if needed.'
                    : 'Your application is still under review. We refresh the status automatically every few seconds.'}
              </p>
              <div className="mt-6 flex items-center gap-3 bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm font-medium">Live status refresh enabled</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg">Need Assistance?</CardTitle>
              <CardDescription>Contact the REACH support team for questions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-background transition-colors cursor-pointer">
                <div className="bg-emerald-100 p-2 rounded-lg text-emerald-700">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Call Toll-Free</p>
                  <p className="text-sm text-slate-500">3230</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-background transition-colors cursor-pointer">
                <div className="bg-emerald-100 p-2 rounded-lg text-emerald-700">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Email Support</p>
                  <p className="text-sm text-slate-500">reach@brd.rw</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {!application && (
        <Card className="border-dashed border-2 border-slate-200 bg-background p-8 text-center">
          <CardTitle className="text-xl font-semibold text-slate-900">No application found</CardTitle>
          <CardDescription className="text-slate-500 mt-2">
            Complete your loan application first, then come back here to track its progress.
          </CardDescription>
          <div className="mt-6">
            <Button onClick={() => window.location.href = '/application-form'} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Start Application
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}

