import { useTranslation } from "react-i18next";
import {
  Star,
  CheckCircle2,
  User,
  Trash2,
  Edit2,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import type { GetReviewDto } from "@/types/types";

interface ReviewListProps {
  reviews: GetReviewDto[];
  currentUserId?: string;
  onEdit: (review: GetReviewDto) => void;
  onDelete: (reviewId: number) => void;
  isDeletingId: number | null;
  isEditing: boolean;
}

export function ReviewList({
  reviews,
  currentUserId,
  onEdit,
  onDelete,
  isDeletingId,
  isEditing,
}: ReviewListProps) {
  const { t } = useTranslation();

  if (!reviews || reviews.length === 0) {
    return (
      <div className="py-12 text-center rounded-3xl bg-card border border-dashed border-border/80 flex flex-col items-center justify-center space-y-3">
        <MessageSquare className="w-10 h-10 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground font-bold">
          {t(
            "products.noReviews",
            "لا توجد تقييمات لهذه الوجبة بعد. كن أول من يشارك رأيه!",
          )}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {reviews.map((rev) => {
        const isOwner = Boolean(
          currentUserId &&
            (rev.appUserId === currentUserId ||
              rev.userName?.toLowerCase() === currentUserId.toLowerCase()),
        );

        return (
          <div
            key={rev.id}
            className="p-5 rounded-2xl bg-card border border-border/80 space-y-4 shadow-sm hover:shadow-md transition-shadow relative group"
          >
            <div className="flex items-center justify-between">
              {/* النجوم */}
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < rev.rating
                        ? "text-amber-400 fill-amber-400"
                        : "text-muted-foreground/20"
                    }`}
                  />
                ))}
              </div>

              {/* أزرار التحكم */}
              {isOwner ? (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      const exist = reviews.find((r) => r.id === rev.id);
                      if (!exist) {
                        toast.error(
                          t(
                            "products.reviewNotFound",
                            "لم يتم العثور على هذا التقييم.",
                          ),
                        );
                      } else {
                        onEdit(rev);
                      }
                    }}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10 transition-colors cursor-pointer"
                    title={t("common.edit", "تعديل")}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(rev.id)}
                    disabled={isDeletingId === rev.id || isEditing}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    title={t("common.delete", "حذف")}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{t("products.verifiedPurchase", "طلب موثق")}</span>
                </span>
              )}
            </div>

            {/* التعليق */}
            {rev.comment && (
              <p className="text-lg font-medium text-foreground/90 leading-relaxed break-words">
              {rev.comment}
              </p>
            )}

            {/* معلومات المستخدم */}
            <div className="pt-3 border-t border-border/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs overflow-hidden shrink-0 border border-primary/20">
                  {rev.userImage ? (
                    <img
                      src={rev.userImage}
                      alt={rev.userName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">
                    {rev.userName ||
                      t("products.defaultClientName", "عميل أكلني")}
                  </h4>
                  <span className="text-[11px] font-medium text-muted-foreground block">
                    {rev.createdAt
                      ? new Date(rev.createdAt).toLocaleDateString()
                      : ""}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}