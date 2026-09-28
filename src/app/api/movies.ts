import api from "./client";
import type { MovieSummary, MovieDetail, Paginated } from "../../types";

export async function fetchFeaturedMovies(count = 10): Promise<MovieSummary[]> {
  const { data } = await api.get<{ data: MovieSummary[] }>("/movies/featured", {
    params: { count },
  });
  return data.data;
}

interface FetchMoviesParams {
  q?: string;
  genreIds?: number[];
  page?: number;
  perPage?: number;
}

export async function fetchMovies({
  q,
  genreIds,
  page,
  perPage,
}: FetchMoviesParams = {}): Promise<Paginated<MovieSummary>> {
  const { data } = await api.get<Paginated<MovieSummary>>("/movies", {
    params: { q, "genreIds[]": genreIds, page, perPage },
  });
  return data;
}

export async function fetchMovieById(id: number): Promise<MovieDetail> {
  const { data } = await api.get<{ data: MovieDetail }>(`/movies/${id}`);
  return data.data;
}