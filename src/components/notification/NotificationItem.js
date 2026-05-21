"use client";

import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

import { Gavel, Wallet, ShoppingBag, Info, ChevronRight } from "lucide-react";

const TYPE_CONFIG = {
  bid: {
    icon: Gavel,
    iconClass: "text-[#c28a16]",
    bgClass: "bg-[#fff7e8]",
  },

  auction: {
    icon: Gavel,
    iconClass: "text-[#2563eb]",
    bgClass: "bg-[#eef4ff]",
  },

  transaction: {
    icon: ShoppingBag,
    iconClass: "text-[#0f9f6e]",
    bgClass: "bg-[#ecfdf3]",
  },

  wallet: {
    icon: Wallet,
    iconClass: "text-[#7c3aed]",
    bgClass: "bg-[#f3e8ff]",
  },

  system: {
    icon: Info,
    iconClass: "text-[#6b7280]",
    bgClass: "bg-[#f3f4f6]",
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
    <button
      onClick={handleClick}
      className={`
        group
        relative
        flex
        w-full
        items-start
        gap-3
        overflow-hidden
        rounded-[28px]
        border
        p-4
        text-left
        transition-all
        duration-200

        sm:gap-4
        sm:p-5

        ${
          notification.isRead
            ? `
              border-[#ece7e3]
              bg-white

              hover:border-[#dfd9d3]
              hover:bg-[#fcfcfb]
            `
            : `
              border-[#f5d58a]
              bg-[#fffaf0]

              hover:border-[#ebc76f]
            `
        }
      `}
    >
      {/* SIDE ACCENT */}
      {!notification.isRead && (
        <div
          className="
            absolute
            left-0
            top-0
            h-full
            w-1.5
            bg-[#f59e0b]
          "
        />
      )}

      {/* ICON */}
      <div
        className={`
          flex
          h-11
          w-11
          shrink-0
          items-center
          justify-center
          rounded-2xl
          border
          border-white/70
          ${config.bgClass}
        `}
      >
        <Icon
          className={`
            h-[18px]
            w-[18px]
            ${config.iconClass}
          `}
        />
      </div>

      {/* CONTENT */}
      <div className="min-w-0 flex-1">
        <div
          className="
            flex
            items-start
            justify-between
            gap-3
          "
        >
          <div className="min-w-0">
            <h3
              className={`
                line-clamp-2
                text-[14px]
                font-semibold
                leading-[1.5]

                sm:text-[15px]

                ${notification.isRead ? "text-[#44403c]" : "text-[#1c1917]"}
              `}
            >
              {notification.title}
            </h3>

            <p
              className="
                mt-1.5
                line-clamp-2
                text-[13px]
                leading-[1.65]
                text-[#78716c]

                sm:text-[14px]
              "
            >
              {notification.message}
            </p>
          </div>

          <ChevronRight
            className="
              mt-0.5
              hidden
              h-4
              w-4
              shrink-0
              text-[#c4c0bc]
              transition-transform
              duration-200

              group-hover:translate-x-0.5

              sm:block
            "
          />
        </div>

        {/* FOOTER */}
        <div
          className="
            mt-3
            flex
            flex-wrap
            items-center
            gap-2
          "
        >
          <span
            className="
              inline-flex
              items-center
              rounded-full
              border
              border-[#ece7e3]
              bg-[#fafaf9]
              px-2.5
              py-1
              text-[11px]
              font-medium
              text-[#78716c]
            "
          >
            {formatDistanceToNow(new Date(notification.createdAt), {
              addSuffix: true,
              locale: id,
            })}
          </span>

          {!notification.isRead && (
            <span
              className="
                inline-flex
                items-center
                rounded-full
                bg-[#f59e0b]
                px-2.5
                py-1
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.08em]
                text-white
              "
            >
              Baru
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
