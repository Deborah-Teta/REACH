'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FileText, User, Building, Hash, Send, CheckCircle, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function RequestAccess() {
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [tinNumber, setTinNumber] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const authData = localStorage.getItem('loanApproverAuth');
    if (!authData) {
      router.push('/approver/login');
      return;
    }

    // Check if access already requested
    const accessRequests = JSON.parse(localStorage.getItem('accessRequests') || '[]');
    const userData = JSON.parse(authData);
    const existingRequest = accessRequests.find((req: any) => req.email === userData.email);

    if (existingRequest) {
      if (existingRequest.status === 'granted') {
        router.push('/approver/dashboard');
      } else {
        setIsSubmitted(true);
      }
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Get user data from localStorage
    const authData = localStorage.getItem('loanApproverAuth');
    if (!authData) return;

    const userData = JSON.parse(authData);

    // Create access request
    const accessRequest = {
      id: Date.now().toString(),
      email: userData.email,
      fullName,
      businessName,
      tinNumber,
      reason,
      status: 'pending',
      submittedAt: new Date().toISOString()
    };

    // Store request locally
    const existingRequests = JSON.parse(localStorage.getItem('accessRequests') || '[]');
    existingRequests.push(accessRequest);
    localStorage.setItem('accessRequests', JSON.stringify(existingRequests));

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Request Submitted</h1>
            <p className="text-gray-600 mb-6">
              Your request for loan approver access has been submitted. Please wait for system administrator approval.
            </p>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 text-left">
                <h3 className="font-semibold text-gray-900 mb-2">Request Details:</h3>
                <p className="text-sm text-gray-600"><strong>Name:</strong> {fullName}</p>
                <p className="text-sm text-gray-600"><strong>Business:</strong> {businessName}</p>
                <p className="text-sm text-gray-600"><strong>TIN:</strong> {tinNumber}</p>
              </div>
              <button
                onClick={() => router.push('/approver/login')}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                Back to Login
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
              <FileText className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Request Access</h1>
            <p className="text-gray-600">Submit your information to request loan approver access</p>
          </div>

          {/* Request Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Name
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder="Enter your business name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                TIN Number
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={tinNumber}
                  onChange={(e) => setTinNumber(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder="Enter your TIN number"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Access
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"
                placeholder="Please explain why you need loan approver access"
                rows={4}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting Request...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Request
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <button
              onClick={() => router.push('/approver/login')}
              className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
            >
              Back to Login
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}