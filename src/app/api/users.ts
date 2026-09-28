import api from "./client";
import type { User, MovieSummary, Review, Paginated } from "../../types";

export async function fetchUserById(id: number): Promise<User> {
  const { data } = await api.get<{ data: User }>(`/users/${id}`);
  return data.data;
}

export async function fetchUserFavorites(
  id: number,
  params: { page?: number; perPage?: number }
): Promise<Paginated<MovieSummary>> {
  const { data } = await api.get<Paginated<MovieSummary>>(`/users/${id}/favorites`, { params });
  return data;
}

export async function fetchUserWatched(
  id: number,
  params: { page?: number; perPage?: number }
): Promise<Paginated<MovieSummary>> {
  const { data } = await api.get<Paginated<MovieSummary>>(`/users/${id}/watched`, { params });
  return data;
}

export async function fetchUserReviews(
  id: number,
  params: { page?: number; perPage?: number }
): Promise<Paginated<Review>> {
  const { data } = await api.get<Paginated<Review>>(`/users/${id}/reviews`, { params });
  return {
    ...data,
    data: data.data.map((r) => ({ ...r, rating: Number(r.rating) })),
  };
}