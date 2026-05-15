'use client';

// ─── Notification & Application Store ────────────────────────────────
// Centralised localStorage-backed store that bridges the applicant
// submission flow with the approver notification + review list.
// ─────────────────────────────────────────────────────────────────────

export interface SubmittedApplication {
  id: string;
  fullName: string;
  email: string;
  businessName: string;
  businessTin: string;
  category: string;
  amountRange: string;
  loanPurpose: string;
  repaymentPlan: string;
  marketDescription: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  responseMessage?: string;
}

export interface ApproverNotification {
  id: string;
  applicationId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// ── Keys ──
const APPLICATIONS_KEY = 'reach_submitted_applications';
const NOTIFICATIONS_KEY = 'reach_approver_notifications';

// ── Applications ──
export function getSubmittedApplications(): SubmittedApplication[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(APPLICATIONS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function addSubmittedApplication(app: Omit<SubmittedApplication, 'id' | 'status' | 'createdAt'>): SubmittedApplication {
  const applications = getSubmittedApplications();
  const newApp: SubmittedApplication = {
    ...app,
    id: `REACH-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  applications.unshift(newApp);
  localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(applications));

  // Also push a notification for the approver
  addApproverNotification({
    applicationId: newApp.id,
    title: 'New Loan Application',
    message: `${newApp.fullName} from ${newApp.businessName} submitted a loan application (${newApp.amountRange}).`,
  });

  return newApp;
}

export function updateApplicationStatus(
  id: string,
  status: 'approved' | 'rejected',
  responseMessage?: string
): void {
  const apps = getSubmittedApplications();
  const idx = apps.findIndex((a) => a.id === id);
  if (idx !== -1) {
    apps[idx].status = status;
    if (responseMessage) apps[idx].responseMessage = responseMessage;
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(apps));
  }
}

// ── Notifications ──
export function getApproverNotifications(): ApproverNotification[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(NOTIFICATIONS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function addApproverNotification(
  data: Omit<ApproverNotification, 'id' | 'isRead' | 'createdAt'>
): ApproverNotification {
  const notifications = getApproverNotifications();
  const notif: ApproverNotification = {
    ...data,
    id: `notif-${Date.now()}`,
    isRead: false,
    createdAt: new Date().toISOString(),
  };
  notifications.unshift(notif);
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  return notif;
}

export function markNotificationRead(id: string): void {
  const notifs = getApproverNotifications();
  const idx = notifs.findIndex((n) => n.id === id);
  if (idx !== -1) {
    notifs[idx].isRead = true;
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifs));
  }
}

export function markAllNotificationsRead(): void {
  const notifs = getApproverNotifications();
  notifs.forEach((n) => (n.isRead = true));
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifs));
}

export function getUnreadNotificationCount(): number {
  return getApproverNotifications().filter((n) => !n.isRead).length;
}
