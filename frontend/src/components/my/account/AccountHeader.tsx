import { Sparkles, Camera, ShieldCheck, Crown, Shield, User2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { UserInfo } from "@/types/types";



interface AccountHeaderProps {
  userInfo: UserInfo | undefined;
  roles: UserInfo["roles"] | undefined;
  currentImagePreview: string | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function AccountHeader({
  userInfo,
  roles,
  currentImagePreview,
  fileInputRef,
  handleImageChange,
}: AccountHeaderProps) {
  const { t } = useTranslation();
  console.log("AccountHeader roles:", roles); // Debugging line to check roles

  const getRoleBadgeStyle = (role: string) => {
    const normalized = role.toLowerCase();
    if (normalized.includes("admin")) {
      return {
        icon: <Crown className="w-4 h-4 text-amber-400" />,
        style: "bg-amber-500/10 text-amber-500 border-amber-500/30",
      };
    }
    if (normalized.includes("manager")) {
      return {
        icon: <Shield className="w-4 h-4 text-rose-400" />,
        style: "bg-rose-500/10 text-rose-500 border-rose-500/30",
      };
    }
    return {
      icon: <User2 className="w-4 h-4 text-emerald-400" />,
      style: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    };
  };

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] border border-primary/20 bg-linear-to-r from-primary/10 via-card to-card p-8 sm:p-12 shadow-2xl backdrop-blur-2xl">
      <div className="absolute top-0 right-0 -z-10 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
        <div className="flex flex-col sm:flex-row items-center gap-8">
          {/* Profile Image & Upload Widget */}
          <div className="relative group">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-[2rem] bg-primary/20 border-2 border-primary/40 flex items-center justify-center text-primary font-black text-4xl sm:text-5xl shadow-2xl shadow-primary/20 overflow-hidden cursor-pointer transition-transform duration-300 group-hover:scale-105 relative"
            >
              {currentImagePreview ? (
                <img
                  src={currentImagePreview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                userInfo?.fullName
                  ? userInfo.fullName.charAt(0).toUpperCase()
                  : userInfo?.userName?.charAt(0).toUpperCase() || "U"
              )}

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Camera className="w-8 h-8" />
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />

            <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-2 rounded-2xl shadow-lg border-2 border-card pointer-events-none">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="space-y-3 text-center sm:text-start">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold">
              <Sparkles className="w-4 h-4" />
              <span>{t("account.badge", "إعدادات الحساب")}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
              {userInfo?.fullName || userInfo?.userName}
            </h1>
            <p className="text-sm text-muted-foreground font-medium">
              {userInfo?.email}
            </p>
          </div>
        </div>

        {/* Roles */}
        {roles && roles.length > 0 && (
          <div className="flex sm:flex-col items-center sm:items-end gap-2.5 pt-4 sm:pt-0 border-t sm:border-t-0 border-border/50 w-full sm:w-auto justify-center">
            <span className="text-xs font-bold text-muted-foreground">
              {t("account.rolesLabel", "الصلاحيات")}
            </span>
            <div className="flex flex-wrap gap-2">
              {roles?.map((role: string) => {
                const { icon, style } = getRoleBadgeStyle(role);
                return (
                  <span
                    key={role}
                    className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl border text-xs sm:text-sm font-bold capitalize transition-all hover:scale-105 ${style}`}
                  >
                    {icon}
                    <span>{role}</span>
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}