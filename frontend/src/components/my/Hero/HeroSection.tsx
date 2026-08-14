import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight } from "lucide-react";
import heroImg from "@/assets/HeroBG.avif";
export default function HeroSection() {
  const { t, i18n } = useTranslation();

  const isRtl = i18n.dir() === "rtl";
  return (
    <section
      dir={i18n.dir()}
      className="relative w-full h-screen min-h-150 flex flex-col rounded-md items-center justify-center text-center px-6 lg:px-16 overflow-hidden bg-black"
    >
      {/* Background Image Container */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-105"
        style={{
          backgroundImage: `url(${heroImg})`,
        }}
      />
      {/* Dark Overlay - دائماً داكن ليُظهر الصورة والنص بشكل ممتاز في المودين */}
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-black/40" />

      {/* Content - دائماً أبيض للوضوح */}
      <div className="relative z-10 text-white max-w-2xl space-y-6">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight drop-shadow-md">
          {t("HeroSection.hero_title")}{" "}
          <span className="text-primary block font-black">
            {t("HeroSection.hero_subtitle")}
          </span>
        </h1>

        <p className="text-lg md:text-xl text-gray-200 font-light leading-relaxed max-w-xl mx-auto">
          {t("HeroSection.hero_description")}
        </p>
        <div className="pt-2">
          <a
            href="#menu"
            className="group px-8 py-3.5 bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 rounded-xl text-lg font-semibold transition-all duration-200 inline-flex items-center shadow-lg hover:shadow-primary/30"
          >
            {t("HeroSection.order_now")}
            {/* ضبط اتجاه السهم ليناسب العربي والإنجليزي */}
            {isRtl ? (
              <ArrowLeft
                className={`fa-solid ${
                  isRtl
                    ? "fa-arrow-left mr-2 group-hover:-translate-x-1"
                    : "fa-arrow-right ml-2 group-hover:translate-x-1"
                } transition-transform duration-300`}
              ></ArrowLeft>
            ) : (
              <ArrowRight
                className={`fa-solid ${
                  isRtl
                    ? "fa-arrow-left mr-2 group-hover:-translate-x-1"
                    : "fa-arrow-right ml-2 group-hover:translate-x-1"
                } transition-transform duration-300`}
              ></ArrowRight>
            )}
          </a>
        </div>
      </div>
    </section>
  );
}
