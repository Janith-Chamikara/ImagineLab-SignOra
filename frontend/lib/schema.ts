import { z } from "zod"

export const loginSchema = z.object({
  nic: z
    .string()
    .min(1, "NIC is required")
    .regex(/^[0-9]{9}[vVxX]$|^[0-9]{12}$/, "Please enter a valid NIC number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const registerSchema = z.object({
  nic: z
    .string()
    .min(1, "NIC is required")
    .regex(/^[0-9]{9}[vVxX]$|^[0-9]{12}$/, "Please enter a valid NIC number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const onboardingSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  birthday: z.string().min(1, "Birthday is required"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  gnDivision: z.string().min(1, "GN Division is required"),
  divisionalSecretariat: z.string().min(1, "Divisional Secretariat is required"),
  contactNumber: z.string().regex(/^[0-9+\-\s()]+$/, "Please enter a valid contact number"),
  email: z.string().email("Please enter a valid email address"),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type OnboardingFormData = z.infer<typeof onboardingSchema>
