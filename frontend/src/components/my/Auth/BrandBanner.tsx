import React from "react";
import { useTranslation } from "react-i18next";
import { Sparkles, ChefHat, Utensils } from "lucide-react";
import dish from "@/assets/vegetarian.png";
import { IoIosRocket } from "react-icons/io";

export const BrandBanner: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="lg:col-span-6 relative hidden lg:flex flex-col justify-between p-16 overflow-hidden bg-gradient-to-br from-rose-950 via-zinc-900 to-black text-white">
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex items-center gap-5">
         <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-xl shadow-rose-500/20 group-hover:scale-105 transition-transform duration-300">
            <img src={dish} alt="Logo" className="w-7 h-7 object-contain" />
          </div>
        <div className="flex gap-1.5 flex-col">
          <span className="text-4xl font-black tracking-widest bg-gradient-to-r from-orange-400 via-rose-500 to-amber-300 bg-clip-text text-transparent font-sans">
            {t("brand")}
          </span>
          <span className="text-xs text-zinc-400 tracking-[0.25em] font-bold uppercase">
            {t("brandSub")}
          </span>
        </div>
      </div>

      <div className="relative z-10 my-auto py-8 space-y-6">
        <div className="inline-flex items-center gap-2.5 px-5 py-2.5  rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-bold shadow-inner">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>{t("auth.brand_tagline")}
            <IoIosRocket className="w-5 h-5 mx-2 text-primary inline" />
          </span>
        </div>

        <h2 className="text-4xl lg:text-5xl font-black leading-tight text-white">
          {t("auth.hero_title")}
          <br />
          <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500 bg-clip-text text-transparent">
            {t("auth.hero_subtitle")}
          </span>
          
        </h2>

        <p className="text-zinc-400 text-base sm:text-lg leading-relaxed max-w-md font-medium">
          {t("auth.hero_description")}
        </p>
      </div>

      <div className="relative z-10 pt-8 border-t border-zinc-800/80 flex items-center justify-between text-sm sm:text-base text-zinc-400 font-bold">
        <div className="flex items-center gap-3">
          <ChefHat className="w-6 h-6  text-amber-400" />
          <span>{t("auth.fresh_ingredients")}</span>
        </div>
        <div className="flex items-center gap-3">
          <Utensils className="w-6 mx-3 h-6 text-rose-400" />
          <span>{t("auth.food_lovers")}</span>
        </div>
      </div>
    </div>
  );
};
