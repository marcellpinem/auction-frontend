"use client";

import { useState, useEffect } from "react";

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

  if (!timeLeft) return <span>Berakhir</span>;

  const { days, hours, minutes, seconds, diff } = timeLeft;
  const isUrgent = diff < 60 * 60 * 1000;

  if (compact) {
    if (days > 0)
      return (
        <span>
          {days}h {hours}j lagi
        </span>
      );
    if (hours > 0)
      return (
        <span className={isUrgent ? "text-red-500 font-medium" : ""}>
          {hours}j {minutes}m lagi
        </span>
      );
    return (
      <span className="text-red-500 font-medium">
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}{" "}
        lagi
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {days > 0 && <TimeUnit value={days} label="Hari" urgent={false} />}
      <TimeUnit value={hours} label="Jam" urgent={isUrgent} />
      <TimeUnit value={minutes} label="Menit" urgent={isUrgent} />
      <TimeUnit value={seconds} label="Detik" urgent={isUrgent} />
    </div>
  );
}

function TimeUnit({ value, label, urgent }) {
  return (
    <div
      className={`flex flex-col items-center min-w-10 px-2 py-1 rounded bg-stone-100 dark:bg-stone-800 ${urgent ? "bg-red-50 dark:bg-red-950" : ""}`}
    >
      <span
        className={`text-lg font-bold font-mono leading-none ${urgent ? "text-red-500" : "text-stone-800 dark:text-stone-100"}`}
      >
        {String(value).padStart(2, "0")}
      </span>
      <span
        className={`text-[10px] mt-0.5 ${urgent ? "text-red-400" : "text-stone-400 dark:text-stone-500"}`}
      >
        {label}
      </span>
    </div>
  );
}
