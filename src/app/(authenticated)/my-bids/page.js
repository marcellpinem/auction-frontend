"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Crown,
  Clock,
  ChevronRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { formatCurrency, formatDate } from "@/lib/utils";

const STATUS_TABS = [
  { key: "", label: "Semua" },
  { key: "winning", label: "Sedang Unggul" },
  { key: "outbid", label: "Tersalip" },
  { key: "won", label: "Menang" },
  { key: "lost", label: "Kalah" },
];

const BID_STATUS_CONFIG = {
  winning: {
    label: "Unggul",
    class:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
  outbid: {
    label: "Tersalip",
    class: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
  won: {
    label: "Menang",
    class:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  lost: {
    label: "Kalah",
    class: "bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400",
  },
};

const getBidStatus = (bid) => {
  if (bid.auction.status === "active") {
    return bid.isWinning ? "winning" : "outbid";
  }
  if (bid.auction.status === "ended") {
    return bid.isWinning ? "won" : "lost";
  }
  return null;
};

export default function MyBidsPage() {
  const [bids, setBids] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [activeTab, setActiveTab] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = { page: 1, limit: 10 };
        if (activeTab) params.status = activeTab;

        const { data } = await api.get("/my-bids", { params });
        if (!cancelled) {
          setBids(data.data.bids);
          setPagination(data.data.pagination);
          setPage(1);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError("Gagal memuat data bid. Coba lagi.");
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [activeTab]);

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    setLoadingMore(true);
    try {
      const params = { page: nextPage, limit: 10 };
      if (activeTab) params.status = activeTab;

      const { data } = await api.get("/my-bids", { params });
      setBids((prev) => [...prev, ...data.data.bids]);
      setPagination(data.data.pagination);
      setPage(nextPage);
    } catch {
      // silent fail
    } finally {
      setLoadingMore(false);
    }
  };

  const handleTabChange = (key) => {
    if (key === activeTab) return;
    setActiveTab(key);
    setBids([]);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
          Bid Saya
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          Riwayat semua bid yang pernah kamu lakukan.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 flex-wrap">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-amber-500 text-white"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-stone-400" />
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      ) : bids.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <TrendingUp className="w-10 h-10 text-stone-300 mx-auto" />
          <p className="text-stone-500 text-sm">
            {activeTab
              ? "Tidak ada bid dengan status ini."
              : "Kamu belum pernah melakukan bid."}
          </p>
          <Button variant="outline" asChild>
            <Link href="/auctions">Lihat Auction</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {bids.map((bid) => {
            const bidStatus = getBidStatus(bid);
            const statusConfig = bidStatus
              ? BID_STATUS_CONFIG[bidStatus]
              : null;

            return (
              <Link
                key={bid.id}
                href={`/auctions/${bid.auction.id}`}
                className="flex items-center justify-between p-4 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 hover:border-amber-300 dark:hover:border-amber-700 transition-colors group"
              >
                <div className="flex items-start gap-3 min-w-0">
                  {/* Icon */}
                  <div
                    className={`mt-0.5 shrink-0 ${bidStatus === "winning" || bidStatus === "won" ? "text-amber-500" : "text-stone-400"}`}
                  >
                    {bidStatus === "won" ? (
                      <Crown className="w-4 h-4" />
                    ) : (
                      <TrendingUp className="w-4 h-4" />
                    )}
                  </div>

                  <div className="min-w-0 space-y-1">
                    <p className="text-sm font-medium text-stone-800 dark:text-stone-200 truncate">
                      {bid.auction.title}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {statusConfig && (
                        <Badge
                          className={`${statusConfig.class} border-0 text-xs`}
                        >
                          {statusConfig.label}
                        </Badge>
                      )}
                      <span className="text-xs text-stone-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(bid.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-stone-400">
                      Harga saat ini:{" "}
                      <span className="text-stone-600 dark:text-stone-300 font-medium">
                        {formatCurrency(bid.auction.currentPrice)}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 ml-3">
                  <div className="text-right">
                    <p className="text-xs text-stone-400">Bid kamu</p>
                    <p className="text-sm font-semibold text-stone-800 dark:text-stone-200">
                      {formatCurrency(bid.amount)}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-amber-400 transition-colors" />
                </div>
              </Link>
            );
          })}

          {/* Load more */}
          {pagination && page < pagination.totalPages && (
            <div className="pt-2 text-center">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="text-sm text-amber-500 hover:underline disabled:opacity-50 flex items-center gap-1.5 mx-auto"
              >
                {loadingMore ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : null}
                {loadingMore ? "Memuat..." : "Lihat lebih banyak"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
