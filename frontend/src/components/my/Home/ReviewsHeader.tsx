// components/reviews/ReviewsHeader.tsx
import { Star } from "lucide-react";

interface ReviewsHeaderProps {
  badgeText: string;
  title: string;
  subtitle: string;
}

export function ReviewsHeader({ badgeText, title, subtitle }: ReviewsHeaderProps) {
  return (
    <div className="flex flex-col items-center text-center max-w-xl mx-auto space-y-3">
      <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-black">
        <Star className="w-3.5 h-3.5 fill-current" />
        <span>{badgeText}</span>
      </div>
      <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
        {title}
      </h2>
      <p className="text-sm font-medium text-muted-foreground">
        {subtitle}
      </p>
    </div>
  );
}