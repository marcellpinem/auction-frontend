"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SORT_OPTIONS = [
  { label: "Terbaru", value: "newest" },
  { label: "Segera Berakhir", value: "ending_soon" },
  { label: "Bid Tertinggi", value: "highest_bid" },
  { label: "Harga Terendah", value: "lowest_price" },
];

const STATUS_OPTIONS = [
  { label: "Semua", value: "all" },
  { label: "Aktif", value: "active" },
  { label: "Berakhir", value: "ended" },
];

export default function AuctionFilter({ categories = [] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (key, value) => {
      const params = new URLSearchParams(searchParams.toString());
      if (!value || value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  const handleSearch = useCallback(
    (e) => {
      if (e.key === "Enter") {
        updateParams("search", e.target.value.trim());
      }
    },
    [updateParams],
  );

  const handleSearchBlur = useCallback(
    (e) => {
      updateParams("search", e.target.value.trim());
    },
    [updateParams],
  );

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
      {/* Search */}
      <div className="relative flex-1 min-w-50">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
        <input
          type="text"
          placeholder="Cari auction..."
          defaultValue={searchParams.get("search") ?? ""}
          onKeyDown={handleSearch}
          onBlur={handleSearchBlur}
          className="w-full pl-9 pr-3 py-2 text-[15px] bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg text-stone-800 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:border-amber-400 dark:focus:border-amber-500 transition-colors"
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <SlidersHorizontal className="w-4 h-4 text-stone-400 hidden sm:block" />

        {/* Category */}
        <Select
          value={searchParams.get("categoryId") ?? "all"}
          onValueChange={(val) => updateParams("categoryId", val)}
        >
          <SelectTrigger className="w-37.5 bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800">
            <SelectValue placeholder="Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kategori</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status */}
        <Select
          value={searchParams.get("status") ?? "all"}
          onValueChange={(val) => updateParams("status", val)}
        >
          <SelectTrigger className="w-32.5 bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select
          value={searchParams.get("sort") ?? "newest"}
          onValueChange={(val) => updateParams("sort", val)}
        >
          <SelectTrigger className="w-40 bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800">
            <SelectValue placeholder="Urutkan" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
