// Mock analytics data for dashboard

// Revenue data for the last 7 days
export const revenueData = [
  { date: "Mon", revenue: 75000, bookings: 3 },
  { date: "Tue", revenue: 52000, bookings: 2 },
  { date: "Wed", revenue: 98000, bookings: 4 },
  { date: "Thu", revenue: 65000, bookings: 3 },
  { date: "Fri", revenue: 125000, bookings: 5 },
  { date: "Sat", revenue: 185000, bookings: 7 },
  { date: "Sun", revenue: 45000, bookings: 2 },
];

// Monthly revenue trend
export const monthlyRevenueData = [
  { month: "Aug", revenue: 320000 },
  { month: "Sep", revenue: 450000 },
  { month: "Oct", revenue: 380000 },
  { month: "Nov", revenue: 520000 },
  { month: "Dec", revenue: 680000 },
  { month: "Jan", revenue: 456000 },
];

// Popular styles
export const popularStylesData = [
  { name: "Knotless Braids", bookings: 45, revenue: 1125000, percentage: 28 },
  { name: "Fulani Braids", bookings: 32, revenue: 960000, percentage: 20 },
  { name: "Goddess Locs", bookings: 28, revenue: 980000, percentage: 17 },
  { name: "French Curls", bookings: 25, revenue: 800000, percentage: 16 },
  { name: "Passion Twists", bookings: 18, revenue: 486000, percentage: 11 },
  { name: "Others", bookings: 12, revenue: 300000, percentage: 8 },
];

// Peak hours data
export const peakHoursData = [
  { hour: "9 AM", mon: 2, tue: 1, wed: 3, thu: 2, fri: 4, sat: 5, sun: 1 },
  { hour: "10 AM", mon: 3, tue: 2, wed: 4, thu: 3, fri: 5, sat: 6, sun: 2 },
  { hour: "11 AM", mon: 4, tue: 3, wed: 5, thu: 4, fri: 6, sat: 8, sun: 3 },
  { hour: "12 PM", mon: 3, tue: 2, wed: 4, thu: 3, fri: 5, sat: 7, sun: 2 },
  { hour: "1 PM", mon: 2, tue: 2, wed: 3, thu: 2, fri: 4, sat: 5, sun: 1 },
  { hour: "2 PM", mon: 3, tue: 3, wed: 4, thu: 4, fri: 5, sat: 6, sun: 2 },
  { hour: "3 PM", mon: 4, tue: 4, wed: 5, thu: 5, fri: 6, sat: 7, sun: 3 },
  { hour: "4 PM", mon: 3, tue: 3, wed: 4, thu: 4, fri: 5, sat: 5, sun: 2 },
];

// Booking status distribution
export const bookingStatusData = [
  { status: "Completed", count: 89, color: "#22c55e" },
  { status: "Confirmed", count: 23, color: "#3b82f6" },
  { status: "Pending", count: 12, color: "#eab308" },
  { status: "Cancelled", count: 4, color: "#ef4444" },
];

// Customer data
export const customerData = [
  { month: "Aug", newCustomers: 18, returningCustomers: 12 },
  { month: "Sep", newCustomers: 24, returningCustomers: 18 },
  { month: "Oct", newCustomers: 20, returningCustomers: 22 },
  { month: "Nov", newCustomers: 28, returningCustomers: 25 },
  { month: "Dec", newCustomers: 35, returningCustomers: 32 },
  { month: "Jan", newCustomers: 22, returningCustomers: 28 },
];

// Recent activity
export const recentActivity = [
  {
    id: "1",
    type: "booking",
    message: "New booking from Adaeze O.",
    detail: "Knotless Braids - Tomorrow 10:00 AM",
    time: "5 mins ago",
  },
  {
    id: "2",
    type: "review",
    message: "New 5-star review",
    detail: "Fulani Braids by Ngozi M.",
    time: "1 hour ago",
  },
  {
    id: "3",
    type: "payment",
    message: "Payment received",
    detail: "₦35,000 for Goddess Locs",
    time: "2 hours ago",
  },
  {
    id: "4",
    type: "booking",
    message: "Booking completed",
    detail: "French Curls for Funke A.",
    time: "3 hours ago",
  },
  {
    id: "5",
    type: "booking",
    message: "New booking from Chioma E.",
    detail: "Passion Twists - Friday 2:00 PM",
    time: "4 hours ago",
  },
];

// Dashboard stats with trends
export const dashboardStats = {
  todayBookings: { value: 5, trend: 25, isUp: true },
  weekBookings: { value: 23, trend: 12, isUp: true },
  monthRevenue: { value: 456000, trend: 8, isUp: true },
  totalCustomers: { value: 128, trend: 15, isUp: true },
  avgRating: { value: 4.8, trend: 2, isUp: true },
  completionRate: { value: 94, trend: 3, isUp: true },
};

// Format currency helper
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
}

// Format compact number
export function formatCompactNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + "K";
  }
  return num.toString();
}
