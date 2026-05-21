"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Gavel, ArrowRight, ShieldCheck, Zap, Clock } from "lucide-react";
import axios from "@/lib/axios";
import AuctionCard from "@/components/common/AuctionCard";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Aman & Terpercaya",
    desc: "Setiap auction diverifikasi admin sebelum aktif. Dana di-hold otomatis selama proses lelang.",
  },
  {
    icon: Zap,
    title: "Buy Now",
    desc: "Tidak mau menunggu? Langsung beli dengan harga Buy Now yang dipasang seller.",
  },
  {
    icon: Clock,
    title: "Auto-Extend",
    desc: "Bid di detik terakhir? Waktu otomatis diperpanjang agar semua punya kesempatan yang adil.",
  },
];

export default function HomePage() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axios.get("/auctions", {
          params: { status: "active", sort: "ending_soon", limit: 8 },
        });
        setAuctions(res.data.data.auctions);
      } catch {
        // silent fail — landing page tetap tampil tanpa auction
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      {/* Hero */}
      <section className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center text-center gap-6">
          <div className="inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-sm font-medium px-4 py-1.5 rounded-full border border-amber-200 dark:border-amber-800">
            <Gavel className="w-4 h-4" />
            Platform Lelang Online
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-stone-900 dark:text-stone-50 leading-tight max-w-2xl">
            Temukan Barang Terbaik,
            <br />
            <span className="text-amber-500">Menangkan dengan Bid</span>
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-lg max-w-xl">
            Ikuti lelang secara real-time, pantau bid kamu, dan dapatkan barang
            impian dengan harga terbaik.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/auctions"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              Jelajahi Auction
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-medium px-6 py-3 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors"
            >
              Daftar Sekarang
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Auctions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-50">
              Auction Aktif
            </h2>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5">
              Segera berakhir — jangan sampai ketinggalan
            </p>
          </div>
          <Link
            href="/auctions"
            className="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1 transition-colors"
          >
            Lihat semua <ArrowRight className="w-4 h-4" />
          </Link>
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
                  <div className="h-5 bg-stone-100 dark:bg-stone-800 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : auctions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Gavel className="w-12 h-12 text-stone-300 dark:text-stone-600 mb-3" />
            <p className="text-stone-500 dark:text-stone-400">
              Belum ada auction aktif saat ini.
            </p>
            <Link
              href="/my-auctions/create"
              className="mt-4 text-sm text-amber-600 hover:text-amber-700 font-medium"
            >
              Buat auction pertama →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {auctions.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        )}
      </section>

      {/* Features */}
      <section className="border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-xl font-bold text-stone-900 dark:text-stone-50 text-center mb-8">
            Kenapa Pilih Platform Ini?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex flex-col items-center text-center gap-3 p-6 rounded-lg border border-stone-200 dark:border-stone-800"
              >
                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <Icon className="w-5 h-5 text-amber-500" />
                </div>
                <h3 className="font-semibold text-stone-900 dark:text-stone-50">
                  {title}
                </h3>
                <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
