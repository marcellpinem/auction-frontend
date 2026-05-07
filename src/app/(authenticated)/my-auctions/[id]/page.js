"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import AuctionForm from "@/components/auction/AuctionForm";
import api from "@/lib/axios";

export default function EditAuctionPage() {
  const { id } = useParams();
  const router = useRouter();

  const [auction, setAuction] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [auctionRes, categoriesRes] = await Promise.all([
          api.get(`/auctions/${id}`),
          api.get("/categories"),
        ]);

        const auctionData = auctionRes.data.data;

        if (auctionData.status !== "pending") {
          setError("Hanya auction berstatus pending yang bisa diedit.");
          return;
        }

        setAuction(auctionData);
        setCategories(categoriesRes.data.data);
      } catch (err) {
        const status = err.response?.status;
        if (status === 404) setError("Auction tidak ditemukan.");
        else if (status === 403)
          setError("Kamu tidak memiliki akses ke auction ini.");
        else setError("Gagal memuat data. Coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (!error) return;

    router.push(`/auctions/${id}`);
  }, [error, id, router]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-12 rounded-lg bg-stone-100 dark:bg-stone-800 animate-pulse"
            style={{ width: `${100 - i * 5}%` }}
          />
        ))}
      </div>
    );
  }

  if (error) {
    return null;
  }

  // if (error) {
  //   router.push(`/auctions/${id}`);

  //   // return (
  //   //   <div className="max-w-2xl mx-auto px-4 py-16 text-center">
  //   //     <AlertCircle className="w-12 h-12 text-stone-300 mx-auto mb-4" />
  //   //     <p className="text-stone-500 mb-6">{error}</p>
  //   //     <Button variant="outline" onClick={() => router.push("/my-auctions")}>
  //   //       Kembali ke My Auctions
  //   //     </Button>
  //   //   </div>
  //   // );
  // }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <Link
          href="/my-auctions"
          className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-amber-500 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          My Auctions
        </Link>
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
          Edit Auction
        </h1>
        <p className="text-sm text-stone-500">
          Auction ID:{" "}
          <span className="font-mono text-stone-700 dark:text-stone-300">
            {auction.id}
          </span>
        </p>
      </div>

      {/* Form */}
      <AuctionForm
        categories={categories}
        initialData={auction}
        mode="edit"
        auctionId={id}
      />
    </div>
  );
}
