import { useTranslation } from "react-i18next";
import { User, MapPin, Trash2, Loader2 } from "lucide-react";

interface CartHeaderProps {
  userInfo:
    | { fullName?: string; userName?: string; address?: string ,imageUrl?: string}
    | undefined;
  onClearCart: () => void;
  isClearing: boolean;
}

export function CartHeader({
  userInfo,
  onClearCart,
  isClearing,
}: CartHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="mb-10 p-6 sm:p-7 rounded-3xl bg-card/60 border-2 border-border/80 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-md relative overflow-hidden">
      <div className="flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-orange-500/20 shrink-0">
          {userInfo?.imageUrl ? (
            <img src={userInfo.imageUrl} alt="User" className="w-full h-full rounded-2xl object-cover" />
          ) : (
            <User className="w-8 h-8" />
          )}
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-lg sm:text-xl font-black text-foreground">
              {userInfo?.fullName ||
                userInfo?.userName ||
                t("cart.default_user")}
            </h2>
            <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 text-xs sm:text-sm font-extrabold border border-emerald-500/20">
              {t("cart.active_account")}
            </span>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground font-medium flex items-center gap-2 mt-2">
            <MapPin className="w-5 h-5 text-primary shrink-0" />
            <span>{userInfo?.address || t("cart.default_address")}</span>
          </p>
        </div>
      </div>

      <button
        onClick={onClearCart}
        disabled={isClearing}
        className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-sm sm:text-base font-extrabold text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 border-2 border-rose-500/20 transition-all cursor-pointer disabled:opacity-40 self-end sm:self-auto"
      >
        {isClearing ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Trash2 className="w-5 h-5" />
        )}
        <span>{t("cart.clear_all")}</span>
      </button>
    </div>
  );
}
