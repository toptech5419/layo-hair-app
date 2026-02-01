export const siteConfig = {
  name: "LAYO HAIR",
  tagline: "Where Every Strand Tells a Story",
  description:
    "Professional hair styling and braiding services in Lincoln, UK. Book your appointment online for braids, cornrows, twists, locs and more.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ogImage: "/og-image.jpg",
  links: {
    instagram: "https://www.instagram.com/funmiluv02?igsh=MXNtcW9wNjR4b21yZA%3D%3D&utm_source=qr",
    twitter: "https://twitter.com/layohair",
    facebook: "https://facebook.com/layohair",
    whatsapp: "https://wa.me/447350167537",
  },
  contact: {
    email: "okefunmilayo34@gmail.com",
    phone: "+44 7350 167537",
    whatsapp: "+447350167537",
    address: "Lincoln, UK",
    postcode: "LN1 1RP",
    fullAddress: "Lincoln, LN1 1RP, UK",
    googleMapsUrl: "https://www.google.com/maps/dir/?api=1&destination=Lincoln+LN1+1RP+UK",
  },
  businessHours: {
    monday: { open: "09:00", close: "19:00" },
    tuesday: { open: "09:00", close: "19:00" },
    wednesday: { open: "09:00", close: "19:00" },
    thursday: { open: "09:00", close: "19:00" },
    friday: { open: "09:00", close: "19:00" },
    saturday: { open: "09:00", close: "19:00" },
    sunday: { open: "09:00", close: "19:00" },
  },
  businessHoursDisplay: "9am - 7pm Daily",
} as const;

export type SiteConfig = typeof siteConfig;
