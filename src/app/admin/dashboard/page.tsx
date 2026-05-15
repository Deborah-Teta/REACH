'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Shield,
  Users,
  AlertTriangle,
  Database,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCcw,
  HardDrive,
  Bell,
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
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from 'recharts';

// ── System Log Store ──────────────────────────────────────────────
interface SystemLogEntry {
  id: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  source: string;
  timestamp: string;
}

interface BackupEntry {
  id: string;
  type: 'manual' | 'scheduled';
  status: 'completed' | 'failed';
  startedAt: string;
  completedAt: string;
  size: string;
}

interface AlertItem {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'resolved';
  createdAt: string;
}

// Default system logs for demonstration
const defaultSystemLogs: SystemLogEntry[] = [
  { id: 'log-1', level: 'info', message: 'System boot completed successfully', source: 'System', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
  { id: 'log-2', level: 'info', message: 'Database connection pool initialized (20 connections)', source: 'Database', timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString() },
  { id: 'log-3', level: 'warning', message: 'CPU usage exceeded 85% threshold for 3 minutes', source: 'Monitoring', timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString() },
  { id: 'log-4', level: 'error', message: 'Failed to connect to replica database (retry 3/5)', source: 'Database', timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString() },
  { id: 'log-5', level: 'info', message: 'Scheduled backup started', source: 'Backup', timestamp: new Date(Date.now() - 1000 * 60 * 40).toISOString() },
  { id: 'log-6', level: 'info', message: 'Scheduled backup completed (2.1 GB)', source: 'Backup', timestamp: new Date(Date.now() - 1000 * 60 * 42).toISOString() },
  { id: 'log-7', level: 'critical', message: 'Unauthorized access attempt blocked from IP 41.186.x.x', source: 'Security', timestamp: new Date(Date.now() - 1000 * 60 * 55).toISOString() },
  { id: 'log-8', level: 'info', message: 'SSL certificate renewal successful (expires 2027-05-15)', source: 'Security', timestamp: new Date(Date.now() - 1000 * 60 * 70).toISOString() },
  { id: 'log-9', level: 'warning', message: 'Memory usage at 78% — consider scaling', source: 'Monitoring', timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString() },
  { id: 'log-10', level: 'info', message: 'User session cleanup completed (142 expired sessions removed)', source: 'Auth', timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
];

// Weekly system activity data
const systemActivityData = [
  { day: 'Mon', logs: 142, alerts: 3, backups: 2 },
  { day: 'Tue', logs: 168, alerts: 5, backups: 2 },
  { day: 'Wed', logs: 155, alerts: 2, backups: 3 },
  { day: 'Thu', logs: 189, alerts: 7, backups: 2 },
  { day: 'Fri', logs: 201, alerts: 4, backups: 2 },
  { day: 'Sat', logs: 98, alerts: 1, backups: 1 },
  { day: 'Sun', logs: 76, alerts: 0, backups: 1 },
];

// System uptime data (last 24 hours)
const uptimeData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${String(i).padStart(2, '0')}:00`,
  uptime: Math.min(100, 95 + Math.random() * 5),
  cpu: Math.max(15, Math.min(90, 40 + Math.random() * 30 + (i > 8 && i < 18 ? 20 : 0))),
  memory: Math.max(30, Math.min(85, 55 + Math.random() * 15)),
}));

const levelColors: Record<string, string> = {
  info: 'bg-emerald-500',
  warning: 'bg-amber-500',
  error: 'bg-red-500',
  critical: 'bg-red-700',
};

const levelBadge: Record<string, string> = {
  info: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
  warning: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
  error: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400',
  critical: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

function timeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [systemLogs, setSystemLogs] = useState<SystemLogEntry[]>([]);
  const [backupHistory, setBackupHistory] = useState<BackupEntry[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  useEffect(() => {
    // Check authentication
    const authData = localStorage.getItem('systemAdminAuth');
    if (!authData) {
      router.push('/admin/login');
      return;
    }

    // Load system logs from localStorage or use defaults
    const savedLogs = localStorage.getItem('adminSystemLogs');
    setSystemLogs(savedLogs ? JSON.parse(savedLogs) : defaultSystemLogs);

    // Load backup history
    const savedBackups = localStorage.getItem('adminBackupHistory');
    setBackupHistory(savedBackups ? JSON.parse(savedBackups) : []);

    // Load alerts
    const savedAlerts = localStorage.getItem('adminAlerts');
    setAlerts(savedAlerts ? JSON.parse(savedAlerts) : []);
  }, [router]);

  // Load access requests
  const accessRequests = JSON.parse(localStorage.getItem('accessRequests') || '[]');
  const pendingAccessRequests = accessRequests.filter((r: any) => r.status === 'pending').length;
  const totalAccessRequests = accessRequests.length;

  // Computed stats
  const totalLogs = systemLogs.length;
  const errorLogs = systemLogs.filter(l => l.level === 'error' || l.level === 'critical').length;
  const warningLogs = systemLogs.filter(l => l.level === 'warning').length;
  const pendingAlerts = alerts.filter(a => a.status === 'pending').length;
  const resolvedAlerts = alerts.filter(a => a.status === 'resolved').length;
  const totalBackups = backupHistory.length;
  const lastBackup = backupHistory.length > 0 ? backupHistory[0] : null;
  const totalStorageGB = backupHistory.reduce((sum, e) => sum + parseFloat(e.size.replace('GB', '') || '0'), 0).toFixed(1);

  const systemStats = [
    {
      label: 'System Alerts',
      value: pendingAlerts.toString(),
      icon: AlertTriangle,
      color: pendingAlerts > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400',
      bg: pendingAlerts > 0 ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-emerald-50 dark:bg-emerald-900/20',
      change: `${resolvedAlerts} resolved`,
      trend: pendingAlerts === 0 ? 'up' : 'down',
    },
    {
      label: 'Access Requests',
      value: pendingAccessRequests.toString(),
      icon: Users,
      color: pendingAccessRequests > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-emerald-600 dark:text-emerald-400',
      bg: pendingAccessRequests > 0 ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-emerald-50 dark:bg-emerald-900/20',
      change: `${totalAccessRequests} total`,
      trend: pendingAccessRequests === 0 ? 'up' : 'down',
    },
    {
      label: 'Backups',
      value: totalBackups.toString(),
      icon: Database,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      change: lastBackup ? `Last: ${timeAgo(lastBackup.completedAt)}` : 'No backups yet',
      trend: 'up',
    },
  ];

  // Log level distribution for pie chart
  const logDistribution = [
    { name: 'Info', value: systemLogs.filter(l => l.level === 'info').length, color: '#3b82f6' },
    { name: 'Warning', value: systemLogs.filter(l => l.level === 'warning').length, color: '#f59e0b' },
    { name: 'Error', value: systemLogs.filter(l => l.level === 'error').length, color: '#ef4444' },
    { name: 'Critical', value: systemLogs.filter(l => l.level === 'critical').length, color: '#991b1b' },
  ].filter(item => item.value > 0);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white transition-colors">Welcome back, System Admin</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1 transition-colors">System overview — logs, alerts, and backup health.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/admin/response')}
            className="px-4 py-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300 transition-colors flex items-center gap-2"
          >
            <AlertTriangle className="w-4 h-4" />
            View Alerts
          </button>
          <button
            onClick={() => router.push('/admin/settings')}
            className="px-4 py-2 bg-emerald-600 dark:bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 dark:hover:bg-emerald-600 shadow-lg shadow-emerald-200 dark:shadow-none transition-colors"
          >
            System Settings
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {systemStats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-zinc-800"
          >
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} transition-colors`}>
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center text-xs font-bold transition-colors ${
                stat.trend === 'up'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-amber-600 dark:text-amber-400'
              }`}>
                {stat.trend === 'up' ? <ArrowUpRight size={14} className="mr-0.5" /> : <ArrowDownRight size={14} className="mr-0.5" />}
                {stat.trend === 'up' ? 'OK' : 'Attn'}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium transition-colors">{stat.label}</p>
              <h3 className="text-3xl font-bold mt-1 text-gray-900 dark:text-white transition-colors">{stat.value}</h3>
              <p className="text-[10px] text-gray-500 dark:text-gray-500 mt-2 transition-colors">{stat.change}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* System Activity Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-sm border border-gray-200 dark:border-zinc-800 transition-colors">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-bold text-xl text-gray-900 dark:text-white transition-colors">System Activity</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">Weekly logs, alerts, and backup operations</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Logs</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Alerts</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Backups</span>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={systemActivityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" strokeOpacity={0.2} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(24, 24, 27, 0.9)', borderRadius: '16px', border: '1px solid #3f3f46', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="logs" fill="#10b981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="alerts" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                <Bar dataKey="backups" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Log Level Distribution */}
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-sm border border-gray-200 dark:border-zinc-800 transition-colors">
          <h3 className="font-bold text-xl mb-6 text-gray-900 dark:text-white transition-colors">Log Levels</h3>
          <div className="h-[220px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={logDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {logDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(24, 24, 27, 0.9)', borderRadius: '12px', border: 'none', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
            {logDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-gray-600 dark:text-gray-400 transition-colors">{item.name}</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white transition-colors">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Performance (CPU/Memory) */}
      <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-sm border border-gray-200 dark:border-zinc-800 transition-colors">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-xl text-gray-900 dark:text-white transition-colors">System Performance (24h)</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">CPU and memory usage over the last 24 hours</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> CPU %</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Memory %</span>
          </div>
        </div>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={uptimeData}>
              <defs>
                <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="memGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" strokeOpacity={0.15} />
              <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10 }} interval={3} />
              <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10 }} />
              <Tooltip
                contentStyle={{ backgroundColor: 'rgba(24, 24, 27, 0.9)', borderRadius: '12px', border: '1px solid #3f3f46', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="cpu" stroke="#3b82f6" strokeWidth={2} fill="url(#cpuGrad)" />
              <Area type="monotone" dataKey="memory" stroke="#8b5cf6" strokeWidth={2} fill="url(#memGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent System Logs */}
      <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-sm border border-gray-200 dark:border-zinc-800 transition-colors">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-xl text-gray-900 dark:text-white transition-colors">Recent System Logs</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">Latest log entries across all services</p>
          </div>
          <button
            onClick={() => router.push('/admin/response')}
            className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 text-sm font-medium transition-colors"
          >
            View All Logs
          </button>
        </div>
        <div className="space-y-3">
          {systemLogs.slice(0, 8).map((log) => (
            <div key={log.id} className="flex items-start gap-4 py-3 border-b border-gray-100 dark:border-zinc-800 last:border-0 transition-colors">
              <div className={`w-2.5 h-2.5 rounded-full mt-2 flex-shrink-0 ${levelColors[log.level]}`}></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${levelBadge[log.level]}`}>
                    {log.level}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">{log.source}</span>
                </div>
                <p className="text-sm text-gray-800 dark:text-gray-200 mt-1 transition-colors">{log.message}</p>
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap mt-1">{timeAgo(log.timestamp)}</span>
            </div>
          ))}
          {systemLogs.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Activity className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="font-medium">No system logs recorded yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
