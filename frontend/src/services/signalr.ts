import * as signalR from "@microsoft/signalr";
import {
  refreshAccessToken,
  isTokenExpiringSoon,
  getCurrentToken,
} from "@/services/tokenRefresh";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5153/api";
const HUB_URL = `${API_BASE.replace(/\/api\/?$/, "")}/hubs/orders`;

const getValidToken = async (): Promise<string> => {
  const currentToken = await getCurrentToken();

  if (currentToken && !isTokenExpiringSoon(currentToken)) {
    return currentToken;
  }

  const newToken = await refreshAccessToken();
  return newToken ?? "";
};

export const orderHubConnection = new signalR.HubConnectionBuilder()
  .withUrl(HUB_URL, {
    
    accessTokenFactory: getValidToken,
  })
  .withAutomaticReconnect([0, 2000, 5000, 10000, 20000])
  .configureLogging(signalR.LogLevel.Warning)
  .build();

export const startOrderHubConnection = async () => {
  if (orderHubConnection.state === signalR.HubConnectionState.Disconnected) {
    try {
      await orderHubConnection.start();
    } catch (err) {
      console.error("SignalR connection error:", err);
      setTimeout(startOrderHubConnection, 5000);
    }
  }
};
export const stopOrderHubConnection = async () => {
  if (orderHubConnection.state !== signalR.HubConnectionState.Disconnected) {
    try {
      await orderHubConnection.stop();
    } catch (err) {
      console.error("SignalR disconnect error:", err);
    }
  }
};
export const playNotificationSound = () => {
  try {
    const AudioCtx =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(880, ctx.currentTime);
    oscillator.frequency.setValueAtTime(1108, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.4);
  } catch (err) {
    console.error("Couldn't play notification sound:", err);
  }
};