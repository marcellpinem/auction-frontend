"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import api from "@/lib/axios";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";

const STATUS_LABEL = {
  pending: {
    label: "Menunggu Konfirmasi",
    color: "text-amber-600 bg-amber-50 border-amber-200",
  },
  confirmed_buyer: {
    label: "Buyer Siap",
    color: "text-blue-600 bg-blue-50 border-blue-200",
  },
  confirmed_seller: {
    label: "Dikirim",
    color: "text-purple-600 bg-purple-50 border-purple-200",
  },
  completed: {
    label: "Selesai",
    color: "text-green-600 bg-green-50 border-green-200",
  },
  cancelled: {
    label: "Dibatalkan",
    color: "text-red-600 bg-red-50 border-red-200",
  },
};

const STATUS_FILTERS = [
  { value: "", label: "Semua" },
  { value: "pending", label: "Menunggu" },
  { value: "confirmed_buyer", label: "Buyer Siap" },
  { value: "confirmed_seller", label: "Dikirim" },
  { value: "completed", label: "Selesai" },
  { value: "cancelled", label: "Dibatalkan" },
];

function formatCurrency(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(dateStr));
}

function TransactionCard({ trx, username }) {
  const role = trx.buyer.username === username ? "buyer" : "seller";
  const counterpart =
    role === "buyer" ? trx.seller.username : trx.buyer.username;
  const badge = STATUS_LABEL[trx.status] ?? {
    label: trx.status,
    color: "text-stone-600 bg-stone-50 border-stone-200",
  };

  return (
    <Link href={`/transactions/${trx.id}`}>
      <div className="group flex items-center gap-4 p-4 bg-white border border-stone-200 rounded-lg hover:border-amber-300 hover:shadow-sm transition-all duration-150 cursor-pointer">
        {/* Thumbnail */}
        <div className="w-14 h-14 rounded-lg overflow-hidden bg-stone-100 shrink-0 relative">
          {trx.auction.imageUrl ? (
            <Image
              src={trx.auction.imageUrl}
              alt={trx.auction.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-300">
              <i className="bx bx-image text-2xl" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-stone-900 truncate group-hover:text-amber-600 transition-colors">
            {trx.auction.title}
          </p>
          <p className="text-xs text-stone-500 mt-0.5">
            {role === "buyer" ? "Dibeli dari" : "Dijual ke"}{" "}
            <span className="text-stone-700 font-medium">@{counterpart}</span>
          </p>
          <p className="text-xs text-stone-400 mt-0.5">
            {formatDate(trx.createdAt)}
          </p>
        </div>

        {/* Amount + Status */}
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <p className="text-sm font-bold text-stone-900">
            {formatCurrency(trx.amount)}
          </p>
          <span
            className={`text-[11px] font-medium px-2 py-0.5 rounded border ${badge.color}`}
          >
            {badge.label}
          </span>
        </div>
      </div>
    </Link>
  );
}

function SkeletonCard() {
  return (
    <div className="flex items-center gap-4 p-4 bg-white border border-stone-200 rounded-lg animate-pulse">
      <div className="w-14 h-14 rounded-lg bg-stone-100 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-stone-100 rounded w-3/4" />
        <div className="h-3 bg-stone-100 rounded w-1/2" />
        <div className="h-3 bg-stone-100 rounded w-1/3" />
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className="h-4 bg-stone-100 rounded w-24" />
        <div className="h-5 bg-stone-100 rounded w-20" />
      </div>
    </div>
  );
}

export default function TransactionsPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoading(true); // ← pindah ke dalam `run()`, bukan di body effect langsung
      try {
        const params = { page, limit: 10 };
        if (status) params.status = status;

        const res = await api.get("/transactions", { params });
        if (!cancelled) {
          setTransactions(res.data.data.transactions);
          setPagination(res.data.data.pagination);
        }
      } catch (err) {
        if (!cancelled)
          toast.error(err.response?.data?.message ?? "Gagal memuat transaksi");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [status, page]);

  const handleStatusChange = (val) => {
    setStatus(val);
    setPage(1);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-stone-900">Transaksi</h1>
        <p className="text-sm text-stone-500 mt-1">
          Riwayat semua transaksi kamu sebagai buyer maupun seller.
        </p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => handleStatusChange(f.value)}
            className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
              status === f.value
                ? "bg-amber-500 border-amber-500 text-white"
                : "bg-white border-stone-200 text-stone-600 hover:border-stone-300"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : transactions.length === 0 ? (
          <div className="text-center py-16 text-stone-400">
            <i className="bx bx-receipt text-4xl mb-2 block" />
            <p className="text-sm">Belum ada transaksi.</p>
          </div>
        ) : (
          transactions.map((trx) => (
            <TransactionCard key={trx.id} trx={trx} username={user?.username} />
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-sm border border-stone-200 rounded-lg text-stone-600 hover:border-stone-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Sebelumnya
          </button>
          <span className="text-sm text-stone-500">
            {page} / {pagination.totalPages}
          </span>
          <button
            onClick={() =>
              setPage((p) => Math.min(pagination.totalPages, p + 1))
            }
            disabled={page === pagination.totalPages}
            className="px-3 py-1.5 text-sm border border-stone-200 rounded-lg text-stone-600 hover:border-stone-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Selanjutnya
          </button>
        </div>
      )}
    </div>
  );
}
