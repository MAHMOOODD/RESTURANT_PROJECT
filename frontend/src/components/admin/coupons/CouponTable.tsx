// المسار المقترح: src/components/admin/coupons/CouponTable.tsx
import {  useState } from "react";
import type { MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import {
  Pencil,
  Trash2,
  Copy,
  Check,
  Calendar,
  CalendarX2,
  TicketPercent,
  Users,
} from "lucide-react";
import type { GetCouponDto } from "@/types/types";

interface CouponTableProps {
  coupons: GetCouponDto[];
  onEdit: (coupon: GetCouponDto) => void;
  onDelete: (coupon: GetCouponDto) => void;
  emptyMessage: string;
}

const COPY_FEEDBACK_MS = 1500;

function StatusBadge() {
  const { t } = useTranslation();
  const isExpired = false;

  return (
    <span
      className={`inline-flex items-center gap-2 font-bold py-1.5 px-3.5 rounded-full border-0 text-xs sm:text-sm shadow-sm ${
        isExpired
          ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
          : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full shrink-0 ${
          isExpired ? "bg-rose-500" : "bg-emerald-500"
        }`}
      />
      {isExpired
        ? t("adminCoupons.table.expired")
        : t("adminCoupons.table.active")}
    </span>
  );
}

function CopyCodeButton({ code }: { code: string }) {
  const { t } = useTranslation();
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), COPY_FEEDBACK_MS);
    } catch {
      // تجاهل بصمت في حالة عدم دعم المتصفح لواجهة الـ Clipboard
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={t("adminCoupons.table.copy")}
      className="h-8 w-8 rounded-lg border border-border/60 bg-background/60 hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-all cursor-pointer active:scale-90 outline-none shrink-0"
    >
      {isCopied ? (
        <Check className="h-3.5 w-3.5 text-emerald-500" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  );
}

export function CouponTable({
  coupons,
  onEdit,
  onDelete,
  emptyMessage,
}: CouponTableProps) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language.startsWith("ar");

  const formatDate = (date: Date | string) =>
    new Date(date).toLocaleDateString(isArabic ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  if (!coupons.length) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-card">
        <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-4 border border-border shadow-inner">
          <TicketPercent className="h-8 w-8 sm:h-10 sm:w-10 stroke-[1.5]" />
        </div>
        <p className="text-base sm:text-lg font-semibold text-foreground">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile View: Cards */}
      <div className="grid grid-cols-1 gap-3 p-4 md:hidden bg-card/50">
        {coupons.map((c) => (
          <div
            key={c.id}
            className="flex flex-col gap-3 p-4 rounded-2xl bg-card border border-border shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-mono font-black text-sm text-foreground tracking-wider truncate">
                  {c.code}
                </span>
                <CopyCodeButton code={c.code} />
              </div>
              <StatusBadge />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-xl bg-muted/40 border border-border/50">
                <p className="text-[10px] text-muted-foreground font-medium mb-0.5">
                  {t("adminCoupons.table.discount")}
                </p>
                <p className="text-sm font-black text-primary font-mono">
                  {c.discount}%
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-muted/40 border border-border/50">
                <p className="text-[10px] text-muted-foreground font-medium mb-0.5">
                  {t("adminCoupons.table.minimumAmount")}
                </p>
                <p className="text-sm font-black text-foreground font-mono">
                  {c.minimumAmount.toLocaleString()}{" "}
                  {t("adminCoupons.currency")}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-primary" />
                {t("adminCoupons.table.usedCount")}: {c.orders.length}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarX2 className="h-3.5 w-3.5" />
                {formatDate(c.expiryDate)}
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
              <button
                type="button"
                onClick={() => onEdit(c)}
                title={t("adminCoupons.table.edit")}
                className="h-9 w-9 rounded-xl border border-border bg-background hover:bg-blue-500/10 hover:border-blue-500/40 hover:text-blue-600 transition-all shadow-sm active:scale-95 cursor-pointer flex items-center justify-center outline-none"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(c)}
                title={t("adminCoupons.table.delete")}
                className="h-9 w-9 rounded-xl border border-border bg-background hover:bg-rose-500/10 hover:border-rose-500/40 hover:text-rose-600 transition-all shadow-sm active:scale-95 cursor-pointer flex items-center justify-center outline-none"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View: Native Table */}
      <div className="hidden md:block w-full h-full bg-card">
        <table className="w-full h-full border-collapse">
          <thead className="bg-muted/80 sticky top-0 z-10 backdrop-blur-md border-b border-border">
            <tr className="hover:bg-transparent border-none">
              <th className="py-4 px-6 text-start font-bold text-sm text-foreground">
                {t("adminCoupons.table.code")}
              </th>
              <th className="py-4 px-6 text-start font-bold text-sm text-foreground">
                {t("adminCoupons.table.discount")}
              </th>
              <th className="py-4 px-6 text-start font-bold text-sm text-foreground">
                {t("adminCoupons.table.minimumAmount")}
              </th>
              <th className="py-4 px-6 text-start font-bold text-sm text-foreground">
                {t("adminCoupons.table.usedCount")}
              </th>
              <th className="py-4 px-6 text-start font-bold text-sm text-foreground">
                {t("adminCoupons.table.createdAt")}
              </th>
              <th className="py-4 px-6 text-start font-bold text-sm text-foreground">
                {t("adminCoupons.table.expiryDate")}
              </th>
              <th className="py-4 px-6 text-start font-bold text-sm text-foreground">
                {t("adminCoupons.table.status")}
              </th>
              <th className="py-4 px-6 text-center font-bold text-sm text-foreground">
                {t("adminCoupons.table.actions")}
              </th>
            </tr>
          </thead>

          <tbody>
            {coupons.map((c) => (
              <tr
                key={c.id}
                className="group hover:bg-muted/30 transition-all duration-200 border-border/40"
              >
                <td className="py-4 px-6 text-start align-middle whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-sm text-foreground tracking-wider">
                      {c.code}
                    </span>
                    <CopyCodeButton code={c.code} />
                  </div>
                </td>

                <td className="py-4 px-6 text-start align-middle whitespace-nowrap">
                  <span className="font-mono font-extrabold text-sm text-primary">
                    {c.discount}%
                  </span>
                </td>

                <td className="py-4 px-6 text-start align-middle whitespace-nowrap">
                  <div className="flex items-baseline gap-1.5 font-mono font-extrabold text-sm text-foreground">
                    <span>{c.minimumAmount.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground font-sans font-medium">
                      {t("adminCoupons.currency")}
                    </span>
                  </div>
                </td>

                <td className="py-4 px-6 text-start align-middle whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground font-semibold">
                    <Users className="h-4 w-4 text-primary" />
                    {c.orders.length}
                  </span>
                </td>

                <td className="py-4 px-6 text-start align-middle whitespace-nowrap">
                  <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-muted-foreground bg-muted px-3.5 py-1.5 rounded-xl border border-border/60 font-semibold">
                    <Calendar className="h-4 w-4 text-primary stroke-2" />
                    <span>{formatDate(c.createdAt)}</span>
                  </div>
                </td>

                <td className="py-4 px-6 text-start align-middle whitespace-nowrap">
                  <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-muted-foreground bg-muted px-3.5 py-1.5 rounded-xl border border-border/60 font-semibold">
                    <CalendarX2 className="h-4 w-4 text-primary stroke-2" />
                    <span>{formatDate(c.expiryDate)}</span>
                  </div>
                </td>

                <td className="py-4 px-6 text-start align-middle whitespace-nowrap">
                  <StatusBadge  />
                </td>

                <td className="py-4 px-6 text-center align-middle whitespace-nowrap">
                  <div className="inline-flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(c)}
                      title={t("adminCoupons.table.edit")}
                      className="h-10 w-10 rounded-xl border border-border bg-background hover:bg-blue-500/10 hover:border-blue-500/40 hover:text-blue-600 transition-all shadow-sm active:scale-95 cursor-pointer flex items-center justify-center outline-none"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(c)}
                      title={t("adminCoupons.table.delete")}
                      className="h-10 w-10 rounded-xl border border-border bg-background hover:bg-rose-500/10 hover:border-rose-500/40 hover:text-rose-600 transition-all shadow-sm active:scale-95 cursor-pointer flex items-center justify-center outline-none"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
