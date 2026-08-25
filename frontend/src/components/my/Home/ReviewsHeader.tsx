// components/reviews/ReviewsHeader.tsx
import { Star } from "lucide-react";

interface ReviewsHeaderProps {
  badgeText: string;
  title: string;
  subtitle: string;
}

export function ReviewsHeader({
  badgeText,
  title,
  subtitle,
}: ReviewsHeaderProps) {
  return (
    <div className="flex flex-col items-center text-center max-w-2xl mx-auto space-y-4">
      <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-sm font-black">
        <Star className="w-4 h-4 fill-current" />
        <span>{badgeText}</span>
      </div>
      <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
        {title}
      </h2>
      <p className="text-base md:text-lg font-medium text-muted-foreground">
        {subtitle}
      </p>
    </div>
  );
}
