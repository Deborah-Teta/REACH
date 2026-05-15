'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/hooks/useTheme';
import { motion } from 'motion/react';
import {
  AlertTriangle,
  ShieldCheck,
  MessageSquare,
  Bell,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  RefreshCcw
} from 'lucide-react';

interface AlertItem {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'resolved';
  createdAt: string;
}

interface ResponseEntry {
  id: string;
  alertId: string;
  response: string;
  respondedAt: string;
}

const initialAlerts: AlertItem[] = [
  {
    id: 'alert-1',
    title: 'High CPU Utilization',
    description: 'CPU usage has remained above 85% for the last 10 minutes.',
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: 'alert-2',
    title: 'Database Connection Failure',
    description: 'One of the database replicas failed to connect.',
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
  },
  {
    id: 'alert-3',
    title: 'Backup Delay Warning',
    description: 'The nightly backup has not completed on time.',
    status: 'resolved',
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
];

export default function AdminResponse() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [responses, setResponses] = useState<ResponseEntry[]>([]);
  const router = useRouter();
  const { theme, isLoaded } = useTheme();

  useEffect(() => {
    const authData = localStorage.getItem('systemAdminAuth');
    if (!authData) {
      router.push('/admin/login');
      return;
    }

    const savedAlerts = JSON.parse(localStorage.getItem('adminAlerts') || 'null') as AlertItem[] | null;
    setAlerts(savedAlerts ?? initialAlerts);
    const savedResponses = JSON.parse(localStorage.getItem('adminResponses') || '[]') as ResponseEntry[];
    setResponses(savedResponses);
  }, [router]);

  useEffect(() => {
    localStorage.setItem('adminAlerts', JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem('adminResponses', JSON.stringify(responses));
  }, [responses]);

  const pendingAlerts = useMemo(
    () => alerts.filter((alert) => alert.status === 'pending'),
    [alerts]
  );

  const selectedAlert = alerts.find((alert) => alert.id === selectedAlertId) || alerts[0] || null;

  if (!isLoaded) return null;

  const handleSelectAlert = (id: string) => {
    setSelectedAlertId(id);
    setResponseMessage('');
  };

  const handleResolve = () => {
    if (!selectedAlert) return;
    const updatedAlerts: AlertItem[] = alerts.map((alert) =>
      alert.id === selectedAlert.id ? { ...alert, status: 'resolved' as const } : alert
    );
    setAlerts(updatedAlerts);

    const newResponse: ResponseEntry = {
      id: Date.now().toString(),
      alertId: selectedAlert.id,
      response: responseMessage || 'Issue acknowledged and team notified.',
      respondedAt: new Date().toISOString(),
    };
    setResponses([newResponse, ...responses]);
    setResponseMessage('');
  };

  const handleRefresh = () => {
    setAlerts(initialAlerts);
    setResponses([]);
    localStorage.removeItem('adminAlerts');
    localStorage.removeItem('adminResponses');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Response Center</h2>
          <p className="text-gray-600 mt-1">Monitor alerts and send responses for system incidents.</p>
        </div>
        <button
          onClick={handleRefresh}
          className="inline-flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          <RefreshCcw className="w-4 h-4" />
          Reset Alerts
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-red-50 rounded-2xl text-red-600">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Alerts</p>
              <p className="text-2xl font-bold text-gray-900">{pendingAlerts.length}</p>
            </div>
          </div>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <button
                key={alert.id}
                onClick={() => handleSelectAlert(alert.id)}
                className={`w-full text-left p-4 rounded-3xl border transition ${
                  selectedAlertId === alert.id || (!selectedAlertId && selectedAlert?.id === alert.id)
                    ? 'border-red-600 bg-red-50'
                    : 'border-gray-200 bg-white hover:border-red-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-gray-900">{alert.title}</p>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    alert.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {alert.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-2">{alert.description}</p>
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="xl:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{selectedAlert ? selectedAlert.title : 'Select an alert'}</h3>
              <p className="text-sm text-gray-500">{selectedAlert ? selectedAlert.description : 'Choose an alert from the list to respond.'}</p>
            </div>
            <div className="inline-flex items-center gap-2 text-sm text-gray-500">
              <Bell className="w-4 h-4" />
              Updated moments ago
            </div>
          </div>

          {selectedAlert ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="rounded-3xl bg-gray-50 border border-gray-200 p-4">
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="mt-2 text-gray-900 font-semibold">{new Date(selectedAlert.createdAt).toLocaleString()}</p>
                </div>
                <div className="rounded-3xl bg-gray-50 border border-gray-200 p-4">
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="mt-2 text-gray-900 font-semibold capitalize">{selectedAlert.status}</p>
                </div>
                <div className="rounded-3xl bg-gray-50 border border-gray-200 p-4">
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="mt-2 text-gray-900 font-semibold">System Alert</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <label className="block text-sm font-medium text-gray-700">Response Message</label>
                <textarea
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  rows={5}
                  className="w-full rounded-3xl border border-gray-200 bg-white p-4 text-sm text-gray-900 focus:border-red-500 focus:ring-red-500"
                  placeholder="Type your response, mitigation plan, or follow-up notes here..."
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-gray-500">You can resolve the alert when the issue has been addressed.</div>
                <button
                  onClick={handleResolve}
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-5 rounded-2xl transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Resolve Alert
                </button>
              </div>
            </>
          ) : (
            <div className="rounded-3xl bg-gray-50 border border-gray-200 p-10 text-center text-gray-500">
              Select an alert to view details and respond.
            </div>
          )}

          <div className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Recent Responses</h4>
              <span className="text-sm text-gray-500">{responses.length} entries</span>
            </div>
            {responses.length === 0 ? (
              <div className="rounded-3xl bg-gray-50 border border-gray-200 p-8 text-center text-gray-500">
                No response history yet.
              </div>
            ) : (
              <div className="space-y-4">
                {responses.map((entry) => {
                  const alert = alerts.find((item) => item.id === entry.alertId);
                  return (
                    <div key={entry.id} className="rounded-3xl border border-gray-200 bg-white p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm text-gray-500">{alert?.title || 'Alert response'}</p>
                          <p className="mt-2 text-gray-900">{entry.response}</p>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          <p>{new Date(entry.respondedAt).toLocaleString()}</p>
                          <p className="mt-1 font-semibold text-gray-900">{alert?.status === 'resolved' ? 'Resolved' : 'Pending'}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
