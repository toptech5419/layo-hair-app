export interface Review {
  id: string;
  styleId: string;
  styleName: string;
  customerName: string;
  customerImage?: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  verified: boolean;
  helpful: number;
  createdAt: string;
  status: "pending" | "approved" | "rejected";
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}
