"use client";

import AuctionCard from "@/components/common/AuctionCard";
import Pagination from "@/components/common/Pagination";

export default function AuctionGrid({
  auctions = [],
  pagination,
  emptyMessage = "Tidak ada auction ditemukan.",
}) {
  if (auctions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-stone-400 dark:text-stone-500 text-[15px]">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {auctions.map((auction) => (
          <AuctionCard key={auction.id} auction={auction} />
        ))}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <Pagination page={pagination.page} totalPages={pagination.totalPages} />
      )}
    </div>
  );
}
