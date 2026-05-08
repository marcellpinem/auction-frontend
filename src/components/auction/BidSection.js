// auction-frontend/src/components/auction/BidSection.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TrendingUp, ShoppingBag, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/axios";
import { formatCurrency } from "@/lib/utils";

export default function BidSection({ auction, onBidSuccess, onBuyNowSuccess }) {
  const router = useRouter();
  const { user } = useAuth();

  const [bidAmount, setBidAmount] = useState("");
  const [bidLoading, setBidLoading] = useState(false);
  const [buyNowLoading, setBuyNowLoading] = useState(false);
  const [error, setError] = useState(null);

  const minBid = auction.currentPrice + auction.bidIncrement;

  const handleBid = async () => {
    setError(null);
    const amount = parseInt(bidAmount);

    if (!amount || isNaN(amount)) {
      setError("Masukkan nominal bid yang valid.");
      return;
    }

    if (amount < minBid) {
      setError(`Bid minimal ${formatCurrency(minBid)}.`);
      return;
    }

    if (!user) {
      router.push("/login");
      return;
    }

    try {
      setBidLoading(true);
      const { data } = await api.post(`/auctions/${auction.id}/bids`, {
        amount,
      });
      setBidAmount("");
      onBidSuccess?.(data.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Gagal melakukan bid. Coba lagi.",
      );
    } finally {
      setBidLoading(false);
    }
  };

  const handleBuyNow = async () => {
    setError(null);

    if (!user) {
      router.push("/login");
      return;
    }

    try {
      setBuyNowLoading(true);
      const { data } = await api.post(`/auctions/${auction.id}/buy-now`);
      onBuyNowSuccess?.(data.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Gagal melakukan Buy Now. Coba lagi.",
      );
    } finally {
      setBuyNowLoading(false);
    }
  };

  const handleSetMinBid = () => {
    setBidAmount(String(minBid));
    setError(null);
  };

  return (
    <div className="space-y-3">
      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Bid input */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-stone-400 pointer-events-none">
              Rp
            </span>
            <Input
              type="number"
              placeholder={minBid.toLocaleString("id-ID")}
              value={bidAmount}
              onChange={(e) => {
                setBidAmount(e.target.value);
                setError(null);
              }}
              className="pl-9 dark:bg-stone-900 dark:border-stone-700"
              min={minBid}
              step={auction.bidIncrement}
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSetMinBid}
            className="shrink-0 text-xs border-stone-200 dark:border-stone-700"
          >
            Min
          </Button>
        </div>

        <p className="text-xs text-stone-400">
          Bid minimum:{" "}
          <button
            onClick={handleSetMinBid}
            className="font-medium text-amber-500 hover:underline"
          >
            {formatCurrency(minBid)}
          </button>{" "}
          · Termasuk fee 3%:{" "}
          <span className="text-stone-500">
            {formatCurrency(Math.ceil(minBid * 1.03))}
          </span>
        </p>
      </div>

      {/* Place Bid button */}
      <Button
        className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold"
        onClick={handleBid}
        disabled={bidLoading || buyNowLoading}
      >
        {bidLoading ? (
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
        ) : (
          <TrendingUp className="w-4 h-4 mr-2" />
        )}
        {bidLoading ? "Memproses..." : "Place Bid"}
      </Button>

      {/* Buy Now button */}
      {auction.isBuyNowActive && auction.buyNowPrice && (
        <Button
          variant="outline"
          className="w-full border-amber-200 text-amber-600 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-900/20 font-semibold"
          onClick={handleBuyNow}
          disabled={bidLoading || buyNowLoading}
        >
          {buyNowLoading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <ShoppingBag className="w-4 h-4 mr-2" />
          )}
          {buyNowLoading
            ? "Memproses..."
            : `Buy Now — ${formatCurrency(auction.buyNowPrice)}`}
        </Button>
      )}

      {/* Not logged in hint */}
      {!user && (
        <p className="text-xs text-center text-stone-400">
          <button
            onClick={() => router.push("/login")}
            className="text-amber-500 hover:underline font-medium"
          >
            Login
          </button>{" "}
          untuk melakukan bid.
        </p>
      )}
    </div>
  );
}
