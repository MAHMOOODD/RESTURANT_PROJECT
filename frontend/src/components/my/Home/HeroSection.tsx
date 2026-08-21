import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight } from "lucide-react";
import heroImg from "@/assets/HeroBG.avif";

export default function HeroSection() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";

  return (
    <section
      className="relative w-full h-[85vh] min-h-[550px] mt-5 flex flex-col items-center justify-center text-center px-6 lg:px-16 overflow-hidden rounded-[2.5rem] border border-border bg-black shadow-2xl"
    >
      {/* 🔴 الصورة واضحة بـ opacity-80 في كل المودات */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-1000 hover:scale-105 opacity-80"
        style={{ backgroundImage: `url(${heroImg})` }}
      />

      {/* Dark Vignette Overlay موحد للوضوح */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30" />

      {/* Content Container */}
      <div className="relative z-10 text-white max-w-3xl space-y-6 flex flex-col items-center">
        

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-tight drop-shadow-2xl text-white">
          {t("HeroSection.hero_title")}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-red-400 to-amber-400 block mt-2 font-black">
            {t("HeroSection.hero_subtitle")}
          </span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-gray-200 font-medium leading-relaxed max-w-xl mx-auto">
          {t("HeroSection.hero_description")}
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
          <a
            href="#menu"
            className="group px-8 py-4 bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 rounded-2xl text-base font-black transition-all duration-300 inline-flex items-center gap-3 shadow-xl shadow-primary/30 cursor-pointer"
          >
            <span>{t("HeroSection.order_now")}</span>
            {isRtl ? (
              <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1.5" />
            ) : (
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1.5" />
            )}
          </a>

         
        </div>
      </div>
    </section>
  );
}