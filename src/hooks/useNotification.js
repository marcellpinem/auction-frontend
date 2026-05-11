"use client";

import { useState, useCallback } from "react";
import api from "@/lib/axios";

export const useNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await api.get("/notifications", {
        params: { page, limit: 20 },
      });
      setNotifications(data.data.notifications);
      setPagination(data.data.pagination);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
    } catch {
      // ignore
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await api.put("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {
      // ignore
    }
  }, []);

  return {
    notifications,
    pagination,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  };
};
