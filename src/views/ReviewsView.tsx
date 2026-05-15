import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  ChevronRight,
  Briefcase,
  GraduationCap,
  Home,
  User,
  Calendar,
  DollarSign,
  FileText
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

const mockApplications: Application[] = [
  { id: 'APP-001', fullName: 'Sarah Connor', email: 'sarah.connor@cyberdyne.com', businessName: 'Cyberdyne Systems', category: 'Business', amountRange: '$50,000 - $100,000', status: 'pending', createdAt: '2024-05-01', reason: 'Expansion of manufacturing facility for modern robotics components.' },
  { id: 'APP-002', fullName: 'Bruce Wayne', email: 'bruce.wayne@wayne.com', businessName: 'Wayne Enterprises', category: 'Business', amountRange: '$1M+', status: 'approved', createdAt: '2024-04-28', reason: 'R&D for urban clean energy infrastructure projects.', responseMessage: 'Your loan has been approved. Please check your dashboard for the next steps.' },
  { id: 'APP-003', fullName: 'Peter Parker', email: 'peter.parker@dailybugle.com', businessName: 'Freelance Photography', category: 'Personal', amountRange: '$1,000 - $5,000', status: 'rejected', createdAt: '2024-04-25', reason: 'Personal equipment upgrade for professional photography.', responseMessage: 'We were unable to move forward due to incomplete financial statements.' },
  { id: 'APP-004', fullName: 'Diana Prince', email: 'diana.prince@themyscira.com', businessName: 'Themyscira Antiques', category: 'Mortgage', amountRange: '$250,000 - $500,000', status: 'pending', createdAt: '2024-05-02', reason: 'Acquisition of historical preservation site in downtown.' },
  { id: 'APP-005', fullName: 'Tony Stark', email: 'tony.stark@starkindustries.com', businessName: 'Stark Industries', category: 'Education', amountRange: '$10,000 - $50,000', status: 'pending', createdAt: '2024-05-03', reason: 'Scholarship fund for local technical institute students.' },
];

export const ReviewsView: React.FC<{ theme: 'light' | 'dark' | 'system' }> = ({ theme }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [fullDetailsApp, setFullDetailsApp] = useState<Application | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectNote, setRejectNote] = useState('');

  const fixedApprovalMessage = 'Congratulations! Your loan application has been approved. Please check your dashboard for the next steps and submit any remaining documentation.';

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
    setApplications(prev => prev.map(app => app.id === fullDetailsApp.id ? {
      ...app,
      status: 'rejected',
      responseMessage: rejectNote.trim()
    } : app));
    setShowRejectModal(false);
    alert(`Rejection note sent to ${fullDetailsApp.email}`);
  };

  return (
    <div className="space-y-6">
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
          <button className="p-3 bg-emerald-50 dark:bg-zinc-800 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors">
            <Filter size={20} />
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
