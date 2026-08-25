import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { UtensilsCrossed, Home, ArrowLeft, ArrowRight, Sparkles } from "lucide-react";

export default function NotFound() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <main 
      dir={isArabic ? "rtl" : "ltr"} 
      className="min-h-[80vh] flex items-center justify-center px-4 sm:px-8 py-12"
    >
      <div className="relative max-w-2xl w-full text-center space-y-8 bg-card/60 p-8 sm:p-14 rounded-[3rem] border border-primary/20 shadow-2xl backdrop-blur-3xl overflow-hidden">
        
        {/* Glow Effects */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-black shadow-inner">
          <Sparkles className="w-4 h-4" />
          <span>{t("notfound.badge", "خطأ 404")}</span>
        </div>

        {/* Icon / Illustration Box */}
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-[2.5rem] bg-primary/10 border border-primary/30 text-primary flex items-center justify-center mx-auto shadow-xl">
          <UtensilsCrossed className="w-16 h-16 sm:w-20 sm:h-20 animate-pulse" />
        </div>

        {/* Titles */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl font-black text-foreground tracking-tight">
            {t("notfound.title", "عفواً! الصفحة غير موجودة")}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground font-medium max-w-md mx-auto leading-relaxed">
            {t("notfound.subtitle", "يبدو أن الطبق الذي تبحث عنه غير موجود في القائمة، أو تم نقله إلى مكان آخر.")}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-black text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-primary/25 hover:opacity-95 transition-all cursor-pointer"
          >
            <Home className="w-5 h-5" />
            <span>{t("notfound.homeBtn", "العودة للرئيسية")}</span>
            {isArabic ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </Link>
        </div>

      </div>
    </main>
  );
}