"use client";

import { useEffect, useState } from "react";

const getTimeLeft = (endsAt) => {
  const diff = new Date(endsAt) - new Date();

  if (diff <= 0) return null;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, diff };
};

export default function CountdownTimer({ endsAt, compact = false }) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(endsAt));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(endsAt));
    }, 1000);

    return () => clearInterval(interval);
  }, [endsAt]);

  if (!timeLeft) {
    return (
      <span className="inline-flex items-center rounded-full border border-[#ececec] bg-[#fafafa] px-2.5 py-1 text-[11px] font-medium text-[#737373]">
        Berakhir
      </span>
    );
  }

  const { days, hours, minutes, seconds, diff } = timeLeft;

  const isUrgent = diff < 60 * 60 * 1000;

  if (compact) {
    if (days > 0) {
      return <CompactBadge value={`${days}h ${hours}j`} urgent={false} />;
    }

    if (hours > 0) {
      return <CompactBadge value={`${hours}j ${minutes}m`} urgent={isUrgent} />;
    }

    return (
      <CompactBadge
        value={`${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
          2,
          "0",
        )}`}
        urgent
      />
    );
  }

  return (
    <div
      className="
        flex
        flex-wrap
        items-center
        gap-2
      "
    >
      {days > 0 && <TimeUnit value={days} label="Hari" urgent={false} />}

      <TimeUnit value={hours} label="Jam" urgent={isUrgent} />

      <TimeUnit value={minutes} label="Menit" urgent={isUrgent} />

      <TimeUnit value={seconds} label="Detik" urgent={isUrgent} />
    </div>
  );
}

function CompactBadge({ value, urgent }) {
  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        border
        px-2.5
        py-1
        text-[11px]
        font-semibold
        tracking-[0.2px]

        ${
          urgent
            ? `
              border-red-200
              bg-red-50
              text-red-600
            `
            : `
              border-[#e7e7e7]
              bg-[#fafafa]
              text-[#525252]
            `
        }
      `}
    >
      {value} lagi
    </span>
  );
}

function TimeUnit({ value, label, urgent }) {
  return (
    <div
      className={`
        relative
        overflow-hidden
        rounded-2xl
        border
        px-3
        py-2
        text-center
        min-w-[72px]

        ${
          urgent
            ? `
              border-red-200
              bg-red-50
            `
            : `
              border-[#ececec]
              bg-white
            `
        }
      `}
    >
      {/* GLOW */}
      {urgent && (
        <div
          className="
            absolute
            inset-0
            bg-[rgba(239,68,68,0.06)]
          "
        />
      )}

      <div className="relative z-10">
        <span
          className={`
            block
            text-[24px]
            font-semibold
            leading-none
            tracking-[-1px]
            tabular-nums

            ${urgent ? "text-red-600" : "text-[#1a1a1a]"}
          `}
        >
          {String(value).padStart(2, "0")}
        </span>

        <span
          className={`
            mt-1
            block
            text-[10px]
            font-medium
            uppercase
            tracking-[0.6px]

            ${urgent ? "text-red-400" : "text-[#8a8a8a]"}
          `}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
