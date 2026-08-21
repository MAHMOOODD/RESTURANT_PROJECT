import { Star, Quote, CheckCircle2 } from "lucide-react";
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
    <div className="group relative p-7 rounded-[2rem] border border-border/80 bg-card hover:bg-accent/5 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between space-y-6">
      <Quote className="w-10 h-10 text-primary/10 absolute top-6 left-6 pointer-events-none group-hover:text-primary/20 transition-colors" />

      <div className="space-y-4">
        {/* Stars & Verified Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {Array.from({ length: review.rating }).map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>

          {review.verifiedOrder && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3" />
              <span>{verifiedLabel}</span>
            </span>
          )}
        </div>

        {/* Comment */}
        <p className="text-sm font-medium text-foreground/90 leading-relaxed relative z-10">
          "{review.comment}"
        </p>
      </div>

      {/* User Profile Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border/60">
        <div className="flex items-center gap-3">
          <img
            src={review.userImage}
            alt={review.userName}
            onError={(e) => {
              e.currentTarget.src = avatarFallback;
            }}
            className="w-10 h-10 rounded-full object-cover border-2 border-primary/20 shadow-sm"
          />
          <div>
            <h4 className="font-black text-sm text-foreground">
              {review.userName}
            </h4>
            <span className="text-[11px] font-medium text-muted-foreground block">
              {review.createdAt}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
