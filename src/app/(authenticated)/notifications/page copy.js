"use client";

import { useEffect } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { useNotification } from "@/hooks/useNotification";
import { useNotification as useNotificationContext } from "@/context/NotificationContext";
import NotificationItem from "@/components/notification/NotificationItem";
import { Button } from "@/components/ui/button";

export default function NotificationsPage() {
  const {
    notifications,
    pagination,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotification();
  const { resetUnread, fetchUnreadCount } = useNotificationContext();

  const handleMarkAsRead = async (id) => {
    const notif = notifications.find((n) => n.id === id);
    if (!notif || notif.isRead) return;
    await markAsRead(id);
    fetchUnreadCount();
  };

  useEffect(() => {
    fetchNotifications(1);
    resetUnread();
  }, [fetchNotifications, resetUnread]);

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    resetUnread();
  };

  const hasUnread = notifications.some((n) => !n.isRead);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-stone-700 dark:text-stone-300" />
          <h1 className="text-xl font-bold text-stone-800 dark:text-stone-100">
            Notifikasi
          </h1>
          {pagination?.total > 0 && (
            <span className="text-sm text-stone-400">({pagination.total})</span>
          )}
        </div>
        {hasUnread && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkAllAsRead}
            className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/20 gap-1.5"
          >
            <CheckCheck className="w-4 h-4" />
            Tandai semua dibaca
          </Button>
        )}
      </div>

      {/* List */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg overflow-hidden">
        {loading ? (
          <div className="divide-y divide-stone-100 dark:divide-stone-800">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-3 px-4 py-3.5 animate-pulse">
                <div className="w-9 h-9 rounded-lg bg-stone-100 dark:bg-stone-800 shrink-0" />
                <div className="flex-1 space-y-2 pt-0.5">
                  <div className="h-4 bg-stone-100 dark:bg-stone-800 rounded w-3/4" />
                  <div className="h-3 bg-stone-100 dark:bg-stone-800 rounded w-full" />
                  <div className="h-3 bg-stone-100 dark:bg-stone-800 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Bell className="w-10 h-10 text-stone-300 dark:text-stone-600 mb-3" />
            <p className="text-stone-500 dark:text-stone-400 font-medium">
              Belum ada notifikasi
            </p>
            <p className="text-sm text-stone-400 dark:text-stone-500 mt-1">
              Notifikasi akan muncul di sini
            </p>
          </div>
        ) : (
          <div className="divide-y divide-stone-100 dark:divide-stone-800">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onRead={handleMarkAsRead}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page <= 1}
            onClick={() => fetchNotifications(pagination.page - 1)}
          >
            Sebelumnya
          </Button>
          <span className="text-sm text-stone-500">
            {pagination.page} / {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => fetchNotifications(pagination.page + 1)}
          >
            Berikutnya
          </Button>
        </div>
      )}
    </div>
  );
}
