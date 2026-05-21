"use client";

import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { Bell, Gavel, Wallet, ShoppingBag, Info } from "lucide-react";

const TYPE_CONFIG = {
  bid: {
    icon: Gavel,
    color: "text-amber-500",
    bg: "bg-amber-50 dark:bg-amber-950/30",
  },
  auction: {
    icon: Gavel,
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-950/30",
  },
  transaction: {
    icon: ShoppingBag,
    color: "text-green-500",
    bg: "bg-green-50 dark:bg-green-950/30",
  },
  wallet: {
    icon: Wallet,
    color: "text-purple-500",
    bg: "bg-purple-50 dark:bg-purple-950/30",
  },
  system: {
    icon: Info,
    color: "text-stone-500",
    bg: "bg-stone-100 dark:bg-stone-800",
  },
};

export default function NotificationItem({ notification, onRead }) {
  const config = TYPE_CONFIG[notification.type] ?? TYPE_CONFIG.system;
  const Icon = config.icon;

  const handleClick = () => {
    if (!notification.isRead) {
      onRead(notification.id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`flex gap-3 px-4 py-3.5 cursor-pointer transition-colors hover:bg-stone-50 dark:hover:bg-stone-800/50 ${
        !notification.isRead ? "bg-amber-50/40 dark:bg-amber-950/10" : ""
      }`}
    >
      {/* Icon */}
      <div
        className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${config.bg}`}
      >
        <Icon className={`w-4 h-4 ${config.color}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p
            className={`text-[15px] font-medium leading-snug ${
              notification.isRead
                ? "text-stone-500 dark:text-stone-400"
                : "text-stone-800 dark:text-stone-100"
            }`}
          >
            {notification.title}
          </p>
          {!notification.isRead && (
            <span className="shrink-0 w-2 h-2 rounded-full bg-amber-500 mt-1.5" />
          )}
        </div>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5 leading-snug">
          {notification.message}
        </p>
        <p className="text-xs text-stone-400 dark:text-stone-500 mt-1">
          {formatDistanceToNow(new Date(notification.createdAt), {
            addSuffix: true,
            locale: id,
          })}
        </p>
      </div>
    </div>
  );
}
