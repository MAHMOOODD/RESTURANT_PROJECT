"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Flame, ShoppingBag, User, Menu, X, ArrowLeft } from "lucide-react";
import LanguageSwitcher from "@/components/my/LanguageSwitcher";
import { ThemeToggle } from "@/components/my/ThemeToggle";
import { Link, useNavigate } from "react-router-dom";
import {
  useCheckAuthQuery,
  useRevokeTokenMutation,
  authApi,
} from "@/store/features/User/Auth";
import { IoMdLogOut } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/features/User/authSlice";
import type { RootState } from "@/store/index";

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAr = i18n.language === "ar";
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 🎯 استدعاء حالة التسجيل من Redux State مباشرة
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  const [revokeToken, { isLoading }] = useRevokeTokenMutation();

  // 🎯 جلب حالة التوثيق من الـ API بشرط وجود التوكن
  const { data: checkAuthData } = useCheckAuthQuery(undefined, {
    skip: !isAuthenticated,
  });

  // تحديد هل المستخدم مسجل دخول أم لا (سواء عبر Redux أو الـ API)
  const isLoggedIn = isAuthenticated && (checkAuthData?.data ?? true);

  const handleLogout = async () => {
    try {
      await revokeToken().unwrap();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      // 1. مسح Redux auth state و LocalStorage
      dispatch(logout());

      // 2. تصفير كاش RTK Query بالكامل وإلغاء الاستعلامات المعلقة
      dispatch(authApi.util.resetApiState());

      // 3. التوجيه لصفحة Auth
      navigate("/auth", { replace: true });
    }
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-3 w-full z-50 px-4 sm:px-8">
      <nav
        className={`max-w-7xl mx-auto rounded-2xl border transition-all duration-300 ${
          isScrolled
            ? "bg-card/80 backdrop-blur-xl border-border shadow-xl shadow-black/10 py-3 px-5"
            : "bg-card/40 backdrop-blur-md border-border/60 py-4 px-6"
        } flex items-center justify-between gap-4`}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/30 group-hover:scale-105 transition-transform">
            <Flame className="w-6 h-6 fill-current" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg sm:text-xl tracking-wider leading-none text-foreground">
              {t("brand")}
            </span>
            <span className="text-[10px] text-muted-foreground font-medium mt-0.5">
              {t("brandSub")}
            </span>
          </div>
        </Link>

        {/* Links */}
        <div className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium">
          <a
            href="#menu"
            className="px-3.5 py-2 rounded-xl text-foreground hover:text-primary hover:bg-muted/60 transition-all"
          >
            {t("nav.menu")}
          </a>
          <a
            href="#categories"
            className="px-3.5 py-2 rounded-xl text-foreground hover:text-primary hover:bg-muted/60 transition-all"
          >
            {t("nav.categories")}
          </a>
          <a
            href="#deals"
            className="px-3.5 py-2 rounded-xl text-foreground hover:text-primary hover:bg-muted/60 transition-all"
          >
            {t("nav.deals")}
          </a>
          <a
            href="#about"
            className="px-3.5 py-2 rounded-xl text-foreground hover:text-primary hover:bg-muted/60 transition-all"
          >
            {t("nav.about")}
          </a>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher />
          <ThemeToggle />

          <button className="hidden sm:flex items-center gap-2 p-2.5 rounded-xl border border-border bg-card text-foreground hover:border-primary/50 hover:text-primary transition-all">
            <User className="w-4 h-4" />
            <span className="text-xs font-semibold hidden xl:inline">
              {t("nav.account")}
            </span>
          </button>

          <button className="relative p-2.5 rounded-xl border border-border bg-card text-foreground hover:border-primary/50 hover:text-primary transition-all">
            <ShoppingBag className="w-4 h-4" />
            <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-card shadow-md">
              3
            </span>
          </button>

          {/* 1. زر أطلب الآن / تسجيل الدخول (عندما يكون غير مسجل دخول) */}
          {!isLoggedIn && (
            <Link
              to="/auth"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-lg shadow-primary/25 active:scale-95 transition-all cursor-pointer"
            >
              <span>{t("nav.order_now")}</span>
              <ArrowLeft
                className={`w-3.5 h-3.5 ${!isAr ? "rotate-180" : ""}`}
              />
            </Link>
          )}

          {/* 2. زر تسجيل الخروج (عندما يكون مسجل دخول) */}
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className={`hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-lg shadow-primary/25 transition-all ${
                isLoading
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-primary/90 active:scale-95 cursor-pointer"
              }`}
            >
              <span>{t("nav.log_out")}</span>
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                <IoMdLogOut className="w-4 h-4" />
              )}


              
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl border border-border bg-card text-foreground"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 p-5 bg-card/95 backdrop-blur-2xl rounded-2xl border border-border shadow-2xl flex flex-col gap-3">
          <a
            href="#menu"
            className="p-3 rounded-xl bg-muted/50 font-bold text-sm text-foreground"
          >
            {t("nav.menu")}
          </a>
          <a
            href="#categories"
            className="p-3 rounded-xl bg-muted/50 font-bold text-sm text-foreground"
          >
            {t("nav.categories")}
          </a>
          <a
            href="#deals"
            className="p-3 rounded-xl bg-muted/50 font-bold text-sm text-foreground"
          >
            {t("nav.deals")}
          </a>
          <button className="w-full py-3 mt-2 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-lg shadow-primary/30">
            {t("nav.order_now")}
          </button>
        </div>
      )}
    </header>
  );
}
