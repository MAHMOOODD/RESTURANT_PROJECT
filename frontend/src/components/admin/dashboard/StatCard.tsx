// src/components/admin/dashboard/StatCard.tsx
import type { LucideIcon } from "lucide-react";

export interface StatDetail {
  label: string;
  value: string;
  colorClass?: string;
  dotClass?: string;
}

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  accentClass?: string;
  details: StatDetail[];
}

export function StatCard({
  icon: Icon,
  label,
  value,
  accentClass = "bg-primary/10 text-primary",
  details,
}: StatCardProps) {
  return (
    <div className="group relative flex h-full w-full flex-col justify-between overflow-hidden rounded-2xl border border-border/60 bg-card p-4 transition-colors duration-300 hover:border-primary/40 sm:rounded-3xl sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-1">
          <p className="truncate text-xs font-medium text-muted-foreground sm:text-sm">
            {label}
          </p>
          <p className="text-[26px] font-bold leading-none tracking-tight tabular-nums text-foreground sm:text-3xl">
            {value}
          </p>
        </div>

        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:-translate-y-0.5 sm:h-10 sm:w-10 sm:rounded-2xl ${accentClass}`}
        >
          <Icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={2.25} />
        </div>
      </div>

      {details && details.length > 0 && (
        <div className="mt-4 flex flex-col gap-2 border-t border-border/50 pt-3 sm:mt-5 sm:pt-4">
          {details.map((d) => (
            <div
              key={d.label}
              className="flex items-center justify-between gap-3 text-xs sm:text-sm"
            >
              <span className="flex min-w-0 items-center gap-2 text-muted-foreground">
                <span
                  className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                    d.dotClass ?? "bg-primary/60"
                  }`}
                />
                <span className="truncate">{d.label}</span>
              </span>
              <span
                className={`shrink-0 font-semibold tabular-nums ${
                  d.colorClass ?? "text-foreground"
                }`}
              >
                {d.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}