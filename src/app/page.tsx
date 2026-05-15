'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Sparkles, Clock, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/navbar';

type UserRole = 'applicant' | 'approver' | 'admin';

export default function RootPage() {
  const router = useRouter();
  const [authRole, setAuthRole] = useState<UserRole | null>(null);
  const [authEmail, setAuthEmail] = useState<string | null>(null);

  useEffect(() => {
    const applicantAuth = localStorage.getItem('applicantAuth');
    const approverAuth = localStorage.getItem('loanApproverAuth');
    const adminAuth = localStorage.getItem('systemAdminAuth');

    if (applicantAuth) {
      const userData = JSON.parse(applicantAuth);
      setAuthRole('applicant');
      setAuthEmail(userData.email);
      return;
    }

    if (approverAuth) {
      const accessRequests = JSON.parse(localStorage.getItem('accessRequests') || '[]');
      const userData = JSON.parse(approverAuth);
      const userRequest = accessRequests.find((req: any) => req.email === userData.email);
      setAuthRole('approver');
      setAuthEmail(userData.email);
      setAuthRole(userRequest && userRequest.status === 'granted' ? 'approver' : 'approver');
      return;
    }

    if (adminAuth) {
      const userData = JSON.parse(adminAuth);
      setAuthRole('admin');
      setAuthEmail(userData.email);
    }
  }, []);

  const handleResume = () => {
    if (authRole === 'applicant') {
      router.push('/verify-tin');
    } else if (authRole === 'approver') {
      const accessRequests = JSON.parse(localStorage.getItem('accessRequests') || '[]');
      const userData = JSON.parse(localStorage.getItem('loanApproverAuth') || '{}');
      const userRequest = accessRequests.find((req: any) => req.email === userData.email);
      if (userRequest && userRequest.status === 'granted') {
        router.push('/approver/dashboard');
      } else {
        router.push('/approver/request-access');
      }
    } else if (authRole === 'admin') {
      router.push('/admin/dashboard');
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('applicantAuth');
    localStorage.removeItem('loanApproverAuth');
    localStorage.removeItem('systemAdminAuth');
    setAuthRole(null);
    setAuthEmail(null);
  };

  return (
    <div className="min-h-screen bg-emerald-50">
      <Navbar />
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
                <Button className="w-full bg-emerald-600 text-white hover:bg-emerald-700 h-14 px-8">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50 h-14 px-8">
                  Sign Up
                </Button>
              </Link>
              <Link href="/signin" className="w-full sm:w-auto">
                <Button className="w-full bg-emerald-600 text-white hover:bg-emerald-700 h-14 px-8 flex items-center justify-center gap-2">
                  Apply for a Loan <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            {authRole && (
              <div className="mt-6 p-6 rounded-3xl border border-emerald-200 bg-emerald-50 text-emerald-900">
                <p className="text-sm font-semibold">Signed in as {authEmail}</p>
                <p className="text-sm text-emerald-700/80 mt-1">
                  You are recognized as an {authRole}. Use resume to continue where you left off.
                </p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <Button onClick={handleResume} className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white h-12 px-6">
                    Resume Dashboard
                  </Button>
                  <Button variant="outline" onClick={handleSignOut} className="w-full sm:w-auto h-12 px-6">
                    Sign Out
                  </Button>
                </div>
              </div>
            )}

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                { title: 'Quick onboarding', description: 'Just the information we need to get you started.' },
                { title: 'Verified data', description: 'Your account connects your RDB and RRA information securely.' },
                { title: 'Track progress', description: 'Real-time updates on your application status and next steps.' },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3">
                  <Sparkles className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    <p className="text-sm text-slate-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <div className="space-y-6">
                {[
                  { icon: Clock, label: 'Step 1', title: 'Create Account', desc: 'Sign up with your email' },
                  { icon: UserPlus, label: 'Step 2', title: 'Verify Business', desc: 'Link your RDB/TIN' },
                  { icon: ShieldCheck, label: 'Step 3', title: 'Apply', desc: 'Complete your application' },
                ].map((step, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-semibold text-sm">
                        {idx + 1}
                      </div>
                      {idx < 2 && <div className="w-0.5 h-8 bg-emerald-200 my-2" />}
                    </div>
                    <div className="pt-1">
                      <p className="text-xs font-semibold text-emerald-600 uppercase">{step.label}</p>
                      <p className="font-semibold text-slate-900">{step.title}</p>
                      <p className="text-sm text-slate-600">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <p className="text-sm text-slate-600">
                  <span className="font-semibold text-emerald-700">Unified Sign-In:</span> All users (applicants, loan approvers, and admins) use the same sign-in portal and are directed to their respective dashboards.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

