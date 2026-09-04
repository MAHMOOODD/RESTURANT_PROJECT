// src/components/admin/users/RoleBadge.tsx
import { useTranslation } from "react-i18next";
import { User2, Shield, Crown, type LucideIcon, ComputerIcon } from "lucide-react";
import { getPrimaryRole, type UserRole } from "@/lib/roles";

interface RoleBadgeProps {
  roles: string[];
}

const ROLE_ICONS: Record<UserRole, LucideIcon> = {
  Admin: Crown,         
  Manager: Shield,
  User: User2, 
  Cashier: ComputerIcon, 
};

const ROLE_CLASSES: Record<UserRole, string> = {
  Admin: "bg-amber-500/15 text-amber-400 dark:text-amber-400 border border-amber-500/30",
  Manager: "bg-rose-500/15 text-rose-500 dark:text-rose-400 border border-rose-500/30",
  User: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30",
  Cashier: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30",
};

const ROLE_LABEL_KEYS: Record<UserRole, string> = {
  Admin: "adminUsers.roles.admin",
  Manager: "adminUsers.roles.manager",
  Cashier: "adminUsers.roles.cashier",
  User: "adminUsers.roles.user",
};

export function RoleBadge({ roles }: RoleBadgeProps) {
  const { t } = useTranslation();
  const primary = getPrimaryRole(roles);

  if (!primary) {
    return (
      <span className="inline-flex items-center font-bold py-1.5 px-3.5 rounded-full text-xs sm:text-sm bg-muted text-muted-foreground">
        {t("adminUsers.table.noRole")}
      </span>
    );
  }

  const Icon = ROLE_ICONS[primary];

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold py-1.5 px-3.5 rounded-2xl text-xs sm:text-sm shadow-sm transition-all ${ROLE_CLASSES[primary]}`}
    >
      <Icon className="h-4 w-4" />
      {t(ROLE_LABEL_KEYS[primary])}
    </span>
  );
}