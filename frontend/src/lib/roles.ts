// src/lib/roles.ts
export const USER_ROLES = ["Admin", "Manager", "User", "Cashier"] as const;
export type UserRole = (typeof USER_ROLES)[number];

const ROLE_PRIORITY: Record<UserRole, number> = {
  Admin: 4,
  Manager: 3,
  Cashier: 2,
  User: 1,
};

function isKnownRole(role: string): role is UserRole {
  return (USER_ROLES as readonly string[]).includes(role);
}


export function getPrimaryRole(roles: string[] | undefined | null): UserRole | null {
  if (!roles || roles.length === 0) return null;

  const known = roles.filter(isKnownRole);
  if (known.length === 0) return null;

  return known.reduce((highest, current) =>
    ROLE_PRIORITY[current] > ROLE_PRIORITY[highest] ? current : highest,
  );
}