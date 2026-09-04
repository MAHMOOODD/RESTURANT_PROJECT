import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function PaymentResultPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success") === "true";
  const merchantOrderId = searchParams.get("merchant_order_id");

  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <div className="p-10 rounded-3xl bg-card/90 backdrop-blur-2xl border border-border/80 shadow-2xl max-w-md w-full">
        {success ? (
          <>
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-6">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-black text-foreground mb-3">
              {t("payment_result.success_title")}
            </h2>
            <p className="text-muted-foreground mb-8">
              {t("payment_result.success_desc")}
            </p>
          </>
        ) : (
          <>
            <div className="w-20 h-20 mx-auto rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mb-6">
              <XCircle className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-black text-foreground mb-3">
              {t("payment_result.failure_title")}
            </h2>
            <p className="text-muted-foreground mb-8">
              {t("payment_result.failure_desc")}
            </p>
          </>
        )}

        <Link
          to={merchantOrderId ? `/orders/${merchantOrderId}` : "/orders"}
          className="inline-block px-10 py-4 rounded-2xl bg-primary text-primary-foreground font-bold shadow-xl hover:bg-primary/90 transition-all"
        >
          {t("payment_result.back_to_orders")}
        </Link>
      </div>
    </main>
  );
}