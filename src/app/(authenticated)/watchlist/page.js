"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark, BookmarkX } from "lucide-react";
import { Button } from "@/components/ui/button";
import AuctionCard from "@/components/common/AuctionCard";
import Pagination from "@/components/common/Pagination";
import api from "@/lib/axios";

export default function WatchlistPage() {
  const [auctions, setAuctions] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/watchlist?page=${page}&limit=12`);
        if (!cancelled) {
          setAuctions(data.data.auctions);
          setPagination(data.data.pagination);
        }
      } catch (err) {
        console.error("Failed to fetch watchlist:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetch();
    return () => {
      cancelled = true;
    };
  }, [page]);

  const handleRemove = async (auctionId) => {
    try {
      await api.post(`/auctions/${auctionId}/watch`);
      setAuctions((prev) => prev.filter((a) => a.id !== auctionId));
      setPagination((prev) =>
        prev ? { ...prev, total: prev.total - 1 } : prev,
      );
    } catch (err) {
      console.error("Failed to remove from watchlist:", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-amber-500" />
            Watchlist
          </h1>
          {pagination && (
            <p className="text-sm text-stone-500 mt-1">
              {pagination.total} auction dipantau
            </p>
          )}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="rounded-lg border border-stone-200 dark:border-stone-700 overflow-hidden"
            >
              <div className="aspect-4/3 bg-stone-100 dark:bg-stone-800 animate-pulse" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-stone-100 dark:bg-stone-800 rounded animate-pulse w-3/4" />
                <div className="h-4 bg-stone-100 dark:bg-stone-800 rounded animate-pulse w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && auctions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <BookmarkX className="w-12 h-12 text-stone-300 dark:text-stone-600 mb-4" />
          <p className="text-stone-500 font-medium mb-1">
            Watchlist kamu kosong
          </p>
          <p className="text-sm text-stone-400 mb-6">
            Tambahkan auction ke watchlist agar tidak ketinggalan.
          </p>
          <Button asChild variant="outline" size="sm">
            <Link href="/auctions">Jelajahi Auction</Link>
          </Button>
        </div>
      )}

      {/* Grid */}
      {!loading && auctions.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {auctions.map((auction) => (
              <div key={auction.id} className="relative group">
                <AuctionCard auction={auction} />
                <button
                  onClick={() => handleRemove(auction.id)}
                  className="absolute top-2 right-2 z-10 p-1.5 rounded-md bg-white/90 dark:bg-stone-900/90 border border-stone-200 dark:border-stone-700 text-stone-400 hover:text-red-500 hover:border-red-300 transition-colors opacity-0 group-hover:opacity-100"
                  title="Hapus dari watchlist"
                >
                  <BookmarkX className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  );
}
