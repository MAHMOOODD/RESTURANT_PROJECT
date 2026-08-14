import React from "react";
import { useTranslation } from "react-i18next";
import { Flame, Sparkles, ChefHat, Utensils } from "lucide-react";

export const BrandBanner: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="lg:col-span-6 relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-gradient-to-br from-rose-950 via-zinc-900 to-black text-white">
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex items-center gap-3.5">
        <div className="relative p-3 bg-gradient-to-tr from-rose-600 via-orange-500 to-amber-400 rounded-2xl shadow-lg shadow-rose-600/30">
          <Flame className="w-7 h-7 text-white fill-white/20 animate-bounce" />
        </div>
        <div className="flex gap-1 flex-col">
          <span className="text-3xl font-black tracking-widest bg-gradient-to-r from-orange-400 via-rose-500 to-amber-300 bg-clip-text text-transparent font-sans">
            {t("brand")}
          </span>
          <span className="text-[10px] text-zinc-400 tracking-[0.25em] font-semibold uppercase">
            {t("brandSub")}
          </span>
        </div>
      </div>

      <div className="relative z-10 my-auto py-6 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold shadow-inner">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{t("auth.brand_tagline")}</span>
        </div>

        <h2 className="text-3xl lg:text-4xl font-black leading-tight text-white">
          {t("auth.hero_title")}
          <br />
          <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500 bg-clip-text text-transparent">
            {t("auth.hero_subtitle")}
          </span>
          😋
        </h2>

        <p className="text-zinc-400 text-sm leading-relaxed max-w-sm font-medium">
          {t("auth.hero_description")}
        </p>
      </div>

      <div className="relative z-10 pt-6 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400 font-semibold">
        <div className="flex items-center gap-2">
          <ChefHat className="w-4 h-4 text-amber-400" />
          <span>{t("auth.fresh_ingredients")}</span>
        </div>
        <div className="flex items-center gap-2">
          <Utensils className="w-4 h-4 text-rose-400" />
          <span>{t("auth.food_lovers")}</span>
        </div>
      </div>
    </div>
  );
};