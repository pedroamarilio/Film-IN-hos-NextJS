import { useEffect, useState } from "react";
import { useDebounce } from "./useDebounce";
import type { MovieSummary, Paginated } from "../types";

type FetchFn = (params: {
  search?: string;
  page: number;
  perPage: number;
}) => Promise<Paginated<MovieSummary>>;

export function usePaginatedMovies(fetchFn: FetchFn, perPage = 20) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState<MovieSummary[]>([]);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetchFn({ search: debouncedSearch || undefined, page, perPage })
      .then(({ data, metadata }) => {
        if (cancelled) return;
        setMovies(data);
        setLastPage(metadata.lastPage);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [fetchFn, debouncedSearch, page, perPage]);

  return { search, setSearch, page, setPage, movies, lastPage, loading };
}