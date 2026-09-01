import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useSidebar } from "./SidebarContext";

interface AdminSidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

interface SidebarBodyProps extends AdminSidebarProps {
  children: React.ReactNode;
  className?: string;
}

export const SidebarBody = ({
  children,
  isOpenMobile,
  onCloseMobile,
  className,
}: SidebarBodyProps) => {
  return (
    <>
      <DesktopSidebar className={className}>{children}</DesktopSidebar>
      <MobileSidebar
        isOpenMobile={isOpenMobile}
        onCloseMobile={onCloseMobile}
        className={className}
      >
        {children}
      </MobileSidebar>
    </>
  );
};

const DesktopSidebar = ({
  className,
  children,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const { open, setOpen, animate } = useSidebar();

  const handleMouseEnter = () => {
    if (!open) {
      setOpen(true);
    }
  };

  return (
    <motion.div
      onMouseEnter={handleMouseEnter}
      className={cn(
        "h-screen px-3 py-4 hidden lg:flex lg:flex-col bg-card border-r rtl:border-r-0 rtl:border-l border-border shrink-0 justify-between relative overflow-hidden z-20 shadow-[4px_0_24px_-8px_rgba(0,0,0,0.35)]",
        className,
      )}
      animate={{
        width: animate ? (open ? "260px" : "76px") : "260px",
      }}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
};

const MobileSidebar = ({
  children,
  isOpenMobile,
  onCloseMobile,
  className,
}: SidebarBodyProps) => {
  const { open, setOpen } = useSidebar();
  const { i18n } = useTranslation();
  const isArabic = i18n.language.startsWith("ar");

  const isDrawerOpen = isOpenMobile !== undefined ? isOpenMobile : open;
  const handleClose = onCloseMobile || (() => setOpen(false));

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: isArabic ? "100%" : "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: isArabic ? "100%" : "-100%" }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className={cn(
              "fixed inset-y-0 h-full w-[280px] sm:w-[320px] bg-card p-5 z-50 flex flex-col justify-between border-r rtl:border-r-0 rtl:border-l border-border shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-y-auto",
              isArabic ? "right-0" : "left-0",
              className,
            )}
          >
            <div
              className={cn(
                "absolute top-5 z-50 text-muted-foreground hover:text-foreground cursor-pointer p-1.5 rounded-xl hover:bg-muted/80 transition-colors duration-200 active:scale-95",
                isArabic ? "left-4" : "right-4",
              )}
              onClick={handleClose}
            >
              <X className="w-5 h-5" />
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};