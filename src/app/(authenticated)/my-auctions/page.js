"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Plus, Gavel, Clock, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/common/Pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency, formatDate } from "@/lib/utils";
import api from "@/lib/axios";

const STATUS_OPTIONS = [
  { label: "Semua", value: "all" },
  { label: "Menunggu Verifikasi", value: "pending" },
  { label: "Aktif", value: "active" },
  { label: "Berakhir", value: "ended" },
  { label: "Dibatalkan", value: "cancelled" },
];

const STATUS_BADGE = {
  pending:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  active:
    "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
  ended: "bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400",
  cancelled: "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400",
};

const STATUS_LABEL = {
  pending: "Menunggu Verifikasi",
  active: "Aktif",
  ended: "Berakhir",
  cancelled: "Dibatalkan",
};

export default function MyAuctionsPage() {
  const searchParams = useSearchParams();

  const [auctions, setAuctions] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchMyAuctions = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (statusFilter && statusFilter !== "all")
          params.set("status", statusFilter);
        if (searchParams.get("page"))
          params.set("page", searchParams.get("page"));

        const res = await api.get(`/auctions/my-auctions?${params.toString()}`);
        setAuctions(res.data.data.auctions);
        setPagination(res.data.data.pagination);
      } catch {
        setAuctions([]);
        setPagination(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMyAuctions();
  }, [statusFilter, searchParams]);

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-stone-800 dark:text-stone-100">
              Auction Saya
            </h1>
            {pagination && (
              <p className="text-sm text-stone-400 mt-1">
                {pagination.total} auction
              </p>
            )}
          </div>
          <Link href="/my-auctions/create">
            <Button className="bg-amber-500 hover:bg-amber-600 text-white gap-2">
              <Plus className="w-4 h-4" />
              Buat Auction
            </Button>
          </Link>
        </div>

        {/* Filter */}
        <div className="mb-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-50 bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg p-4 animate-pulse"
              >
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-stone-100 dark:bg-stone-800 rounded-lg shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-stone-100 dark:bg-stone-800 rounded w-2/3" />
                    <div className="h-3 bg-stone-100 dark:bg-stone-800 rounded w-1/3" />
                    <div className="h-3 bg-stone-100 dark:bg-stone-800 rounded w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : auctions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Gavel className="w-12 h-12 text-stone-300 dark:text-stone-600 mb-3" />
            <p className="text-stone-500 dark:text-stone-400 text-[15px]">
              Belum ada auction.
            </p>
            <Link href="/my-auctions/create" className="mt-4">
              <Button variant="outline" className="gap-2">
                <Plus className="w-4 h-4" />
                Buat Auction Pertama
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {auctions.map((auction) => (
              <Link
                key={auction.id}
                href={`/my-auctions/${auction.id}`}
                className="block group"
              >
                <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg p-4 hover:border-amber-400 dark:hover:border-amber-500 transition-colors">
                  <div className="flex gap-4">
                    {/* Image */}
                    <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-800">
                      {auction.imageUrl ? (
                        <Image
                          src={auction.imageUrl}
                          alt={auction.title}
                          loading="eager"
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Gavel className="w-6 h-6 text-stone-300 dark:text-stone-600" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="text-[15px] font-medium text-stone-800 dark:text-stone-100 truncate">
                          {auction.title}
                        </h3>
                        <span
                          className={`shrink-0 text-xs px-2 py-0.5 rounded font-medium ${STATUS_BADGE[auction.status]}`}
                        >
                          {STATUS_LABEL[auction.status]}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-400 dark:text-stone-500">
                        <span className="flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {auction.category?.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Gavel className="w-3 h-3" />
                          {auction.totalBids} bid
                        </span>
                        {auction.endsAt && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(auction.endsAt)}
                          </span>
                        )}
                      </div>

                      <p className="mt-1.5 text-sm font-semibold text-amber-500">
                        {formatCurrency(auction.currentPrice)}
                      </p>

                      {/* Rejection/cancel reason */}
                      {auction.rejectionReason && (
                        <p className="mt-1 text-xs text-red-500">
                          Ditolak: {auction.rejectionReason}
                        </p>
                      )}
                      {auction.cancelReason && (
                        <p className="mt-1 text-xs text-red-500">
                          Dibatalkan: {auction.cancelReason}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {pagination && pagination.totalPages > 1 && (
              <div className="pt-4">
                <Pagination
                  page={pagination.page}
                  totalPages={pagination.totalPages}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
