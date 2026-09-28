"use client";
import Link from "next/link";
import StarRating from "../starrating";
import { getAvatarUrl } from "../../app/api/utils/avatar";
import type { Review } from "../../types";

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <article className="mb-4 rounded-lg border border-[#2e2e30] bg-surface p-4 text-white">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/users/${review.user.id}`}
          className="flex items-center gap-2 text-sm font-semibold text-white no-underline"
        >
          <img
            src={getAvatarUrl(review.user)}
            alt={review.user.fullName ?? ""}
            className="h-8 w-8 rounded-full object-cover"
          />
          <span>{review.user.fullName}</span>
        </Link>

        <Link
          href={`/movies/${review.movie.id}`}
          className="text-sm text-gray-400 no-underline hover:text-white hover:underline"
        >
          {review.movie.title} ({review.movie.releaseYear})
        </Link>
      </div>

      <StarRating rating={review.rating} />
      <p className="mt-2 text-sm leading-relaxed text-gray-300">{review.text}</p>
    </article>
  );
}