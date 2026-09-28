import api from "./client";
import type { Review, Paginated } from "../../types";

export async function fetchRandomReviews(count = 10): Promise<Review[]> {
    const { data } = await api.get<{ data: Review[] }>("/reviews/random", {
        params: {count},
    });
    return data.data;
}

export async function fetchReviews(params: {
  movieId?: number;
  page?: number;
  perPage?: number;
}): Promise<Paginated<Review>> {
  const { data } = await api.get<Paginated<Review>>("/reviews", { params });
  return {
    ...data,
    data: data.data.map((review) => ({ ...review, rating: Number(review.rating) })),
  };
}

export async function submitReview(payload: {
    movieId: number;
    rating: number;
    text: string;
}): Promise<Review> {
    const { data } = await api.post<{data: Review}>("/reviews/", payload);
    return data.data;
}

export async function updateReview(
    id: number,
    payload: { rating: number; text: string }
): Promise<Review> {
    const { data } = await api.put<{data: Review}>(`/reviews/${id}`, payload);
    return data.data;
}

export async function deleteReview(id: number): Promise<void> {
    await api.delete(`/reviews/${id}`);
}