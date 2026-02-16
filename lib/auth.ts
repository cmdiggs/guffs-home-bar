import { cookies } from "next/headers";

const ADMIN_COOKIE = "guffs_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "";
}

export async function isAdmin(): Promise<boolean> {
  /* When ADMIN_PASSWORD is not set, allow access without login */
  if (!process.env.ADMIN_PASSWORD) return true;
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  return token === getAdminPassword();
}

export async function setAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, getAdminPassword(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  });
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
}
