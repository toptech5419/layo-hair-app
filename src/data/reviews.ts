import { Review, ReviewStats } from "@/types/review";

export const mockReviews: Review[] = [
  {
    id: "1",
    styleId: "knotless-braids",
    styleName: "Knotless Braids",
    customerName: "Adaeze O.",
    customerImage: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop",
    rating: 5,
    title: "Absolutely perfect!",
    comment: "My knotless braids were done beautifully. Layo took her time to make sure each braid was neat and the parting was clean. They lasted me 2 months with minimal frizz. Will definitely be back!",
    images: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&h=300&fit=crop",
    ],
    verified: true,
    helpful: 24,
    createdAt: "2026-01-15",
    status: "approved",
  },
  {
    id: "2",
    styleId: "knotless-braids",
    styleName: "Knotless Braids",
    customerName: "Blessing A.",
    customerImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    rating: 5,
    title: "Best braider in Lagos!",
    comment: "I've been to many stylists but Layo is by far the best. The braids were so light on my head, no tension at all. The booking process was easy and she was very professional.",
    verified: true,
    helpful: 18,
    createdAt: "2026-01-10",
    status: "approved",
  },
  {
    id: "3",
    styleId: "knotless-braids",
    styleName: "Knotless Braids",
    customerName: "Chioma E.",
    rating: 4,
    title: "Great experience",
    comment: "Very satisfied with my braids. Only giving 4 stars because the appointment ran a bit longer than expected, but the results were worth the wait.",
    verified: true,
    helpful: 12,
    createdAt: "2026-01-05",
    status: "approved",
  },
  {
    id: "4",
    styleId: "fulani-braids",
    styleName: "Fulani Braids",
    customerName: "Ngozi M.",
    customerImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    rating: 5,
    title: "Stunning Fulani braids!",
    comment: "The beads and cowrie shells were placed perfectly. I got so many compliments at my friend's wedding. Layo really knows her craft!",
    images: [
      "https://images.unsplash.com/photo-1595959183082-7b570b7e1daf?w=300&h=300&fit=crop",
    ],
    verified: true,
    helpful: 31,
    createdAt: "2026-01-20",
    status: "approved",
  },
  {
    id: "5",
    styleId: "fulani-braids",
    styleName: "Fulani Braids",
    customerName: "Funke T.",
    rating: 5,
    title: "Perfect for my traditional wedding",
    comment: "Layo did my Fulani braids for my traditional wedding and they were absolutely gorgeous. She even came early to make sure everything was perfect. Highly recommend!",
    verified: true,
    helpful: 27,
    createdAt: "2026-01-18",
    status: "approved",
  },
  {
    id: "6",
    styleId: "goddess-locs",
    styleName: "Goddess Locs",
    customerName: "Amara K.",
    customerImage: "https://images.unsplash.com/photo-1523263685509-57c1d050d19b?w=100&h=100&fit=crop",
    rating: 5,
    title: "Goddess locs of my dreams!",
    comment: "I've always wanted goddess locs and Layo made my dream come true. They're so soft and the curly ends are perfect. Best decision I've made!",
    images: [
      "https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=300&h=300&fit=crop",
    ],
    verified: true,
    helpful: 42,
    createdAt: "2026-01-22",
    status: "approved",
  },
  {
    id: "7",
    styleId: "goddess-locs",
    styleName: "Goddess Locs",
    customerName: "Yemi O.",
    rating: 4,
    title: "Beautiful but took long",
    comment: "The goddess locs came out beautiful, very full and the length was perfect. It took about 7 hours though, so come prepared with snacks!",
    verified: true,
    helpful: 15,
    createdAt: "2026-01-12",
    status: "approved",
  },
  {
    id: "8",
    styleId: "passion-twists",
    styleName: "Passion Twists",
    customerName: "Nneka P.",
    customerImage: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop",
    rating: 5,
    title: "Obsessed with my passion twists!",
    comment: "These passion twists are everything! So bouncy and full. Layo used quality hair that doesn't tangle. I've already booked my next appointment.",
    verified: true,
    helpful: 33,
    createdAt: "2026-01-25",
    status: "approved",
  },
  {
    id: "9",
    styleId: "cornrows",
    styleName: "Classic Cornrows",
    customerName: "Tolu B.",
    rating: 5,
    title: "Clean and precise",
    comment: "Simple but perfect cornrows. The lines were so straight and neat. Great for everyday wear. Quick service too!",
    verified: true,
    helpful: 19,
    createdAt: "2026-01-08",
    status: "approved",
  },
  {
    id: "10",
    styleId: "french-curls",
    styleName: "French Curls",
    customerName: "Kemi D.",
    customerImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    rating: 5,
    title: "French curls perfection!",
    comment: "The french curls braids were done so well! Very lightweight and the curls at the end are so pretty. I feel like a princess!",
    images: [
      "https://images.unsplash.com/photo-1534180477871-5d6cc81f3920?w=300&h=300&fit=crop",
    ],
    verified: true,
    helpful: 28,
    createdAt: "2026-01-28",
    status: "approved",
  },
];

export function getReviewsByStyle(styleId: string): Review[] {
  return mockReviews.filter(
    (review) => review.styleId === styleId && review.status === "approved"
  );
}

export function getReviewStats(styleId: string): ReviewStats {
  const reviews = getReviewsByStyle(styleId);

  if (reviews.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    };
  }

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = Math.round((totalRating / reviews.length) * 10) / 10;

  const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((review) => {
    ratingDistribution[review.rating as keyof typeof ratingDistribution]++;
  });

  return {
    averageRating,
    totalReviews: reviews.length,
    ratingDistribution,
  };
}

export function getAllReviews(): Review[] {
  return mockReviews;
}

export function getRecentReviews(limit: number = 5): Review[] {
  return [...mockReviews]
    .filter((review) => review.status === "approved")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}
