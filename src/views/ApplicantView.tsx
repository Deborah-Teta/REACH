import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Building2,
  DollarSign,
  PenTool,
  Clock,
  Layout
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const ApplicantView: React.FC = () => {
  const { profile } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: profile?.fullName || '',
    businessName: '',
    tinNumber: '',
    amountRange: '',
    reason: '',
    category: 'Business Expansion'
  });

  const categories = ['Business Expansion', 'Inventory Purchase', 'Asset Acquisition', 'Working Capital', 'Renovation', 'Debt Refinancing'];
  const amountRanges = ['$1,000 - $5,000', '$5,000 - $10,000', '$10,000 - $50,000', '$50,000 - $100,000', '$100,000+'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setLoading(true);

    window.setTimeout(() => {
      setSuccess(true);
      setStep(3);
      setLoading(false);
    }, 500);
  };

  const nextStep = () => {
    if (step === 1 && formData.fullName && formData.businessName && formData.tinNumber) {
      setStep(2);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold tracking-tighter mb-4">Apply for a Loan</h2>
        <p className="text-zinc-500 max-w-sm mx-auto">Complete the multi-step form to submit your application for review.</p>
        
        {/* Progress Bar */}
        <div className="flex items-center justify-center mt-12 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className={`flex items-center ${i < 3 ? 'flex-1 max-w-[100px]' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                step >= i ? 'bg-zinc-900 text-white' : 'bg-zinc-200 text-zinc-500'
              }`}>
                {i < step ? <CheckCircle2 size={16} /> : i}
              </div>
              {i < 3 && <div className={`h-1 flex-1 mx-2 rounded-full ${step > i ? 'bg-zinc-900' : 'bg-zinc-200'}`}></div>}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-[40px] border border-zinc-200 dark:border-zinc-800 shadow-2xl shadow-zinc-200/50 p-12 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-500 ml-1">FULL NAMES</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={e => setFormData({...formData, fullName: e.target.value})}
                    placeholder="Enter your legal full name"
                    className="w-full px-6 py-4 bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-500 ml-1">BUSINESS NAME</label>
                  <input
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={e => setFormData({...formData, businessName: e.target.value})}
                    placeholder="Registered business name"
                    className="w-full px-6 py-4 bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-500 ml-1">TIN NUMBER</label>
                <input
                  type="text"
                  required
                  value={formData.tinNumber}
                  onChange={e => setFormData({...formData, tinNumber: e.target.value})}
                  placeholder="Tax Identification Number"
                  className="w-full px-6 py-4 bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all"
                />
              </div>
              <button
                onClick={nextStep}
                disabled={!formData.fullName || !formData.businessName || !formData.tinNumber}
                className="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all disabled:opacity-50"
              >
                Verify & Continue <ChevronRight size={20} />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-500 ml-1">HOW MUCH DO YOU NEED?</label>
                  <select
                    required
                    value={formData.amountRange}
                    onChange={e => setFormData({...formData, amountRange: e.target.value})}
                    className="w-full px-6 py-4 bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select an amount</option>
                    {amountRanges.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-500 ml-1">CATEGORY</label>
                  <select
                    required
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full px-6 py-4 bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all appearance-none cursor-pointer"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-sm font-bold text-zinc-500">REASON FOR LOAN</label>
                  <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-widest">{formData.reason.length}/100 words</span>
                </div>
                <textarea
                  required
                  rows={4}
                  value={formData.reason}
                  onChange={e => setFormData({...formData, reason: e.target.value})}
                  placeholder="Tell us in about 100 words why you need this loan..."
                  className="w-full px-6 py-4 bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all resize-none"
                />
                {formData.reason.split(' ').length > 105 && (
                  <div className="flex items-center gap-2 text-rose-500 text-xs font-medium bg-rose-50 p-3 rounded-xl">
                    <AlertCircle size={14} /> Reason exceeds word limit (Max 100 words).
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="px-8 py-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-2xl font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading || !formData.amountRange || !formData.reason}
                  className="flex-1 py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit My Application'} <Send size={20} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                <CheckCircle2 size={48} />
              </div>
              <h3 className="text-3xl font-bold mb-4">Application Submitted!</h3>
              <p className="text-zinc-500 max-w-sm mx-auto mb-12">
                We've received your request for {formData.amountRange}. Our team will review your application and notify you shortly.
              </p>
              <button
                onClick={() => {
                  setStep(1);
                  setSuccess(false);
                  setFormData({
                    fullName: profile?.fullName || '',
                    businessName: '',
                    tinNumber: '',
                    amountRange: '',
                    reason: '',
                    category: 'Business Expansion'
                  });
                }}
                className="px-12 py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-bold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all"
              >
                Submit New Application
              </button>

              <div className="mt-12 p-8 bg-zinc-50 dark:bg-zinc-800/50 rounded-[32px] grid grid-cols-3 gap-8">
                 <div className="space-y-1">
                   <p className="text-[10px] text-zinc-400 font-bold uppercase">Estimated Review</p>
                   <p className="font-bold flex items-center justify-center gap-2 text-sm"><Clock size={14} /> 24 Hours</p>
                 </div>
                 <div className="space-y-1">
                   <p className="text-[10px] text-zinc-400 font-bold uppercase">Case ID</p>
                   <p className="font-bold text-sm">#RLA-{Math.floor(1000 + Math.random() * 9000)}</p>
                 </div>
                 <div className="space-y-1">
                   <p className="text-[10px] text-zinc-400 font-bold uppercase">Status</p>
                   <p className="font-bold text-sm">Pending</p>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
