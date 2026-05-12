"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import AuctionManageList from "@/components/admin/AuctionManageList";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Pagination from "@/components/common/Pagination";
import EmptyState from "@/components/common/EmptyState";
import { Search } from "lucide-react";

const STATUS_OPTIONS = [
  { value: "all", label: "Semua Status" },
  { value: "pending", label: "Pending" },
  { value: "active", label: "Active" },
  { value: "ended", label: "Ended" },
  { value: "cancelled", label: "Cancelled" },
];

export default function AdminAuctionsPage() {
  const [auctions, setAuctions] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;

    const fetchAuctions = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 12 };
        if (search) params.search = search;
        if (status !== "all") params.status = status;

        const res = await api.get("/admin/auctions", { params });
        if (!cancelled) {
          setAuctions(res.data.data.auctions);
          setPagination(res.data.data.pagination);
        }
      } catch (err) {
        if (!cancelled) console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchAuctions();
    return () => {
      cancelled = true;
    };
  }, [search, status, page]);

  const handleStatusChange = (val) => {
    setStatus(val);
    setPage(1);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleApproved = (auctionId) => {
    setAuctions((prev) =>
      prev.map((a) => (a.id === auctionId ? { ...a, status: "active" } : a)),
    );
  };

  const handleRejected = (auctionId) => {
    setAuctions((prev) =>
      prev.map((a) => (a.id === auctionId ? { ...a, status: "cancelled" } : a)),
    );
  };

  const handleForceStopped = (auctionId) => {
    setAuctions((prev) =>
      prev.map((a) => (a.id === auctionId ? { ...a, status: "cancelled" } : a)),
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
          Manajemen Auction
        </h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
          Review, approve, reject, dan force stop auction.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <Input
            placeholder="Cari judul auction..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
          />
        </form>

        <Select value={status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-full sm:w-44">
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

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-lg bg-stone-100 dark:bg-stone-800 animate-pulse"
            />
          ))}
        </div>
      ) : auctions.length === 0 ? (
        <EmptyState
          title="Tidak ada auction"
          description="Tidak ada auction yang cocok dengan filter yang dipilih."
        />
      ) : (
        <>
          <AuctionManageList
            auctions={auctions}
            onApproved={handleApproved}
            onRejected={handleRejected}
            onForceStopped={handleForceStopped}
          />
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
