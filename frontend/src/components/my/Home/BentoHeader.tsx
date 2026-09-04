import { useTranslation } from "react-i18next";
import { IoIosRocket } from "react-icons/io";

export default function BentoHeader() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-background border border-primary/25  text-primary text-sm sm:text-base font-black shadow-sm backdrop-blur-sm">
          <span>{t("bentoHeader.badge", "Top Sellers")}</span>
        </div>

        {/*  Main Title */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-primary mt-3 tracking-tight">
          {t("bentoHeader.title", "الأكثر طلباً هذا الأسبوع ")}
          <IoIosRocket className="inline-block w-20 mx-3 h-20 text-primary animate-bounce " />
        </h2>
      </div>

      <p className="text-base sm:text-lg font-bold text-muted-foreground max-w-md leading-relaxed">
        {t(
          "bentoHeader.subtitle",
          "اختيارات مجربة ومفضلة لدى آلاف العملاء بشكل يومي.",
        )}
      </p>
    </div>
  );
}
