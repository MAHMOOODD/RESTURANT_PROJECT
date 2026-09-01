// src/components/admin/users/UserTable.tsx
import { useTranslation } from "react-i18next";
import { Info, Phone, MapPin, UserX, User as UserIcon } from "lucide-react";
import type { GetUserInfo } from "@/store/features/User/Auth";
import { RoleBadge } from "./RoleBadge";

interface UserTableProps {
  users: GetUserInfo[];
  onViewDetails: (userId: string) => void;
}

export function UserTable({ users, onViewDetails }: UserTableProps) {
  const { t } = useTranslation();

  if (!users.length) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-card">
        <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-4 border border-border shadow-inner">
          <UserX className="h-8 w-8 sm:h-10 sm:w-10 stroke-[1.5]" />
        </div>
        <p className="text-base sm:text-lg font-semibold text-foreground">
          {t("adminUsers.noUsers")}
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile View: Cards */}
      <div className="grid grid-cols-1 gap-3 p-4 md:hidden bg-card/50">
        {users.map((u) => (
          <div
            key={u.id}
            onClick={() => onViewDetails(u.id)}
            className="flex flex-col gap-3 p-4 rounded-2xl bg-card border border-border shadow-sm cursor-pointer active:scale-[0.99] transition-transform"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center border border-border shrink-0 overflow-hidden">
                  {u.imageUrl ? (
                    <img
                      src={u.imageUrl}
                      alt={u.userName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserIcon className="h-5 w-5 text-muted-foreground" />
                  )}
                </span>
                <div className="min-w-0">
                  <p className="font-bold text-sm text-foreground truncate">{u.userName}</p>
                  <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                </div>
              </div>
              <RoleBadge roles={u.roles} />
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="truncate">
                {u.phoneNumber || t("adminUsers.table.noPhone")}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/60">
              <div className="flex items-center gap-2 text-xs text-muted-foreground min-w-0">
                <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="truncate">
                  {u.address || t("adminUsers.table.noAddress")}
                </span>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails(u.id);
                }}
                className="h-9 px-3 rounded-xl border border-border bg-background text-xs font-semibold gap-1.5 flex items-center justify-center transition-all cursor-pointer active:scale-95 shrink-0"
              >
                <Info className="h-4 w-4" />
                <span>{t("adminUsers.table.details")}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View: Native Table */}
      <div className="hidden md:block w-full h-full bg-card">
        <table className="w-full h-full border-collapse">
          <thead className="bg-muted/80 sticky top-0 z-10 backdrop-blur-md border-b border-border">
            <tr className="hover:bg-transparent border-none">
              <th className="py-4 px-6 text-start font-bold text-sm text-foreground">
                {t("adminUsers.table.user")}
              </th>
              <th className="py-4 px-6 text-start font-bold text-sm text-foreground">
                {t("adminUsers.table.email")}
              </th>
              <th className="py-4 px-6 text-start font-bold text-sm text-foreground">
                {t("adminUsers.table.phone")}
              </th>
              <th className="py-4 px-6 text-start font-bold text-sm text-foreground">
                {t("adminUsers.table.address")}
              </th>
              <th className="py-4 px-6 text-start font-bold text-sm text-foreground">
                {t("adminUsers.table.roles")}
              </th>
              <th className="py-4 px-6 text-start font-bold text-sm text-foreground">
                {t("adminUsers.table.actions")}
              </th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr
                key={u.id}
                onClick={() => onViewDetails(u.id)}
                className="group hover:bg-muted/30 transition-all duration-200 border-border/40 cursor-pointer"
              >
                <td className="py-4 px-6 text-start align-middle max-w-[220px]">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center border border-border shrink-0 overflow-hidden">
                      {u.imageUrl ? (
                        <img
                          src={u.imageUrl}
                          alt={u.userName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                      )}
                    </span>
                    <span className="font-semibold text-foreground text-sm truncate">
                      {u.userName}
                    </span>
                  </div>
                </td>

                <td className="py-4 px-6 text-start align-middle max-w-[220px]">
                  <span className="text-sm text-muted-foreground truncate block" title={u.email}>
                    {u.email}
                  </span>
                </td>

                <td className="py-4 px-6 text-start align-middle whitespace-nowrap">
                  <span className="text-sm text-muted-foreground">
                    {u.phoneNumber || t("adminUsers.table.noPhone")}
                  </span>
                </td>

                <td className="py-4 px-6 text-start align-middle max-w-xs">
                  <span
                    className="text-sm text-muted-foreground truncate block"
                    title={u.address}
                  >
                    {u.address || t("adminUsers.table.noAddress")}
                  </span>
                </td>

                <td className="py-4 px-6 text-start align-middle whitespace-nowrap">
                  <RoleBadge roles={u.roles} />
                </td>

                <td className="py-4 text-center flex justify-center -ms-14 align-middle whitespace-nowrap">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetails(u.id);
                    }}
                    className="h-10 w-10 rounded-xl border border-border bg-background hover:bg-blue-500/10 hover:border-blue-500/40 hover:text-blue-600 transition-all shadow-sm active:scale-95 cursor-pointer flex items-center justify-center outline-none"
                    title={t("adminUsers.table.details")}
                  >
                    <Info className="h-5 w-5 stroke-[1.8]" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
