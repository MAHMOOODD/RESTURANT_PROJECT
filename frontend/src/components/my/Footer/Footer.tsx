import React from "react";
import { useTranslation } from "react-i18next";
import {
  
  Mail,
  Phone,
  MapPin,
  Send,
  Heart,
  Clock,
  ShieldCheck,
  Truck,
  Award,
} from "lucide-react";

import  Logo  from "@/assets/vegetarian.png";
import {Link} from "react-router-dom";
import { CiFacebook, CiInstagram, CiTwitter } from "react-icons/ci";

export const Footer: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  return (
    <footer className="w-full  text-foreground border-t-2 border-border/60 relative overflow-hidden transition-colors duration-300">
      {/* Glow Backdrops */}
      <div className="absolute top-0 left-1/4 w-[28rem] h-[28rem] bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[28rem] h-[28rem] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Value Badges*/}
      <div className="border-b-2 border-border/60 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-start">
            <div className="flex items-center justify-center md:justify-start gap-5">
              <div className="p-4 bg-rose-500/10 text-rose-500 rounded-2xl shrink-0">
                <Truck className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-extrabold text-base sm:text-lg text-foreground">
                  {t("footer.fast_delivery", "توصيل سريع وساخن")}
                </h4>
                <p className="text-sm text-muted-foreground font-medium mt-1">
                  {t("footer.fast_delivery_desc", "ينافس سرعة الجوع لديك")}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-5">
              <div className="p-4 bg-amber-500/10 text-amber-500 rounded-2xl shrink-0">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-extrabold text-base sm:text-lg text-foreground">
                  {t("footer.best_quality", "أعلى جودة طعام")}
                </h4>
                <p className="text-sm text-muted-foreground font-medium mt-1">
                  {t("footer.best_quality_desc", "مكونات طازجة يومياً 100%")}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-5">
              <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl shrink-0">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-extrabold text-base sm:text-lg text-foreground">
                  {t("footer.secure_pay", "دفع آمن وسهل")}
                </h4>
                <p className="text-sm text-muted-foreground font-medium mt-1">
                  {t("footer.secure_pay_desc", "كاش أو أونلاين بكل أمان")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 pt-16 pb-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Brand Info & Newsletter (4 cols) */}
          <div className="lg:col-span-4 space-y-7">
             <Link to="/" className="flex items-center gap-3.5 group shrink-0">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-xl shadow-rose-500/20 group-hover:scale-105 transition-transform duration-300">
            <img
              src={Logo}
              alt="Logo"
              className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-3xl sm:text-4xl font-black tracking-widest bg-gradient-to-r from-orange-400 via-rose-500 to-amber-400 bg-clip-text text-transparent">
                {t("brand")}
              </span>
            <span className="text-xs text-muted-foreground font-semibold mt-1">
              {t("brandSub")}
            </span>
          </div>
        </Link>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-medium">
              {t(
                "footer.brand_desc",
                "نقدم لك تجربة أكل سريع لا تُنسى! أشهى البرجر والوجبات المحضرة بشغف وبأجود المكونات الطازجة يومياً.",
              )}
            </p>

            {/* Newsletter Input */}
            <div className="space-y-3">
              <span className="text-sm sm:text-base font-extrabold text-foreground block">
                {t(
                  "footer.subscribe_title",
                  "اشترك للحصول على خصومات حصرية 🔥",
                )}
              </span>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="relative flex items-center"
              >
                <input
                  type="email"
                  placeholder={t(
                    "footer.email_placeholder",
                    "أدخل بريدك الإلكتروني",
                  )}
                  className={`w-full py-3.5 ${
                    isRtl ? "pr-5 pl-14" : "pl-5 pr-14"
                  } bg-muted/60 border-2 border-input rounded-2xl text-sm sm:text-base font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-rose-500 transition-all`}
                />
                <button
                  type="submit"
                  className={`absolute ${
                    isRtl ? "left-2" : "right-2"
                  } p-2.5 bg-gradient-to-r from-rose-600 to-orange-500 hover:opacity-90 text-white rounded-xl transition-all shadow-md cursor-pointer`}
                  aria-label="Subscribe"
                >
                  <Send className={`w-5 h-5 ${isRtl ? "rotate-180" : ""}`} />
                </button>
              </form>
            </div>
          </div>

          {/* Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-5">
            <h3 className="text-base sm:text-lg font-black text-foreground uppercase tracking-wider">
              {t("footer.quick_links", "روابط سريعة")}
            </h3>
            <ul className="space-y-3.5 text-sm sm:text-base text-muted-foreground font-semibold">
              <li>
                <a
                  href="#menu"
                  className="hover:text-rose-500 transition-colors"
                >
                  {t("footer.menu", "قائمة الطعام")}
                </a>
              </li>
              <li>
                <a
                  href="#offers"
                  className="hover:text-rose-500 transition-colors flex items-center gap-2"
                >
                  <span>{t("footer.offers", "العروض اليومية")}</span>
                  <span className="px-2 py-0.5 text-xs font-black bg-rose-500/10 text-rose-500 rounded-full">
                    HOT
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="#branches"
                  className="hover:text-rose-500 transition-colors"
                >
                  {t("footer.branches", "فروعنا")}
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="hover:text-rose-500 transition-colors"
                >
                  {t("footer.about_us", "من نحن")}
                </a>
              </li>
            </ul>
          </div>

          {/* Opening Hours (3 cols) */}
          <div className="lg:col-span-3 space-y-5">
            <h3 className="text-base sm:text-lg font-black text-foreground uppercase tracking-wider">
              {t("footer.working_hours", "ساعات العمل")}
            </h3>
            <div className="space-y-3 text-sm sm:text-base text-muted-foreground font-medium">
              <div className="flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-rose-500 shrink-0" />
                <span>{t("footer.days", "من السبت إلى الخميس:")}</span>
              </div>
              <p className="text-foreground font-extrabold px-7 text-base sm:text-lg">
                10:00 AM - 02:00 AM
              </p>

              <div className="flex items-center gap-2.5 pt-2">
                <Clock className="w-5 h-5 text-amber-500 shrink-0" />
                <span>{t("footer.friday", "الجمعة:")}</span>
              </div>
              <p className="text-foreground font-extrabold px-7 text-base sm:text-lg">
                01:00 PM - 03:00 AM
              </p>
            </div>
          </div>

          {/* Contact Info (3 cols) */}
          <div className="lg:col-span-3 space-y-5">
            <h3 className="text-base sm:text-lg font-black text-foreground uppercase tracking-wider">
              {t("footer.contact_us", "تواصل معنا")}
            </h3>
            <ul className="space-y-4 text-sm sm:text-base text-muted-foreground font-semibold">
              <li className="flex items-center gap-3.5">
                <div className="p-2.5 bg-muted rounded-xl text-rose-500 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs text-muted-foreground font-bold">
                    {t("footer.hotline", "الخط الساخن")}
                  </span>
                  <a
                    href="tel:19999"
                    className="text-foreground font-black text-base sm:text-lg hover:text-rose-500 transition-colors"
                  >
                    19999
                  </a>
                </div>
              </li>

              <li className="flex items-center gap-3.5">
                <div className="p-2.5 bg-muted rounded-xl text-rose-500 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <a
                  href="mailto:support@aklny.com"
                  className="hover:text-rose-500 transition-colors font-bold"
                >
                  support@aklny.com
                </a>
              </li>

              <li className="flex items-center gap-3.5">
                <div className="p-2.5 bg-muted rounded-xl text-rose-500 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="font-bold">
                  {t("footer.address", "القاهرة، مصر")}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar (Socials + Copyright) */}
        <div className="mt-16 pt-8 border-t-2 border-border/60 flex flex-col sm:flex-row items-center justify-between gap-5 text-sm text-muted-foreground font-semibold">
          <p className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            <span>
              © {new Date().getFullYear()} AKLNY.{" "}
              {t("footer.rights", "جميع الحقوق محفوظة.")}
            </span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline-flex items-center gap-1.5 font-bold">
              {t("footer.made_with", "صنع بـ")}{" "}
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />{" "}
              {t("footer.for_lovers", "لعشاق الأكل")}
            </span>
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-3.5">
            <a
              href="#facebook"
              aria-label="Facebook"
              className="p-3 bg-muted/60 hover:bg-rose-500 hover:text-white rounded-2xl text-foreground transition-all duration-200"
            >
              <CiFacebook className="w-6 h-6" />
            </a>
            <a
              href="#instagram"
              aria-label="Instagram"
              className="p-3 bg-muted/60 hover:bg-rose-500 hover:text-white rounded-2xl text-foreground transition-all duration-200"
            >
              <CiInstagram className="w-6 h-6" />
            </a>
            <a
              href="#twitter"
              aria-label="Twitter"
              className="p-3 bg-muted/60 hover:bg-rose-500 hover:text-white rounded-2xl text-foreground transition-all duration-200"
            >
              <CiTwitter className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
