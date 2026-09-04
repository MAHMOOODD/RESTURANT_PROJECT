import { CreditCard, Utensils, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PaymentMethod } from "@/types/types";
import type { PaymentMethod as PaymentMethodType } from "@/types/types";

interface PaymentMethodSectionProps {
  paymentMethod: PaymentMethodType;
  setPaymentMethod: (method: PaymentMethodType) => void;
}

export function PaymentMethodSection({
  paymentMethod,
  setPaymentMethod,
}: PaymentMethodSectionProps) {
  const { t } = useTranslation();

  return (
    <div className="p-8 rounded-3xl bg-card/70 backdrop-blur-xl border border-border/80 shadow-md space-y-4">
      <h2 className="text-xl font-black text-foreground mb-2 flex items-center gap-3">
        <CreditCard className="w-7 h-7 text-primary" />
        <span>{t("checkout.payment.title")}</span>
      </h2>

      <button
        type="button"
        onClick={() => setPaymentMethod(PaymentMethod.cod)}
        className={`w-full p-6 rounded-2xl border-2 flex items-center justify-between transition-all cursor-pointer ${
          paymentMethod === PaymentMethod.cod
            ? "bg-primary/5 border-primary"
            : "bg-background/60 border-border/60 hover:border-primary/40"
        }`}
      >
        <div className="flex items-center gap-4">
          <Utensils className="w-7 h-7 text-primary" />
          <span className="text-sm sm:text-base font-black text-foreground">
            {t("checkout.payment.cod")}
          </span>
        </div>
        {paymentMethod === PaymentMethod.cod && (
          <CheckCircle2 className="w-7 h-7 text-primary" />
        )}
      </button>

      <button
        type="button"
        onClick={() => setPaymentMethod(PaymentMethod.online)}
        className={`w-full p-6 rounded-2xl border-2 flex items-center justify-between transition-all cursor-pointer ${
          paymentMethod === PaymentMethod.online
            ? "bg-primary/5 border-primary"
            : "bg-background/60 border-border/60 hover:border-primary/40"
        }`}
      >
        <div className="flex items-center gap-4">
          <CreditCard className="w-7 h-7 text-primary" />
          <span className="text-sm sm:text-base font-black text-foreground">
            {t("checkout.payment.card")}
          </span>
        </div>
        {paymentMethod === PaymentMethod.online && (
          <CheckCircle2 className="w-7 h-7 text-primary" />
        )}
      </button>
    </div>
  );
}