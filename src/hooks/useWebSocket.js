// auction-frontend/src/hooks/useWebSocket.js
"use client";

import { useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000";
const RECONNECT_DELAY = 3000;
const MAX_RECONNECT_ATTEMPTS = 5;

/**
 * Singleton WebSocket instance — shared across all hook consumers.
 * Reconnect logic dan auth hanya dijalankan sekali.
 */
let globalWs = null;
let globalListeners = new Map(); // event → Set<callback>
let reconnectAttempts = 0;
let reconnectTimer = null;
let currentToken = null;
let isConnecting = false;

const notifyListeners = (event, payload) => {
  globalListeners.get(event)?.forEach((cb) => cb(payload));
  globalListeners.get("*")?.forEach((cb) => cb({ event, payload }));
};

const connectWs = (token) => {
  if (isConnecting || globalWs?.readyState === WebSocket.OPEN) return;

  isConnecting = true;
  currentToken = token;

  const ws = new WebSocket(WS_URL);
  globalWs = ws;

  ws.onopen = () => {
    isConnecting = false;
    reconnectAttempts = 0;

    // Kirim auth token kalau user sudah login
    if (token) {
      ws.send(JSON.stringify({ type: "auth", payload: { token } }));
    }

    notifyListeners("ws_connected", {});
  };

  ws.onmessage = (e) => {
    try {
      const { event, payload } = JSON.parse(e.data);
      notifyListeners(event, payload);
    } catch {
      // abaikan pesan non-JSON
    }
  };

  ws.onclose = () => {
    isConnecting = false;
    globalWs = null;
    notifyListeners("ws_disconnected", {});

    // Reconnect dengan exponential backoff
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      const delay = RECONNECT_DELAY * Math.pow(1.5, reconnectAttempts);
      reconnectAttempts++;
      reconnectTimer = setTimeout(() => connectWs(currentToken), delay);
    }
  };

  ws.onerror = () => {
    ws.close();
  };
};

const disconnectWs = () => {
  clearTimeout(reconnectTimer);
  reconnectAttempts = MAX_RECONNECT_ATTEMPTS; // stop auto-reconnect
  globalWs?.close();
  globalWs = null;
  isConnecting = false;
};

const sendWs = (type, payload = {}) => {
  if (globalWs?.readyState === WebSocket.OPEN) {
    globalWs.send(JSON.stringify({ type, payload }));
  }
};

// ─── Hook ──────────────────────────────────────────────────────────────────────

export const useWebSocket = () => {
  const { accessToken, isAuthenticated } = useAuth();

  // Inisialisasi koneksi saat pertama kali hook dipakai
  useEffect(() => {
    reconnectAttempts = 0; // reset saat mount
    connectWs(accessToken);

    return () => {
      // Jangan disconnect saat unmount — koneksi singleton tetap hidup
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-auth saat access token berubah (refresh token atau login baru)
  useEffect(() => {
    if (!isAuthenticated) return;
    if (globalWs?.readyState === WebSocket.OPEN && accessToken) {
      globalWs.send(
        JSON.stringify({ type: "auth", payload: { token: accessToken } }),
      );
      currentToken = accessToken;
    }
  }, [accessToken, isAuthenticated]);

  /**
   * Subscribe ke event WebSocket.
   * Mengembalikan fungsi unsubscribe — panggil di cleanup useEffect.
   */
  const subscribe = useCallback((event, callback) => {
    if (!globalListeners.has(event)) {
      globalListeners.set(event, new Set());
    }
    globalListeners.get(event).add(callback);

    return () => {
      globalListeners.get(event)?.delete(callback);
    };
  }, []);

  /**
   * Join room auction — mulai terima broadcast untuk auction tertentu.
   */
  const joinAuction = useCallback((auctionId) => {
    sendWs("join_auction", { auctionId });
  }, []);

  /**
   * Leave room auction.
   */
  const leaveAuction = useCallback((auctionId) => {
    sendWs("leave_auction", { auctionId });
  }, []);

  return { subscribe, joinAuction, leaveAuction };
};
