"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import AuctionForm from "@/components/auction/AuctionForm";
import api from "@/lib/axios";

export default function CreateAuctionPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api
      .get("/categories")
      .then((res) => {
        setCategories(res.data.data);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Kembali
          </button>
          <h1 className="text-2xl font-bold text-stone-800 dark:text-stone-100">
            Buat Auction Baru
          </h1>
          <p className="text-sm text-stone-400 mt-1">
            Auction akan direview admin sebelum ditayangkan.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg p-6">
          <AuctionForm categories={categories} />
        </div>
      </div>
    </div>
  );
}
