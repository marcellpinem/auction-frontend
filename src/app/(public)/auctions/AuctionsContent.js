// src/app/(public)/auctions/AuctionsContent.js
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import AuctionFilter from "@/components/auction/AuctionFilter";
import AuctionGrid from "@/components/auction/AuctionGrid";
import api from "@/lib/axios";

export default function AuctionsContent() {
  const searchParams = useSearchParams();

  const [auctions, setAuctions] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/categories")
      .then((res) => {
        setCategories(res.data.data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const fetchAuctions = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchParams.get("search"))
          params.set("search", searchParams.get("search"));
        if (searchParams.get("categoryId"))
          params.set("categoryId", searchParams.get("categoryId"));
        if (searchParams.get("status"))
          params.set("status", searchParams.get("status"));
        if (searchParams.get("sort"))
          params.set("sort", searchParams.get("sort"));
        if (searchParams.get("page"))
          params.set("page", searchParams.get("page"));

        const res = await api.get(`/auctions?${params.toString()}`);
        setAuctions(res.data.data.auctions);
        setPagination(res.data.data.pagination);
      } catch {
        setAuctions([]);
        setPagination(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-stone-800 dark:text-stone-100">
            Browse Auction
          </h1>
          {pagination && (
            <p className="text-sm text-stone-400 mt-1">
              {pagination.total} auction ditemukan
            </p>
          )}
        </div>

        <div className="mb-6">
          <AuctionFilter categories={categories} />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg overflow-hidden animate-pulse"
              >
                <div className="aspect-4/3 bg-stone-100 dark:bg-stone-800" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-stone-100 dark:bg-stone-800 rounded w-1/3" />
                  <div className="h-4 bg-stone-100 dark:bg-stone-800 rounded w-full" />
                  <div className="h-4 bg-stone-100 dark:bg-stone-800 rounded w-2/3" />
                  <div className="h-5 bg-stone-100 dark:bg-stone-800 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <AuctionGrid
            auctions={auctions}
            pagination={pagination}
            emptyMessage="Tidak ada auction yang sesuai dengan filter."
          />
        )}
      </div>
    </div>
  );
}
