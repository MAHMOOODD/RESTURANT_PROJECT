import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function ConfirmEmail() {
  const { t} = useTranslation();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    // TODO: Call GET /api/Account/ConfirmEmail?userId=...&token=...
    const timer = setTimeout(() => {
      setStatus("success");
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div  className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md text-center bg-card p-8 rounded-2xl border border-border shadow-2xl space-y-6">
        {status === "loading" && (
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary animate-pulse">
              <i className="fa-solid fa-spinner text-3xl animate-spin"></i>
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              {t("Auth.confirmingEmail", "جاري تأكيد حسابك...")}
            </h2>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500">
              <i className="fa-solid fa-circle-check text-4xl"></i>
            </div>
            <h2 className="text-3xl font-black text-foreground">
              {t("Auth.emailConfirmedTitle", "تم تأكيد الحساب بنجاح!")}
            </h2>
            <p className="text-muted-foreground text-sm">
              {t("Auth.emailConfirmedSubtitle", "أهلاً بك في أكلني! حسابك جاهز الآن للبدء واستكشاف أشهى الوجبات.")}
            </p>
            <div className="pt-4">
              <a
                href="/login"
                className="inline-block w-full py-3.5 px-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg hover:shadow-primary/25"
              >
                {t("Auth.goToLogin", "تسجيل الدخول الآن")}
              </a>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 text-destructive">
              <i className="fa-solid fa-triangle-exclamation text-3xl"></i>
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              {t("Auth.confirmFailedTitle", "فشل تأكيد الحساب")}
            </h2>
            <p className="text-muted-foreground text-sm">
              {t("Auth.confirmFailedSubtitle", "الرابط المنقضية صلاحيته أو غير صالح. يرجى طلب رابط تأكيد جديد.")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}