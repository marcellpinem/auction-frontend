"use client";

import { useEffect } from "react";
import { Bell, CheckCheck } from "lucide-react";

import { useNotification } from "@/hooks/useNotification";
import { useNotification as useNotificationContext } from "@/context/NotificationContext";

import NotificationItem from "@/components/notification/NotificationItem";
import Pagination from "@/components/common/Pagination";

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

  useEffect(() => {
    fetchNotifications(1);
    resetUnread();
  }, [fetchNotifications, resetUnread]);

  const handleMarkAsRead = async (id) => {
    const notif = notifications.find((n) => n.id === id);

    if (!notif || notif.isRead) return;

    await markAsRead(id);

    fetchUnreadCount();
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    resetUnread();
  };

  const hasUnread = notifications.some((n) => !n.isRead);

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <div
        className="
          mx-auto
          w-full
          max-w-4xl
          px-4
          py-5

          sm:px-6
          sm:py-6

          lg:px-8
          lg:py-8
        "
      >
        {/* HEADER */}
        <div
          className="
            mb-6
            flex
            flex-col
            gap-4

            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-[#e7e5e4]
                  bg-white
                  shadow-[0_1px_2px_rgba(0,0,0,0.04)]
                "
              >
                <Bell className="h-5 w-5 text-[#18181b]" />
              </div>

              <div>
                <h1
                  className="
                    text-[22px]
                    font-semibold
                    tracking-[-0.04em]
                    text-[#18181b]
                  "
                >
                  Notifikasi
                </h1>

                <p
                  className="
                    mt-0.5
                    text-[13px]
                    text-[#78716c]
                  "
                >
                  Aktivitas bidding, transaksi, dan sistem akun
                </p>
              </div>
            </div>
          </div>

          <div
            className="
              flex
              items-center
              justify-between
              gap-3

              sm:justify-end
            "
          >
            {pagination?.total > 0 && (
              <div
                className="
                  rounded-2xl
                  border
                  border-[#e7e5e4]
                  bg-white
                  px-4
                  py-2.5
                  shadow-[0_1px_2px_rgba(0,0,0,0.03)]
                "
              >
                <p
                  className="
                    text-[11px]
                    font-medium
                    uppercase
                    tracking-[0.08em]
                    text-[#a8a29e]
                  "
                >
                  Total
                </p>

                <p
                  className="
                    mt-0.5
                    text-[18px]
                    font-semibold
                    leading-none
                    text-[#18181b]
                  "
                >
                  {pagination.total}
                </p>
              </div>
            )}

            {hasUnread && (
              <button
                onClick={handleMarkAllAsRead}
                className="
                  inline-flex
                  h-11
                  items-center
                  justify-center
                  gap-2
                  rounded-2xl
                  border
                  border-[#f3e2b3]
                  bg-[#fff8e7]
                  px-4
                  text-[13px]
                  font-semibold
                  text-[#b7791f]
                  transition-all
                  duration-200

                  hover:border-[#ebcf84]
                  hover:bg-[#fff3d6]
                "
              >
                <CheckCheck className="h-4 w-4" />
                <span className="hidden sm:block">Tandai semua dibaca</span>
              </button>
            )}
          </div>
        </div>

        {/* LIST */}
        <div className="space-y-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="
                  flex
                  gap-3
                  rounded-[28px]
                  border
                  border-[#ece7e3]
                  bg-white
                  p-4
                  animate-pulse
                "
              >
                <div
                  className="
                    h-11
                    w-11
                    shrink-0
                    rounded-2xl
                    bg-[#f3f2f1]
                  "
                />

                <div className="flex-1">
                  <div
                    className="
                      h-4
                      w-2/3
                      rounded-full
                      bg-[#f1f0ef]
                    "
                  />

                  <div
                    className="
                      mt-2
                      h-3
                      w-full
                      rounded-full
                      bg-[#f5f5f4]
                    "
                  />

                  <div
                    className="
                      mt-2
                      h-3
                      w-1/3
                      rounded-full
                      bg-[#f5f5f4]
                    "
                  />
                </div>
              </div>
            ))
          ) : notifications.length === 0 ? (
            <div
              className="
                flex
                flex-col
                items-center
                justify-center
                rounded-[32px]
                border
                border-dashed
                border-[#dedad6]
                bg-white
                px-6
                py-20
                text-center
              "
            >
              <div
                className="
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-[24px]
                  bg-[#f5f5f4]
                "
              >
                <Bell className="h-7 w-7 text-[#b0aba7]" />
              </div>

              <h2
                className="
                  mt-5
                  text-[18px]
                  font-semibold
                  tracking-[-0.03em]
                  text-[#18181b]
                "
              >
                Belum ada notifikasi
              </h2>

              <p
                className="
                  mt-2
                  max-w-sm
                  text-[14px]
                  leading-[1.7]
                  text-[#78716c]
                "
              >
                Semua update auction, transaksi, dan bidding akan muncul di
                sini.
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onRead={handleMarkAsRead}
              />
            ))
          )}
        </div>

        {/* PAGINATION */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={fetchNotifications}
            />
          </div>
        )}
      </div>
    </div>
  );
}
