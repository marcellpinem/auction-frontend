"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import api from "@/lib/axios";
import TransactionTimeline from "@/components/transaction/TransactionTimeline";
import TransactionInfo from "@/components/transaction/TransactionInfo";
import { useAuth } from "@/hooks/useAuth";

export default function TransactionDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchTransaction = async () => {
    try {
      const res = await api.get(`/transactions/${id}`);
      setTransaction(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Gagal memuat transaksi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    const run = async () => {
      try {
        const res = await api.get(`/transactions/${id}`);
        if (!cancelled) setTransaction(res.data.data);
      } catch (err) {
        if (!cancelled)
          toast.error(err.response?.data?.message ?? "Gagal memuat transaksi");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const role =
    user?.id === transaction?.buyer?.id
      ? "buyer"
      : user?.id === transaction?.seller?.id
        ? "seller"
        : null;

  // Fallback: cek via username kalau id tidak ada di response
  const resolvedRole = (() => {
    if (!transaction || !user) return null;
    if (transaction.buyer.username === user.username) return "buyer";
    if (transaction.seller.username === user.username) return "seller";
    return null;
  })();

  const handleConfirmReady = async () => {
    setActionLoading(true);
    try {
      await api.post(`/transactions/${id}/confirm-ready`);
      toast.success("Konfirmasi siap bayar berhasil");
      fetchTransaction();
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Gagal konfirmasi");
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmShipped = async () => {
    setActionLoading(true);
    try {
      await api.post(`/transactions/${id}/confirm-shipped`);
      toast.success("Konfirmasi pengiriman berhasil");
      fetchTransaction();
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Gagal konfirmasi");
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmReceived = async () => {
    setActionLoading(true);
    try {
      await api.post(`/transactions/${id}/confirm-received`);
      toast.success("Transaksi selesai!");
      fetchTransaction();
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Gagal konfirmasi");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
        <div className="h-6 w-40 bg-stone-100 rounded animate-pulse" />
        <div className="h-48 bg-stone-100 rounded-lg animate-pulse" />
        <div className="h-64 bg-stone-100 rounded-lg animate-pulse" />
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center text-stone-500">
        Transaksi tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-xl font-bold text-stone-900">Detail Transaksi</h1>

      <TransactionTimeline
        status={transaction.status}
        role={resolvedRole}
        onConfirmReady={handleConfirmReady}
        onConfirmShipped={handleConfirmShipped}
        onConfirmReceived={handleConfirmReceived}
        loading={actionLoading}
      />

      <TransactionInfo transaction={transaction} role={resolvedRole} />
    </div>
  );
}
