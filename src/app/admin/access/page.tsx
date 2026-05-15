'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/hooks/useTheme';
import { motion } from 'framer-motion';
import {
  Shield,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Building,
  Hash,
  Mail,
  Calendar
} from 'lucide-react';

interface AccessRequest {
  id: string;
  email: string;
  fullName: string;
  businessName: string;
  tinNumber: string;
  reason: string;
  status: 'pending' | 'granted' | 'denied';
  submittedAt: string;
}

export default function AccessManagement() {
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const router = useRouter();
  const { theme, isLoaded } = useTheme();

  useEffect(() => {
    // Check authentication
    const authData = localStorage.getItem('systemAdminAuth');
    if (!authData) {
      router.push('/admin/login');
      return;
    }

    // Load access requests
    const accessRequests = JSON.parse(localStorage.getItem('accessRequests') || '[]');
    setRequests(accessRequests);
  }, [router]);

  const handleApprove = (requestId: string) => {
    const updatedRequests = requests.map(req =>
      req.id === requestId ? { ...req, status: 'granted' as const } : req
    );
    setRequests(updatedRequests);
    localStorage.setItem('accessRequests', JSON.stringify(updatedRequests));
  };

  const handleDeny = (requestId: string) => {
    const updatedRequests = requests.map(req =>
      req.id === requestId ? { ...req, status: 'denied' as const } : req
    );
    setRequests(updatedRequests);
    localStorage.setItem('accessRequests', JSON.stringify(updatedRequests));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'granted': return 'text-emerald-600 bg-emerald-50';
      case 'denied': return 'text-red-600 bg-red-50';
      default: return 'text-amber-600 bg-amber-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'granted': return <CheckCircle className="w-4 h-4" />;
      case 'denied': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Access Management</h2>
          <p className="text-gray-600 mt-1">Review and manage loan approver access requests</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-red-50 text-red-700 rounded-lg text-sm font-medium">
            {requests.filter(r => r.status === 'pending').length} Pending Requests
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-6">
        {requests.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Access Requests</h3>
            <p className="text-gray-600">Access requests from loan approvers will appear here</p>
          </div>
        ) : (
          requests.map((request, idx) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{request.fullName}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {request.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(request.submittedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                  {getStatusIcon(request.status)}
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{request.businessName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{request.tinNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Loan Approver Access</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Reason for Access:</h4>
                <p className="text-gray-600 text-sm">{request.reason}</p>
              </div>

              {request.status === 'pending' && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(request.id)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve Access
                  </button>
                  <button
                    onClick={() => handleDeny(request.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Deny Access
                  </button>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
