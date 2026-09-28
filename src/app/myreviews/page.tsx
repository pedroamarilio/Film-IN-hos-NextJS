"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchMyReviews } from "../api/account";
import { updateReview, deleteReview } from "../api/reviews";
import ReviewModal from "../../components/reviewmodal";
import StarRating from "../../components/starrating";
import Pagination from "../../components/pagination";
import type { Review } from "../../types";

export default function MyReviewsPage() {
  const router = useRouter();
  const { status } = useSession();
  const [page, setPage] = useState(1);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [status, router]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["my-reviews", page],
    queryFn: () => fetchMyReviews({ page, perPage: 10 }),
    enabled: status === "authenticated",
  });

  const reviews = data?.data ?? [];
  const lastPage = data?.metadata.lastPage ?? 1;

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["my-reviews"] });
  }

  const editMutation = useMutation({
    mutationFn: (payload: { rating: number; text: string }) =>
      updateReview(editingReview!.id, payload),
    onSuccess: () => {
      invalidate();
      setEditingReview(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (reviewId: number) => deleteReview(reviewId),
    onSuccess: invalidate,
  });

  function handleDelete(reviewId: number) {
    if (!window.confirm("Tem certeza que deseja excluir essa review?")) return;
    deleteMutation.mutate(reviewId);
  }

  if (status !== "authenticated") {
    return <p className="p-8 text-gray-300">Carregando...</p>;
  }

  return (
    <div className="mx-auto max-w-200 px-6 py-8">
      <h1 className="text-2xl font-bold text-white">Minhas Reviews</h1>

      {isLoading ? (
        <p className="mt-6 text-gray-300">Carregando...</p>
      ) : isError ? (
        <p className="mt-6 text-red-300">Não foi possível carregar suas reviews.</p>
      ) : reviews.length === 0 ? (
        <p className="mt-6 text-gray-400">Você ainda não escreveu nenhuma review.</p>
      ) : (
        <ul className="my-6 flex flex-col gap-4">
          {reviews.map((review) => (
            <li key={review.id} className="rounded-lg border border-[#2e2e30] bg-surface p-4">
              <Link
                href={`/movies/${review.movie.id}`}
                className="font-semibold text-white hover:underline"
              >
                {review.movie.title} ({review.movie.releaseYear})
              </Link>

              <div className="mt-1">
                <StarRating rating={review.rating} />
              </div>
              <p className="my-2 text-sm leading-relaxed text-gray-300">{review.text}</p>

              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => setEditingReview(review)}
                  className="rounded-md border border-border bg-surface-hover px-3 py-1.5 text-sm text-white hover:bg-[#4a4a4c]"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(review.id)}
                  className="rounded-md border border-red-900 bg-surface-hover px-3 py-1.5 text-sm text-red-300 hover:bg-red-900/20"
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Pagination currentPage={page} lastPage={lastPage} onPageChange={setPage} />

      <ReviewModal
        key={editingReview?.id ?? "closed"}
        isOpen={editingReview !== null}
        onClose={() => setEditingReview(null)}
        onSubmit={async (payload) => {
          await editMutation.mutateAsync(payload);
        }}
        initialRating={editingReview?.rating}
        initialText={editingReview?.text}
      />
    </div>
  );
}