"use client";
import { useRef } from "react";
import type { ReactNode } from "react";

interface CarouselProps {
  title: string;
  children: ReactNode;
}

export default function Carousel({ title, children }: CarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollBy(amount: number) {
    trackRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  }

  return (
    <section className="w-full">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scrollBy(-400)}
            aria-label="Anterior"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-surface text-lg text-white hover:bg-surfaceHover"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => scrollBy(400)}
            aria-label="Próximo"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-surface text-lg text-white hover:bg-surfaceHover"
          >
            ›
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="flex gap-2 overflow-x-auto [scrollbar:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
    </section>
  );
}