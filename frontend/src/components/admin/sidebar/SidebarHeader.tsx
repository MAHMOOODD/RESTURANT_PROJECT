import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {  PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
import dish from "@/assets/vegetarian.png";
import { useSidebar } from "./SidebarContext";

export const HeaderSection = () => {
  const { open, setOpen } = useSidebar();
  const { t } = useTranslation();
  const ToggleIcon = open ? PanelLeftClose : PanelLeftOpen;

  return (
    <div className="flex items-center justify-between gap-2 py-1 relative z-20">
      <Link to="/admin" className="font-normal flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-md shrink-0">
          <img src={dish} alt="AKLNY Logo" className="w-5 h-5 object-contain" />
        </div>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col min-w-0"
          >
            <span className="text-3xl font-black tracking-widest bg-gradient-to-r from-orange-400 via-rose-500 to-amber-400 bg-clip-text text-transparent">
              {t("brand")}
            </span>
            <span className="text-[10px] sm:text-xs text-muted-foreground font-semibold truncate">
              {t("adminHeader.dashboard", "لوحة التحكم")}
            </span>
          </motion.div>
        )}
      </Link>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer shrink-0 hidden lg:block"
        title={
          open
            ? t("adminHeader.closeMenu", "إغلاق القائمة")
            : t("adminHeader.openMenu", "فتح القائمة")
        }
      >
        {open && <ToggleIcon className="w-5 h-5 rtl:rotate-180" />}
      </button>
    </div>
  );
};

export const LogoIcon = () => {
  return (
    <Link to="/admin" className="flex items-center gap-2 py-1 relative z-25">
      <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-md shrink-0">
        <img src={dish} alt="AKLNY Logo" className="w-5 h-5 object-contain" />
      </div>
    </Link>
  );
};
