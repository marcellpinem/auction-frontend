"use client";

import { useEffect, useState, useRef } from "react";
import { TrendingUp, Crown, Loader2 } from "lucide-react";
import api from "@/lib/axios";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function BidHistory({ auctionId, refreshTrigger = 0 }) {
  const [bids, setBids] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/auctions/${auctionId}/bids`, {
          params: { page: 1, limit: 10 },
        });
        if (!cancelled) {
          setBids(data.data.bids);
          setPagination(data.data.pagination);
          setPage(1);
          setLoading(false);
        }
      } catch {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [auctionId, refreshTrigger]);

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    setLoadingMore(true);
    try {
      const { data } = await api.get(`/auctions/${auctionId}/bids`, {
        params: { page: nextPage, limit: 10 },
      });
      setBids((prev) => [...prev, ...data.data.bids]);
      setPagination(data.data.pagination);
      setPage(nextPage);
    } catch {
      // silent fail
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-lg border border-stone-200 dark:border-stone-700 p-6 flex justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-stone-400" />
      </div>
    );
  }

  if (bids.length === 0) {
    return (
      <div className="rounded-lg border border-stone-200 dark:border-stone-700 p-6 text-center text-sm text-stone-400">
        Belum ada bid untuk auction ini.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-stone-200 dark:border-stone-700 overflow-hidden">
      <div className="divide-y divide-stone-100 dark:divide-stone-800">
        {bids.map((bid, index) => (
          <div
            key={bid.id}
            className={`flex items-center justify-between px-4 py-3 ${
              bid.isWinning
                ? "bg-amber-50 dark:bg-amber-900/10"
                : "bg-white dark:bg-stone-900"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xs text-stone-400 w-5 text-center font-mono">
                {index === 0 && bid.isWinning ? (
                  <Crown className="w-4 h-4 text-amber-500" />
                ) : (
                  `#${index + 1}`
                )}
              </span>

              <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-xs font-semibold text-stone-500 uppercase shrink-0">
                {bid.bidder.username.charAt(0)}
              </div>

              <div>
                <p className="text-sm font-medium text-stone-800 dark:text-stone-200">
                  {bid.bidder.username}
                </p>
                <p className="text-xs text-stone-400">
                  {formatDate(bid.createdAt)}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p
                className={`text-sm font-semibold ${
                  bid.isWinning
                    ? "text-amber-500"
                    : "text-stone-700 dark:text-stone-300"
                }`}
              >
                {formatCurrency(bid.amount)}
              </p>
              {bid.isWinning && (
                <p className="text-xs text-amber-500 font-medium">Tertinggi</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {pagination && page < pagination.totalPages && (
        <div className="p-3 border-t border-stone-100 dark:border-stone-800 text-center">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="text-sm text-amber-500 hover:underline disabled:opacity-50 flex items-center gap-1.5 mx-auto"
          >
            {loadingMore ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <TrendingUp className="w-3 h-3" />
            )}
            {loadingMore ? "Memuat..." : "Lihat lebih banyak"}
          </button>
        </div>
      )}
    </div>
  );
}
