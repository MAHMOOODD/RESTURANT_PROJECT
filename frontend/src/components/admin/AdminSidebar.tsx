import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Layers,
  ShoppingBag,
  Ticket,
  Users,
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

import { useSidebar } from "./sidebar/SidebarContext";
import { SidebarProvider } from "./sidebar/SidebarProvider";
import { SidebarBody } from "./sidebar/SidebarContainers";
import { SidebarCustomLink } from "./sidebar/SidebarCustomLink";
import { HeaderSection } from "./sidebar/SidebarHeader";

interface AdminSidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

function SidebarContent({ isOpenMobile, onCloseMobile }: AdminSidebarProps) {
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

  const links = [
    {
      label: t("adminSidebar.links.dashboard", "الرئيسية"),
      href: "/admin",
      icon: <LayoutDashboard className="h-4 w-4 shrink-0" />,
    },
    {
      label: t("adminSidebar.links.products", "المنتجات والأكلات"),
      href: "/admin/products",
      icon: <UtensilsCrossed className="h-4 w-4 shrink-0" />,
    },
    {
      label: t("adminSidebar.links.categories", "الأقسام والتصنيفات"),
      href: "/admin/categories",
      icon: <Layers className="h-4 w-4 shrink-0" />,
    },
    {
      label: t("adminSidebar.links.orders", "طلبات الزباين"),
      href: "/admin/orders",
      icon: <ShoppingBag className="h-4 w-4 shrink-0" />,
    },
    {
      label: t("adminSidebar.links.coupons", "كوبونات الخصم"),
      href: "/admin/coupons",
      icon: <Ticket className="h-4 w-4 shrink-0" />,
    },
    {
      label: t("adminSidebar.links.users", "المستخدمين"),
      href: "/admin/users",
      icon: <Users className="h-4 w-4 shrink-0" />,
    },
  ];

  return (
    <SidebarBody
      className="justify-between gap-4 border-r rtl:border-r-0 rtl:border-l border-border/60 bg-card/80 backdrop-blur-md"
      isOpenMobile={isOpenMobile}
      onCloseMobile={onCloseMobile}
    >
      {/* Header & Links */}
      <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <HeaderSection />
        <div className="mt-6 flex flex-col gap-1.5">
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

      {/* Bottom Utility Actions */}
      <div className="flex flex-col gap-2.5 pt-3 border-t shrink-0">
        {/* Theme & Language Box */}
        <div className="flex flex-col gap-2 p-2 rounded-2xl  ">
          

          {/* Language */}
          <div className="flex items-center justify-between gap-3 pt-2 min-h-9">
            {open && (
              <span className="text-xs font-bold text-muted-foreground shrink-0">
                {t("adminSidebar.language", "اللغة")}
              </span>
            )}

            <button
              type="button"
              onClick={toggleLanguage}
              title={
                currentLang === "ar"
                  ? "Switch to English"
                  : "التحويل للغة العربية"
              }
              className={cn(
                "h-8 rounded-xl bg-muted/60 flex items-center justify-center gap-2",
                "text-muted-foreground hover:bg-primary hover:text-primary-foreground",
                "transition-all cursor-pointer px-3 shrink-0 active:scale-95",
                open ? "fit" : "w-9"
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
        </div>

        {/* Profile Badge */}
        <Link
          to={isLoggedIn ? "/profile" : "/auth"}
          onClick={onCloseMobile}
          className="flex items-center gap-2.5 p-2 rounded-2xl bg-muted/20 hover:bg-muted/60 transition-all"
          title={!open ? userName || t("adminSidebar.myAccount", "حسابي") : undefined}
        >
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
            {userInitial || "A"}
          </div>
          {open && (
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-foreground truncate">
                {userName || t("adminSidebar.myAccount", "حسابي")}
              </span>
              <span className="text-[10px] text-muted-foreground truncate">
                {t("adminSidebar.adminRole", "مشرف النظام")}
              </span>
            </div>
          )}
        </Link>

        {/* Main App Link */}
        <Link
          to="/"
          onClick={onCloseMobile}
          className="flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-primary/10 text-primary hover:bg-primary/20 font-bold text-xs transition-all active:scale-95"
          title={t("adminSidebar.backToHome", "العودة للموقع الرئيسي")}
        >
          <Home className="w-4 h-4 shrink-0" />
          {open && <span className="truncate">{t("adminSidebar.backToHome", "العودة للرئيسية")}</span>}
        </Link>

        {/* Logout Button */}
        {isLoggedIn && (
          <button
            type="button"
            onClick={() => {
              onCloseMobile?.();
              handleLogout();
            }}
            className="flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-destructive/10 text-destructive hover:bg-destructive/20 font-semibold text-xs transition-all cursor-pointer active:scale-95"
            title={!open ? t("adminSidebar.logout", "تسجيل الخروج") : undefined}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {open && <span>{t("adminSidebar.logout", "تسجيل الخروج")}</span>}
          </button>
        )}
      </div>
    </SidebarBody>
  );
}

export default function AdminSidebar({
  isOpenMobile,
  onCloseMobile,
}: AdminSidebarProps) {
  return (
    <SidebarProvider>
      <SidebarContent
        isOpenMobile={isOpenMobile}
        onCloseMobile={onCloseMobile}
      />
    </SidebarProvider>
  );
}