"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  Clock,
  Tag,
  User,
  TrendingUp,
  ShoppingBag,
  Eye,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AuctionImages from "@/components/auction/AuctionImages";
import BidSection from "@/components/auction/BidSection";
import BidHistory from "@/components/auction/BidHistory";
import CountdownTimer from "@/components/common/CountdownTimer";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/axios";
import { formatCurrency, formatDate } from "@/lib/utils";

const STATUS_CONFIG = {
  pending: {
    label: "Belum Diverifikasi",
    class: "bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400",
  },
  active: {
    label: "Berlangsung",
    class:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
  ended: {
    label: "Selesai",
    class: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  cancelled: {
    label: "Dibatalkan",
    class: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
};

export default function AuctionDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bidRefreshTrigger, setBidRefreshTrigger] = useState(0);

  useEffect(() => {
    if (authLoading) return;

    const fetchAuction = async () => {
      try {
        const { data } = await api.get(`/auctions/${id}`);
        setAuction(data.data);
      } catch (err) {
        const status = err.response?.status;
        if (status === 404) setError("Auction tidak ditemukan.");
        else setError("Gagal memuat auction. Coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchAuction();
  }, [id, authLoading]);

  const handleBidSuccess = (bid) => {
    setAuction((prev) => ({
      ...prev,
      currentPrice: bid.amount,
      bidIncrement: Math.max(
        1000,
        Math.ceil(Math.ceil(bid.amount * 0.02) / 1000) * 1000,
      ),
      totalBids: prev.totalBids + 1,
      isBuyNowActive: false,
    }));
    setBidRefreshTrigger((n) => n + 1);
  };

  const handleBuyNowSuccess = () => {
    setAuction((prev) => ({
      ...prev,
      status: "ended",
      isBuyNowActive: false,
    }));
    setBidRefreshTrigger((n) => n + 1);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-3">
            <div className="aspect-4/3 rounded-lg bg-stone-100 dark:bg-stone-800 animate-pulse" />
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-16 h-16 rounded-md bg-stone-100 dark:bg-stone-800 animate-pulse"
                />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-6 rounded bg-stone-100 dark:bg-stone-800 animate-pulse"
                style={{ width: `${80 - i * 8}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-12 h-12 text-stone-300 mx-auto mb-4" />
        <p className="text-stone-500 mb-6">{error}</p>
        <Button variant="outline" onClick={() => router.back()}>
          Kembali
        </Button>
      </div>
    );
  }

  const isSeller = user?.id === auction.sellerId;
  const statusConfig = STATUS_CONFIG[auction.status] ?? STATUS_CONFIG.pending;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-stone-500">
        <Link
          href="/auctions"
          className="hover:text-amber-500 transition-colors flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          Semua Auction
        </Link>
        <span>/</span>
        <span className="text-stone-700 dark:text-stone-300 truncate max-w-xs">
          {auction.title}
        </span>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Kiri — Images */}
        <div>
          <AuctionImages images={auction.images} />
        </div>

        {/* Kanan — Info */}
        <div className="space-y-5">
          {/* Status + Category */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={`${statusConfig.class} border-0 font-medium`}>
              {statusConfig.label}
            </Badge>
            <Badge
              variant="outline"
              className="text-stone-500 border-stone-200 dark:border-stone-700"
            >
              <Tag className="w-3 h-3 mr-1" />
              {auction.category.name}
            </Badge>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100 leading-snug">
            {auction.title}
          </h1>

          {/* Seller */}
          <div className="flex items-center gap-2 text-sm text-stone-500">
            <User className="w-4 h-4" />
            <span>Dijual oleh</span>
            <span className="font-medium text-stone-700 dark:text-stone-300">
              {auction.seller.username}
            </span>
          </div>

          {/* Price block */}
          <div className="rounded-lg border border-stone-200 dark:border-stone-700 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-stone-400 mb-0.5 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Harga Saat Ini
                </p>
                <p className="text-2xl font-bold text-amber-500">
                  {formatCurrency(auction.currentPrice)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-stone-400 mb-0.5">Total Bid</p>
                <p className="text-lg font-semibold text-stone-700 dark:text-stone-300">
                  {auction.totalBids}x
                </p>
              </div>
            </div>

            {/* Min next bid */}
            {auction.status === "active" && (
              <div className="text-xs text-stone-500 bg-stone-50 dark:bg-stone-800 rounded px-3 py-2">
                Bid minimum berikutnya:{" "}
                <span className="font-semibold text-stone-700 dark:text-stone-300">
                  {formatCurrency(auction.currentPrice + auction.bidIncrement)}
                </span>
              </div>
            )}

            {/* Buy Now price info (non-active) */}
            {!auction.isBuyNowActive &&
              auction.buyNowPrice &&
              auction.status === "active" && (
                <div className="flex items-center gap-1.5 text-xs text-stone-400 pt-1 border-t border-stone-100 dark:border-stone-700">
                  <ShoppingBag className="w-3 h-3" />
                  Buy Now tidak tersedia setelah ada bid masuk
                </div>
              )}

            {/* Buy Now price (active) */}
            {auction.isBuyNowActive && auction.buyNowPrice && (
              <div className="flex items-center justify-between pt-1 border-t border-stone-100 dark:border-stone-700">
                <div className="flex items-center gap-1.5 text-sm">
                  <ShoppingBag className="w-4 h-4 text-amber-500" />
                  <span className="text-stone-600 dark:text-stone-400">
                    Buy Now
                  </span>
                </div>
                <span className="font-semibold text-stone-800 dark:text-stone-200">
                  {formatCurrency(auction.buyNowPrice)}
                </span>
              </div>
            )}
          </div>

          {/* Countdown */}
          {auction.status === "active" && auction.endsAt && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="text-stone-500">Berakhir dalam:</span>
              <CountdownTimer
                endsAt={auction.endsAt}
                className="font-semibold text-stone-800 dark:text-stone-200"
              />
            </div>
          )}

          {auction.status === "ended" && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-sm">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              Auction ini telah berakhir pada {formatDate(auction.endsAt)}.
            </div>
          )}

          {auction.status === "cancelled" && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Auction dibatalkan.</p>
                {auction.cancelReason && (
                  <p className="mt-0.5 text-red-600/80 dark:text-red-400/80">
                    Alasan: {auction.cancelReason}
                  </p>
                )}
              </div>
            </div>
          )}

          {auction.status === "pending" && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-stone-50 dark:bg-stone-800 text-stone-500 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p>Auction ini sedang menunggu verifikasi admin.</p>
                {auction.rejectionReason && (
                  <p className="mt-0.5 text-red-500">
                    Ditolak: {auction.rejectionReason}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Bid Section */}
          {auction.status === "active" && (
            <div className="rounded-lg border border-stone-200 dark:border-stone-700 p-4">
              {isSeller ? (
                <div className="flex items-center gap-2 text-sm text-stone-500 justify-center py-2">
                  <Eye className="w-4 h-4" />
                  <span>Kamu adalah seller dari auction ini.</span>
                </div>
              ) : (
                <BidSection
                  auction={auction}
                  onBidSuccess={handleBidSuccess}
                  onBuyNowSuccess={handleBuyNowSuccess}
                />
              )}
            </div>
          )}

          {/* Dates */}
          <div className="text-xs text-stone-400 space-y-1 pt-1 border-t border-stone-100 dark:border-stone-800">
            {auction.startedAt && (
              <p>Dimulai: {formatDate(auction.startedAt)}</p>
            )}
            {auction.endsAt && <p>Berakhir: {formatDate(auction.endsAt)}</p>}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
          Deskripsi
        </h2>
        <p className="text-[15px] text-stone-600 dark:text-stone-400 leading-relaxed whitespace-pre-wrap">
          {auction.description}
        </p>
      </div>

      {/* Bid History */}
      {auction.status !== "pending" && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
            Riwayat Bid
          </h2>
          <BidHistory
            auctionId={auction.id}
            refreshTrigger={bidRefreshTrigger}
          />
        </div>
      )}
    </div>
  );
}
