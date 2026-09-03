"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  ShoppingBag,
  User,
  Menu,
  X,
  ArrowLeft,
  Bell,
  Package,
  Clock,
  ChefHat,
  Bike,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
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
import { markAllNotificationsAsRead } from "@/store/features/notificationsSlice";
import type { RootState } from "@/store/index";
import { OrderStatus } from "@/types/types";

const STATUS_CONFIG: Record<
  number,
  { icon: typeof Clock; color: string; labelKey: string }
> = {
  [OrderStatus.pending]: {
    icon: Clock,
    color: "text-amber-500 bg-amber-500/10",
    labelKey: "orderDetails.statuses.pending",
  },
  [OrderStatus.processing]: {
    icon: ChefHat,
    color: "text-blue-500 bg-blue-500/10",
    labelKey: "orderDetails.statuses.processing",
  },
  [OrderStatus.shipped]: {
    icon: Bike,
    color: "text-purple-500 bg-purple-500/10",
    labelKey: "orderDetails.statuses.shipped",
  },
  [OrderStatus.delivered]: {
    icon: CheckCircle2,
    color: "text-emerald-500 bg-emerald-500/10",
    labelKey: "orderDetails.statuses.delivered",
  },
  [OrderStatus.cancelled]: {
    icon: XCircle,
    color: "text-rose-500 bg-rose-500/10",
    labelKey: "orderDetails.statuses.cancelled",
  },
};

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const isAr = i18n.language === "ar";
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  const notifications = useSelector(
    (state: RootState) => state.notifications.items,
  );
  const unreadCount = notifications.filter((n) => !n.read).length;

  const [revokeToken, { isLoading }] = useRevokeTokenMutation();

  const {
    data: checkAuthData,
    isLoading: isCheckAuthLoading,
    isFetching: isCheckAuthFetching,
  } = useCheckAuthQuery(undefined, {
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
    <img
      src={userInfo.imageUrl}
      alt="User"
      className="w-full h-full object-cover rounded-full"
    />
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

  const handleToggleNotifications = () => {
    setIsNotifOpen((prev) => {
      const next = !prev;
      if (next && unreadCount > 0) {
        dispatch(markAllNotificationsAsRead());
      }
      return next;
    });
  };

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString(isAr ? "ar-EG" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { to: "/", label: t("nav.Home") },
    { to: "/products", label: t("nav.menu") },
    { to: "/orders", label: t("nav.orders") },
    { to: "/about", label: t("nav.about") },
    { to: "/contact", label: t("nav.contact") },
  ];

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

        {/* Links */}
        <div className="hidden xl:flex items-center gap-2 text-base font-bold">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="px-4 py-2 rounded-xl text-foreground hover:text-primary hover:bg-muted/60 transition-all"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 lg:gap-3 shrink-0">
          <LanguageSwitcher />

          {/* Notifications Bell */}
          {isLoggedIn && (
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={handleToggleNotifications}
                className="relative p-2.5 rounded-2xl border border-border/80 bg-card text-foreground hover:border-primary/50 hover:text-primary transition-all cursor-pointer active:scale-95"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-card shadow-md">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsNotifOpen(false)}
                />
              )}

              {isNotifOpen && (
                <div className="absolute top-full mt-2 z-50 w-80 max-h-96 overflow-y-auto bg-card border border-border rounded-2xl shadow-2xl p-2 animate-in fade-in-50 zoom-in-95 backdrop-blur-xl end-0">
                  <div className="px-3 py-2 flex items-center justify-between border-b border-border/50 mb-1">
                    <span className="text-sm font-black text-foreground">
                      {t("nav.notifications", "الإشعارات")}
                    </span>
                  </div>

                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center gap-2">
                      <Package className="w-8 h-8 text-muted-foreground/40" />
                      <span className="text-xs text-muted-foreground font-semibold">
                        {t("nav.noNotifications", "لا توجد إشعارات حالياً")}
                      </span>
                    </div>
                  ) : (
                    notifications.map((n) => {
                      const config = STATUS_CONFIG[n.status];
                      const Icon = config?.icon ?? Package;
                      return (
                        <Link
                          key={n.id}
                          to={`/orders/${n.orderId}`}
                          onClick={() => setIsNotifOpen(false)}
                          className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors ${
                            n.read
                              ? "hover:bg-muted/50"
                              : "bg-primary/5 hover:bg-primary/10"
                          }`}
                        >
                          <span
                            className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${config?.color ?? "bg-muted text-muted-foreground"}`}
                          >
                            <Icon className="h-4 w-4" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-foreground truncate">
                              {t("nav.orderUpdated", "تحديث للطلب")} #
                              {n.orderId}
                            </p>
                            <p className="text-[11px] text-muted-foreground font-medium truncate">
                              {config ? t(config.labelKey) : ""}
                            </p>
                          </div>
                          <span className="text-[10px] text-muted-foreground font-semibold shrink-0">
                            {formatTime(n.receivedAt)}
                          </span>
                        </Link>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          )}

          {/* User Button */}
          {isCheckAuthLoading || isCheckAuthFetching ? (
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          ) : (
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
          )}

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

          {/* Mobile Menu Toggle */}
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
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className="p-3.5 rounded-xl bg-muted/40 hover:bg-muted/80 font-bold text-sm text-foreground transition-colors flex items-center justify-between"
            >
              <span>{link.label}</span>
            </Link>
          ))}

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
