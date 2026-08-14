import { useTranslation } from "react-i18next";
import { useEffect } from "react";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || "ar";

  const changeLanguage = (lang: "en" | "ar") => {
    i18n.changeLanguage(lang);
    document.documentElement.lang = lang;
    localStorage.setItem("i18nextLng", lang);
  };

  // ضبط الاتجاه واللغة في العنصر الرئيسي عند التحميل الأول
  useEffect(() => {
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  return (
    <div className="inline-flex items-center gap-1 p-1 bg-muted rounded-lg border border-border">
      <button
        type="button"
        onClick={() => changeLanguage("ar")}
        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 cursor-pointer ${
          currentLang === "ar"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground hover:bg-background/50"
        }`}
      >
        عربي
      </button>

      <button
        type="button"
        onClick={() => changeLanguage("en")}
        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 cursor-pointer ${
          currentLang === "en"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground hover:bg-background/50"
        }`}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;
