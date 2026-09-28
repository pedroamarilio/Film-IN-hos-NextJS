"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchUserById,
  fetchUserFavorites,
  fetchUserWatched,
  fetchUserReviews,
} from "../api/users";
import Carousel from "../../components/carousel";
import MovieCard from "../../components/moviecard";
import ReviewCard from "../../components/reviewcard";
import Pagination from "../../components/pagination";
import { getAvatarUrl } from "../api/utils/avatar";

export default function UserProfilePage({ params }: { params: { id: string } }) {
  const userId = Number(params.id);
  const [reviewsPage, setReviewsPage] = useState(1);

  const { data: user, isLoading: loadingUser, isError } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUserById(userId),
  });

  const { data: favoritesData } = useQuery({
    queryKey: ["user", userId, "favorites"],
    queryFn: () => fetchUserFavorites(userId, { perPage: 20 }),
  });

  const { data: watchedData } = useQuery({
    queryKey: ["user", userId, "watched"],
    queryFn: () => fetchUserWatched(userId, { perPage: 20 }),
  });

  const { data: reviewsData, isLoading: loadingReviews } = useQuery({
    queryKey: ["user", userId, "reviews", reviewsPage],
    queryFn: () => fetchUserReviews(userId, { page: reviewsPage, perPage: 10 }),
  });

  const favorites = favoritesData?.data ?? [];
  const watched = watchedData?.data ?? [];
  const reviews = reviewsData?.data ?? [];
  const reviewsLastPage = reviewsData?.metadata.lastPage ?? 1;

  if (loadingUser) return <p className="p-8 text-gray-300">Carregando...</p>;
  if (isError || !user) return <p className="p-8 text-gray-300">Usuário não encontrado.</p>;

  return (
    <div className="mx-auto max-w-300 pb-12">
      <div className="mb-8 flex items-center gap-4 border-b border-[#2e2e30] bg-linear-to-br from-surface to-surfaceHover px-6 py-10">
        <img
          src={getAvatarUrl(user)}
          alt={user.fullName ?? ""}
          className="h-22-2 w-22-2 rounded-full border-2 border-border object-cover"
        />
        <div>
          <h1 className="text-2xl font-bold text-white">{user.fullName}</h1>
          <p className="mt-1 text-sm text-gray-400">
            {favorites.length} favorito(s) · {watched.length} assistido(s)
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-10 px-6">
        <Carousel title="Favoritos">
          {favorites.length === 0 ? (
            <p className="text-gray-400">Nenhum filme favoritado.</p>
          ) : (
            favorites.map((movie) => (
              <div key={movie.id} className="w-32.5 flex-none">
                <MovieCard movie={movie} />
              </div>
            ))
          )}
        </Carousel>

        <Carousel title="Assistidos">
          {watched.length === 0 ? (
            <p className="text-gray-400">Nenhum filme assistido.</p>
          ) : (
            watched.map((movie) => (
              <div key={movie.id} className="w-32.5 flex-none">
                <MovieCard movie={movie} />
              </div>
            ))
          )}
        </Carousel>

        <section>
          <h2 className="mb-4 text-xl font-semibold text-white">Reviews</h2>
          {!loadingReviews && reviews.length === 0 && (
            <p className="text-gray-400">Nenhuma review escrita.</p>
          )}
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
          <Pagination
            currentPage={reviewsPage}
            lastPage={reviewsLastPage}
            onPageChange={setReviewsPage}
          />
        </section>
      </div>
    </div>
  );
}