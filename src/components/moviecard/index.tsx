"use client";
import Link from "next/link";
import type { MovieSummary } from "../../types";

interface MovieCardProps {
  movie: MovieSummary;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link href={`/movies/${movie.id}`} className="group block w-full">
      <div className="relative aspect-2/3 w-full overflow-hidden rounded-md bg-surface">
        <img
          src={movie.posterImageUrl ?? "/placeholder-poster.png"}
          alt={movie.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-150 ease-out group-hover:scale-105"
        />

        <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/85 via-black/20 to-transparent p-2 opacity-0 transition-opacity duration-150 ease-out group-hover:opacity-100">
          <span className="line-clamp-2 text-xs font-semibold leading-tight text-white">
            {movie.title}
          </span>
          {movie.releaseYear && (
            <span className="mt-0.5 text-[0.7rem] text-gray-300">{movie.releaseYear}</span>
          )}
        </div>
      </div>
    </Link>
  );
}