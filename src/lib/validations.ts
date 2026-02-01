import { z } from "zod";

// Booking form validation
export const bookingFormSchema = z.object({
  styleId: z.string().min(1, "Please select a style"),
  date: z.date(),
  startTime: z.string().min(1, "Please select a time"),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[\d\s+()-]{10,}$/.test(val),
      "Please enter a valid phone number"
    ),
  notes: z.string().max(500, "Notes are too long").optional(),
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;

// Style form validation (admin)
export const styleFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers and hyphens"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description is too long"),
  category: z.enum([
    "BRAIDS",
    "CORNROWS",
    "TWISTS",
    "LOCS",
    "NATURAL",
    "WEAVES",
    "WIGS",
    "TREATMENTS",
    "OTHER",
  ]),
  price: z.coerce
    .number()
    .min(0, "Price must be positive")
    .max(1000000, "Price is too high"),
  duration: z.coerce
    .number()
    .min(15, "Duration must be at least 15 minutes")
    .max(480, "Duration cannot exceed 8 hours"),
  images: z.array(z.string().url()).min(1, "At least one image is required"),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

export type StyleFormValues = z.infer<typeof styleFormSchema>;

// Admin login validation
export const loginFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

// Availability form validation
export const availabilitySchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format"),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format"),
  isAvailable: z.boolean(),
});

export type AvailabilityValues = z.infer<typeof availabilitySchema>;

// Blocked date validation
export const blockedDateSchema = z.object({
  date: z.date(),
  reason: z.string().max(200).optional(),
  stylistId: z.string().optional(),
});

export type BlockedDateValues = z.infer<typeof blockedDateSchema>;

// Settings validation
export const settingsSchema = z.object({
  salonName: z.string().min(1).max(100),
  salonEmail: z.string().email(),
  salonPhone: z.string().optional(),
  salonAddress: z.string().optional(),
  bookingBuffer: z.number().min(0).max(120),
  maxAdvanceBooking: z.number().min(1).max(90),
  minAdvanceBooking: z.number().min(0).max(72),
});

export type SettingsValues = z.infer<typeof settingsSchema>;

// Contact form validation
export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message is too long"),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

// Review form validation
export const reviewFormSchema = z.object({
  rating: z.number().int().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
  comment: z.string().max(1000, "Comment cannot exceed 1000 characters").optional(),
  styleId: z.string().min(1, "Style is required"),
  bookingRef: z.string().optional(),
  customerName: z.string().min(2, "Name must be at least 2 characters").optional(),
  customerEmail: z.string().email("Invalid email address"),
});

export type ReviewFormValues = z.infer<typeof reviewFormSchema>;

// Checkout validation
export const checkoutSchema = z.object({
  styleId: z.string().optional(),
  styleName: z.string().min(1, "Style name is required"),
  stylePrice: z.number().positive("Price must be positive"),
  styleSlug: z.string().optional(),
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerEmail: z.string().email("Invalid email address"),
  customerPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  appointmentDate: z.string().min(1, "Appointment date is required"),
  appointmentTime: z.string().min(1, "Appointment time is required"),
  notes: z.string().optional(),
  paymentType: z.enum(["deposit", "full"]),
});

export type CheckoutValues = z.infer<typeof checkoutSchema>;

// Helper function to validate API requests
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = result.error.issues.map((e: z.ZodIssue) => `${e.path.join(".")}: ${e.message}`).join("; ");
    return { success: false, error: errors };
  }
  return { success: true, data: result.data };
}
