import MovieCard from "../moviecard";
import type { MovieSummary } from "../../types";

interface MovieGridProps {
  movies: MovieSummary[];
  emptyMessage?: string;
}

export default function MovieGrid({
  movies,
  emptyMessage = "Nenhum filme encontrado.",
}: MovieGridProps) {
  if (movies.length === 0) {
    return <p className="">{emptyMessage}</p>;
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-2">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}