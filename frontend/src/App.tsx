import AppRouter from "./routes/AppRouter";
import "./i18n/config";
import { Toaster } from "@/components/ui/sonner";
import { useTranslation } from "react-i18next";
import bg from "@/assets/bg.avif";
import {ScrollToTop} from "./components/ui/ScrollToTop";

export default function App() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  return (
    <div className="relative min-h-screen w-full text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
      <Toaster position={isAr ? "bottom-left" : "bottom-right"} />

      {/* 🌟 Fixed Wallpaper Container with Dynamic Overlays */}
      <div className="fixed inset-0 pointer-events-none z-0 h-screen w-screen overflow-hidden">
        <img
          src={bg}
          alt=""
          className="h-full w-full blur-lg object-cover object-center"
        />

        {/* Dynamic Light/Dark Overlay */}
        <div className="absolute inset-0 bg-white/70 dark:bg-black/75 backdrop-blur-[2px] transition-colors duration-300" />

        {/* Dynamic Red Glow */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at top, rgba(255,42,75,0.12), transparent 70%)",
          }}
        />

        {/* Bottom Fade */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent dark:via-black/20 to-white/40 dark:to-black/70" />
      </div>

      {/* 🚀 App Content Above Background */}
      <div className="relative z-10">
        <AppRouter />
      </div>

      <ScrollToTop />
    </div>
  );
}