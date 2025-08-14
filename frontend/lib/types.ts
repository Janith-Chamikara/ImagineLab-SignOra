import { z } from "zod";
import { loginSchema, onboardingSchema, registerSchema } from "./schema";

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type OnboardingFormData = z.infer<typeof onboardingSchema>;
