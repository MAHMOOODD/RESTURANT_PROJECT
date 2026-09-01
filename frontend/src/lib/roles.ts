// src/lib/roles.ts
// المصدر الوحيد لأسماء الرولز — لازم تفضل مطابقة تماماً لـ Role.cs في الباك اند
export const USER_ROLES = ["Admin", "Manager", "User"] as const;
export type UserRole = (typeof USER_ROLES)[number];

const ROLE_PRIORITY: Record<UserRole, number> = {
  Admin: 3,
  Manager: 2,
  User: 1,
};

function isKnownRole(role: string): role is UserRole {
  return (USER_ROLES as readonly string[]).includes(role);
}

/**
 * بيرجع أعلى رول (أهم صلاحية) من مصفوفة الرولز بتاعة اليوزر، لعرضه كـ badge واحد في الجدول.
 * بيرجع null لو اليوزر مالوش أي رول معروف.
 */
export function getPrimaryRole(roles: string[] | undefined | null): UserRole | null {
  if (!roles || roles.length === 0) return null;

  const known = roles.filter(isKnownRole);
  if (known.length === 0) return null;

  return known.reduce((highest, current) =>
    ROLE_PRIORITY[current] > ROLE_PRIORITY[highest] ? current : highest,
  );
}
