'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/hooks/useTheme';
import { rdbData, rraData, crbData } from '@/lib/mockData';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  TrendingUp,
  DollarSign,
  Building2,
  Bell,
  X,
  ArrowRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { getUnreadNotificationCount, markAllNotificationsRead } from '@/lib/notificationStore';

export default function LoanApproverDashboard() {
  const router = useRouter();
  const { isLoaded } = useTheme();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Check authentication and access
    const authData = localStorage.getItem('loanApproverAuth');
    if (!authData) {
      router.push('/approver/login');
      return;
    }

    const accessRequests = JSON.parse(localStorage.getItem('accessRequests') || '[]');
    const userData = JSON.parse(authData);
    const userRequest = accessRequests.find((req: any) => req.email === userData.email);

    if (!userRequest || userRequest.status !== 'granted') {
      router.push('/approver/request-access');
      return;
    }

    // Load notifications
    const count = getUnreadNotificationCount();
    setUnreadCount(count);

    // Poll for new notifications
    const interval = setInterval(() => {
      setUnreadCount(getUnreadNotificationCount());
    }, 3000);

    return () => clearInterval(interval);
  }, [router]);

  if (!isLoaded) return null;

  // Calculate stats from mock data
  const totalBusinesses = rdbData.length;
  const compliantBusinesses = rraData.filter(r => r.Tax_Compliance_Status === 'Compliant').length;
  const businessesWithLoans = crbData.filter(c => c.Has_Loan === 'Yes').length;
  const averageCreditScore = Math.round(
    crbData.reduce((sum, c) => sum + c.Credit_Score, 0) / crbData.length
  );

  // Loan status distribution
  const loanStatusData = [
    { name: 'Paid', value: crbData.filter(c => c.Loan_Status === 'Paid').length, color: '#10b981' },
    { name: 'Ongoing', value: crbData.filter(c => c.Loan_Status === 'Ongoing').length, color: '#f59e0b' },
    { name: 'Defaulted', value: crbData.filter(c => c.Loan_Status === 'Defaulted').length, color: '#ef4444' },
  ];

  // Tax compliance distribution
  const taxComplianceData = [
    { name: 'Compliant', value: rraData.filter(r => r.Tax_Compliance_Status === 'Compliant').length },
    { name: 'Partial', value: rraData.filter(r => r.Tax_Compliance_Status === 'Partial').length },
    { name: 'Non-compliant', value: rraData.filter(r => r.Tax_Compliance_Status === 'Non-compliant').length },
  ];

  // Business field distribution
  const fieldDistribution = rdbData.reduce((acc: any, business) => {
    const existing = acc.find((item: any) => item.name === business.Business_Field);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: business.Business_Field, value: 1 });
    }
    return acc;
  }, []);

  // Recent high-value businesses
  const recentHighValue = rraData
    .sort((a, b) => b.Annual_Income - a.Annual_Income)
    .slice(0, 5)
    .map(rra => {
      const rdb = rdbData.find(r => r.Business_ID === rra.Business_ID);
      const crb = crbData.find(c => c.Business_ID === rra.Business_ID);
      return {
        businessId: rra.Business_ID,
        businessName: rdb?.Business_Name || 'Unknown',
        income: rra.Annual_Income,
        creditScore: crb?.Credit_Score || 0,
        loanStatus: crb?.Loan_Status || 'No record'
      };
    });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">Approver Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1 transition-colors">Overview of businesses, loans, and compliance status</p>
          </div>

          {/* Notification Banner */}
          {unreadCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="relative"
            >
              <div className="rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white p-4 flex items-center justify-between shadow-lg shadow-emerald-200 dark:shadow-none">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Bell size={22} className="animate-bounce" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-emerald-600 text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-base">
                      {unreadCount} {unreadCount === 1 ? 'new application' : 'new applications'}
                    </p>
                    <p className="text-sm opacity-90">
                      {unreadCount === 1 ? 'An applicant has submitted a new loan application.' : `${unreadCount} applicants have submitted loan applications.`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => router.push('/approver/reviews')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white text-emerald-600 rounded-xl font-semibold hover:bg-opacity-90 transition-all"
                  >
                    Review <ArrowRight size={16} />
                  </button>
                  <button
                    onClick={() => {
                      markAllNotificationsRead();
                      setUnreadCount(0);
                    }}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Building2, label: 'Total Businesses', value: totalBusinesses, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
              { icon: CheckCircle2, label: 'Compliant', value: compliantBusinesses, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
              { icon: DollarSign, label: 'With Loans', value: businessesWithLoans, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
              { icon: TrendingUp, label: 'Avg Credit Score', value: averageCreditScore, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-gray-200 dark:border-zinc-800 shadow-sm transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2 transition-colors">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} transition-colors`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Loan Status Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-gray-200 dark:border-zinc-800 shadow-sm transition-colors"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors">Loan Status Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={loanStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {loanStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(24, 24, 27, 0.9)', borderRadius: '8px', border: 'none', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Tax Compliance Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-gray-200 dark:border-zinc-800 shadow-sm transition-colors"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors">Tax Compliance Status</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={taxComplianceData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.2} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(24, 24, 27, 0.9)', borderRadius: '8px', border: 'none', color: '#fff' }} />
                  <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Business Field Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-gray-200 dark:border-zinc-800 shadow-sm transition-colors"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors">Business Field Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={fieldDistribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.2} />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(24, 24, 27, 0.9)', borderRadius: '8px', border: 'none', color: '#fff' }} />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Recent High-Value Businesses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-gray-200 dark:border-zinc-800 shadow-sm transition-colors"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors">Top Businesses by Revenue</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-zinc-800 transition-colors">
                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 text-sm font-medium transition-colors">Business ID</th>
                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 text-sm font-medium transition-colors">Business Name</th>
                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 text-sm font-medium transition-colors">Annual Income</th>
                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 text-sm font-medium transition-colors">Credit Score</th>
                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 text-sm font-medium transition-colors">Loan Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentHighValue.map((business, idx) => (
                    <tr key={idx} className="border-b border-gray-100 dark:border-zinc-800/50 last:border-0 transition-colors">
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400 text-sm font-mono transition-colors">{business.businessId}</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white text-sm font-medium transition-colors">{business.businessName}</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white text-sm font-semibold transition-colors">
                        RWF {(business.income / 1_000_000).toFixed(1)}M
                      </td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white text-sm transition-colors">{business.creditScore}</td>
                      <td className="py-3 px-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          business.loanStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' :
                          business.loanStatus === 'Ongoing' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                          business.loanStatus === 'Defaulted' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                          'bg-gray-100 text-gray-800 dark:bg-zinc-800 dark:text-gray-400'
                        } transition-colors`}>
                          {business.loanStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
