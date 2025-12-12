export interface Destination {
  id: string;
  title: string;
  slug: string;
  region: string;
  country: string;
  heritageType: 'Cultural' | 'Natural' | 'Mixed';
  era: string;
  description: string;
  history: string;
  images: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
  features: string[];
  bestTimeToVisit?: string;
  rating?: number;
  reviewCount?: number;
  isFeatured?: boolean;
}

export interface VirtualTour {
  id: string;
  destinationId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  tourUrl?: string;
  tourType: '360' | 'video' | '3d';
  duration?: string;
}

export interface Experience {
  id: string;
  destinationId: string;
  title: string;
  description: string;
  type: 'workshop' | 'guided-tour' | 'cultural-event' | 'culinary';
  duration: string;
  price?: number;
  imageUrl: string;
}

export interface Story {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorAvatar?: string;
  imageUrl: string;
  publishedAt: string;
  tags: string[];
  destinationId?: string;
}

export interface User {
  id: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  role: 'ADMIN' | 'EDITOR' | 'USER';
  createdAt: string;
}
