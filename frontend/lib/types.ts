import { z } from "zod";
import {
  bookingSchema,
  createServiceSchema,
  departmentSchema,
  feedbackSchema,
  loginSchema,
  onboardingSchema,
  registerSchema,
} from "./schema";

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type OnboardingFormData = z.infer<typeof onboardingSchema>;
export type BookingFormData = z.infer<typeof bookingSchema>;
export type DepartmentFormData = z.infer<typeof departmentSchema>;
export type CreateServiceFormData = z.infer<typeof createServiceSchema>;
export type FeedbackFormData = z.infer<typeof feedbackSchema>;

export type Status = {
  status: "default" | "success" | "error";
  message: string;
  data?: object;
};
export type Notification = {
  id: string;
  title: string;
  message: string;
  type?: "success" | "error" | "info" | "warning";
  isRead: boolean;
  timestamp?: Date;
  createdAt?: string;
};

export type Department = {
  id: string;
  name: string;
  code: string;
  description?: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  workingHours?: any;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  services: Service[];
};

export type Service = {
  id: string;
  name: string;
  code: string;
  description: string;
  departmentId: string;
  estimatedTime: number;
  requiredDocuments?: string[];
  fee: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type TimeSlot = {
  id: string;
  departmentId: string;
  date: String;
  startTime: String;
  endTime: String;
  maxBookings: number;
  currentBookings: number;
  status: "AVAILABLE" | "FULL" | "BLOCKED" | "HOLIDAY";
};

export enum AppointmentStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  NO_SHOW = "NO_SHOW",
}

export enum DocumentType {
  NATIONAL_ID = "NATIONAL_ID",
  BIRTH_CERTIFICATE = "BIRTH_CERTIFICATE",
  MARRIAGE_CERTIFICATE = "MARRIAGE_CERTIFICATE",
  PASSPORT = "PASSPORT",
  UTILITY_BILL = "UTILITY_BILL",
  BANK_STATEMENT = "BANK_STATEMENT",
  EMPLOYMENT_LETTER = "EMPLOYMENT_LETTER",
  MEDICAL_CERTIFICATE = "MEDICAL_CERTIFICATE",
  OTHER = "OTHER",
}

export enum DocumentStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  UNDER_REVIEW = "UNDER_REVIEW",
}

export interface Document {
  id: string;
  fileName: string;
  originalName: string;
  fileSize: number;
  mimeType: string;
  filePath: string;
  documentType: DocumentType;
  userId: string;
  appointmentId?: string;
  uploadedAt: string;
  processedAt?: string;
  processedById?: string;
  status: DocumentStatus;
  notes?: string;
}

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
  phoneNumber: string;
  nationalId: string;
  dateOfBirth: Date;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  isVerified: boolean;
  role: string;
  employeeId?: string;
  departmentId?: string;
  createdAt: Date;
};
export interface Appointment {
  id: string;
  userId: string;
  serviceId: string;
  timeSlotId: string;
  officerId?: string;
  status: AppointmentStatus;
  notes?: string;
  appointmentDate: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  user: User;
  service: Service;
  timeSlot: TimeSlot;
  officer?: {
    name: string;
  };
  documents: Document[];
}
export type Feedback = {
  id: string;
  rating: number;
  comment: string | null;
  isAnonymous: boolean;
  createdAt: string;
  user: User;
};
