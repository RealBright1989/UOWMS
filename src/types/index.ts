export type UserRole = 'student' | 'staff' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  matricNumber?: string;
  phoneNumber?: string;
  faculty?: string;
  department?: string;
  hostel?: string;
  status: 'Active' | 'Suspended' | 'Pending';
}

export type WasteCategory = 'Plastic' | 'Glass' | 'Organic' | 'Paper' | 'Metal' | 'Electronic' | 'Mixed Waste';
export type ReportPriority = 'Low' | 'Medium' | 'High' | 'Emergency';
export type ReportStatus = 'Pending' | 'Assigned' | 'In Progress' | 'Completed';

export interface Comment {
  id: string;
  author: string;
  authorRole: UserRole;
  content: string;
  timestamp: string;
}

export interface WasteReport {
  id: string;
  category: WasteCategory;
  priority: ReportPriority;
  location: {
    faculty: string;
    building: string;
    latitude?: number;
    longitude?: number;
    details?: string;
  };
  description: string;
  imageUrl?: string;
  completionImageUrl?: string;
  status: ReportStatus;
  dateSubmitted: string;
  assignedStaffId?: string;
  assignedStaffName?: string;
  comments: Comment[];
  studentId: string;
  studentName: string;
  aiClassification?: {
    confidence: number;
    handlingTip: string;
    recyclePotential: 'High' | 'Medium' | 'Low';
    greenTip: string;
  };
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'success' | 'info' | 'warning' | 'error';
}

export interface ActivityLog {
  id: string;
  action: string;
  user: string;
  role: string;
  timestamp: string;
  details: string;
}
