import { useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useConfirmEmailMutation } from "@/store/features/User/Auth";
import { useTranslation } from "react-i18next";
import { MdError } from "react-icons/md";
import { BiHappyHeartEyes } from "react-icons/bi";

export default function ConfirmEmail() {
  const [searchParams] = useSearchParams();

  const { t } = useTranslation();

  const [confirmEmail, { isLoading, isSuccess, isError }] =
    useConfirmEmailMutation();
  const called = useRef(false);

  const userId = searchParams.get("userId");
  const token = searchParams.get("token");

  useEffect(() => {
    // لو تم الاستدعاء قبل كده أو الـ params مش كاملين متنفذش
    if (called.current || !userId || !token) return;

    called.current = true; // 👈 علم إن الطلب اتدبّس خلاص

    confirmEmail({ userId: userId, token: token })
      .unwrap()
      .then((res) => console.log("Email confirmation response:", res))
      .catch((err) => console.error("Email confirmation error:", err));
  }, [userId, token, confirmEmail]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6 py-16">
      <div className="w-full max-w-xl text-center bg-card p-10 sm:p-12 rounded-3xl border-2 border-border shadow-2xl space-y-8">
        {isLoading && (
          <div className="space-y-6">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 text-primary animate-pulse">
              <i className="fa-solid fa-spinner text-5xl animate-spin"></i>
            </div>
            <h2 className="text-3xl font-bold text-foreground">
              {t("auth.confirmingEmail", "جاري تأكيد حسابك...")}
            </h2>
          </div>
        )}

        {isSuccess && (
          <div className="space-y-6">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-500/10 text-emerald-500">
              <BiHappyHeartEyes className="text-6xl" />
            </div>
            <h2 className="text-4xl font-black text-foreground">
              {t("auth.emailConfirmedTitle", "تم تأكيد الحساب بنجاح!")}
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg font-medium leading-relaxed">
              {t(
                "auth.emailConfirmedSubtitle",
                "أهلاً بك في أكلني! حسابك جاهز الآن للبدء واستكشاف أشهى الوجبات.",
              )}
            </p>
            <div className="pt-6">
              <Link
                to="/auth"
                className="inline-block w-full py-4 px-6 bg-primary text-primary-foreground font-extrabold text-lg sm:text-xl rounded-2xl hover:bg-primary/90 active:scale-[0.98] transition-all shadow-xl hover:shadow-primary/25"
              >
                {t("auth.goToLogin", "تسجيل الدخول الآن")}
              </Link>
            </div>
          </div>
        )}

        {isError && (
          <div className="space-y-6">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-destructive/10 text-destructive">
              <MdError className="text-5xl" />
            </div>
            <h2 className="text-3xl font-bold text-foreground">
              {t("auth.confirmFailedTitle", "فشل تأكيد الحساب")}
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg font-medium leading-relaxed">
              {t(
                "auth.confirmFailedSubtitle",
                "الرابط المنقضية صلاحيته أو غير صالح. يرجى طلب رابط تأكيد جديد.",
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
