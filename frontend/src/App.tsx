import AppRouter from "./routes/AppRouter";
import "./i18n/config";
import { Toaster } from "@/components/ui/sonner";

import { useTranslation } from "react-i18next";
import ScrollToTop from "./components/ui/ScrollToTop";
export default function App() {
  const { i18n } = useTranslation();

  const isAr = i18n.language === "ar";
  return (
    <div className="min-h-screen w-full bg-[#05040a] text-foreground antialiased relative overflow-x-hidden">
      <Toaster position={isAr ? "bottom-left" : "bottom-right"} />
      {/* 🌟 الخلفية المطابقة للصورة تماماً للموقع كله */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[#05040a]">
        {/* التدرج اللكيلي الداكن */}
        <div className="absolute inset-0 bg-linear-to-b from-[#090712] via-[#05040a] to-[#030206]" />

        {/* التوهج البنفسجي الناعم جداً في الأسفل والوسط (نفس الصورة) */}
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-212.5 h-112.5 bg-[#2e0854]/30 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-100 bg-[#1e0538]/20 rounded-full blur-[150px]" />
      </div>

      <AppRouter />
      <ScrollToTop />
    </div>
  );
}
