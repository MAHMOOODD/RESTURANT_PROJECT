import { Mutex } from "async-mutex";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5153/api";


export const refreshMutex = new Mutex();

interface RefreshTokenResponse {
  token?: string;
  data?: {
    token?: string;
  };
}


const getStoreModule = () => import("@/store");


export async function refreshAccessToken(): Promise<string | null> {
  const { store } = await getStoreModule();
  const { setCredentials, logout } = await import(
    "@/store/features/User/authSlice"
  );

  if (refreshMutex.isLocked()) {
    await refreshMutex.waitForUnlock();
    return store.getState().auth.token;
  }

  const release = await refreshMutex.acquire();
  try {
    const res = await fetch(`${API_BASE}/Account/RefreshToken`, {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) {
      store.dispatch(logout());
      return null;
    }

    const json = (await res.json()) as RefreshTokenResponse;
    const newToken = json?.data?.token || json?.token;

    if (!newToken) {
      store.dispatch(logout());
      return null;
    }

    store.dispatch(setCredentials({ token: newToken }));
    return newToken;
  } catch (err) {
    console.error("Token refresh failed:", err);
    store.dispatch(logout());
    return null;
  } finally {
    release();
  }
}


export function isTokenExpiringSoon(token: string, bufferSeconds = 30): boolean {
  try {
    const payloadBase64 = token.split(".")[1];
    const payload = JSON.parse(atob(payloadBase64));

    if (!payload?.exp) return true;

    const expiresAtMs = payload.exp * 1000;
    return Date.now() >= expiresAtMs - bufferSeconds * 1000;
  } catch {
    return true;
  }
}

export async function getCurrentToken(): Promise<string | null> {
  const { store } = await getStoreModule();
  return store.getState().auth.token;
}