export enum UserRole {
  APPLICANT = 'applicant',
  APPROVER = 'approver'
}

export enum ApplicationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export enum ApproverAccessStatus {
  NONE = 'none',
  REQUESTED = 'requested',
  GRANTED = 'granted'
}

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  fullName: string;
  businessName?: string;
  tinNumber?: string;
  approverAccessStatus?: ApproverAccessStatus;
  theme?: 'light' | 'dark' | 'system';
  createdAt: any;
}

export interface LoanApplication {
  id: string;
  applicantId: string;
  approverId?: string;
  fullName: string;
  businessName: string;
  tinNumber: string;
  amountRange: string;
  reason: string;
  category: string;
  status: ApplicationStatus;
  responseMessage?: string;
  createdAt: any;
  updatedAt?: any;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: 'submission' | 'status_update' | 'access_request';
  isRead: boolean;
  createdAt: any;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}
