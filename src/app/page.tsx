"use client";
import { useQuery, useQueries } from "@tanstack/react-query";
import Carousel from "../components/carousel";
import MovieCard from "../components/moviecard";
import ReviewCard from "../components/reviewcard";
import { fetchFeaturedMovies, fetchMovies } from "./api/movies";
import { fetchGenres } from "./api/genres";
import { fetchRandomReviews } from "./api/reviews";

export default function Home() {
  const { data: featured, isLoading: loadingFeatured } = useQuery({
    queryKey: ["movies", "featured"],
    queryFn: () => fetchFeaturedMovies(10),
  });

  const { data: genres, isLoading: loadingGenres } = useQuery({
    queryKey: ["genres"],
    queryFn: fetchGenres,
  });

  const { data: reviews, isLoading: loadingReviews } = useQuery({
    queryKey: ["reviews", "random"],
    queryFn: () => fetchRandomReviews(10),
  });

  const genreQueries = useQueries({
    queries: (genres ?? []).map((genre) => ({
      queryKey: ["movies", "genre", genre.id],
      queryFn: () => fetchMovies({ genreIds: [genre.id], perPage: 20 }),
      enabled: !!genres,
    })),
  });

  const loading = loadingFeatured || loadingGenres || loadingReviews;

  if (loading) return <p className="p-8 text-gray-300">Carregando...</p>;

  return (
    <div className="mx-auto flex max-w-300 flex-col gap-10 px-6 py-8">
      <Carousel title="Em destaque">
        {(featured ?? []).map((movie) => (
          <div key={movie.id} className="w-32.5 flex-none">
            <MovieCard movie={movie} />
          </div>
        ))}
      </Carousel>

      {(genres ?? []).map((genre, i) => {
        const result = genreQueries[i];
        const movies = result?.data?.data ?? [];
        if (movies.length === 0) return null;

        return (
          <Carousel key={genre.id} title={genre.name}>
            {movies.map((movie) => (
              <div key={movie.id} className="w-32.5 flex-none">
                <MovieCard movie={movie} />
              </div>
            ))}
          </Carousel>
        );
      })}

      <section>
        <h2 className="mb-4 text-xl font-semibold text-white">Reviews da comunidade</h2>
        {(reviews ?? []).length === 0 && <p className="text-gray-400">Ainda não há reviews.</p>}
        {(reviews ?? []).map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </section>
    </div>
  );
}