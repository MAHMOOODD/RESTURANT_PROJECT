import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Menu } from "lucide-react";

export default function AdminLayout() {
  const { pathname } = useLocation();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language.startsWith("ar");
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
  className="h-screen flex relative overflow-x-hidden overflow-y-hidden"
    >
      {/* Sidebar - ثابت على الشاشات الكبيرة */}
      <div className="hidden lg:block sticky top-0 h-screen shrink-0 z-40">
        <AdminSidebar
          isOpenMobile={isMobileOpen}
          onCloseMobile={() => setIsMobileOpen(false)}
        />
      </div>

      {/* للموبايل (لو مكون الـ Sidebar بياخد Drawer من جوا، سيبه يشتغل حسب تصميمه) */}
      <div className="lg:hidden">
        <AdminSidebar
          isOpenMobile={isMobileOpen}
          onCloseMobile={() => setIsMobileOpen(false)}
        />
      </div>

      {/* Main Content Area - بياخد باقي المساحة وما يدخلش تحت السايبر */}
<div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">        {/* Mobile Bar Only */}
        <div className="lg:hidden p-3 sm:p-4 border-b border-border flex items-center justify-between backdrop-blur-md sticky top-0 z-30 ">
          <button
            type="button"
            onClick={() => setIsMobileOpen(true)}
            className="p-2.5 rounded-xl border border-border text-foreground flex items-center gap-2 text-xs font-bold shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            <Menu className="w-4 h-4 text-primary" />
            <span>{t("adminLayout.menu")}</span>
          </button>
        </div>

        {/* محتوى الصفحة الرئيسي */}
        <main className="w-full flex-1 mx-auto max-w-[2000px] p-4 sm:p-6 lg:p-8 animate-in fade-in duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
}