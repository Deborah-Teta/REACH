'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/hooks/useTheme';
import { motion } from 'framer-motion';
import {
  Database,
  ShieldCheck,
  Clock,
  RefreshCcw,
  Cloud,
  FolderPlus,
  Download,
  CheckCircle2
} from 'lucide-react';

interface BackupEntry {
  id: string;
  type: 'manual' | 'scheduled';
  status: 'completed' | 'failed';
  startedAt: string;
  completedAt: string;
  size: string;
}

const scheduleOptions = [
  { value: 'daily', label: 'Daily Backup' },
  { value: 'weekly', label: 'Weekly Backup' },
  { value: 'monthly', label: 'Monthly Backup' },
];

export default function AdminBackup() {
  const [backupHistory, setBackupHistory] = useState<BackupEntry[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState('daily');
  const [isBackingUp, setIsBackingUp] = useState(false);
  const router = useRouter();
  const { theme, isLoaded } = useTheme();

  useEffect(() => {
    const authData = localStorage.getItem('systemAdminAuth');
    if (!authData) {
      router.push('/admin/login');
      return;
    }

    const savedHistory = JSON.parse(localStorage.getItem('adminBackupHistory') || '[]');
    setBackupHistory(savedHistory);
    const savedSchedule = localStorage.getItem('adminBackupSchedule');
    if (savedSchedule) {
      setSelectedSchedule(savedSchedule);
    }
  }, [router]);

  const lastBackup = useMemo(() => {
    if (backupHistory.length === 0) return null;
    return backupHistory[0];
  }, [backupHistory]);

  const totalBackups = backupHistory.length;
  const totalStorage = backupHistory.reduce((sum, entry) => sum + Number(entry.size.replace('GB', '')), 0).toFixed(1);

  const handleBackupNow = () => {
    setIsBackingUp(true);
    setTimeout(() => {
      const newEntry: BackupEntry = {
        id: Date.now().toString(),
        type: 'manual',
        status: 'completed',
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        size: '2.2GB',
      };
      const updatedHistory = [newEntry, ...backupHistory];
      setBackupHistory(updatedHistory);
      localStorage.setItem('adminBackupHistory', JSON.stringify(updatedHistory));
      setIsBackingUp(false);
    }, 1400);
  };

  const handleScheduleChange = (schedule: string) => {
    setSelectedSchedule(schedule);
    localStorage.setItem('adminBackupSchedule', schedule);
  };

  if (!isLoaded) return null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Backup Management</h2>
          <p className="text-gray-600 mt-1">Manage system backups and recovery points from here.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-red-50 rounded-2xl text-red-600">
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Next Scheduled Backup</p>
              <p className="text-lg font-semibold text-gray-900">{selectedSchedule.charAt(0).toUpperCase() + selectedSchedule.slice(1)}</p>
            </div>
          </div>
          <div className="space-y-3">
            {scheduleOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleScheduleChange(option.value)}
                className={`w-full text-left px-4 py-3 rounded-2xl border transition ${
                  selectedSchedule === option.value
                    ? 'border-red-600 bg-red-50 text-red-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-red-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-gray-500">Storage Summary</p>
              <h3 className="text-2xl font-bold text-gray-900">{totalStorage}GB backed up</h3>
            </div>
            <button
              onClick={handleBackupNow}
              disabled={isBackingUp}
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-semibold py-3 px-5 rounded-2xl transition-colors"
            >
              {isBackingUp ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {isBackingUp ? 'Running Backup...' : 'Backup Now'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="rounded-3xl bg-red-50 border border-red-100 p-5">
              <p className="text-sm text-gray-500">Last Backup</p>
              <p className="mt-3 text-xl font-semibold text-gray-900">{lastBackup ? new Date(lastBackup.completedAt).toLocaleString() : 'No backups yet'}</p>
            </div>
            <div className="rounded-3xl bg-white border border-gray-200 p-5">
              <p className="text-sm text-gray-500">Total Backups</p>
              <p className="mt-3 text-xl font-semibold text-gray-900">{totalBackups}</p>
            </div>
            <div className="rounded-3xl bg-white border border-gray-200 p-5">
              <p className="text-sm text-gray-500">Restore Points</p>
              <p className="mt-3 text-xl font-semibold text-gray-900">{backupHistory.length}</p>
            </div>
          </div>

          <div className="rounded-3xl bg-gray-50 border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">Backup History</h4>
                <p className="text-sm text-gray-500">Recent automatic and manual backup operations.</p>
              </div>
              <div className="inline-flex items-center gap-2 text-sm font-medium text-gray-600">
                <ShieldCheck className="w-4 h-4" />
                Secure
              </div>
            </div>
            {backupHistory.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FolderPlus className="mx-auto mb-4 w-10 h-10" />
                No backup history available yet.
              </div>
            ) : (
              <div className="space-y-4">
                {backupHistory.map((entry) => (
                  <div key={entry.id} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white border border-gray-200 rounded-3xl p-4">
                    <div>
                      <p className="text-sm text-gray-500">{entry.type === 'manual' ? 'Manual Backup' : 'Scheduled Backup'}</p>
                      <p className="text-base font-semibold text-gray-900">{new Date(entry.completedAt).toLocaleString()}</p>
                      <p className="text-sm text-gray-500">Size: {entry.size}</p>
                    </div>
                    <div
                      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${
                        entry.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {entry.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                      {entry.status === 'completed' ? 'Completed' : 'Failed'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

