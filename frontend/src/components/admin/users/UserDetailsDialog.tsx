// src/components/admin/users/UserDetailsDialog.tsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  X,
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Shield,
  Loader2,
  type LucideIcon,
} from "lucide-react";
import {
  useGetUserByIdQuery,
  useAddRoleMutation,
  useRemoveRoleMutation,
} from "@/store/features/User/Auth";
import { USER_ROLES, type UserRole } from "@/lib/roles";

interface UserDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string | null;
}

const ROLE_ICONS: Record<UserRole, LucideIcon> = {
  Admin: ShieldCheck,
  Manager: Shield,
  User: UserIcon,
};

const ROLE_LABEL_KEYS: Record<UserRole, string> = {
  Admin: "adminUsers.roles.admin",
  Manager: "adminUsers.roles.manager",
  User: "adminUsers.roles.user",
};

const ROLE_ACTIVE_CLASSES: Record<UserRole, string> = {
  Admin: "bg-rose-500/20 border-rose-500 text-rose-500 shadow-rose-500/20",
  Manager: "bg-amber-500/20 border-amber-500 text-amber-500 shadow-amber-500/20",
  User: "bg-blue-500/20 border-blue-500 text-blue-500 shadow-blue-500/20",
};

export function UserDetailsDialog({ open, onOpenChange, userId }: UserDetailsDialogProps) {
  const { t } = useTranslation();

  const {
    data: user,
    isLoading,
    isError,
  } = useGetUserByIdQuery(userId ?? "", { skip: !userId || !open });

  const [addRole] = useAddRoleMutation();
  const [removeRole] = useRemoveRoleMutation();
  const [pendingRole, setPendingRole] = useState<UserRole | null>(null);

  if (!open || !userId) return null;

  const handleToggleRole = async (role: UserRole, hasRole: boolean) => {
    setPendingRole(role);
    try {
      if (hasRole) {
        await removeRole({ userId, roleName: role }).unwrap();
        toast.success(t("adminUsers.modal.removeRoleSuccess"));
      } else {
        await addRole({ userId, roleName: role }).unwrap();
        toast.success(t("adminUsers.modal.addRoleSuccess"));
      }
    } catch {
      toast.error(
        hasRole
          ? t("adminUsers.modal.removeRoleError")
          : t("adminUsers.modal.addRoleError"),
      );
    } finally {
      setPendingRole(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-300"
    >
      <div className="relative w-full max-w-xl max-h-[88vh] flex flex-col rounded-3xl bg-card/95 border border-border/80 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative px-6 pt-6 pb-4 flex items-center justify-between border-b border-border/40 shrink-0 bg-card/50 backdrop-blur-sm">
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {t("adminUsers.modal.title")}
          </h3>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="p-2 rounded-2xl bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200 active:scale-90 border border-border/45 cursor-pointer outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border/60 [&::-webkit-scrollbar-track]:bg-transparent">
          {isLoading ? (
            <p className="text-sm text-muted-foreground font-medium py-8 text-center">
              {t("adminUsers.modal.loading")}
            </p>
          ) : isError || !user ? (
            <p className="text-sm text-rose-500 font-semibold py-8 text-center">
              {t("adminUsers.modal.loadError")}
            </p>
          ) : (
            <>
              <div className="flex items-center gap-3 pb-4 border-b border-border/40">
                <div className="relative h-14 w-14 rounded-2xl overflow-hidden border-2 border-primary/30 shadow-md shrink-0 bg-card flex items-center justify-center">
                  {user.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt={user.userName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserIcon className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-base font-extrabold text-foreground truncate">
                    {user.fullName || user.userName}
                  </h4>
                  <p className="text-xs text-muted-foreground truncate font-mono">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2.5 min-w-0 p-2.5 rounded-xl bg-card/50 border border-border/40">
                  <span className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center border border-border/60 shrink-0 text-primary">
                    <Mail className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] text-muted-foreground font-medium">
                      {t("adminUsers.modal.email")}
                    </p>
                    <p className="text-xs font-bold text-foreground truncate">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 min-w-0 p-2.5 rounded-xl bg-card/50 border border-border/40">
                  <span className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center border border-border/60 shrink-0 text-primary">
                    <Phone className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] text-muted-foreground font-medium">
                      {t("adminUsers.modal.phone")}
                    </p>
                    <p className="text-xs font-bold text-foreground truncate">
                      {user.phoneNumber || t("adminUsers.modal.notProvided")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 min-w-0 p-2.5 rounded-xl bg-card/50 border border-border/40 sm:col-span-2">
                  <span className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center border border-border/60 shrink-0 text-primary">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] text-muted-foreground font-medium">
                      {t("adminUsers.modal.address")}
                    </p>
                    <p className="text-xs font-bold text-foreground truncate">
                      {user.address || t("adminUsers.modal.notProvided")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <h4 className="text-sm font-bold text-foreground">
                    {t("adminUsers.modal.rolesTitle")}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {t("adminUsers.modal.rolesDesc")}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  {USER_ROLES.map((role) => {
                    const hasRole = user.roles.includes(role);
                    const Icon = ROLE_ICONS[role];
                    const isPending = pendingRole === role;

                    return (
                      <button
                        key={role}
                        type="button"
                        disabled={isPending}
                        onClick={() => handleToggleRole(role, hasRole)}
                        className="flex flex-col items-center gap-2 group cursor-pointer outline-none disabled:cursor-wait"
                      >
                        <div
                          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all duration-200 border ${
                            hasRole
                              ? `${ROLE_ACTIVE_CLASSES[role]} border-2 shadow-lg scale-105`
                              : "bg-card/40 border-border/40 text-muted-foreground/40 opacity-50 group-hover:opacity-80 group-hover:scale-105"
                          }`}
                        >
                          {isPending ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                          )}
                        </div>
                        <span
                          className={`text-[10px] sm:text-[11px] font-bold leading-tight text-center ${
                            hasRole ? "text-foreground" : "text-muted-foreground/50"
                          }`}
                        >
                          {t(ROLE_LABEL_KEYS[role])}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="px-6 py-4 border-t border-border/40 bg-card/80 backdrop-blur-md shrink-0 flex items-center justify-end">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-5 py-2.5 rounded-xl border border-border/80 bg-background/50 hover:bg-muted text-foreground font-semibold text-sm transition-all duration-200 active:scale-95 cursor-pointer outline-none"
          >
            {t("adminUsers.modal.close")}
          </button>
        </div>
      </div>
    </div>
  );
}
