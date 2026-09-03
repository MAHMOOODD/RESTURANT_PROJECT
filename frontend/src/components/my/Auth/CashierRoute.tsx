// src/components/my/Auth/CashierRoute.tsx
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useCheckAuthQuery, useGetUserInfoQuery } from "@/store/features/User/Auth";
import type { RootState } from "@/store/index";
import { USER_ROLES } from "@/lib/roles";

const ALLOWED_ROLES: readonly string[] = USER_ROLES.filter(
  (r) => r === "Admin" || r === "Manager" || r === "Cashier",
);

interface CashierRouteProps {
  children: React.ReactNode;
}

export default function CashierRoute({ children }: CashierRouteProps) {
  const { t } = useTranslation();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const { data: checkAuthData, isLoading: isCheckingAuth } = useCheckAuthQuery(undefined, {
    skip: !isAuthenticated,
  });
  const isLoggedIn = isAuthenticated && (checkAuthData?.data ?? true);

  const {
    data: userInfo,
    isLoading: isLoadingUser,
    isError,
  } = useGetUserInfoQuery(undefined, {
    skip: !isLoggedIn,
  });

  if (!isAuthenticated) return <Navigate to="/auth" replace />;

  if (isCheckingAuth || isLoadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold text-muted-foreground">
            {t("cashierRoute.loading")}
          </p>
        </div>
      </div>
    );
  }

  const hasAccess = !isError && userInfo?.roles?.some((r) => ALLOWED_ROLES.includes(r));

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6 text-center animate-in fade-in duration-300">
        <div className="max-w-md space-y-4 bg-card/60 backdrop-blur-xl border border-border p-8 rounded-[2.5rem] shadow-2xl">
          <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto text-2xl font-black">
            403
          </div>
          <h1 className="text-2xl font-black tracking-tight">
            {t("cashierRoute.unauthorizedTitle")}
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            {t("cashierRoute.unauthorizedDesc")}
          </p>
          <div className="pt-4 flex gap-3 justify-center">
            <a
              href="/"
              className="px-5 py-2.5 rounded-2xl bg-primary text-primary-foreground font-bold text-xs shadow-lg hover:bg-primary/90 transition-all cursor-pointer"
            >
              {t("cashierRoute.homeBtn")}
            </a>
            <a
              href="/auth"
              className="px-5 py-2.5 rounded-2xl bg-secondary hover:bg-secondary/80 text-foreground font-bold text-xs transition-all cursor-pointer"
            >
              {t("cashierRoute.loginBtn")}
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}