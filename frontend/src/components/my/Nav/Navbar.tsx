"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ShoppingBag, User, Menu, X, ArrowLeft } from "lucide-react";
import LanguageSwitcher from "@/components/my/LanguageSwitcher";
import { Link, useNavigate } from "react-router-dom";

import dish from "@/assets/vegetarian.png";
import {
  useCheckAuthQuery,
  useGetUserInfoQuery,
  useRevokeTokenMutation,
  authApi,
} from "@/store/features/User/Auth";
import { useGetCartQuery } from "@/store/features/cartApi";
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

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  const [revokeToken, { isLoading }] = useRevokeTokenMutation();

  const { data: checkAuthData } = useCheckAuthQuery(undefined, {
    skip: !isAuthenticated,
  });

  const isLoggedIn = isAuthenticated && (checkAuthData?.data ?? true);

  const { data: userInfo } = useGetUserInfoQuery(undefined, {
    skip: !isLoggedIn,
  });

  const { data: cartData } = useGetCartQuery();
  const cartCount = cartData
    ? cartData.reduce((acc, item) => acc + item.quantity, 0)
    : 0;

  const userName = userInfo?.fullName || userInfo?.userName;
  const userInitial = userInfo?.imageUrl ? (
    <img src={userInfo.imageUrl} alt="User" className="w-full h-full object-cover rounded-full" />
  ) : (
    userName?.charAt(0).toUpperCase()
  );

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

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full px-4 pt-3 pb-1 transition-all duration-300">
      <nav
        className={`max-w-[1536px] mx-auto rounded-3xl border transition-all duration-300 ${
          isScrolled
            ? "bg-card/85 backdrop-blur-2xl border-border shadow-xl shadow-black/10 py-3 px-5 lg:px-6"
            : "bg-card/50 backdrop-blur-xl border-border/70 py-4 px-5 lg:px-8"
        } flex items-center justify-between gap-3 lg:gap-4`}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-xl shadow-rose-500/20 group-hover:scale-105 transition-transform duration-300">
            <img src={dish} alt="Logo" className="w-7 h-7 object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-black tracking-widest bg-gradient-to-r from-orange-400 via-rose-500 to-amber-400 bg-clip-text text-transparent">
              {t("brand")}
            </span>
            <span className="text-[11px] text-muted-foreground font-semibold mt-0.5">
              {t("brandSub")}
            </span>
          </div>
        </Link>

        {/* Links - تم تعديلها لتظهر فقط في الشاشات الأكبر من xl (1280px) لمنع التداخل */}
        <div className="hidden xl:flex items-center gap-2 text-base font-bold">
          <Link
            to="/"
            className="px-4 py-2 rounded-xl text-foreground hover:text-primary hover:bg-muted/60 transition-all"
          >
            {t("nav.Home")}
          </Link>

          <Link
            to="/products"
            className="px-4 py-2 rounded-xl text-foreground hover:text-primary hover:bg-muted/60 transition-all"
          >
            {t("nav.menu")}
          </Link>
          <Link
            to="/orders"
            className="px-4 py-2 rounded-xl text-foreground hover:text-primary hover:bg-muted/60 transition-all"
          >
            {t("nav.orders")}
          </Link>
          
          <Link
            to ="/about"
            className="px-4 py-2 rounded-xl text-foreground hover:text-primary hover:bg-muted/60 transition-all"
          >
            {t("nav.about")}
          </Link>
          <Link
            to="/contact"
            className="px-4 py-2 rounded-xl text-foreground hover:text-primary hover:bg-muted/60 transition-all"
          >
            {t("nav.contact")}
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 lg:gap-3 shrink-0">
          <LanguageSwitcher />

          {/* User Button */}
          <Link
            to={isLoggedIn ? "/profile" : "/auth"}
            className="flex items-center justify-center group cursor-pointer transition-all hover:opacity-95"
          >
            {isLoggedIn ? (
              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-muted/50 hover:bg-muted border border-border/60 hover:border-border transition-all duration-200">
                <div className="relative shrink-0">
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-primary to-orange-500 text-white font-black text-sm flex items-center justify-center ring-2 ring-background shadow-md group-hover:scale-105 transition-transform">
                    {userInitial}
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
                </div>

                <div className="hidden sm:flex flex-col min-w-0 leading-tight">
                  <span className="text-[10px] font-medium text-muted-foreground">
                    {t("nav.welcome", "مرحباً")}
                  </span>
                  <span className="max-w-[100px] truncate text-xs font-bold text-foreground">
                    {userName || t("nav.account")}
                  </span>
                </div>
              </div>
            ) : (
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-muted/60 border border-border/60 text-muted-foreground group-hover:bg-primary/10 group-hover:border-primary/40 group-hover:text-primary transition-all duration-200">
                <User className="w-4 h-4" strokeWidth={2} />
              </div>
            )}
          </Link>

          {/* Shopping Bag */}
          <button
            onClick={() => navigate("/cart")}
            className="relative p-2.5 rounded-2xl border border-border/80 bg-card text-foreground hover:border-primary/50 hover:text-primary transition-all cursor-pointer active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-card shadow-md">
                {cartCount}
              </span>
            )}
          </button>

          {/* Action Buttons */}
          {!isLoggedIn && (
            <Link
              to="/auth"
              className="hidden lg:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-black shadow-lg shadow-primary/20 active:scale-95 transition-all cursor-pointer"
            >
              <span>{t("nav.order_now")}</span>
              <ArrowLeft
                className={`w-3.5 h-3.5 ${!isAr ? "rotate-180" : ""}`}
              />
            </Link>
          )}

          {isLoggedIn && (
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className={`hidden lg:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-primary text-primary-foreground text-xs font-black shadow-lg shadow-primary/20 transition-all ${
                isLoading
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-primary/90 active:scale-95 cursor-pointer"
              }`}
            >
              <span>{t("nav.log_out")}</span>
              {isLoading ? (
                <span className="w-3.5 h-3.5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                <IoMdLogOut className="w-4 h-4" />
              )}
            </button>
          )}

          {/* Mobile Menu Toggle - يظهر الآن في الشاشات الأقل من xl لمنع خروج العناصر */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2.5 rounded-2xl border border-border bg-card text-foreground cursor-pointer"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile / Tablet Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden mt-3 max-w-[1536px] mx-auto p-4 bg-card/95 backdrop-blur-2xl rounded-3xl border border-border/80 shadow-2xl flex flex-col gap-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="p-3.5 rounded-xl bg-muted/40 hover:bg-muted/80 font-bold text-sm text-foreground transition-colors flex items-center justify-between"
          >
            <span>{t("nav.Home")}</span>
          </Link>

          <Link
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="p-3.5 rounded-xl bg-muted/40 hover:bg-muted/80 font-bold text-sm text-foreground transition-colors flex items-center justify-between"
          >
            <span>{t("nav.menu")}</span>
          </Link>

          <a
            href="#deals"
            onClick={() => setMobileMenuOpen(false)}
            className="p-3.5 rounded-xl bg-muted/40 hover:bg-muted/80 font-bold text-sm text-foreground transition-colors flex items-center justify-between"
          >
            <span>{t("nav.deals")}</span>
          </a>

          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="p-3.5 rounded-xl bg-muted/40 hover:bg-muted/80 font-bold text-sm text-foreground transition-colors flex items-center justify-between"
          >
            <span>{t("nav.about")}</span>
          </a>

          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="p-3.5 rounded-xl bg-muted/40 hover:bg-muted/80 font-bold text-sm text-foreground transition-colors flex items-center justify-between"
          >
            <span>{t("nav.contact")}</span>
          </a>

          <div className="pt-2 border-t border-border/50 mt-1 flex flex-col gap-2">
            <Link
              to={isLoggedIn ? "/profile" : "/auth"}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-center text-sm shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
            >
              <span>{isLoggedIn ? t("nav.account") : t("nav.order_now")}</span>
            </Link>

            {isLoggedIn && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full py-3.5 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 font-black text-center text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t("nav.log_out")}</span>
                <IoMdLogOut className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
