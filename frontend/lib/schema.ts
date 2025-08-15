import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, { message: "Password is too short" }),
  })
  .refine(
    (values) => {
      return values.password === values.confirmPassword;
    },
    {
      message: "Passwords must match!",
      path: ["confirmPassword"],
    }
  );

export const onboardingSchema = z.object({
  firstName: z.string().min(2, "Full name must be at least 2 characters"),
  lastName: z.string().optional(),
  dateOfBirth: z.date(),
  address: z.string().min(5, "Address must be at least 5 characters"),
  gnDivision: z.string().min(1, "GN Division is required"),
  divisionalSecretariat: z
    .string()
    .min(1, "Divisional Secretariat is required"),
  phoneNumber: z
    .string()
    .regex(/^[0-9+\-\s()]+$/, "Please enter a valid contact number"),
  nationalId: z.string().min(1, "Please provide your national id number"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type OnboardingFormData = z.infer<typeof onboardingSchema>;
