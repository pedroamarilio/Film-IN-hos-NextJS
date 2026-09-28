import api from "./client";
import type { MovieSummary, Paginated, Review } from "../../types";

export async function addFavorite(movieId: number): Promise<void> {
  await api.post("/account/favorites", { movieId });
}

export async function removeFavorite(movieId: number): Promise<void> {
  await api.delete(`/account/favorites/${movieId}`);
}

export async function addWatched(movieId: number): Promise<void> {
  await api.post("/account/watched", { movieId });
}

export async function removeWatched(movieId: number): Promise<void> {
  await api.delete(`/account/watched/${movieId}`);
}

interface ListParams {
  search?: string;
  page?: number;
  perPage?: number;
}

export async function fetchFavorites(params: ListParams): Promise<Paginated<MovieSummary>> {
  const { data } = await api.get<Paginated<MovieSummary>>("/account/favorites", { params });
  return data;
}

export async function fetchWatched(params: ListParams): Promise<Paginated<MovieSummary>> {
  const { data } = await api.get<Paginated<MovieSummary>>("/account/watched", { params });
  return data;
}

export async function fetchMyReviews(params: {
  page?: number;
  perPage?: number;
}): Promise<Paginated<Review>> {
  const { data } = await api.get<Paginated<Review>>("/account/reviews", { params });
  return {
    ...data,
    data: data.data.map((r) => ({ ...r, rating: Number(r.rating) })),
  };
}