"use client";

import { useActionState, useState } from "react";
import { Star, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { submitReviewAction, deleteReviewAction } from "@/app/actions/user";
import type { UserReview } from "@/lib/mock-user-data";
import { cn } from "@/lib/utils";

type Dict = {
  reviewSectionTitle: string;
  loginToReview: string;
  yourRating: string;
  yourComment: string;
  submitReview: string;
  deleteReview: string;
  noReviewYet: string;
  postedOn: string;
  editReview: string;
  overallScore: string;
  outOf: string;
};

type Props = {
  articleId: string;
  lang: string;
  existingReview: UserReview | null;
  isLoggedIn: boolean;
  dict: Dict;
};

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  const filled = hovered || value;

  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(n)}
          className="p-0.5 focus:outline-none"
          aria-label={`Rate ${n} out of 10`}
        >
          <Star
            className={cn(
              "size-5 transition-colors",
              n <= filled
                ? "fill-amber-400 text-amber-400"
                : "text-muted-foreground/40"
            )}
          />
        </button>
      ))}
      <span className="ml-2 text-sm font-semibold tabular-nums self-center">
        {value}/10
      </span>
    </div>
  );
}

export function UserReviewSection({
  articleId,
  lang,
  existingReview,
  isLoggedIn,
  dict,
}: Props) {
  const [isEditing, setIsEditing] = useState(!existingReview);
  const [rating, setRating] = useState(existingReview?.rating ?? 7);

  const submitBound = submitReviewAction.bind(null, articleId, lang);
  const deleteBound = deleteReviewAction.bind(null, articleId, lang);

  const [, formAction, isPending] = useActionState(
    async (_: unknown, formData: FormData) => {
      formData.set("rating", String(rating));
      await submitBound(formData);
      setIsEditing(false);
      return null;
    },
    null
  );

  const locale = lang === "es-MX" ? "es-MX" : "en-US";

  return (
    <section className="space-y-4">
      <Separator />
      <h2 className="text-lg font-semibold">{dict.reviewSectionTitle}</h2>

      {!isLoggedIn ? (
        <p className="text-sm text-muted-foreground py-4">{dict.loginToReview}</p>
      ) : existingReview && !isEditing ? (
        /* ── Existing review card ── */
        <div className="rounded-xl border bg-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                <Star
                  key={n}
                  className={cn(
                    "size-4",
                    n <= existingReview.rating
                      ? "fill-amber-400 text-amber-400"
                      : "text-muted-foreground/30"
                  )}
                />
              ))}
              <span className="ml-2 text-sm font-semibold tabular-nums">
                {existingReview.rating}/10
              </span>
            </div>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                className="h-7 px-2 text-xs"
                onClick={() => {
                  setRating(existingReview.rating);
                  setIsEditing(true);
                }}
              >
                <Pencil className="size-3 mr-1" />
                {dict.editReview}
              </Button>
              <form action={deleteBound}>
                <Button
                  size="sm"
                  variant="ghost"
                  type="submit"
                  className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                >
                  <Trash2 className="size-3 mr-1" />
                  {dict.deleteReview}
                </Button>
              </form>
            </div>
          </div>
          <p className="text-sm">{existingReview.comment}</p>
          <p className="text-xs text-muted-foreground">
            {dict.postedOn}{" "}
            {new Date(existingReview.createdAt).toLocaleDateString(locale, {
              dateStyle: "long",
            })}
          </p>
        </div>
      ) : (
        /* ── Review form ── */
        <form action={formAction} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">{dict.yourRating}</label>
            <StarRating value={rating} onChange={setRating} />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="comment" className="text-sm font-medium">
              {dict.yourComment}
            </label>
            <Textarea
              id="comment"
              name="comment"
              defaultValue={existingReview?.comment ?? ""}
              rows={4}
              required
              minLength={10}
              className="resize-none"
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={isPending}>
              {isPending ? "..." : dict.submitReview}
            </Button>
            {existingReview && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Cancelar
              </Button>
            )}
          </div>
        </form>
      )}
    </section>
  );
}
