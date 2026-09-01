import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSidebar } from "./SidebarContext";

interface SidebarCustomLinkProps {
  link: { label: string; href: string; icon: React.ReactNode };
  className?: string;
  active?: boolean;
  onClick?: () => void;
}

export const SidebarCustomLink = ({
  link,
  className,
  active,
  onClick,
}: SidebarCustomLinkProps) => {
  const { open, animate } = useSidebar();
  return (
    <Link
      to={link.href}
      onClick={onClick}
      title={!open ? link.label : undefined}
      className={cn(
        "relative flex items-center justify-start gap-3 group/sidebar py-2.5 px-3 rounded-2xl transition-all duration-200 ease-out font-medium text-xs sm:text-sm",
        active
          ? "bg-primary text-primary-foreground font-bold shadow-md shadow-primary/25"
          : "text-muted-foreground hover:bg-muted/70 hover:text-foreground active:scale-[0.98]",
        className,
      )}
    >
      {active && (
        <motion.span
          layoutId="sidebar-active-indicator"
          className="absolute inset-y-1.5 -left-1 rtl:left-auto rtl:-right-1 w-1 rounded-full bg-primary-foreground/70"
          transition={{ duration: 0.2, ease: "easeOut" }}
        />
      )}
      <div
        className={cn(
          "shrink-0 flex items-center justify-center w-5 h-5 transition-transform duration-200",
          !active && "group-hover/sidebar:scale-110",
        )}
      >
        {link.icon}
      </div>
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="truncate whitespace-pre group-hover/sidebar:translate-x-1 rtl:group-hover/sidebar:-translate-x-1 transition-transform duration-200 ease-out"
      >
        {String(link.label)}
      </motion.span>
    </Link>
  );
};