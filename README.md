# LAYO HAIR

A modern, full-featured hair salon booking application built with Next.js 16. Book appointments, browse hairstyles, and manage your salon business with ease.

[![Live Demo](https://img.shields.io/badge/Live-Demo-gold?style=for-the-badge)](https://layo-hair-app.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

## Features

### Customer Features
- **Browse Styles** - Explore a curated collection of hairstyles with images, pricing, and duration
- **Online Booking** - Book appointments with real-time availability checking
- **Secure Payments** - Pay deposits or full amounts via Stripe
- **Booking Tracking** - Track your appointment status with a booking reference
- **Email Confirmations** - Receive booking confirmations and reminders

### Admin Features
- **Dashboard** - Overview of bookings, revenue, and key metrics
- **Analytics** - Detailed insights into business performance
- **Booking Management** - View, confirm, and manage all appointments
- **Style Management** - Add, edit, and organize hairstyles with image uploads
- **Payment Tracking** - Monitor all transactions and payment statuses
- **Availability Settings** - Set working hours and block dates
- **Customer Reviews** - Manage and approve customer feedback

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma |
| Authentication | NextAuth.js |
| Payments | Stripe |
| Email | Resend |
| Image Uploads | Cloudinary |
| Deployment | Vercel |

## Live Demo

**Website:** [https://layo-hair-app.vercel.app](https://layo-hair-app.vercel.app)

**Admin Panel:** [https://layo-hair-app.vercel.app/admin](https://layo-hair-app.vercel.app/admin)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database (or Supabase account)
- Stripe account
- Cloudinary account
- Resend account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Okefunmilayo/layo-hair-app.git
   cd layo-hair-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://..."
   DIRECT_URL="postgresql://..."

   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"

   # Stripe
   STRIPE_SECRET_KEY="sk_test_..."
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."

   # Resend (Email)
   RESEND_API_KEY="re_..."

   # Cloudinary
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="your-api-key"
   CLOUDINARY_API_SECRET="your-api-secret"
   ```

4. **Generate Prisma client**
   ```bash
   npx prisma generate
   ```

5. **Run database migrations**
   ```bash
   npx prisma db push
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
layo-hair-app/
├── prisma/
│   └── schema.prisma      # Database schema
├── src/
│   ├── app/               # Next.js App Router pages
│   │   ├── admin/         # Admin dashboard pages
│   │   ├── api/           # API routes
│   │   ├── book/          # Booking flow
│   │   ├── styles/        # Style catalog
│   │   └── ...
│   ├── components/        # React components
│   │   ├── admin/         # Admin-specific components
│   │   ├── common/        # Shared components
│   │   ├── layout/        # Header, Footer
│   │   └── ui/            # UI primitives
│   ├── lib/               # Utilities and configurations
│   └── types/             # TypeScript type definitions
├── public/                # Static assets
└── ...
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:studio` | Open Prisma Studio |

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string (pooled) | Yes |
| `DIRECT_URL` | PostgreSQL direct connection | Yes |
| `NEXTAUTH_URL` | Application URL | Yes |
| `NEXTAUTH_SECRET` | NextAuth secret key | Yes |
| `STRIPE_SECRET_KEY` | Stripe secret key | Yes |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Yes |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | Yes |
| `RESEND_API_KEY` | Resend API key for emails | No |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | No |
| `CLOUDINARY_API_KEY` | Cloudinary API key | No |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | No |

## Deployment

The app is configured for deployment on Vercel:

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add all environment variables
4. Deploy

For Stripe webhooks in production, add this endpoint in your Stripe dashboard:
```
https://your-domain.com/api/webhook/stripe
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Contact

For inquiries about the salon or bookings, visit [LAYO HAIR](https://layo-hair-app.vercel.app).

---

Built with love for LAYO HAIR
