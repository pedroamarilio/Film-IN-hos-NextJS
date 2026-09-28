interface StarRatingProps {
  rating: number | null;
  maxStars?: number;
}

export default function StarRating({ rating, maxStars = 5 }: StarRatingProps) {
  const numericRating = rating === null ? null : Number(rating);

  if (numericRating === null || Number.isNaN(numericRating)) {
    return <span className="text-sm italic text-gray-400">Sem avaliações</span>;
  }

  const fullStars = Math.floor(numericRating);
  const hasHalfStar = numericRating - fullStars >= 0.5;

  return (
    <span
      className="tracking-wide text-yellow-400"
      aria-label={`${numericRating} de ${maxStars} estrelas`}
    >
      {"★".repeat(fullStars)}
      {hasHalfStar && "½"}
    </span>
  );
}