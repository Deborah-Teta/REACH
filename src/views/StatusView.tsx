import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { LoanApplication, ApplicationStatus } from '../types';

const defaultApplications: LoanApplication[] = [
  {
    id: 'app-001',
    applicantId: 'user-123',
    fullName: 'Amina Johnson',
    businessName: "Amina's Bakery",
    tinNumber: 'TIN-7734-5',
    amountRange: '₦500,000 - ₦1,000,000',
    reason: 'Expand into a second location, purchase new ovens, and hire three new staff members.',
    category: 'Growth capital',
    status: ApplicationStatus.PENDING,
    createdAt: new Date('2026-04-12'),
  },
  {
    id: 'app-002',
    applicantId: 'user-123',
    fullName: 'Amina Johnson',
    businessName: 'Johnson Fabrics',
    tinNumber: 'TIN-2245-6',
    amountRange: '₦1,000,000 - ₦2,500,000',
    reason: 'Buy additional inventory ahead of the holiday season and improve our delivery fleet.',
    category: 'Working Capital',
    status: ApplicationStatus.APPROVED,
    responseMessage: 'Your loan has been approved. Please check your dashboard for the next steps.',
    createdAt: new Date('2026-03-28'),
  },
  {
    id: 'app-003',
    applicantId: 'user-123',
    fullName: 'Amina Johnson',
    businessName: 'Amina Tech Solutions',
    tinNumber: 'TIN-5567-8',
    amountRange: '₦250,000 - ₦500,000',
    reason: 'Purchase new laptops and upgrade our network infrastructure.',
    category: 'Asset Acquisition',
    status: ApplicationStatus.REJECTED,
    responseMessage: 'We were unable to move forward due to incomplete financial statements.',
    createdAt: new Date('2026-02-17'),
  }
];

const formatDate = (value: any) => {
  if (!value) return '—';
  if (typeof value?.toDate === 'function') return value.toDate().toLocaleDateString();
  return new Date(value).toLocaleDateString();
};

export const StatusView: React.FC = () => {
  const [applications, setApplications] = useState<LoanApplication[]>(defaultApplications);
  const [expandedAppId, setExpandedAppId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string>('');

  const toggleDetails = (id: string) => {
    setExpandedAppId(prev => (prev === id ? null : id));
  };

  const withdrawApplication = (id: string) => {
    setApplications(prev => prev.filter(app => app.id !== id));
    setToastMessage('Application withdrawn successfully.');
  };

  const sendInquiry = (id: string) => {
    setApplications(prev => prev.map(app => {
      if (app.id !== id) return app;
      return {
        ...app,
        responseMessage: 'Inquiry sent. You will receive a response within 24 hours.',
      };
    }));
    setToastMessage('Inquiry sent to the review team.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Application Activity</h2>
        <p className="text-zinc-500">Track the status of your recent loan requests</p>
      </div>

      {toastMessage && (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-6 py-4 text-sm text-emerald-800 shadow-sm">
          {toastMessage}
          <button
            onClick={() => setToastMessage('')}
            className="ml-4 text-emerald-900 font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="space-y-4">
        {applications.length > 0 ? applications.map((app, index) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm"
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                      <Clock size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{app.businessName}</h3>
                      <p className="text-sm text-zinc-500">{app.category} • {app.amountRange}</p>
                    </div>
                  </div>

                  {app.responseMessage && (
                    <div className="p-4 bg-zinc-50 dark:bg-zinc-800/30 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                      <div className="flex items-center gap-2 mb-2 text-zinc-400">
                        <MessageSquare size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Official Response</span>
                      </div>
                      <p className="text-sm italic text-zinc-600 dark:text-zinc-300">"{app.responseMessage}"</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-start md:items-end justify-between min-w-[140px] gap-3">
                  <div className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${
                    app.status === ApplicationStatus.APPROVED ? 'bg-emerald-100 text-emerald-700' :
                    app.status === ApplicationStatus.REJECTED ? 'bg-rose-100 text-rose-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {app.status === ApplicationStatus.APPROVED ? <CheckCircle size={16} /> :
                      app.status === ApplicationStatus.REJECTED ? <XCircle size={16} /> :
                      <Clock size={16} />}
                    {app.status}
                  </div>
                  <span className="text-xs text-zinc-400 font-medium">
                    Submitted {formatDate(app.createdAt)}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => toggleDetails(app.id)}
                  className="rounded-2xl border border-zinc-200 bg-zinc-100 px-5 py-3 text-sm font-bold text-zinc-700 hover:bg-zinc-200 transition-all"
                >
                  {expandedAppId === app.id ? 'Hide details' : 'View details'}
                </button>
                <button
                  onClick={() => sendInquiry(app.id)}
                  className="rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-bold text-white hover:bg-zinc-800 transition-all"
                >
                  {app.responseMessage ? 'Send another inquiry' : 'Send inquiry'}
                </button>
                <button
                  onClick={() => withdrawApplication(app.id)}
                  disabled={app.status !== ApplicationStatus.PENDING}
                  className={`rounded-2xl border px-5 py-3 text-sm font-bold transition-all disabled:cursor-not-allowed disabled:opacity-50 ${app.status !== ApplicationStatus.PENDING ? 'border-zinc-200 text-zinc-400' : 'border-rose-200 text-rose-700 hover:bg-rose-50'}`}
                >
                  Withdraw request
                </button>
              </div>

              <AnimatePresence initial={false}>
                {expandedAppId === app.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 p-6"
                  >
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="text-xs uppercase tracking-widest text-zinc-400">Applicant</p>
                        <p className="font-semibold text-zinc-900 dark:text-zinc-100">{app.fullName}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-widest text-zinc-400">TIN</p>
                        <p className="font-semibold text-zinc-900 dark:text-zinc-100">{app.tinNumber}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-xs uppercase tracking-widest text-zinc-400">Reason</p>
                      <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">{app.reason}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )) : (
          <div className="bg-white dark:bg-zinc-900 rounded-[40px] border border-dashed border-zinc-200 dark:border-zinc-800 p-20 text-center">
            <AlertCircle size={48} className="mx-auto mb-4 text-zinc-200" />
            <h3 className="text-xl font-bold mb-1">No applications yet</h3>
            <p className="text-sm text-zinc-500">You haven't submitted any loan requests yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};
