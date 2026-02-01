export const siteConfig = {
  name: "LAYO HAIR",
  tagline: "Where Every Strand Tells a Story",
  description:
    "Professional hair styling and braiding services. Book your appointment online for braids, cornrows, twists, locs and more.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ogImage: "/og-image.jpg",
  links: {
    instagram: "https://instagram.com/layohair",
    twitter: "https://twitter.com/layohair",
    facebook: "https://facebook.com/layohair",
  },
  contact: {
    email: "hello@layohair.com",
    phone: "+234 XXX XXX XXXX",
    address: "Lagos, Nigeria",
  },
  businessHours: {
    monday: { open: "09:00", close: "18:00" },
    tuesday: { open: "09:00", close: "18:00" },
    wednesday: { open: "09:00", close: "18:00" },
    thursday: { open: "09:00", close: "18:00" },
    friday: { open: "09:00", close: "18:00" },
    saturday: { open: "09:00", close: "17:00" },
    sunday: { open: null, close: null }, // Closed
  },
} as const;

export type SiteConfig = typeof siteConfig;
