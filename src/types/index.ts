import type {
  User,
  Style,
  Booking,
  Availability,
  BlockedDate,
  Review,
  Settings,
  Category,
  BookingStatus,
  Role,
} from "@prisma/client";

// Re-export Prisma types
export type {
  User,
  Style,
  Booking,
  Availability,
  BlockedDate,
  Review,
  Settings,
  Category,
  BookingStatus,
  Role,
};

// Style with relations
export type StyleWithRelations = Style & {
  bookings?: Booking[];
  reviews?: Review[];
  _count?: {
    bookings: number;
    reviews: number;
  };
};

// Booking with relations
export type BookingWithRelations = Booking & {
  style: Style;
  customer?: User | null;
  stylist?: User | null;
};

// User with relations
export type UserWithRelations = User & {
  bookings?: Booking[];
  stylistBookings?: Booking[];
  reviews?: Review[];
};

// Time slot for booking
export interface TimeSlot {
  time: string; // "09:00" format
  available: boolean;
}

// Booking form data
export interface BookingFormData {
  styleId: string;
  date: Date;
  startTime: string;
  name: string;
  email: string;
  phone?: string;
  notes?: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Filter options for styles
export interface StyleFilters {
  category?: Category;
  isActive?: boolean;
  isFeatured?: boolean;
  minPrice?: number;
  maxPrice?: number;
}

// Filter options for bookings
export interface BookingFilters {
  status?: BookingStatus;
  dateFrom?: Date;
  dateTo?: Date;
  customerId?: string;
  stylistId?: string;
}

// Dashboard stats
export interface DashboardStats {
  todayBookings: number;
  weekBookings: number;
  pendingBookings: number;
  totalCustomers: number;
  revenue: {
    today: number;
    week: number;
    month: number;
  };
}

// Category display names
export const categoryLabels: Record<Category, string> = {
  BRAIDS: "Braids",
  CORNROWS: "Cornrows",
  TWISTS: "Twists",
  LOCS: "Locs",
  NATURAL: "Natural",
  WEAVES: "Weaves",
  WIGS: "Wigs",
  TREATMENTS: "Treatments",
  OTHER: "Other",
};

// Status display names and colors
export const statusConfig: Record<
  BookingStatus,
  { label: string; color: string }
> = {
  PENDING: { label: "Pending", color: "yellow" },
  CONFIRMED: { label: "Confirmed", color: "blue" },
  COMPLETED: { label: "Completed", color: "green" },
  CANCELLED: { label: "Cancelled", color: "red" },
  NO_SHOW: { label: "No Show", color: "gray" },
};
