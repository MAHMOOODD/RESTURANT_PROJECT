import { useMemo } from "react";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useGetTop10ReviewsQuery } from "@/store/features/reviewApi";
import type { GetReviewDto } from "@/types/types";
import avatarFallback from "@/assets/bb.jpg";
import { ReviewCard, type FormattedReview } from "./ReviewCard";
import { ReviewsHeader } from "./ReviewsHeader";

export default function ReviewsSection() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const { data: rawReviews, isLoading } = useGetTop10ReviewsQuery();

  const topReviews = useMemo<FormattedReview[]>(() => {
    if (!rawReviews) return [];

    return rawReviews
      .filter((rev: GetReviewDto) => rev.comment && rev.comment.trim() !== "")
      .map((rev: GetReviewDto) => {
        const dateObj = rev.createdAt ? new Date(rev.createdAt) : null;
        const isValidDate = dateObj && !isNaN(dateObj.getTime());

        return {
          id: rev.id,
          userName:
            rev.userName?.trim() || t("reviews.anonymous", "عميل أكلني"),
          userImage: rev.userImage || avatarFallback,
          rating: rev.rating,
          comment: rev.comment || "",
          createdAt: isValidDate
            ? dateObj.toLocaleDateString(isAr ? "ar-EG" : "en-US", {
                month: "short",
                day: "numeric",
              })
            : t("reviews.recent", "مؤخراً"),
          verifiedOrder: true,
        };
      })
      .slice(0, 6);
  }, [rawReviews, isAr, t]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (topReviews.length === 0) return null;

  return (
    <section className="py-16 space-y-12">
      <ReviewsHeader
        badgeText={t("reviews.badge", "آراء وتجارب حقيقية")}
        title={t("reviews.title", "ماذا يقول عملاؤنا؟ ⭐")}
        subtitle={t(
          "reviews.subtitle",
          "أعلى التقييمات التي تم جمعها فور استلام الطلبات",
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {topReviews.map((rev) => (
          <ReviewCard
            key={rev.id}
            review={rev}
            verifiedLabel={t("reviews.verified", "طلب موثق")}
          />
        ))}
      </div>
    </section>
  );
}
