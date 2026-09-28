"use client";
import { useState } from "react";
import type { FormEvent } from "react";
import StarRatingInput from "../starratinginput";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: { rating: number; text: string }) => Promise<void>;
  initialRating?: number;
  initialText?: string;
}

export default function ReviewModal({
  isOpen,
  onClose,
  onSubmit,
  initialRating = 0,
  initialText = "",
}: ReviewModalProps) {
  const [rating, setRating] = useState(initialRating);
  const [text, setText] = useState(initialText);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (rating === 0) {
      setError("Escolha uma quantidade de estrelas.");
      return;
    }
    if (text.trim().length === 0) {
      setError("Escreva um texto para a review.");
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit({ rating, text: text.trim() });
      onClose();
    } catch {
      setError("Não foi possível enviar a review. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-surface text-white">
        <DialogHeader>
          <DialogTitle>{initialText ? "Editar review" : "Deixar uma review"}</DialogTitle>
          <DialogDescription className="sr-only">
            Escolha uma nota e escreva sua opinião sobre o filme.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <p className="rounded-md bg-red-900/20 px-3 py-2 text-sm text-red-300">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <StarRatingInput value={rating} onChange={setRating} />

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={2000}
            rows={5}
            placeholder="O que você achou do filme?"
            className="resize-y rounded-lg border border-border bg-surface-hover px-3 py-2 text-sm text-white outline-none focus:border-brand"
          />
          <span className="self-end text-xs text-gray-400">{text.length}/2000</span>

          <Button type="submit" disabled={submitting} className="mt-2 w-full">
            {submitting ? "Enviando..." : "Enviar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}