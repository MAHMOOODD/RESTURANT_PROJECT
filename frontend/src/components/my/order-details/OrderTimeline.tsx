import { OrderStatus } from "@/types/types";
import { useTranslation } from "react-i18next";

interface OrderTimelineProps {
  status: number;
  step: number;
}

export default function OrderTimeline({ status, step }: OrderTimelineProps) {
  const { t } = useTranslation();

  if (status === OrderStatus.cancelled) return null;

  const steps = [
    { title: t("orderDetails.timeline.received"), step: 1, emoji: "📝" },
    { title: t("orderDetails.timeline.processing"), step: 2, emoji: "👨‍🍳" },
    { title: t("orderDetails.timeline.onTheWay"), step: 3, emoji: "🛵" },
    { title: t("orderDetails.timeline.delivered"), step: 4, emoji: "🎉" },
  ];

  return (
    <div className="grid grid-cols-4 gap-4 relative mt-6">
      {steps.map((s) => {
        const isActive = step >= s.step;
        const isCurrent = step === s.step;

        return (
          <div key={s.step} className="flex flex-col items-center text-center group">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl transition-all duration-300 transform ${
                isActive
                  ? "bg-primary/20 border-2 border-primary scale-105 shadow-xl shadow-primary/25"
                  : "bg-muted/60 border border-border/60 opacity-50 grayscale"
              } ${isCurrent ? "animate-bounce" : ""}`}
            >
              <span>{s.emoji}</span>
            </div>
            <span
              className={`text-xs sm:text-sm font-black mt-3 transition-colors ${
                isActive ? "text-foreground" : "text-muted-foreground/50"
              }`}
            >
              {s.title}
            </span>
          </div>
        );
      })}
    </div>
  );
}