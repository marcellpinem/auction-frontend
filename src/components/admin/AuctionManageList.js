"use client";

import { useState } from "react";
import Image from "next/image";
import api from "@/lib/axios";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { CheckCircle, XCircle, StopCircle, ImageOff } from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

const STATUS_BADGE = {
  pending:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  active:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  ended: "bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const STATUS_LABEL = {
  pending: "Pending",
  active: "Active",
  ended: "Ended",
  cancelled: "Cancelled",
};

export default function AuctionManageList({
  auctions,
  onApproved,
  onRejected,
  onForceStopped,
}) {
  // Approve
  const [approveTarget, setApproveTarget] = useState(null);
  const [approveLoading, setApproveLoading] = useState(false);

  // Reject
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectLoading, setRejectLoading] = useState(false);
  const [rejectError, setRejectError] = useState("");

  // Force Stop
  const [forceTarget, setForceTarget] = useState(null);
  const [forceReason, setForceReason] = useState("");
  const [forceLoading, setForceLoading] = useState(false);
  const [forceError, setForceError] = useState("");

  // ─── Handlers ────────────────────────────────────────────────────────────

  const handleApprove = async () => {
    setApproveLoading(true);
    try {
      await api.post(`/admin/auctions/${approveTarget.id}/approve`);
      onApproved(approveTarget.id);
      setApproveTarget(null);
    } catch (err) {
      console.error(err);
    } finally {
      setApproveLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      setRejectError("Alasan reject wajib diisi.");
      return;
    }
    setRejectLoading(true);
    setRejectError("");
    try {
      await api.post(`/admin/auctions/${rejectTarget.id}/reject`, {
        reason: rejectReason.trim(),
      });
      onRejected(rejectTarget.id);
      setRejectTarget(null);
      setRejectReason("");
    } catch (err) {
      setRejectError(
        err.response?.data?.message ?? "Terjadi kesalahan, coba lagi.",
      );
    } finally {
      setRejectLoading(false);
    }
  };

  const handleForceStop = async () => {
    if (!forceReason.trim()) {
      setForceError("Alasan force stop wajib diisi.");
      return;
    }
    setForceLoading(true);
    setForceError("");
    try {
      await api.post(`/admin/auctions/${forceTarget.id}/force-stop`, {
        reason: forceReason.trim(),
      });
      onForceStopped(forceTarget.id);
      setForceTarget(null);
      setForceReason("");
    } catch (err) {
      setForceError(
        err.response?.data?.message ?? "Terjadi kesalahan, coba lagi.",
      );
    } finally {
      setForceLoading(false);
    }
  };

  const openReject = (auction) => {
    setRejectTarget(auction);
    setRejectReason("");
    setRejectError("");
  };

  const openForceStop = (auction) => {
    setForceTarget(auction);
    setForceReason("");
    setForceError("");
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      <div className="space-y-3">
        {auctions.map((auction) => (
          <div
            key={auction.id}
            className="flex items-center gap-4 p-4 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900"
          >
            {/* Thumbnail */}
            <div className="relative w-14 h-14 rounded-md overflow-hidden shrink-0 bg-stone-100 dark:bg-stone-800">
              {auction.imageUrl ? (
                <Image
                  src={auction.imageUrl}
                  alt={auction.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageOff className="w-5 h-5 text-stone-400" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-stone-900 dark:text-stone-100 truncate text-sm">
                  {auction.title}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[auction.status]}`}
                >
                  {STATUS_LABEL[auction.status]}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs text-stone-500 dark:text-stone-400 flex-wrap">
                <span>@{auction.seller.username}</span>
                <span>·</span>
                <span>{auction.category.name}</span>
                <span>·</span>
                <span>{formatCurrency(auction.startingPrice)}</span>
                <span>·</span>
                <span>
                  {format(new Date(auction.createdAt), "d MMM yyyy", {
                    locale: localeId,
                  })}
                </span>
              </div>
              {auction.status === "cancelled" &&
                (auction.rejectionReason || auction.cancelReason) && (
                  <p className="text-xs text-red-500 mt-1 truncate">
                    Alasan: {auction.rejectionReason ?? auction.cancelReason}
                  </p>
                )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {auction.status === "pending" && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-green-600 border-green-200 hover:bg-green-50 dark:hover:bg-green-900/20 gap-1.5"
                    onClick={() => setApproveTarget(auction)}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 gap-1.5"
                    onClick={() => openReject(auction)}
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Reject
                  </Button>
                </>
              )}
              {auction.status === "active" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 gap-1.5"
                  onClick={() => openForceStop(auction)}
                >
                  <StopCircle className="w-3.5 h-3.5" />
                  Force Stop
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Approve Dialog ─────────────────────────────────────────────── */}
      <Dialog
        open={!!approveTarget}
        onOpenChange={(open) => !open && setApproveTarget(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Approve Auction</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-stone-600 dark:text-stone-400">
            Kamu akan menyetujui auction{" "}
            <span className="font-semibold text-stone-900 dark:text-stone-100">
              &ldquo;{approveTarget?.title}&rdquo;
            </span>
            . Auction akan langsung aktif setelah di-approve.
          </p>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setApproveTarget(null)}
              disabled={approveLoading}
            >
              Batal
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleApprove}
              disabled={approveLoading}
            >
              {approveLoading ? "Memproses..." : "Ya, Approve"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Reject Dialog ──────────────────────────────────────────────── */}
      <Dialog
        open={!!rejectTarget}
        onOpenChange={(open) => {
          if (!open) {
            setRejectTarget(null);
            setRejectReason("");
            setRejectError("");
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Auction</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-stone-600 dark:text-stone-400">
              Berikan alasan penolakan untuk auction{" "}
              <span className="font-semibold text-stone-900 dark:text-stone-100">
                &ldquo;{rejectTarget?.title}&rdquo;
              </span>
              . Alasan akan dikirim ke seller via notifikasi.
            </p>
            <Textarea
              placeholder="Tulis alasan reject..."
              value={rejectReason}
              onChange={(e) => {
                setRejectReason(e.target.value);
                if (rejectError) setRejectError("");
              }}
              rows={3}
              className="resize-none"
            />
            {rejectError && (
              <p className="text-xs text-red-500">{rejectError}</p>
            )}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setRejectTarget(null);
                setRejectReason("");
                setRejectError("");
              }}
              disabled={rejectLoading}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={rejectLoading}
            >
              {rejectLoading ? "Memproses..." : "Reject Auction"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Force Stop Dialog ──────────────────────────────────────────── */}
      <Dialog
        open={!!forceTarget}
        onOpenChange={(open) => {
          if (!open) {
            setForceTarget(null);
            setForceReason("");
            setForceError("");
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Force Stop Auction</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-stone-600 dark:text-stone-400">
              Menghentikan auction{" "}
              <span className="font-semibold text-stone-900 dark:text-stone-100">
                &ldquo;{forceTarget?.title}&rdquo;
              </span>{" "}
              akan membatalkan semua bid dan mengembalikan saldo bidder.
              Tindakan ini tidak bisa dibatalkan.
            </p>
            <Textarea
              placeholder="Tulis alasan force stop..."
              value={forceReason}
              onChange={(e) => {
                setForceReason(e.target.value);
                if (forceError) setForceError("");
              }}
              rows={3}
              className="resize-none"
            />
            {forceError && <p className="text-xs text-red-500">{forceError}</p>}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setForceTarget(null);
                setForceReason("");
                setForceError("");
              }}
              disabled={forceLoading}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleForceStop}
              disabled={forceLoading}
            >
              {forceLoading ? "Memproses..." : "Force Stop"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
