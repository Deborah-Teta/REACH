'use client';

import React, { useState } from 'react';
import { Layout } from './components/shared/layout';
import { ApproverDashboard } from './components/approver/ApproverDashboard';
import { ReviewsView } from './components/approver/ReviewsView';
import { ReportsView } from './components/approver/ReportsView';
import { SettingsView } from './components/settings/SettingsView';
import { motion, AnimatePresence } from 'framer-motion';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} theme={theme}>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'dashboard' && <ApproverDashboard theme={theme} />}
          {activeTab === 'reviews' && <ReviewsView theme={theme} />}
          {activeTab === 'reports' && <ReportsView theme={theme} />}
          {activeTab === 'settings' && <SettingsView theme={theme} setTheme={setTheme} />}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
};

export default function App() {
  return <AppContent />;
}

