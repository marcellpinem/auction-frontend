"use client";

import {
  ArrowDownLeft,
  ArrowUpRight,
  Lock,
  Unlock,
  Percent,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const TYPE_CONFIG = {
  topup: {
    label: "Top Up",
    icon: ArrowDownLeft,
    colorClass: "text-green-600",
    bgClass: "bg-green-50",
    sign: "+",
  },
  withdraw: {
    label: "Withdraw",
    icon: ArrowUpRight,
    colorClass: "text-red-500",
    bgClass: "bg-red-50",
    sign: "-",
  },
  hold: {
    label: "Hold Bid",
    icon: Lock,
    colorClass: "text-amber-600",
    bgClass: "bg-amber-50",
    sign: "-",
  },
  release: {
    label: "Release",
    icon: Unlock,
    colorClass: "text-blue-500",
    bgClass: "bg-blue-50",
    sign: "+",
  },
  fee: {
    label: "Fee Transaksi",
    icon: Percent,
    colorClass: "text-stone-500",
    bgClass: "bg-stone-100",
    sign: "-",
  },
};

const FILTER_OPTIONS = [
  { value: "", label: "Semua" },
  { value: "topup", label: "Top Up" },
  { value: "withdraw", label: "Withdraw" },
  { value: "hold", label: "Hold" },
  { value: "release", label: "Release" },
  { value: "fee", label: "Fee" },
];

const formatDate = (dateStr) => {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateStr));
};

export default function TransactionList({
  transactions = [],
  pagination = {},
  activeFilter = "",
  onFilterChange,
  onPageChange,
  loading = false,
}) {
  return (
    <div className="bg-white border border-stone-200 rounded-lg">
      {/* Header + Filter */}
      <div className="px-6 py-4 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-base font-semibold text-stone-900">
          Riwayat Transaksi
        </h2>
        <div className="flex gap-2 flex-wrap">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onFilterChange(opt.value)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                activeFilter === opt.value
                  ? "bg-amber-500 border-amber-500 text-white"
                  : "bg-white border-stone-200 text-stone-600 hover:border-amber-400"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="px-6 py-12 text-center text-sm text-stone-400">
          Memuat...
        </div>
      ) : transactions.length === 0 ? (
        <div className="px-6 py-12 text-center text-sm text-stone-400">
          Belum ada transaksi
        </div>
      ) : (
        <ul className="divide-y divide-stone-100">
          {transactions.map((trx) => {
            const config = TYPE_CONFIG[trx.type] || TYPE_CONFIG.fee;
            const Icon = config.icon;
            return (
              <li key={trx.id} className="px-6 py-4 flex items-center gap-4">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${config.bgClass}`}
                >
                  <Icon className={`w-4 h-4 ${config.colorClass}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-800">
                    {config.label}
                  </p>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {formatDate(trx.createdAt)}
                  </p>
                </div>
                <p
                  className={`text-sm font-semibold shrink-0 ${config.colorClass}`}
                >
                  {config.sign}
                  {formatCurrency(trx.amount)}
                </p>
              </li>
            );
          })}
        </ul>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="px-6 py-4 border-t border-stone-100 flex items-center justify-between">
          <p className="text-xs text-stone-400">{pagination.total} transaksi</p>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="px-3 py-1.5 text-xs border border-stone-200 rounded-lg text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Prev
            </button>
            <span className="px-3 py-1.5 text-xs text-stone-500">
              {pagination.page} / {pagination.totalPages}
            </span>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="px-3 py-1.5 text-xs border border-stone-200 rounded-lg text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
