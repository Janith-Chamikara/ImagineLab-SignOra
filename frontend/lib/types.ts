import { z } from "zod";
import {
  bookingSchema,
  createServiceSchema,
  departmentSchema,
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
  date: Date;
  startTime: Date;
  endTime: Date;
  maxBookings: number;
  currentBookings: number;
  status: "AVAILABLE" | "FULL" | "BLOCKED" | "HOLIDAY";
};
