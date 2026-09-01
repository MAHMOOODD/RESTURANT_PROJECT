import { useGetUserInfoQuery } from "@/store/features/User/Auth";
import { useTranslation } from "react-i18next";

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const { data: userInfo, isLoading, isError } = useGetUserInfoQuery();
  // لو لسه البيانات بتحمل
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold text-muted-foreground">
            {t("adminRoute.loading", "جاري التحقق من الصلاحيات...")}
          </p>
        </div>
      </div>
    );
  }




  const isAdmin = userInfo && Array.isArray(userInfo.roles) && userInfo.roles.includes("Admin");


  if (isError || !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6 text-center animate-in fade-in duration-300">
        <div className="max-w-md space-y-4 bg-card/60 backdrop-blur-xl border border-border p-8 rounded-[2.5rem] shadow-2xl">
          <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto text-2xl font-black">
            403
          </div>
          <h1 className="text-2xl font-black tracking-tight">
            {t("adminRoute.unauthorizedTitle", "غير مصرح لك بالدخول")}
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            {t(
              "adminRoute.unauthorizedDesc",
              "عذراً، هذه الصفحة مخصصة لمديري النظام فقط. يجب تسجيل الدخول بحساب صلاحياته مديراً (Admin) للوصول إليها."
            )}
          </p>
          <div className="pt-4 flex gap-3 justify-center">
            <a
              href="/"
              className="px-5 py-2.5 rounded-2xl bg-primary text-primary-foreground font-bold text-xs shadow-lg hover:bg-primary/90 transition-all cursor-pointer"
            >
              {t("adminRoute.homeBtn", "الرئيسية")}
            </a>
            <a
              href="/auth"
              className="px-5 py-2.5 rounded-2xl bg-secondary hover:bg-secondary/80 text-foreground font-bold text-xs transition-all cursor-pointer"
            >
              {t("adminRoute.loginBtn", "تسجيل الدخول")}
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}