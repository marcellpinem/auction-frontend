"use client";

import Image from "next/image";
import { formatCurrency } from "@/lib/utils";

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-start py-2.5 border-b border-stone-100 last:border-0">
    <span className="text-sm text-stone-500">{label}</span>
    <span className="text-sm font-medium text-stone-900 text-right max-w-[60%]">
      {value}
    </span>
  </div>
);

export default function TransactionInfo({ transaction, role }) {
  if (!transaction) return null;

  const { id, amount, fee, auction, buyer, seller, createdAt, autoReleaseAt } =
    transaction;

  return (
    <div className="space-y-4">
      {/* Item */}
      <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
        {auction.imageUrl && (
          <div className="relative w-full h-40">
            <Image
              src={auction.imageUrl}
              alt={auction.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="p-4">
          <p className="text-xs text-stone-400 uppercase tracking-wider mb-1">
            Item
          </p>
          <p className="text-sm font-semibold text-stone-900">
            {auction.title}
          </p>
        </div>
      </div>

      {/* Nominal */}
      <div className="bg-white border border-stone-200 rounded-lg p-4">
        <p className="text-xs text-stone-400 uppercase tracking-wider mb-3">
          Ringkasan Pembayaran
        </p>
        <InfoRow label="Harga Akhir" value={formatCurrency(amount)} />
        <InfoRow label="Biaya Layanan (3%)" value={formatCurrency(fee)} />
        <div className="flex justify-between items-center pt-2.5 mt-1">
          <span className="text-sm font-semibold text-stone-700">
            Total Ditahan
          </span>
          <span className="text-sm font-bold text-amber-600">
            {formatCurrency(amount + fee)}
          </span>
        </div>
      </div>

      {/* Kontak */}
      <div className="bg-white border border-stone-200 rounded-lg p-4">
        <p className="text-xs text-stone-400 uppercase tracking-wider mb-3">
          Informasi Kontak
        </p>
        <InfoRow label="Buyer" value={buyer.username} />
        <InfoRow
          label="Kontak Buyer"
          value={
            buyer.contactInfo ?? (
              <span className="text-stone-400 italic">Belum diisi</span>
            )
          }
        />
        <InfoRow label="Seller" value={seller.username} />
        <InfoRow
          label="Kontak Seller"
          value={
            seller.contactInfo ?? (
              <span className="text-stone-400 italic">Belum diisi</span>
            )
          }
        />
      </div>

      {/* Meta */}
      <div className="bg-white border border-stone-200 rounded-lg p-4">
        <p className="text-xs text-stone-400 uppercase tracking-wider mb-3">
          Detail Transaksi
        </p>
        <InfoRow
          label="ID Transaksi"
          value={<span className="font-mono text-xs">{id}</span>}
        />
        <InfoRow
          label="Dibuat"
          value={new Date(createdAt).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        />
        {autoReleaseAt && (
          <InfoRow
            label="Auto-release"
            value={new Date(autoReleaseAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          />
        )}
      </div>
    </div>
  );
}
