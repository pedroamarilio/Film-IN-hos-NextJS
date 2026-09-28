import api from "./client";
import type { Genre } from "../../types";

export async function fetchGenres(): Promise<Genre[]> {
  const { data } = await api.get<{ data: Genre[] }>("/genres");
  return data.data;
}