"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000";

// Referensi ke singleton WebSocket dari useWebSocket
// Kita tidak import useWebSocket (hook) karena context bukan component.
// Sebaliknya, kita listen langsung ke globalListeners via custom event browser.
// Cara yang lebih clean: expose subscribe via window event.

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const { isAuthenticated } = useAuth();

  const fetchUnreadCount = useCallback(async () => {
    try {
      const { data } = await api.get("/notifications/unread-count");
      setUnreadCount(data.data.count);
    } catch {
      // ignore
    }
  }, []);

  const incrementUnread = useCallback(() => {
    setUnreadCount((prev) => prev + 1);
  }, []);

  const resetUnread = useCallback(() => {
    setUnreadCount(0);
  }, []);

  // Listen ke custom browser event yang di-dispatch oleh useWebSocket
  // saat menerima event "notification" dari server
  useEffect(() => {
    if (!isAuthenticated) return;

    const handler = () => {
      setUnreadCount((prev) => prev + 1);
    };

    window.addEventListener("ws:notification", handler);
    return () => window.removeEventListener("ws:notification", handler);
  }, [isAuthenticated]);

  return (
    <NotificationContext.Provider
      value={{
        unreadCount,
        fetchUnreadCount,
        incrementUnread,
        resetUnread,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context)
    throw new Error("useNotification must be used within NotificationProvider");
  return context;
};
