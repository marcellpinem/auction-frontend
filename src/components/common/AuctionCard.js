"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, Gavel, Zap } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import CountdownTimer from "./CountdownTimer";

export default function AuctionCard({ auction }) {
  const {
    id,
    title,
    currentPrice,
    buyNowPrice,
    isBuyNowActive,
    endsAt,
    status,
    imageUrl,
    category,
    totalBids,
  } = auction;

  const isEnded = status === "ended" || status === "cancelled";

  return (
    <Link href={`/auctions/${id}`} className="group block">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg overflow-hidden hover:border-amber-400 dark:hover:border-amber-500 transition-colors duration-200">
        {/* Image */}
        <div className="relative aspect-4/3 bg-stone-100 dark:bg-stone-800 overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              loading="eager"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Gavel className="w-10 h-10 text-stone-300 dark:text-stone-600" />
            </div>
          )}

          {/* Status badge */}
          <div className="absolute top-2 left-2 z-10">
            {isEnded ? (
              <span className="px-2 py-0.5 text-xs font-medium bg-stone-700 text-stone-200 rounded">
                Berakhir
              </span>
            ) : (
              <span className="px-2 py-0.5 text-xs font-medium bg-green-500 text-white rounded">
                Aktif
              </span>
            )}
          </div>

          {/* Buy Now badge */}
          {isBuyNowActive && buyNowPrice && !isEnded && (
            <div className="absolute top-2 right-2 z-10">
              <span className="px-2 py-0.5 text-xs font-medium bg-amber-500 text-white rounded flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Buy Now
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3">
          {/* Category */}
          <p className="text-xs text-stone-400 dark:text-stone-500 mb-1">
            {category?.name}
          </p>

          {/* Title */}
          <h3 className="text-[15px] font-medium text-stone-800 dark:text-stone-100 line-clamp-2 mb-3 leading-snug">
            {title}
          </h3>

          {/* Price */}
          <div className="flex items-end justify-between mb-2">
            <div>
              <p className="text-xs text-stone-400 dark:text-stone-500">
                {totalBids > 0 ? "Bid tertinggi" : "Harga awal"}
              </p>
              <p className="text-base font-bold text-amber-500">
                {formatCurrency(currentPrice)}
              </p>
            </div>
            {totalBids > 0 && (
              <p className="text-xs text-stone-400 dark:text-stone-500">
                {totalBids} bid
              </p>
            )}
          </div>

          {/* Timer */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            {isEnded ? (
              <span>Auction telah berakhir</span>
            ) : endsAt ? (
              <CountdownTimer endsAt={endsAt} compact />
            ) : (
              <span>Menunggu aktivasi</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
