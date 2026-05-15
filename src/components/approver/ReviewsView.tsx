import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  ChevronRight,
  Briefcase,
  GraduationCap,
  Home,
  User,
  Bell,
  RefreshCcw
} from 'lucide-react';

interface Application {
  id: string;
  fullName: string;
  email: string;
  businessName: string;
  category: string;
  amountRange: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  reason: string;
  responseMessage?: string;
}

import { rdbData, rraData, crbData } from '../../lib/mockData';
import {
  getSubmittedApplications,
  updateApplicationStatus,
  getApproverNotifications,
  markAllNotificationsRead,
  getUnreadNotificationCount,
  type SubmittedApplication,
} from '../../lib/notificationStore';

const mapLoanStatus = (status: string) => {
  if (status === 'Paid') return 'approved';
  if (status === 'Defaulted') return 'rejected';
  return 'pending';
};

const buildMockApplications = (): Application[] =>
  rdbData.slice(0, 10).map((rdb) => {
    const crb = crbData.find((c) => c.Business_ID === rdb.Business_ID);
    const rra = rraData.find((r) => r.Business_ID === rdb.Business_ID);
    const income = rra ? rra.Annual_Income : 0;
    let amountRange = '$1,000 - $5,000';
    if (income > 5000000) amountRange = '$50,000 - $100,000';
    if (income > 10000000) amountRange = '$100k+';
    return {
      id: rdb.Business_ID,
      fullName: rdb.Owner_Name,
      email: rdb.Email,
      businessName: rdb.Business_Name,
      category: rdb.Business_Field,
      amountRange,
      status: crb ? (mapLoanStatus(crb.Loan_Status) as Application['status']) : 'pending',
      createdAt: new Date().toISOString().split('T')[0],
      reason: `Expansion of ${rdb.Business_Field} operations.`,
      responseMessage: crb?.Loan_Status === 'Paid' ? 'Your loan has been approved.' : undefined,
    };
  });

/** Convert a SubmittedApplication from the store into the local Application shape */
const fromStore = (sa: SubmittedApplication): Application => ({
  id: sa.id,
  fullName: sa.fullName,
  email: sa.email,
  businessName: sa.businessName,
  category: sa.category,
  amountRange: sa.amountRange,
  status: sa.status,
  createdAt: sa.createdAt.split('T')[0],
  reason: sa.loanPurpose || 'Loan application submitted via REACH.',
  responseMessage: sa.responseMessage,
});

export const ReviewsView: React.FC<{ theme: 'light' | 'dark' | 'system' }> = ({ theme }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [applications, setApplications] = useState<Application[]>([]);
  const [fullDetailsApp, setFullDetailsApp] = useState<Application | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectNote, setRejectNote] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const fixedApprovalMessage = 'Congratulations! Your loan application has been approved. Please check your dashboard for the next steps and submit any remaining documentation.';

  // Load applications from store + mock data
  const loadApplications = useCallback(() => {
    const storeApps = getSubmittedApplications().map(fromStore);
    const mockApps = buildMockApplications();
    // Merge: store apps first (newest), then mock apps
    // Avoid duplicates by id
    const ids = new Set(storeApps.map((a) => a.id));
    const combined = [...storeApps, ...mockApps.filter((a) => !ids.has(a.id))];
    setApplications(combined);
    setUnreadCount(getUnreadNotificationCount());
  }, []);

  useEffect(() => {
    loadApplications();
    // Poll every 3 seconds for new submissions
    const interval = setInterval(loadApplications, 3000);
    return () => clearInterval(interval);
  }, [loadApplications]);

  const handleMarkAllRead = () => {
    markAllNotificationsRead();
    setUnreadCount(0);
    setShowNotifications(false);
  };

  const notifications = getApproverNotifications();

  const filteredApps = applications.filter(app => {
    const matchesSearch = app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          app.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'Business': return <Briefcase size={16} />;
      case 'Education': return <GraduationCap size={16} />;
      case 'Mortgage': return <Home size={16} />;
      default: return <User size={16} />;
    }
  };

  const openFullDetails = (app: Application) => {
    setFullDetailsApp(app);
    setRejectNote('');
  };

  const closeFullDetails = () => {
    setFullDetailsApp(null);
    setShowApproveModal(false);
    setShowRejectModal(false);
    setRejectNote('');
  };

  const sendApproval = () => {
    if (!fullDetailsApp) return;
    // Update in the store (for store-originated apps)
    updateApplicationStatus(fullDetailsApp.id, 'approved', fixedApprovalMessage);
    setApplications(prev => prev.map(app => app.id === fullDetailsApp.id ? {
      ...app,
      status: 'approved',
      responseMessage: fixedApprovalMessage
    } : app));
    setShowApproveModal(false);
    alert(`Approval email sent to ${fullDetailsApp.email}`);
  };

  const sendRejection = () => {
    if (!fullDetailsApp || !rejectNote.trim()) return;
    updateApplicationStatus(fullDetailsApp.id, 'rejected', rejectNote.trim());
    setApplications(prev => prev.map(app => app.id === fullDetailsApp.id ? {
      ...app,
      status: 'rejected',
      responseMessage: rejectNote.trim()
    } : app));
    setShowRejectModal(false);
    alert(`Rejection note sent to ${fullDetailsApp.email}`);
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Notification Banner */}
      {unreadCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <div className="rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white p-4 flex items-center justify-between shadow-lg shadow-emerald-200">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bell size={22} className="animate-bounce" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-emerald-600 text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              </div>
              <div>
                <p className="font-bold text-sm">
                  {unreadCount} new application{unreadCount > 1 ? 's' : ''} submitted!
                </p>
                <p className="text-emerald-100 text-xs">New loan applications are waiting for your review.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-xl font-semibold transition"
              >
                View All
              </button>
              <button
                onClick={handleMarkAllRead}
                className="text-xs bg-white text-emerald-600 hover:bg-emerald-50 px-3 py-1.5 rounded-xl font-semibold transition"
              >
                Mark Read
              </button>
            </div>
          </div>

          {/* Dropdown notification list */}
          {showNotifications && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full left-0 right-0 mt-2 z-50 bg-white dark:bg-zinc-900 rounded-2xl border border-emerald-100 dark:border-zinc-800 shadow-2xl max-h-72 overflow-y-auto"
            >
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-zinc-500 text-sm">No notifications yet.</div>
              ) : (
                notifications.slice(0, 10).map((notif) => (
                  <div
                    key={notif.id}
                    className={`px-5 py-3 border-b border-emerald-50 dark:border-zinc-800 last:border-0 flex items-start gap-3 ${
                      !notif.isRead ? 'bg-emerald-50/50 dark:bg-emerald-950/20' : ''
                    }`}
                  >
                    <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${notif.isRead ? 'bg-gray-300' : 'bg-emerald-500'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-emerald-950 dark:text-emerald-100">{notif.title}</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">{notif.message}</p>
                      <p className="text-[10px] text-zinc-400 mt-1">{timeAgo(notif.createdAt)}</p>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Search & Filters */}
      <div className="bg-white dark:bg-zinc-900 p-4 rounded-[2rem] border border-emerald-100 dark:border-zinc-800 shadow-sm flex flex-col lg:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600" size={20} />
          <input 
            type="text" 
            placeholder="Search by name, company, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-emerald-50/50 dark:bg-zinc-800 border-none rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-emerald-900/30 dark:placeholder:text-emerald-100/30"
          />
        </div>
        
        <div className="flex items-center gap-2 w-full lg:w-auto">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`flex-1 lg:flex-none px-4 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all ${
                statusFilter === status 
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100 dark:shadow-none' 
                  : 'text-zinc-500 hover:bg-emerald-50 dark:hover:bg-zinc-800'
              }`}
            >
              {status}
            </button>
          ))}
          <button
            onClick={loadApplications}
            className="p-3 bg-emerald-50 dark:bg-zinc-800 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors"
            title="Refresh"
          >
            <RefreshCcw size={20} />
          </button>
        </div>
      </div>

      {!fullDetailsApp ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2 px-2">
            <span className="text-sm font-bold text-emerald-900 dark:text-emerald-100 uppercase tracking-widest">{filteredApps.length} Applications Found</span>
            <span className="text-xs text-emerald-600 font-medium">Sorted by: Newest First</span>
          </div>

          <div className="space-y-3">
            {filteredApps.map((app) => (
              <motion.div
                layout
                key={app.id}
                onClick={() => openFullDetails(app)}
                className="group p-5 bg-white dark:bg-zinc-900 border cursor-pointer rounded-3xl transition-all duration-300 hover:shadow-xl hover:shadow-emerald-100 dark:hover:shadow-none border-emerald-50 dark:border-zinc-800"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 rounded-2xl flex items-center justify-center font-bold text-lg">
                      {app.fullName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-emerald-950 dark:text-emerald-50 group-hover:text-emerald-600 transition-colors">{app.fullName}</h4>
                      <p className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                        <span className="font-semibold text-emerald-700/70">{app.businessName}</span> • {app.id}
                      </p>
                      <p className="text-[11px] text-zinc-400 mt-1">{app.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="hidden sm:flex flex-col items-end">
                      <span className="text-sm font-bold text-emerald-950 dark:text-emerald-50">{app.amountRange}</span>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                          {getCategoryIcon(app.category)} {app.category}
                        </span>
                      </div>
                    </div>

                    <div className={`px-4 py-2 rounded-xl text-xs font-bold capitalize ${
                      app.status === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                      app.status === 'rejected' ? 'bg-rose-50 text-rose-600' :
                      'bg-amber-50 text-amber-600'
                    }`}>
                      {app.status}
                    </div>
                    <ChevronRight size={20} className="text-emerald-200 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openFullDetails(app);
                    }}
                    className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 transition"
                  >
                    See more
                  </button>
                </div>
              </motion.div>
            ))}
            {filteredApps.length === 0 && (
              <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-[3rem] border border-dashed border-emerald-200">
                <Search size={48} className="mx-auto text-emerald-100 mb-4" />
                <h3 className="text-lg font-bold text-emerald-950">No results found</h3>
                <p className="text-zinc-500">Try adjusting your search or filters.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-[2rem] bg-white dark:bg-zinc-900 border border-emerald-100 dark:border-zinc-800 p-8 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8">
            <div>
              <p className="text-xs uppercase tracking-widest text-zinc-400">Application Detail</p>
              <h2 className="text-3xl font-bold text-emerald-950 dark:text-white">{fullDetailsApp.businessName}</h2>
              <p className="text-sm text-zinc-500 mt-2">{fullDetailsApp.fullName} • {fullDetailsApp.email}</p>
            </div>
            <button
              onClick={closeFullDetails}
              className="rounded-2xl bg-zinc-100 dark:bg-zinc-800 px-5 py-3 text-sm font-bold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 transition"
            >
              Back to reviews
            </button>
          </div>

          <div className="grid gap-6 lg:grid-cols-3 mb-8">
            <div className="rounded-3xl border border-emerald-100 dark:border-zinc-800 p-6 bg-emerald-50 dark:bg-zinc-950/50">
              <p className="text-xs uppercase tracking-widest text-emerald-600 mb-2">Status</p>
              <p className={`text-xl font-bold ${fullDetailsApp.status === 'approved' ? 'text-emerald-700' : fullDetailsApp.status === 'rejected' ? 'text-rose-600' : 'text-amber-700'}`}>{fullDetailsApp.status}</p>
            </div>
            <div className="rounded-3xl border border-emerald-100 dark:border-zinc-800 p-6 bg-white dark:bg-zinc-900">
              <p className="text-xs uppercase tracking-widest text-zinc-500 mb-2">Loan ID</p>
              <p className="font-bold text-emerald-950 dark:text-white">{fullDetailsApp.id}</p>
            </div>
            <div className="rounded-3xl border border-emerald-100 dark:border-zinc-800 p-6 bg-white dark:bg-zinc-900">
              <p className="text-xs uppercase tracking-widest text-zinc-500 mb-2">Amount Range</p>
              <p className="font-bold text-emerald-950 dark:text-white">{fullDetailsApp.amountRange}</p>
            </div>
          </div>

          <div className="rounded-[2rem] bg-emerald-50 dark:bg-zinc-950/50 border border-emerald-100 dark:border-zinc-800 p-8 mb-8">
            <h3 className="font-bold text-xl text-emerald-950 dark:text-white mb-4">Application Reason</h3>
            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">{fullDetailsApp.reason}</p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl border border-emerald-100 dark:border-zinc-800 p-6 bg-white dark:bg-zinc-900">
              <p className="text-xs uppercase tracking-widest text-zinc-500 mb-2">Submitted</p>
              <p className="font-bold text-emerald-950 dark:text-white">{fullDetailsApp.createdAt}</p>
            </div>
            <div className="rounded-3xl border border-emerald-100 dark:border-zinc-800 p-6 bg-white dark:bg-zinc-900">
              <p className="text-xs uppercase tracking-widest text-zinc-500 mb-2">Category</p>
              <p className="font-bold text-emerald-950 dark:text-white">{fullDetailsApp.category}</p>
            </div>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            <button
              onClick={() => setShowApproveModal(true)}
              className="w-full rounded-3xl bg-emerald-600 text-white py-4 font-bold hover:bg-emerald-700 transition"
            >
              Approve Application
            </button>
            <button
              onClick={() => setShowRejectModal(true)}
              className="w-full rounded-3xl border border-rose-200 bg-white dark:bg-zinc-900 text-rose-600 py-4 font-bold hover:bg-rose-50 transition"
            >
              Reject with Note
            </button>
          </div>
        </div>
      )}

      {showApproveModal && fullDetailsApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-6">
          <div className="w-full max-w-2xl rounded-[2rem] bg-white dark:bg-zinc-900 border border-emerald-100 dark:border-zinc-800 p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h4 className="text-2xl font-bold text-emerald-950 dark:text-white">Send Approval Email</h4>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">This email will be sent to {fullDetailsApp.email}</p>
              </div>
              <button onClick={() => setShowApproveModal(false)} className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200">Close</button>
            </div>
            <textarea
              readOnly
              value={fixedApprovalMessage}
              className="w-full min-h-[180px] rounded-3xl border border-zinc-200 bg-emerald-50 p-5 text-sm text-zinc-800 dark:bg-zinc-950 dark:text-white"
            />
            <button
              onClick={sendApproval}
              className="mt-6 w-full rounded-3xl bg-emerald-600 text-white py-4 font-bold hover:bg-emerald-700 transition"
            >
              Send Approval
            </button>
          </div>
        </div>
      )}

      {showRejectModal && fullDetailsApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-6">
          <div className="w-full max-w-2xl rounded-[2rem] bg-white dark:bg-zinc-900 border border-emerald-100 dark:border-zinc-800 p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h4 className="text-2xl font-bold text-emerald-950 dark:text-white">Send Rejection Note</h4>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Type the reason for rejection and send it to {fullDetailsApp.email}</p>
              </div>
              <button onClick={() => setShowRejectModal(false)} className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200">Close</button>
            </div>
            <textarea
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
              placeholder="Type the rejection note here..."
              className="w-full min-h-[180px] rounded-3xl border border-zinc-200 bg-white p-5 text-sm text-zinc-900 dark:bg-zinc-950 dark:text-white"
            />
            <button
              onClick={sendRejection}
              className="mt-6 w-full rounded-3xl bg-rose-600 text-white py-4 font-bold hover:bg-rose-700 transition"
            >
              Send Rejection
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

