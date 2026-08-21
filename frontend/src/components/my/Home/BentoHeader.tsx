import { Flame } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function BentoHeader() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black">
          <Flame className="w-3.5 h-3.5 fill-current" />
          <span>{t("bentoHeader.badge", "Top Sellers")}</span>
        </div>
        <h2 className="text-2xl md:text-4xl font-black text-foreground mt-2">
          {t("bentoHeader.title", "الأكثر طلباً هذا الأسبوع 🚀")}
        </h2>
      </div>
      <p className="text-sm font-bold rounded-2xl text-muted-foreground max-w-sm">
        {t("bentoHeader.subtitle", "اختيارات مجربة ومفضلة لدى آلاف العملاء بشكل يومي.")}
      </p>
    </div>
  );
}