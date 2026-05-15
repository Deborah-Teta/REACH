'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/hooks/useTheme';
import { SettingsView } from '../../../components/settings/SettingsView';

export default function AdminSettingsPage() {
  const router = useRouter();
  const { theme, setTheme, isLoaded } = useTheme();

  useEffect(() => {
    // Check authentication for admin
    const authData = localStorage.getItem('systemAdminAuth');
    if (!authData) {
      router.push('/admin/login');
      return;
    }
  }, [router]);

  if (!isLoaded) return null;

  const bgClass = theme === 'dark' ? 'bg-zinc-950' : theme === 'system' ? 'bg-gray-100' : 'bg-gray-50';

  return (
    <div className={`min-h-screen ${bgClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SettingsView theme={theme} setTheme={setTheme} />
      </div>
    </div>
  );
}


