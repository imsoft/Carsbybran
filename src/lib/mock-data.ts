export interface Review {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: "SUV" | "Sedan" | "Sports" | "Electric" | "Luxury" | "Pickup";
  brand: string;
  model: string;
  year: number;
  rating: number;
  readTime: number;
  publishedAt: string;
  author: {
    name: string;
    avatar: string;
  };
}

export interface Brand {
  name: string;
  slug: string;
  count: number;
}

export interface Comparison {
  id: string;
  slug: string;
  car1: Review;
  car2: Review;
  winner: "car1" | "car2" | "tie";
  verdict: string;
  car1Pros: string[];
  car2Pros: string[];
  publishedAt: string;
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  avatar: string;
  reviews: number;
}

export const featuredReview: Review = {
  id: "1",
  slug: "geely-monjaro-2024-review",
  title: "2024 Geely Monjaro: The Chinese SUV Redefining Accessible Luxury",
  excerpt:
    "We spent two weeks with Geely's flagship crossover across city traffic and open highway. Here's what genuinely surprised us — and what still needs work.",
  coverImage:
    "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1400&q=80",
  category: "SUV",
  brand: "Geely",
  model: "Monjaro",
  year: 2024,
  rating: 8.7,
  readTime: 12,
  publishedAt: "2026-04-20",
  author: { name: "Carlos Mendoza", avatar: "https://i.pravatar.cc/40?img=68" },
};

export const reviews: Review[] = [
  {
    id: "2",
    slug: "mercedes-c300-2024-review",
    title: "Mercedes-Benz C300 2024: Still the Benchmark for Executive Sedans",
    excerpt:
      "After 3,000 km behind the wheel, we confirm the C300 remains the gold standard for business-class driving — at a price.",
    coverImage:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80",
    category: "Luxury",
    brand: "Mercedes-Benz",
    model: "C300",
    year: 2024,
    rating: 9.1,
    readTime: 10,
    publishedAt: "2026-04-15",
    author: { name: "Ana Torres", avatar: "https://i.pravatar.cc/40?img=47" },
  },
  {
    id: "3",
    slug: "toyota-highlander-2024-review",
    title: "Toyota Highlander 2024: The Sensible Family SUV That Delivers",
    excerpt:
      "Dependable, spacious, and now with improved tech. The Highlander continues to be the default choice for families that prioritize reliability.",
    coverImage:
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=800&q=80",
    category: "SUV",
    brand: "Toyota",
    model: "Highlander",
    year: 2024,
    rating: 8.3,
    readTime: 9,
    publishedAt: "2026-04-10",
    author: {
      name: "Carlos Mendoza",
      avatar: "https://i.pravatar.cc/40?img=68",
    },
  },
  {
    id: "4",
    slug: "bmw-330i-2024-review",
    title: "BMW 330i 2024: Driving Dynamics That Justify the Badge",
    excerpt:
      "The latest 3 Series proves BMW still knows how to build a driver's car. We took it to the track to find out how far.",
    coverImage:
      "https://images.unsplash.com/photo-1580414057403-c5f451f30e1c?w=800&q=80",
    category: "Sedan",
    brand: "BMW",
    model: "330i",
    year: 2024,
    rating: 8.9,
    readTime: 11,
    publishedAt: "2026-04-05",
    author: {
      name: "Roberto Castillo",
      avatar: "https://i.pravatar.cc/40?img=12",
    },
  },
  {
    id: "5",
    slug: "kia-sportage-2024-review",
    title: "Kia Sportage 2024: Korean Engineering at Its Most Confident",
    excerpt:
      "Bold design, a premium interior and a pricing strategy that puts serious pressure on everyone above it in the segment.",
    coverImage:
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80",
    category: "SUV",
    brand: "Kia",
    model: "Sportage",
    year: 2024,
    rating: 8.5,
    readTime: 8,
    publishedAt: "2026-03-28",
    author: { name: "Ana Torres", avatar: "https://i.pravatar.cc/40?img=47" },
  },
  {
    id: "6",
    slug: "volkswagen-tiguan-2024-review",
    title: "Volkswagen Tiguan 2024: Refined Pragmatism in a Crowded Segment",
    excerpt:
      "The Tiguan keeps its German precision and adds a warmer character. A solid choice in a segment that rarely disappoints.",
    coverImage:
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80",
    category: "SUV",
    brand: "Volkswagen",
    model: "Tiguan",
    year: 2024,
    rating: 8.2,
    readTime: 9,
    publishedAt: "2026-03-20",
    author: {
      name: "Roberto Castillo",
      avatar: "https://i.pravatar.cc/40?img=12",
    },
  },
  {
    id: "7",
    slug: "audi-a4-2024-review",
    title: "Audi A4 2024: Understated Excellence for the Discerning Driver",
    excerpt:
      "Subtlety is a feature, not a bug. The A4 rewards those who look past the surface with a deeply refined driving experience.",
    coverImage:
      "https://images.unsplash.com/photo-1616788494672-ec7ca25fdda9?w=800&q=80",
    category: "Luxury",
    brand: "Audi",
    model: "A4",
    year: 2024,
    rating: 8.8,
    readTime: 10,
    publishedAt: "2026-03-15",
    author: {
      name: "Carlos Mendoza",
      avatar: "https://i.pravatar.cc/40?img=68",
    },
  },
];

export const topRatedReviews: Review[] = [
  featuredReview,
  reviews[0],
  reviews[2],
  reviews[5],
  reviews[3],
];

export const brands: Brand[] = [
  { name: "Geely", slug: "geely", count: 8 },
  { name: "Mercedes-Benz", slug: "mercedes-benz", count: 12 },
  { name: "BMW", slug: "bmw", count: 15 },
  { name: "Toyota", slug: "toyota", count: 18 },
  { name: "Kia", slug: "kia", count: 9 },
  { name: "Volkswagen", slug: "volkswagen", count: 11 },
  { name: "Audi", slug: "audi", count: 13 },
  { name: "Hyundai", slug: "hyundai", count: 10 },
];

// All reviews including the featured one, for listing pages
export const allReviews: Review[] = [featuredReview, ...reviews];

export const comparisons: Comparison[] = [
  {
    id: "c1",
    slug: "geely-monjaro-vs-toyota-highlander",
    car1: featuredReview,
    car2: reviews[1], // Toyota Highlander
    winner: "car1",
    verdict:
      "The Monjaro wins on technology and value, but the Highlander's proven reliability keeps it competitive for families who prioritize long-term ownership.",
    car1Pros: [
      "More tech for the money",
      "Stronger engine output",
      "More modern interior design",
    ],
    car2Pros: [
      "Proven long-term reliability",
      "Wider dealer network",
      "Better resale value",
    ],
    publishedAt: "2026-04-22",
  },
  {
    id: "c2",
    slug: "mercedes-c300-vs-bmw-330i",
    car1: reviews[0], // Mercedes C300
    car2: reviews[2], // BMW 330i
    winner: "tie",
    verdict:
      "Two different philosophies executed brilliantly. The C300 prioritizes comfort and prestige; the 330i lives for the drive. Your choice comes down to whether you want to arrive or whether you want to drive.",
    car1Pros: [
      "Superior interior refinement",
      "More comfortable ride",
      "Stronger brand prestige",
    ],
    car2Pros: [
      "More engaging to drive",
      "Better handling dynamics",
      "More driver-focused cockpit",
    ],
    publishedAt: "2026-04-08",
  },
  {
    id: "c3",
    slug: "kia-sportage-vs-volkswagen-tiguan",
    car1: reviews[3], // Kia Sportage
    car2: reviews[4], // Volkswagen Tiguan
    winner: "car1",
    verdict:
      "The Sportage edges out the Tiguan with a bolder design, more standard features at each trim level, and a lower price of entry. The Tiguan fights back with better refinement and build quality.",
    car1Pros: [
      "Better value at every trim",
      "More distinctive styling",
      "More standard tech features",
    ],
    car2Pros: [
      "More refined on-road manners",
      "Premium build quality",
      "Better long-term reliability record",
    ],
    publishedAt: "2026-03-30",
  },
];

export const teamMembers: TeamMember[] = [
  {
    name: "Carlos Mendoza",
    role: "Editor in Chief",
    bio: "15 years covering the automotive industry. Former racing driver turned journalist with a soft spot for German engineering and a hard stance on value.",
    avatar: "https://i.pravatar.cc/120?img=68",
    reviews: 210,
  },
  {
    name: "Ana Torres",
    role: "Senior Road Test Editor",
    bio: "Electric vehicle specialist and weekend track enthusiast. Believes that a great car should be practical on Monday and thrilling on Saturday.",
    avatar: "https://i.pravatar.cc/120?img=47",
    reviews: 185,
  },
  {
    name: "Roberto Castillo",
    role: "Motorsport & Performance Editor",
    bio: "Spent a decade in motorsport before switching to automotive journalism. If it has more than 300 hp, Roberto has probably driven it hard.",
    avatar: "https://i.pravatar.cc/120?img=12",
    reviews: 140,
  },
];
