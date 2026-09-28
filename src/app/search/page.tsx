"use client";
import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import MovieCard from "../../components/moviecard";
import Pagination from "../../components/pagination";
import { fetchMovies } from "../api/movies";
import { fetchGenres } from "../api/genres";
import { useDebounce } from "../../hooks/useDebounce";

function SearchInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [inputValue, setInputValue] = useState(searchParams.get("q") ?? "");
  const debouncedQuery = useDebounce(inputValue, 400);

  const [selectedGenreIds, setSelectedGenreIds] = useState<number[]>(
    searchParams.getAll("genre").map(Number)
  );
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const { data: genres } = useQuery({ queryKey: ["genres"], queryFn: fetchGenres });

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedQuery.trim()) params.set("q", debouncedQuery.trim());
    selectedGenreIds.forEach((id) => params.append("genre", String(id)));
    if (page > 1) params.set("page", String(page));
    router.replace(`/search?${params.toString()}`);
  }, [debouncedQuery, selectedGenreIds, page, router]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, selectedGenreIds]);

  const { data, isLoading } = useQuery({
    queryKey: ["movies", "search", { q: debouncedQuery, genreIds: selectedGenreIds, page }],
    queryFn: () =>
      fetchMovies({
        q: debouncedQuery.trim() || undefined,
        genreIds: selectedGenreIds.length > 0 ? selectedGenreIds : undefined,
        page,
        perPage: 20,
      }),
  });

  const movies = data?.data ?? [];
  const lastPage = data?.metadata.lastPage ?? 1;

  function toggleGenre(genreId: number) {
    setSelectedGenreIds((prev) => (prev.includes(genreId) ? prev : [...prev, genreId]));
    setFilterMenuOpen(false);
  }
  function removeGenre(genreId: number) {
    setSelectedGenreIds((prev) => prev.filter((id) => id !== genreId));
  }

  const availableGenres = (genres ?? []).filter((g) => !selectedGenreIds.includes(g.id));

  return (
    <div className="mx-auto max-w-300 px-6 py-8">
      <h1 className="text-2xl font-bold text-white">Pesquisa</h1>

      <div className="my-5 flex flex-wrap items-start gap-4">
        <input
          type="search"
          placeholder="Buscar por título..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="min-w-55 flex-1 rounded-lg border border-border bg-surface px-4 py-2 text-white outline-none focus:border-brand"
        />

        <div className="relative">
          <button
            type="button"
            onClick={() => setFilterMenuOpen((v) => !v)}
            className="whitespace-nowrap rounded-lg border border-border bg-surface px-4 py-2 text-sm text-white hover:bg-surfaceHover"
          >
            + Adicionar filtro
          </button>

          {filterMenuOpen && (
            <ul className="absolute right-0 top-[calc(100%+0.5rem)] z-10 max-h-60 min-w-45 overflow-y-auto rounded-lg border border-border bg-background p-2">
              {availableGenres.length === 0 && (
                <li className="px-3 py-2 text-sm text-gray-400">Nenhum filtro disponível</li>
              )}
              {availableGenres.map((genre) => (
                <li key={genre.id}>
                  <button
                    type="button"
                    onClick={() => toggleGenre(genre.id)}
                    className="w-full rounded-md px-3 py-2 text-left text-sm text-white hover:bg-surface"
                  >
                    {genre.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {selectedGenreIds.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {selectedGenreIds.map((id) => {
            const genre = (genres ?? []).find((g) => g.id === id);
            if (!genre) return null;
            return (
              <span
                key={id}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface py-1 pl-3 pr-1 text-sm text-white"
              >
                {genre.name}
                <button
                  type="button"
                  onClick={() => removeGenre(id)}
                  aria-label={`Remover filtro ${genre.name}`}
                  className="px-1 text-gray-400 hover:text-white"
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      )}

      {isLoading ? (
        <p className="text-gray-300">Carregando...</p>
      ) : movies.length === 0 ? (
        <p className="my-8 text-gray-400">Nenhum filme encontrado.</p>
      ) : (
        <div className="mb-6 grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-2">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}

      <Pagination currentPage={page} lastPage={lastPage} onPageChange={setPage} />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<p className="p-8 text-gray-300">Carregando...</p>}>
      <SearchInner />
    </Suspense>
  );
}