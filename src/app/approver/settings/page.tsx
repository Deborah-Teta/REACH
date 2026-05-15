'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SettingsView } from '@/components/settings/SettingsView';
import { useTheme } from '@/hooks/useTheme';

export default function ApproverSettingsPage() {
  const router = useRouter();
  const { theme, setTheme, isLoaded } = useTheme();

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


