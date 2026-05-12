"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { formatCurrency } from "@/lib/utils";
import { Gavel, Package, Wallet, Trophy, TrendingUp } from "lucide-react";

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg p-5 flex items-center gap-4">
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div>
      <p className="text-sm text-stone-500 dark:text-stone-400">{label}</p>
      <p className="text-xl font-bold text-stone-900 dark:text-stone-100">
        {value}
      </p>
    </div>
  </div>
);

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("/dashboard/stats");
        setStats(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-24 rounded-lg bg-stone-100 dark:bg-stone-800 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <p className="text-stone-500 dark:text-stone-400 text-sm">
        Gagal memuat data dashboard.
      </p>
    );
  }

  const cards = [
    {
      icon: Gavel,
      label: "Active Bids",
      value: stats.activeBids,
      color: "bg-amber-500",
    },
    {
      icon: Package,
      label: "Auctions Created",
      value: stats.totalAuctionsCreated,
      color: "bg-stone-600",
    },
    {
      icon: Trophy,
      label: "Auctions Won",
      value: stats.totalWonAuctions,
      color: "bg-green-500",
    },
    {
      icon: Wallet,
      label: "Available Balance",
      value: formatCurrency(stats.availableBalance),
      color: "bg-blue-500",
    },
    {
      icon: TrendingUp,
      label: "Held Balance",
      value: formatCurrency(stats.heldBalance),
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
          Dashboard
        </h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
          Ringkasan aktivitas akunmu
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {cards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>
    </div>
  );
}
