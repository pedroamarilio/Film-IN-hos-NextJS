"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { fetchMovieById } from "../api/movies";
import { fetchReviews, submitReview, updateReview } from "../api/reviews";
import { addFavorite, removeFavorite, addWatched, removeWatched } from "../api/account";
import StarRating from "../../components/starrating";
import ReviewCard from "../../components/reviewcard";
import ReviewModal from "../../components/reviewmodal";
import Pagination from "../../components/pagination";

export default function MovieDetailPage({ params }: { params: { id: string } }) {
  const movieId = Number(params.id);
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const queryClient = useQueryClient();

  const [reviewsPage, setReviewsPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);

  const { data: movie, isLoading: loadingMovie } = useQuery({
    queryKey: ["movie", movieId],
    queryFn: () => fetchMovieById(movieId),
  });

  const { data: reviewsData, isLoading: loadingReviews } = useQuery({
    queryKey: ["reviews", movieId, reviewsPage],
    queryFn: () => fetchReviews({ movieId, page: reviewsPage, perPage: 10 }),
  });

  const reviews = reviewsData?.data ?? [];
  const reviewsLastPage = reviewsData?.metadata.lastPage ?? 1;
  const myReview = reviews.find((r) => String(r.user.id) === session?.user?.id);

  function invalidateMovie() {
    queryClient.invalidateQueries({ queryKey: ["movie", movieId] });
  }
  function invalidateReviews() {
    queryClient.invalidateQueries({ queryKey: ["reviews", movieId] });
  }

  const favoriteMutation = useMutation({
    mutationFn: (next: boolean) => (next ? addFavorite(movieId) : removeFavorite(movieId)),
    onSuccess: invalidateMovie,
  });

  const watchedMutation = useMutation({
    mutationFn: (next: boolean) => (next ? addWatched(movieId) : removeWatched(movieId)),
    onSuccess: invalidateMovie,
  });

  const reviewMutation = useMutation({
    mutationFn: (payload: { rating: number; text: string }) =>
      myReview ? updateReview(myReview.id, payload) : submitReview({ movieId, ...payload }),
    onSuccess: () => {
      invalidateMovie();
      invalidateReviews();
    },
  });

  if (loadingMovie) return <p className="p-8 text-gray-300">Carregando...</p>;
  if (!movie) return <p className="p-8 text-gray-300">Filme não encontrado.</p>;

  return (
    <div className="mx-auto max-w-250 pb-12">
      <div
        className="relative flex h-80 items-end bg-cover bg-center bg-surface p-6"
        style={{ backgroundImage: `url(${movie.bannerImageUrl ?? ""})` }}
      >
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-background/10" />
        <img
          src={movie.posterImageUrl ?? "/placeholder-poster.png"}
          alt={movie.title}
          className="relative z-10 aspect-2/3 w-36 rounded-md object-cover shadow-lg"
        />
      </div>

      <div className="px-6 py-6 text-white">
        <h1 className="mb-1 text-3xl font-bold">{movie.title}</h1>
        <p className="mb-3 text-sm text-gray-400">
          {movie.releaseYear} · {movie.durationMinutes} min
          {movie.ageRating && ` · ${movie.ageRating}`}
        </p>

        <div className="mb-4 flex flex-wrap gap-2">
          {movie.genres.map((g) => (
            <span key={g.id} className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-gray-300">
              {g.name}
            </span>
          ))}
        </div>

        <div className="mb-4 flex items-center gap-3">
          <StarRating rating={movie.avgRating} />
          <span className="text-sm text-gray-400">{movie.reviewCount} review(s)</span>
        </div>

        <p className="mb-4 leading-relaxed text-gray-300">{movie.synopsis}</p>

        {movie.cast && (
          <p className="my-1 text-sm text-gray-300">
            <strong>Elenco:</strong> {movie.cast}
          </p>
        )}
        {movie.contentWarning && (
          <p className="my-3 rounded-md bg-red-900/10 px-3 py-2 text-sm text-red-300">
            <strong>Aviso:</strong> {movie.contentWarning}
          </p>
        )}

        {isAuthenticated && (
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => favoriteMutation.mutate(!movie.isFavorite)}
              className={`rounded-md border px-4 py-2 text-sm ${
                movie.isFavorite
                  ? "border-brand bg-brand text-white"
                  : "border-border bg-surface text-white hover:bg-surfaceHover"
              }`}
            >
              {movie.isFavorite ? "★ Favoritado" : "☆ Favoritar"}
            </button>
            <button
              onClick={() => watchedMutation.mutate(!movie.isWatched)}
              className={`rounded-md border px-4 py-2 text-sm ${
                movie.isWatched
                  ? "border-brand bg-brandtext-white"
                  : "border-border bg-surface text-white hover:bg-surfaceHover"
              }`}
            >
              {movie.isWatched ? "✓ Assistido" : "Marcar como assistido"}
            </button>
            <button
              onClick={() => setModalOpen(true)}
              className="rounded-md border border-border bg-surface px-4 py-2 text-sm text-white hover:bg-surfaceHover"
            >
              {myReview ? "Editar minha review" : "Deixar uma review"}
            </button>
          </div>
        )}
      </div>

      <section className="px-6">
        <h2 className="mb-4 text-xl font-semibold text-white">Reviews</h2>
        {!loadingReviews && reviews.length === 0 && (
          <p className="mb-4 text-gray-400">Ainda não há reviews para esse filme.</p>
        )}
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
        <Pagination currentPage={reviewsPage} lastPage={reviewsLastPage} onPageChange={setReviewsPage} />
      </section>

      <ReviewModal
        key={myReview?.id ?? "new"}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={async (payload) => {
          await reviewMutation.mutateAsync(payload);
          setModalOpen(false);
        }}
        initialRating={myReview?.rating}
        initialText={myReview?.text}
      />
    </div>
  );
}