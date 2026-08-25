import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Star, Send, Loader2, X, Edit3 } from "lucide-react";

interface ReviewFormProps {
  initialRating?: number;
  initialComment?: string;
  isEditing?: boolean;
  isLoading: boolean;
  onSubmit: (rating: number, comment?: string) => Promise<void>;
  onCancelEdit?: () => void;
}

export function ReviewForm({
  initialRating = 5,
  initialComment = "",
  isEditing = false,
  isLoading,
  onSubmit,
  onCancelEdit,
}: ReviewFormProps) {
  const { t } = useTranslation();
  const [rating, setRating] = useState<number>(initialRating);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>(initialComment);

  const [prevProps, setPrevProps] = useState({ initialRating, initialComment });

  if (
    prevProps.initialRating !== initialRating ||
    prevProps.initialComment !== initialComment
  ) {
    setPrevProps({ initialRating, initialComment });
    setRating(initialRating);
    setComment(initialComment);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(rating, comment.trim() !== "" ? comment : undefined);
    if (!isEditing) {
      setComment("");
      setRating(5);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`p-6 rounded-3xl border transition-all duration-300 space-y-4 shadow-sm ${
        isEditing
          ? "bg-amber-500/5 border-amber-500/30 ring-2 ring-amber-500/20"
          : "bg-card border-border/80"
      }`}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-base font-black text-foreground flex items-center gap-2">
          {isEditing ? (
            <>
              <Edit3 className="w-4 h-4 text-amber-500" />
              <span>{t("products.editReviewTitle", "تعديل تقييمك")}</span>
            </>
          ) : (
            <span>{t("products.addReviewTitle", "أضف تقييمك للوجبة")}</span>
          )}
        </h3>
        {isEditing && onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span>{t("common.cancel", "إلغاء")}</span>
          </button>
        )}
      </div>

      {/* النجوم */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-muted-foreground">
          {t("products.yourRating", "تقييمك:")}
        </span>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 transition-transform hover:scale-125 focus:outline-none cursor-pointer"
            >
              <Star
                className={`w-6 h-6 transition-colors ${
                  star <= (hoverRating || rating)
                    ? "text-amber-400 fill-amber-400"
                    : "text-muted-foreground/30"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* نص التعليق */}
      <textarea
        rows={3}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder={t(
          "products.writeCommentPlaceholder",
          "اكتب رأيك بالوجبة هنا...",
        )}
        className="w-full p-4 rounded-2xl bg-muted/50 border border-border/60 text-foreground text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-all"
      />

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer ${
            isEditing
              ? "bg-amber-500 hover:bg-amber-600 text-white"
              : "bg-primary hover:bg-primary/90 text-primary-foreground"
          }`}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4 dir-rtl:rotate-180" />
          )}
          <span>
            {isEditing
              ? t("products.updateReview", "تحديث التقييم")
              : t("products.submitReview", "إرسال التقييم")}
          </span>
        </button>
      </div>
    </form>
  );
}