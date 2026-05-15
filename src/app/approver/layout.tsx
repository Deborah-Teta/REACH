'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from '@/hooks/useTheme';
import {
  FileText,
  LayoutDashboard,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  User
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/approver/dashboard', icon: LayoutDashboard },
  { name: 'Reviews', href: '/approver/reviews', icon: MessageSquare },
  { name: 'Reports', href: '/approver/reports', icon: BarChart3 },
  { name: 'Settings', href: '/approver/settings', icon: Settings },
];

export default function ApproverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoaded } = useTheme();

  if (!isLoaded) return null;

  const handleLogout = () => {
    localStorage.removeItem('loanApproverAuth');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 transition-colors">
      {/* Top Navigation */}
      <nav className="bg-white dark:bg-zinc-900 shadow-sm border-b border-gray-200 dark:border-zinc-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <FileText className="h-8 w-8 text-emerald-600 dark:text-emerald-500" />
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white transition-colors">REACH Approver</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 relative transition-colors">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-zinc-900 transition-all"></span>
              </button>

              {/* Profile */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center transition-colors">
                    <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">Loan Approver</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white dark:bg-zinc-900 shadow-sm min-h-screen border-r border-gray-200 dark:border-zinc-800 transition-colors">
          <nav className="mt-8 px-4">
            <div className="space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'
                        : 'text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 transition-colors ${
                        isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                      }`}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}