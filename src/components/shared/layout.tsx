import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  Bell, 
  LogOut, 
  Menu, 
  X,
  User
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme: 'light' | 'dark' | 'system';
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, theme }) => {
  const { profile } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  // Mock Notifications for Frontend Demo
  const notifications = [
    { id: '1', message: 'New loan application from Vertex Solutions', createdAt: new Date() },
    { id: '2', message: 'Weekly report is ready for export', createdAt: new Date(Date.now() - 3600000) },
  ];

  const unreadCount = notifications.length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'reviews', label: 'Reviews', icon: FileText },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const rootClass = theme === 'dark'
    ? 'dark bg-zinc-950 text-zinc-100'
    : theme === 'system'
      ? 'bg-zinc-100 text-zinc-950'
      : 'bg-white text-zinc-950';

  return (
    <div className={`${rootClass} min-h-screen flex transition-colors duration-300`}>
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 80 }}
        className={`fixed left-0 top-0 h-full ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : theme === 'system' ? 'bg-zinc-100 border-zinc-300' : 'bg-white border-emerald-100'} border-r dark:border-zinc-800 z-50 overflow-hidden`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center justify-between">
            <AnimatePresence mode="wait">
              {isSidebarOpen && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="font-bold text-2xl tracking-tighter text-emerald-600"
                >
                  REACH.
                </motion.span>
              )}
            </AnimatePresence>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-zinc-800 transition-colors text-emerald-600"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 ${
                  activeTab === item.id 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 dark:shadow-none' 
                    : 'hover:bg-emerald-50 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
                }`}
              >
                <item.icon size={22} />
                {isSidebarOpen && (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="ml-3 font-medium"
                  >
                    {item.label}
                  </motion.span>
                )}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-emerald-50 dark:border-zinc-800">
            <button
              className="w-full flex items-center p-3 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            >
              <LogOut size={22} />
              {isSidebarOpen && <span className="ml-3 font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main 
        className="flex-1 transition-all duration-300"
        style={{ marginLeft: isSidebarOpen ? 260 : 80 }}
      >
        {/* Topbar */}
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-emerald-100 dark:border-zinc-800 px-8 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold capitalize text-emerald-900 dark:text-emerald-100">
            {navItems.find(i => i.id === activeTab)?.label || 'Overview'}
          </h1>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-full hover:bg-emerald-50 dark:hover:bg-zinc-800 relative transition-colors text-emerald-600"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-zinc-900"></span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 bg-white dark:bg-zinc-900 border border-emerald-100 dark:border-zinc-800 rounded-2xl shadow-2xl p-4 z-50"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-emerald-900 dark:text-emerald-100">Notifications</h3>
                      <span className="text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full font-bold">{unreadCount} New</span>
                    </div>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {notifications.map(notif => (
                        <div key={notif.id} className="p-3 rounded-xl bg-emerald-50/50 dark:bg-zinc-800/50 border border-emerald-50 dark:border-zinc-800">
                          <p className="text-sm text-zinc-700 dark:text-zinc-300">{notif.message}</p>
                          <span className="text-[10px] text-zinc-500 mt-1 block">
                            {notif.createdAt.toLocaleTimeString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center space-x-3 pl-4 border-l border-emerald-100 dark:border-zinc-800">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold">{profile?.fullName}</p>
                <p className="text-xs text-emerald-600 capitalize font-medium">{profile?.role}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white shadow-lg shadow-emerald-100">
                {profile?.fullName?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
