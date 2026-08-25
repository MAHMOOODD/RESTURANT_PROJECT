import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight } from "lucide-react";
import heroImg from "@/assets/HeroBG.avif";
import { Link } from "react-router-dom";

export default function HeroSection() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";

  return (
    <section className="relative w-full h-[90vh] min-h-[650px] mt-6 flex flex-col items-center justify-center text-center px-8 lg:px-20 overflow-hidden rounded-[3rem] border border-border bg-black shadow-2xl">
      {/* 🔴 الصورة واضحة بـ opacity-80 في كل المودات */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-1000 hover:scale-105 opacity-80"
        style={{ backgroundImage: `url(${heroImg})` }}
      />

      {/* Dark Vignette Overlay موحد للوضوح */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30" />

      {/* Content Container */}
      <div className="relative z-10 text-white max-w-4xl space-y-8 flex flex-col items-center">
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-tight drop-shadow-2xl text-white">
          {t("HeroSection.hero_title")}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-red-400 to-amber-400 block mt-3 font-black">
            {t("HeroSection.hero_subtitle")}
          </span>
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl text-gray-200 font-medium leading-relaxed max-w-2xl mx-auto">
          {t("HeroSection.hero_description")}
        </p>

        <div className="pt-6 flex flex-col sm:flex-row items-center gap-5">
          <Link
            to="/Products"
            className="group px-10 py-5 bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 rounded-2xl text-lg font-black transition-all duration-300 inline-flex items-center gap-3.5 shadow-2xl shadow-primary/40 cursor-pointer"
          >
            <span>{t("HeroSection.order_now")}</span>
            {isRtl ? (
              <ArrowLeft className="w-6 h-6 transition-transform duration-300 group-hover:-translate-x-1.5" />
            ) : (
              <ArrowRight className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1.5" />
            )}
          </Link>
        </div>
      </div>
    </section>
  );
}
