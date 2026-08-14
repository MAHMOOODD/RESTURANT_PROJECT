import React from "react";
import { useTranslation } from "react-i18next";
import {
  Flame,
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

import { CiFacebook , CiInstagram , CiTwitter} from "react-icons/ci";

export const Footer: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  return (
    <footer className="w-full bg-card text-foreground border-t border-border/60 relative overflow-hidden transition-colors duration-300">
      {/* Glow Backdrops - لمسات إضاءة خلفية ناعمة */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Value Badges - شريط الميزات السريعة */}
      <div className="border-b border-border/60 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-start">
            <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="p-3 bg-rose-500/10 text-rose-500 rounded-2xl shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-foreground">
                  {t("footer.fast_delivery", "توصيل سريع وساخن")}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t("footer.fast_delivery_desc", "ينافس سرعة الجوع لديك")}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-foreground">
                  {t("footer.best_quality", "أعلى جودة طعام")}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t("footer.best_quality_desc", "مكونات طازجة يومياً 100%")}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-foreground">
                  {t("footer.secure_pay", "دفع آمن وسهل")}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t("footer.secure_pay_desc", "كاش أو أونلاين بكل أمان")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand Info & Newsletter (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-tr from-rose-600 via-orange-500 to-amber-400 rounded-2xl shadow-lg shadow-rose-500/20">
                <Flame className="w-6 h-6 text-white fill-white/20" />
              </div>
              <span className="text-2xl font-black tracking-widest bg-gradient-to-r from-orange-400 via-rose-500 to-amber-400 bg-clip-text text-transparent">
                AKLNY
              </span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              {t(
                "footer.brand_desc",
                "نقدم لك تجربة أكل سريع لا تُنسى! أشهى البرجر والوجبات المحضرة بشغف وبأجود المكونات الطازجة يومياً."
              )}
            </p>

            {/* Newsletter Input */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-foreground block">
                {t("footer.subscribe_title", "اشترك للحصول على خصومات حصرية 🔥")}
              </span>
              <form onSubmit={(e) => e.preventDefault()} className="relative flex items-center">
                <input
                  type="email"
                  placeholder={t("footer.email_placeholder", "أدخل بريدك الإلكتروني")}
                  className={`w-full py-2.5 ${
                    isRtl ? "pr-3.5 pl-12" : "pl-3.5 pr-12"
                  } bg-muted/60 border border-input rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-rose-500 transition-all`}
                />
                <button
                  type="submit"
                  className={`absolute ${
                    isRtl ? "left-1.5" : "right-1.5"
                  } p-2 bg-gradient-to-r from-rose-600 to-orange-500 hover:opacity-90 text-white rounded-lg transition-all shadow-md cursor-pointer`}
                  aria-label="Subscribe"
                >
                  <Send className={`w-3.5 h-3.5 ${isRtl ? "rotate-180" : ""}`} />
                </button>
              </form>
            </div>
          </div>

          {/* Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
              {t("footer.quick_links", "روابط سريعة")}
            </h3>
            <ul className="space-y-2.5 text-xs text-muted-foreground font-medium">
              <li>
                <a href="#menu" className="hover:text-rose-500 transition-colors">
                  {t("footer.menu", "قائمة الطعام")}
                </a>
              </li>
              <li>
                <a href="#offers" className="hover:text-rose-500 transition-colors flex items-center gap-1.5">
                  <span>{t("footer.offers", "العروض اليومية")}</span>
                  <span className="px-1.5 py-0.5 text-[9px] font-bold bg-rose-500/10 text-rose-500 rounded-full">
                    HOT
                  </span>
                </a>
              </li>
              <li>
                <a href="#branches" className="hover:text-rose-500 transition-colors">
                  {t("footer.branches", "فروعنا")}
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-rose-500 transition-colors">
                  {t("footer.about_us", "من نحن")}
                </a>
              </li>
            </ul>
          </div>

          {/* Opening Hours (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
              {t("footer.working_hours", "ساعات العمل")}
            </h3>
            <div className="space-y-2 text-xs text-muted-foreground font-medium">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{t("footer.days", "من السبت إلى الخميس:")}</span>
              </div>
              <p className="text-foreground font-semibold px-6">10:00 AM - 02:00 AM</p>

              <div className="flex items-center gap-2 pt-1">
                <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{t("footer.friday", "الجمعة:")}</span>
              </div>
              <p className="text-foreground font-semibold px-6">01:00 PM - 03:00 AM</p>
            </div>
          </div>

          {/* Contact Info (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
              {t("footer.contact_us", "تواصل معنا")}
            </h3>
            <ul className="space-y-3 text-xs text-muted-foreground font-medium">
              <li className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-lg text-rose-500 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[10px] text-muted-foreground">{t("footer.hotline", "الخط الساخن")}</span>
                  <a href="tel:19999" className="text-foreground font-bold hover:text-rose-500 transition-colors">
                    19999
                  </a>
                </div>
              </li>

              <li className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-lg text-rose-500 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <a href="mailto:support@aklny.com" className="hover:text-rose-500 transition-colors">
                  support@aklny.com
                </a>
              </li>

              <li className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-lg text-rose-500 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <span>{t("footer.address", "القاهرة، مصر")}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar (Socials + Copyright) */}
        <div className="mt-12 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground font-medium">
          <p className="flex items-center gap-1">
            <span>© {new Date().getFullYear()} AKLNY. {t("footer.rights", "جميع الحقوق محفوظة.")}</span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline-flex items-center gap-1">
              {t("footer.made_with", "صنع بـ")} <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" /> {t("footer.for_lovers", "لعشاق الأكل")}
            </span>
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            <a
              href="#facebook"
              aria-label="Facebook"
              className="p-2 bg-muted/60 hover:bg-rose-500 hover:text-white rounded-xl text-foreground transition-all duration-200"
            >
              <CiFacebook className="w-4 h-4" />
            </a>
            <a
              href="#instagram"
              aria-label="Instagram"
              className="p-2 bg-muted/60 hover:bg-rose-500 hover:text-white rounded-xl text-foreground transition-all duration-200"
            >
              <CiInstagram className="w-4 h-4" />
            </a>
            <a
              href="#twitter"
              aria-label="Twitter"
              className="p-2 bg-muted/60 hover:bg-rose-500 hover:text-white rounded-xl text-foreground transition-all duration-200"
            >
              <CiTwitter className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};