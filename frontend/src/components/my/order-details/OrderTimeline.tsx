import { OrderStatus } from "@/types/types";
import { useTranslation } from "react-i18next";
import { 
  Clock, 
  ChefHat, 
  Bike, 
  CheckCircle2, 
  XCircle, 
  type LucideIcon 
} from "lucide-react";

interface OrderTimelineProps {
  status: number;
  step: number;
}

const TIMELINE_VISUALS: Record<number, { icon: LucideIcon; activeColor: string }> = {
  [OrderStatus.pending]: {
    icon: Clock,
    activeColor: "bg-blue-500/20 border-blue-500 text-blue-500 shadow-blue-500/20",
  },
  [OrderStatus.processing]: {
    icon: ChefHat,
    activeColor: "bg-amber-500/20 border-amber-500 text-amber-500 shadow-amber-500/20",
  },
  [OrderStatus.shipped]: {
    icon: Bike,
    activeColor: "bg-purple-500/20 border-purple-500 text-purple-500 shadow-purple-500/20",
  },
  [OrderStatus.delivered]: {
    icon: CheckCircle2,
    activeColor: "bg-emerald-500/20 border-emerald-500 text-emerald-500 shadow-emerald-500/20",
  },
  [OrderStatus.cancelled]: {
    icon: XCircle,
    activeColor: "bg-rose-500/20 border-rose-500 text-rose-500 shadow-rose-500/20",
  },
};

export default function OrderTimeline({ status, step }: OrderTimelineProps) {
  const { t } = useTranslation();

  const isCancelled = status === OrderStatus.cancelled;

  const steps = [
    { title: t("orderDetails.timeline.received"), value: OrderStatus.pending, step: 1 },
    { title: t("orderDetails.timeline.processing"), value: OrderStatus.processing, step: 2 },
    { title: t("orderDetails.timeline.onTheWay"), value: OrderStatus.shipped, step: 3 },
    { title: t("orderDetails.timeline.delivered"), value: OrderStatus.delivered, step: 4 },
  ];

  return (
    <div className={`grid ${isCancelled ? 'grid-cols-5' : 'grid-cols-4'} gap-2.5 relative mt-6 pt-2`}>
      {steps.map((s) => {
        const isActive = !isCancelled && step >= s.step;
        const isCurrent = !isCancelled && step === s.step;
        const visual = TIMELINE_VISUALS[s.value];
        const IconComponent = visual.icon;

        return (
          <div key={s.value} className="flex flex-col items-center text-center group">
            <div
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all duration-300 transform border ${
                isActive
                  ? `${visual.activeColor} border-2 shadow-lg scale-105`
                  : "bg-card/40 border-border/40 text-muted-foreground/40 opacity-40 grayscale"
              } ${isCurrent ? "ring-4 ring-current/20 animate-pulse" : ""}`}
            >
              <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>

            <span
              className={`text-[10px] sm:text-[11px] font-bold mt-2.5 transition-colors leading-tight px-1 ${
                isActive ? "text-foreground font-extrabold" : "text-muted-foreground/50"
              }`}
            >
              {s.title}
            </span>
          </div>
        );
      })}

      {isCancelled && (
        <div className="flex flex-col items-center text-center group">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all duration-300 transform border bg-rose-500/20 border-rose-500 text-rose-500 shadow-rose-500/20 border-2 shadow-lg scale-105">
            <XCircle className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <span className="text-[10px] sm:text-[11px] font-bold mt-2.5 transition-colors leading-tight px-1 text-foreground font-extrabold">
            {t("adminOrders.cancelled")}
          </span>
        </div>
      )}
    </div>
  );
}