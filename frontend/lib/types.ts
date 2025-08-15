import { z } from "zod";
import { loginSchema, onboardingSchema, registerSchema } from "./schema";

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type OnboardingFormData = z.infer<typeof onboardingSchema>;

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
