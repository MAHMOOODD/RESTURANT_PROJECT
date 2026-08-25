import { CreditCard, Utensils, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export function PaymentMethodSection() {
  const { t } = useTranslation();

  return (
    <div className="p-8 rounded-3xl bg-card/70 backdrop-blur-xl border border-border/80 shadow-md">
      <h2 className="text-xl font-black text-foreground mb-6 flex items-center gap-3">
        <CreditCard className="w-7 h-7 text-primary" />
        <span>{t("checkout.payment.title")}</span>
      </h2>
      <div className="p-6 rounded-2xl bg-primary/5 border-2 border-primary flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Utensils className="w-7 h-7 text-primary" />
          <span className="text-sm sm:text-base font-black text-foreground">
            {t("checkout.payment.cod")}
          </span>
        </div>
        <CheckCircle2 className="w-7 h-7 text-primary" />
      </div>
    </div>
  );
}