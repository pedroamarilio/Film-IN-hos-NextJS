"use client";
import { useState } from "react";

interface StarRatingInputProps {
  value: number;
  onChange: (value: number) => void;
  maxStars?: number;
}

const ALLOWED_VALUES = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

export default function StarRatingInput({
  value,
  onChange,
  maxStars = 5,
}: StarRatingInputProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const displayValue = Number(hoverValue ?? value) || 0;

  function handleClick(starIndex: number, isHalf: boolean) {
    const clicked = isHalf ? starIndex + 0.5 : starIndex + 1;
    const closest = ALLOWED_VALUES.reduce((prev, curr) =>
      Math.abs(curr - clicked) < Math.abs(prev - clicked) ? curr : prev
    );
    onChange(closest);
  }

  return (
    <div
      className="flex items-center"
      onMouseLeave={() => setHoverValue(null)}
      role="radiogroup"
      aria-label="Avaliação por estrelas"
    >
      {Array.from({ length: maxStars }, (_, i) => {
        const fillPercent = Math.min(Math.max(displayValue - i, 0), 1) * 100;

        return (
          <span key={i} className="relative inline-block h-8 w-8 cursor-pointer text-3xl leading-none">
            <span
              className="absolute inset-y-0 left-0 z-20 w-1/2"
              onMouseEnter={() => setHoverValue(i + 0.5)}
              onClick={() => handleClick(i, true)}
            />
            <span
              className="absolute inset-y-0 right-0 z-20 w-1/2"
              onMouseEnter={() => setHoverValue(i + 1)}
              onClick={() => handleClick(i, false)}
            />
            <span
              className="pointer-events-none absolute left-0 top-0 z-10 overflow-hidden whitespace-nowrap text-yellow-400"
              style={{ width: `${fillPercent}%` }}
            >
              ★
            </span>
            <span className="pointer-events-none absolute left-0 top-0 z-0 w-full overflow-hidden whitespace-nowrap text-gray-300">
              ★
            </span>
          </span>
        );
      })}
      <span className="ml-2 text-sm text-gray-400">{displayValue.toFixed(1)}</span>
    </div>
  );
}