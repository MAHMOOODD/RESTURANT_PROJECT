import { MapPin, User, Phone, Edit3 } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type {UserInfo } from "@/types/types";

interface ShippingSectionProps {
  userInfo: UserInfo;
}

export function ShippingSection({ userInfo }: ShippingSectionProps) {
  const { t } = useTranslation();

  return (
    <div className="p-8 rounded-3xl bg-card/70 backdrop-blur-xl border border-border/80 shadow-md relative">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <MapPin className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-black text-foreground">
            {t("checkout.shipping.title")}
          </h2>
        </div>

        <Link
          to="/profile"
          className="flex items-center gap-2 text-xs font-bold text-primary hover:underline bg-primary/10 px-4 py-2 rounded-xl border border-primary/20"
        >
          <Edit3 className="w-4 h-4" />
          <span>{t("checkout.shipping.edit")}</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm font-medium">
        <div className="p-5 rounded-2xl bg-background/80 border border-border/60 flex items-center gap-4">
          <User className="w-6 h-6 text-muted-foreground shrink-0" />
          <div>
            <span className="text-xs text-muted-foreground block mb-1">
              {t("checkout.shipping.name")}
            </span>
            <span className="font-bold text-foreground text-base">
              {userInfo.fullName || userInfo.userName}
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-background/80 border border-border/60 flex items-center gap-4">
          <Phone className="w-6 h-6 text-muted-foreground shrink-0" />
          <div>
            <span className="text-xs text-muted-foreground block mb-1">
              {t("checkout.shipping.phone")}
            </span>
            <span className="font-bold text-foreground text-base">
              {userInfo.phoneNumber || (
                <span className="text-rose-500">
                  {t("checkout.shipping.not_specified")}
                </span>
              )}
            </span>
          </div>
        </div>

        <div className="sm:col-span-2 p-5 rounded-2xl bg-background/80 border border-border/60 flex items-center gap-4">
          <MapPin className="w-6 h-6 text-muted-foreground shrink-0" />
          <div className="w-full">
            <span className="text-xs text-muted-foreground block mb-1">
              {t("checkout.shipping.address")}
            </span>
            <p className="font-bold text-foreground text-base">
              {userInfo.address || (
                <span className="text-rose-500">
                  {t("checkout.shipping.no_address")}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}