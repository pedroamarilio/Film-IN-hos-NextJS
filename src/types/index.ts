export interface User {
  id: number;
  fullName: string | null;
  email?: string; 
  avatarUrl: string | null;
  initials: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface MovieSummary {
  id: number;
  title: string;
  posterImageUrl: string | null;
  releaseYear: number | null;
  genres: Genre[];
}

export interface MovieDetail extends MovieSummary {
  synopsis: string;
  bannerImageUrl: string | null;
  durationMinutes: number | null;
  ageRating: string | null;
  contentWarning: string | null;
  cast: string | null;
  avgRating: number | null;
  reviewCount: number;
  isFavorite: boolean;
  isWatched: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: number;
  rating: number;
  text: string;
  createdAt: string;
  updatedAt: string;
  user: Pick<User, "id" | "fullName" | "avatarUrl" | "initials">;
  movie: MovieSummary;
}

export interface PaginationMetadata {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  firstPage: number;
  firstPageUrl: string;
  lastPageUrl: string;
  nextPageUrl: string | null;
  previousPageUrl: string | null;
}

export interface Paginated<T> {
  data: T[];
  metadata: PaginationMetadata;
}

export interface AuthResponse {
  token: string;
  user: User;
}