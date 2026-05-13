"use client";

import { useState } from "react";
import Image from "next/image";
import api from "@/lib/axios";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UserX,
  ShieldOff,
  ShieldCheck,
  Shield,
  UserCircle,
} from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

const SUSPEND_DURATION_OPTIONS = [
  { value: "1_day", label: "1 Hari" },
  { value: "3_days", label: "3 Hari" },
  { value: "7_days", label: "7 Hari" },
  { value: "14_days", label: "14 Hari" },
  { value: "30_days", label: "30 Hari" },
];

function getUserStatusBadge(user) {
  if (user.is_banned)
    return {
      label: "Banned",
      className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
  if (
    user.is_suspended &&
    user.suspended_until &&
    new Date(user.suspended_until) > new Date()
  )
    return {
      label: "Suspended",
      className:
        "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    };
  if (user.role === "admin")
    return {
      label: "Admin",
      className:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    };
  return {
    label: "Active",
    className:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  };
}

export default function UserManageList({
  users,
  onSuspended,
  onUnsuspended,
  onBanned,
  onMadeAdmin,
}) {
  // Suspend
  const [suspendTarget, setSuspendTarget] = useState(null);
  const [suspendReason, setSuspendReason] = useState("");
  const [suspendDuration, setSuspendDuration] = useState("");
  const [suspendLoading, setSuspendLoading] = useState(false);
  const [suspendError, setSuspendError] = useState("");

  // Unsuspend
  const [unsuspendTarget, setUnsuspendTarget] = useState(null);
  const [unsuspendLoading, setUnsuspendLoading] = useState(false);

  // Ban
  const [banTarget, setBanTarget] = useState(null);
  const [banReason, setBanReason] = useState("");
  const [banLoading, setBanLoading] = useState(false);
  const [banError, setBanError] = useState("");

  // Make Admin
  const [adminTarget, setAdminTarget] = useState(null);
  const [adminLoading, setAdminLoading] = useState(false);

  // ─── Handlers ────────────────────────────────────────────────────────────

  const handleSuspend = async () => {
    if (!suspendReason.trim()) {
      setSuspendError("Alasan suspend wajib diisi.");
      return;
    }
    if (!suspendDuration) {
      setSuspendError("Pilih durasi suspend.");
      return;
    }
    setSuspendLoading(true);
    setSuspendError("");
    try {
      await api.post(`/admin/users/${suspendTarget.id}/suspend`, {
        reason: suspendReason.trim(),
        duration: suspendDuration,
      });
      onSuspended(suspendTarget.id);
      setSuspendTarget(null);
      setSuspendReason("");
      setSuspendDuration("");
    } catch (err) {
      setSuspendError(
        err.response?.data?.message ?? "Terjadi kesalahan, coba lagi.",
      );
    } finally {
      setSuspendLoading(false);
    }
  };

  const handleUnsuspend = async () => {
    setUnsuspendLoading(true);
    try {
      await api.post(`/admin/users/${unsuspendTarget.id}/unsuspend`);
      onUnsuspended(unsuspendTarget.id);
      setUnsuspendTarget(null);
    } catch (err) {
      console.error(err);
    } finally {
      setUnsuspendLoading(false);
    }
  };

  const handleBan = async () => {
    if (!banReason.trim()) {
      setBanError("Alasan ban wajib diisi.");
      return;
    }
    setBanLoading(true);
    setBanError("");
    try {
      await api.post(`/admin/users/${banTarget.id}/ban`, {
        reason: banReason.trim(),
      });
      onBanned(banTarget.id);
      setBanTarget(null);
      setBanReason("");
    } catch (err) {
      setBanError(
        err.response?.data?.message ?? "Terjadi kesalahan, coba lagi.",
      );
    } finally {
      setBanLoading(false);
    }
  };

  const handleMakeAdmin = async () => {
    setAdminLoading(true);
    try {
      await api.post(`/admin/users/${adminTarget.id}/make-admin`);
      onMadeAdmin(adminTarget.id);
      setAdminTarget(null);
    } catch (err) {
      console.error(err);
    } finally {
      setAdminLoading(false);
    }
  };

  const openSuspend = (user) => {
    setSuspendTarget(user);
    setSuspendReason("");
    setSuspendDuration("");
    setSuspendError("");
  };

  const openBan = (user) => {
    setBanTarget(user);
    setBanReason("");
    setBanError("");
  };

  const isSuspended = (user) =>
    user.is_suspended &&
    user.suspended_until &&
    new Date(user.suspended_until) > new Date();

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      <div className="space-y-3">
        {users.map((user) => {
          const badge = getUserStatusBadge(user);
          return (
            <div
              key={user.id}
              className="flex items-center gap-4 p-4 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900"
            >
              {/* Avatar */}
              <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 bg-stone-100 dark:bg-stone-800">
                {user.avatar_url ? (
                  <Image
                    src={user.avatar_url}
                    alt={user.username}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <UserCircle className="w-6 h-6 text-stone-400" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-stone-900 dark:text-stone-100 text-sm">
                    @{user.username}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.className}`}
                  >
                    {badge.label}
                  </span>
                  {user.strike_count > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                      {user.strike_count} Strike
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-stone-500 dark:text-stone-400 flex-wrap">
                  <span>{user.email}</span>
                  <span>·</span>
                  <span>
                    Bergabung{" "}
                    {format(new Date(user.created_at), "d MMM yyyy", {
                      locale: localeId,
                    })}
                  </span>
                  {isSuspended(user) && (
                    <>
                      <span>·</span>
                      <span className="text-orange-500">
                        Suspend hingga{" "}
                        {format(
                          new Date(user.suspended_until),
                          "d MMM yyyy HH:mm",
                          { locale: localeId },
                        )}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {!user.is_banned &&
                  !isSuspended(user) &&
                  user.role !== "admin" && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-orange-600 border-orange-200 hover:bg-orange-50 dark:hover:bg-orange-900/20 gap-1.5"
                        onClick={() => openSuspend(user)}
                      >
                        <ShieldOff className="w-3.5 h-3.5" />
                        Suspend
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 gap-1.5"
                        onClick={() => openBan(user)}
                      >
                        <UserX className="w-3.5 h-3.5" />
                        Ban
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-blue-600 border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 gap-1.5"
                        onClick={() => setAdminTarget(user)}
                      >
                        <Shield className="w-3.5 h-3.5" />
                        Make Admin
                      </Button>
                    </>
                  )}
                {isSuspended(user) && !user.is_banned && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-600 border-green-200 hover:bg-green-50 dark:hover:bg-green-900/20 gap-1.5"
                      onClick={() => setUnsuspendTarget(user)}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Unsuspend
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 gap-1.5"
                      onClick={() => openBan(user)}
                    >
                      <UserX className="w-3.5 h-3.5" />
                      Ban
                    </Button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Suspend Dialog ─────────────────────────────────────────────── */}
      <Dialog
        open={!!suspendTarget}
        onOpenChange={(open) => !open && setSuspendTarget(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Suspend User</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-stone-600 dark:text-stone-400">
              Suspend akun{" "}
              <span className="font-semibold text-stone-900 dark:text-stone-100">
                @{suspendTarget?.username}
              </span>
              . User tidak bisa login selama masa suspend.
            </p>
            <Select
              value={suspendDuration}
              onValueChange={(v) => {
                setSuspendDuration(v);
                if (suspendError) setSuspendError("");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih durasi suspend" />
              </SelectTrigger>
              <SelectContent>
                {SUSPEND_DURATION_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Tulis alasan suspend..."
              value={suspendReason}
              onChange={(e) => {
                setSuspendReason(e.target.value);
                if (suspendError) setSuspendError("");
              }}
              rows={3}
              className="resize-none"
            />
            {suspendError && (
              <p className="text-xs text-red-500">{suspendError}</p>
            )}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setSuspendTarget(null)}
              disabled={suspendLoading}
            >
              Batal
            </Button>
            <Button
              className="bg-orange-600 hover:bg-orange-700 text-white"
              onClick={handleSuspend}
              disabled={suspendLoading}
            >
              {suspendLoading ? "Memproses..." : "Suspend User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Unsuspend Dialog ───────────────────────────────────────────── */}
      <Dialog
        open={!!unsuspendTarget}
        onOpenChange={(open) => !open && setUnsuspendTarget(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cabut Suspend</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-stone-600 dark:text-stone-400">
            Kamu akan mencabut suspend pada akun{" "}
            <span className="font-semibold text-stone-900 dark:text-stone-100">
              @{unsuspendTarget?.username}
            </span>
            . User bisa login kembali setelah ini.
          </p>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setUnsuspendTarget(null)}
              disabled={unsuspendLoading}
            >
              Batal
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleUnsuspend}
              disabled={unsuspendLoading}
            >
              {unsuspendLoading ? "Memproses..." : "Ya, Cabut Suspend"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Ban Dialog ─────────────────────────────────────────────────── */}
      <Dialog
        open={!!banTarget}
        onOpenChange={(open) => {
          if (!open) {
            setBanTarget(null);
            setBanReason("");
            setBanError("");
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ban User Permanen</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-stone-600 dark:text-stone-400">
              Ban permanen akun{" "}
              <span className="font-semibold text-stone-900 dark:text-stone-100">
                @{banTarget?.username}
              </span>
              . User tidak bisa login selamanya. Tindakan ini tidak bisa
              dibatalkan.
            </p>
            <Textarea
              placeholder="Tulis alasan ban..."
              value={banReason}
              onChange={(e) => {
                setBanReason(e.target.value);
                if (banError) setBanError("");
              }}
              rows={3}
              className="resize-none"
            />
            {banError && <p className="text-xs text-red-500">{banError}</p>}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setBanTarget(null);
                setBanReason("");
                setBanError("");
              }}
              disabled={banLoading}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleBan}
              disabled={banLoading}
            >
              {banLoading ? "Memproses..." : "Ban Permanen"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Make Admin Dialog ──────────────────────────────────────────── */}
      <Dialog
        open={!!adminTarget}
        onOpenChange={(open) => !open && setAdminTarget(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Jadikan Admin</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-stone-600 dark:text-stone-400">
            Kamu akan menjadikan{" "}
            <span className="font-semibold text-stone-900 dark:text-stone-100">
              @{adminTarget?.username}
            </span>{" "}
            sebagai admin. User akan mendapat akses penuh ke panel admin.
          </p>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setAdminTarget(null)}
              disabled={adminLoading}
            >
              Batal
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleMakeAdmin}
              disabled={adminLoading}
            >
              {adminLoading ? "Memproses..." : "Ya, Jadikan Admin"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
