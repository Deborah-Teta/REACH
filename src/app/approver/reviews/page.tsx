'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ReviewsView } from '@/components/approver/ReviewsView';

export default function ApproverReviewsPage() {
  const router = useRouter();

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ReviewsView theme="light" />
      </div>
    </div>
  );
}
