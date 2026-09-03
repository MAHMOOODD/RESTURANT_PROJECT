import { useTranslation } from "react-i18next";
import { User, Mail, Phone, MapPin } from "lucide-react";
import { useGetUserByIdQuery } from "@/store/features/User/Auth";

interface UserInfoCardProps {
  appUserId: string | undefined;
}

export function UserInfoCard({ appUserId }: UserInfoCardProps) {
  const { t } = useTranslation();
  const { data: user, isLoading, isError } = useGetUserByIdQuery(appUserId ?? "", {
    skip: !appUserId,
  });

  return (
    <div className="rounded-2xl bg-muted/40 border border-border/50 p-4 sm:p-5 space-y-4">
      <div className="flex items-center gap-3 border-b border-border/40 pb-4">
        <div className="relative h-14 w-14 rounded-2xl overflow-hidden border-2 border-primary/30 shadow-md shrink-0 bg-card flex items-center justify-center">
          {user?.imageUrl ? (
            <img
              src={user.imageUrl}
              alt={user.userName || "User"}
              className="h-full w-full object-cover"
            />
          ) : (
            <User className="h-6 w-6 text-muted-foreground" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              {t("adminOrders.userDetails.title")}
            </span>
          </div>
          <h4 className="text-base font-extrabold text-foreground truncate mt-1">
            {user?.fullName || user?.userName || t("adminOrders.userDetails.notProvided")}
          </h4>
          <p className="text-xs text-muted-foreground truncate font-mono">
            {user?.email || "—"}
          </p>
        </div>
      </div>

      {isLoading ? (
        <p className="text-xs text-muted-foreground font-medium py-2 text-center">
          {t("adminOrders.userDetails.loading")}
        </p>
      ) : isError || !user ? (
        <p className="text-xs text-rose-500 font-semibold py-2 text-center">
          {t("adminOrders.userDetails.notProvided")}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="flex items-center gap-2.5 min-w-0 p-2.5 rounded-xl bg-card/50 border border-border/40">
            <span className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center border border-border/60 shrink-0 text-primary">
              <User className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] text-muted-foreground font-medium">
                {t("adminOrders.userDetails.username")}
              </p>
              <p className="text-xs font-bold text-foreground truncate">{user.userName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 min-w-0 p-2.5 rounded-xl bg-card/50 border border-border/40">
            <span className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center border border-border/60 shrink-0 text-primary">
              <Mail className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] text-muted-foreground font-medium">
                {t("adminOrders.userDetails.email")}
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
                {t("adminOrders.userDetails.phone")}
              </p>
              <p className="text-xs font-bold text-foreground truncate">
                {user.phoneNumber || t("adminOrders.userDetails.notProvided")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 min-w-0 p-2.5 rounded-xl bg-card/50 border border-border/40">
            <span className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center border border-border/60 shrink-0 text-primary">
              <MapPin className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] text-muted-foreground font-medium">
                {t("adminOrders.userDetails.address")}
              </p>
              <p className="text-xs font-bold text-foreground truncate">
                {user.address || t("adminOrders.userDetails.notProvided")}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}