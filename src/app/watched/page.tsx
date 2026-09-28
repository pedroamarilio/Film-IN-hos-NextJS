"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchWatched } from "../api/account";
import { useDebounce } from "../../hooks/useDebounce";
import MovieGrid from "../../components/moviegrid";
import Pagination from "../../components/pagination";

export default function WatchedPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["watched", { search: debouncedSearch, page }],
    queryFn: () => fetchWatched({ search: debouncedSearch || undefined, page, perPage: 20 }),
  });

  const movies = data?.data ?? [];
  const lastPage = data?.metadata.lastPage ?? 1;

  return (
    <div className="mx-auto max-w-300 px-6 py-8">
      <h1 className="text-2xl font-bold text-white">Assistidos</h1>

      <input
        type="search"
        placeholder="Buscar nos assistidos..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="my-5 block w-full max-w-md rounded-lg border border-border bg-surface px-4 py-2 text-white outline-none focus:border-brand"
      />

      {isLoading ? (
        <p className="text-gray-300">Carregando...</p>
      ) : (
        <MovieGrid movies={movies} emptyMessage="Você ainda não marcou nenhum filme como assistido." />
      )}

      <Pagination currentPage={page} lastPage={lastPage} onPageChange={setPage} />
    </div>
  );
}