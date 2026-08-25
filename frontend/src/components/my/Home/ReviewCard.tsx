import { Star, CheckCircle2 } from "lucide-react";
import avatarFallback from "@/assets/bb.jpg";

export interface FormattedReview {
  id: string | number;
  userName: string;
  userImage: string;
  rating: number;
  comment: string;
  createdAt?: string;
  verifiedOrder: boolean;
}

interface ReviewCardProps {
  review: FormattedReview;
  verifiedLabel: string;
}

export function ReviewCard({ review, verifiedLabel }: ReviewCardProps) {
  return (
    <div className="group relative p-8 sm:p-9 rounded-[2.5rem] border border-border/80 bg-card hover:bg-accent/5 transition-all duration-300 shadow-sm hover:shadow-2xl flex flex-col justify-between space-y-8">

      <div className="space-y-5">
        {/* Stars & Verified Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {Array.from({ length: review.rating }).map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
            ))}
          </div>

          {review.verifiedOrder && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3.5 py-1 rounded-full">
              <CheckCircle2 className="w-4 h-4" />
              <span>{verifiedLabel}</span>
            </span>
          )}
        </div>

        {/* Comment */}
        <p className="text-base sm:text-lg font-medium text-foreground/90 leading-relaxed relative z-10">
        {review.comment}
        </p>
      </div>

      {/* User Profile Footer */}
      <div className="flex items-center justify-between pt-5 border-t border-border/60">
        <div className="flex items-center gap-4">
          <img
            src={review.userImage}
            alt={review.userName}
            onError={(e) => {
              e.currentTarget.src = avatarFallback;
            }}
            className="w-12 h-12 rounded-full object-cover border-2 border-primary/20 shadow-md"
          />
          <div>
            <h4 className="font-black text-base text-foreground">
              {review.userName}
            </h4>
            <span className="text-xs font-medium text-muted-foreground block">
              {review.createdAt}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
