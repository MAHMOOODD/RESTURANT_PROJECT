// src/components/cashier/CashierSidebar.tsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  ClipboardList,
  LogOut,
  Home,
  Globe,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import {
  useCheckAuthQuery,
  useGetUserInfoQuery,
  useRevokeTokenMutation,
  authApi,
} from "@/store/features/User/Auth";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/features/User/authSlice";
import type { RootState } from "@/store/index";

import { useSidebar } from "@/components/admin/sidebar/SidebarContext";
import { SidebarProvider } from "@/components/admin/sidebar/SidebarProvider";
import { SidebarBody } from "@/components/admin/sidebar/SidebarContainers";
import { SidebarCustomLink } from "@/components/admin/sidebar/SidebarCustomLink";
import { HeaderSection } from "@/components/admin/sidebar/SidebarHeader";

interface CashierSidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

function SidebarContent({ isOpenMobile, onCloseMobile }: CashierSidebarProps) {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { open } = useSidebar();

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const [revokeToken] = useRevokeTokenMutation();
  const { data: checkAuthData } = useCheckAuthQuery(undefined, {
    skip: !isAuthenticated,
  });
  const isLoggedIn = isAuthenticated && (checkAuthData?.data ?? true);
  const { data: userInfo } = useGetUserInfoQuery(undefined, {
    skip: !isLoggedIn,
  });

  const userName = userInfo?.fullName || userInfo?.userName;
  const userInitial = userInfo?.imageUrl ? (
    <img
      src={userInfo.imageUrl}
      alt="User"
      className="w-full h-full object-cover rounded-full"
    />
  ) : (
    userName?.charAt(0).toUpperCase()
  );

  const currentLang = i18n.language?.startsWith("ar") ? "ar" : "en";

  const toggleLanguage = () => {
    const nextLang = currentLang === "ar" ? "en" : "ar";
    i18n.changeLanguage(nextLang);
  };

  const handleLogout = async () => {
    try {
      await revokeToken().unwrap();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      dispatch(logout());
      dispatch(authApi.util.resetApiState());
      navigate("/auth", { replace: true });
    }
  };

  // مفيش Dashboard للكاشير — بس صفحة الطلب الجديد (POS) وصفحة الأوردرات
  const links = [
    {
      label: t("cashierSidebar.links.newOrder", "طلب جديد"),
      href: "/cashier",
      icon: <ShoppingCart className="h-4 w-4 shrink-0" />,
    },
    {
      label: t("cashierSidebar.links.orders", "الأوردرات"),
      href: "/cashier/orders",
      icon: <ClipboardList className="h-4 w-4 shrink-0" />,
    },
  ];

  return (
    <SidebarBody
      className="justify-between gap-4 h-screen border-r rtl:border-r-0 rtl:border-l border-border/60 bg-card/80 backdrop-blur-md"
      isOpenMobile={isOpenMobile}
      onCloseMobile={onCloseMobile}
    >
      <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden pb-2">
        <HeaderSection />
        <div className="mt-6 flex flex-col gap-1">
          {links.map((link, idx) => (
            <SidebarCustomLink
              key={idx}
              link={link}
              active={location.pathname === link.href}
              onClick={onCloseMobile}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2.5 pt-3 border-t border-border/60 shrink-0">
        <div className="flex items-center justify-between gap-3 p-2 rounded-2xl min-h-9">
          {open && (
            <span className="text-xs font-bold text-muted-foreground shrink-0">
              {t("cashierSidebar.language", "اللغة")}
            </span>
          )}
          <button
            type="button"
            onClick={toggleLanguage}
            title={currentLang === "ar" ? "Switch to English" : "التحويل للغة العربية"}
            className={cn(
              "h-8 rounded-xl bg-muted/60 flex items-center justify-center gap-2",
              "text-muted-foreground hover:bg-primary hover:text-primary-foreground",
              "transition-all duration-200 cursor-pointer px-3 shrink-0 active:scale-95",
              open ? "w-fit" : "w-9 mx-auto"
            )}
          >
            {open && (
              <span className="text-xs font-semibold whitespace-nowrap">
                {currentLang === "ar" ? "English" : "العربية"}
              </span>
            )}
            <Globe className="w-4 h-4 shrink-0" />
          </button>
        </div>

        <Link
          to={isLoggedIn ? "/profile" : "/auth"}
          onClick={onCloseMobile}
          className={cn(
            "flex items-center gap-2.5 p-2 rounded-2xl bg-muted/20 hover:bg-muted/60 border border-transparent hover:border-border/60 transition-all duration-200",
            !open && "justify-center",
          )}
          title={!open ? userName || t("cashierSidebar.myAccount", "حسابي") : undefined}
        >
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-black text-xs flex items-center justify-center shrink-0 shadow-sm ring-2 ring-primary/20 overflow-hidden">
            {userInitial || "C"}
          </div>
          {open && (
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-foreground truncate">
                {userName || t("cashierSidebar.myAccount", "حسابي")}
              </span>
              <span className="text-[10px] text-muted-foreground truncate">
                {t("cashierSidebar.cashierRole", "كاشير")}
              </span>
            </div>
          )}
        </Link>

        <Link
          to="/"
          onClick={onCloseMobile}
          className="flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-primary/10 text-primary hover:bg-primary/20 font-bold text-xs transition-all duration-200 active:scale-95"
          title={t("cashierSidebar.backToHome", "العودة للموقع الرئيسي")}
        >
          <Home className="w-4 h-4 shrink-0" />
          {open && <span className="truncate">{t("cashierSidebar.backToHome", "العودة للرئيسية")}</span>}
        </Link>

        {isLoggedIn && (
          <button
            type="button"
            onClick={() => {
              onCloseMobile?.();
              handleLogout();
            }}
            className="flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-destructive/10 text-destructive hover:bg-destructive/20 font-semibold text-xs transition-all duration-200 cursor-pointer active:scale-95"
            title={!open ? t("cashierSidebar.logout", "تسجيل الخروج") : undefined}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {open && <span>{t("cashierSidebar.logout", "تسجيل الخروج")}</span>}
          </button>
        )}
      </div>
    </SidebarBody>
  );
}

export default function CashierSidebar({
  isOpenMobile,
  onCloseMobile,
}: CashierSidebarProps) {
  return (
    <SidebarProvider>
      <SidebarContent
        isOpenMobile={isOpenMobile}
        onCloseMobile={onCloseMobile}
      />
    </SidebarProvider>
  );
}