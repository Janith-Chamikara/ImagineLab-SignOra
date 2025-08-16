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

export const bookingSchema = z.object({
  serviceId: z.string().min(1, "Service is required"),
  timeSlotId: z.string().min(1, "Time slot is required"),
  appointmentDate: z.string().min(1, "Appointment date is required"),
  notes: z.string().optional(),
  requiredDocuments: z
    .array(z.string())
    .min(1, "At least one document is required"),
  documentFiles: z.record(z.instanceof(File)).optional(), // Maps document type to file
});

export const departmentSchema = z.object({
  name: z
    .string()
    .min(1, "Department name is required")
    .max(100, "Name must be less than 100 characters"),
  code: z
    .string()
    .min(1, "Department code is required")
    .max(10, "Code must be less than 10 characters")
    .regex(
      /^[A-Z0-9_]+$/,
      "Code must contain only uppercase letters, numbers, and underscores"
    ),
  description: z.string().optional(),
  address: z.string().optional(),
  phoneNumber: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[+]?[0-9\s\-()]+$/.test(val),
      "Please enter a valid phone number"
    ),
  email: z
    .string()
    .optional()
    .refine(
      (val) => !val || z.string().email().safeParse(val).success,
      "Please enter a valid email address"
    ),
  workingHours: z
    .object({
      monday: z
        .object({
          isOpen: z.boolean(),
          openTime: z.string(),
          closeTime: z.string(),
        })
        .optional(),
      tuesday: z
        .object({
          isOpen: z.boolean(),
          openTime: z.string(),
          closeTime: z.string(),
        })
        .optional(),
      wednesday: z
        .object({
          isOpen: z.boolean(),
          openTime: z.string(),
          closeTime: z.string(),
        })
        .optional(),
      thursday: z
        .object({
          isOpen: z.boolean(),
          openTime: z.string(),
          closeTime: z.string(),
        })
        .optional(),
      friday: z
        .object({
          isOpen: z.boolean(),
          openTime: z.string(),
          closeTime: z.string(),
        })
        .optional(),
      saturday: z
        .object({
          isOpen: z.boolean(),
          openTime: z.string(),
          closeTime: z.string(),
        })
        .optional(),
      sunday: z
        .object({
          isOpen: z.boolean(),
          openTime: z.string(),
          closeTime: z.string(),
        })
        .optional(),
    })
    .optional(),
  isActive: z.boolean(),
});

export const createServiceSchema = z.object({
  name: z
    .string()
    .min(1, "Service name is required")
    .max(100, "Name must be less than 100 characters"),
  code: z
    .string()
    .min(1, "Service code is required")
    .max(20, "Code must be less than 20 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters"),
  departmentId: z.string().min(1, "Department is required"),
  estimatedTime: z
    .number()
    .min(1, "Estimated time must be at least 1 minute")
    .max(1440, "Cannot exceed 24 hours"),
  requiredDocuments: z.array(z.string()).optional(),
  fee: z.number().min(0, "Fee cannot be negative"),
  isActive: z.boolean(),
});

export const feedbackSchema = z.object({
  appointmentId: z.string().uuid(),
  rating: z.number().int().min(1, "Please provide a rating").max(5),
  comment: z.string().optional(),
  isAnonymous: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type OnboardingFormData = z.infer<typeof onboardingSchema>;
