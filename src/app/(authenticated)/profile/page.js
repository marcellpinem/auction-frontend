"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "@/lib/axios";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";

// ─── Strike Badge ────────────────────────────────────────────────────────────

const StrikeBadge = ({ count }) => {
  if (count === 0) return null;

  const config = {
    1: {
      label: "Strike 1/3 — Peringatan",
      color: "bg-amber-50 border-amber-300 text-amber-700",
      icon: "bx bx-error",
      desc: "Kamu pernah tidak melakukan konfirmasi pembayaran dalam 24 jam setelah menang auction.",
    },
    2: {
      label: "Strike 2/3 — Riwayat Suspend",
      color: "bg-orange-50 border-orange-300 text-orange-700",
      icon: "bx bx-error-circle",
      desc: "Akun kamu pernah disuspend karena bid & run. Strike selanjutnya akan mengakibatkan ban permanen.",
    },
    3: {
      label: "Strike 3/3 — Akun Dibanned",
      color: "bg-red-50 border-red-300 text-red-700",
      icon: "bx bx-block",
      desc: "Akun kamu telah dibanned secara permanen karena tiga kali bid & run.",
    },
  };

  const cfg = config[Math.min(count, 3)];

  return (
    <div
      className={`flex items-start gap-3 rounded-lg border px-4 py-3 ${cfg.color}`}
    >
      <i className={`${cfg.icon} mt-0.5 text-lg shrink-0`} />
      <div>
        <p className="text-sm font-semibold">{cfg.label}</p>
        <p className="text-xs mt-0.5 opacity-80">{cfg.desc}</p>
      </div>
    </div>
  );
};

// ─── Avatar Upload ────────────────────────────────────────────────────────────

const AvatarUpload = ({ currentUrl, username, onUpload }) => {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      toast.error("Format tidak didukung. Gunakan JPG, PNG, atau WEBP.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 2MB.");
      return;
    }

    setUploading(true);
    try {
      const { data: presigned } = await axios.post("/upload/presigned-url", {
        fileName: file.name,
        fileType: file.type,
        folder: "avatars",
      });

      await fetch(presigned.data.presignedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      await axios.put("/profile/avatar", { avatarUrl: presigned.data.fileUrl });
      onUpload(presigned.data.fileUrl);
      toast.success("Foto profil berhasil diperbarui.");
    } catch {
      toast.error("Gagal mengupload foto. Coba lagi.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const initials = username?.slice(0, 2).toUpperCase() ?? "??";

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative w-24 h-24 rounded-full overflow-hidden bg-stone-200 cursor-pointer group"
        onClick={() => !uploading && fileRef.current?.click()}
      >
        {currentUrl ? (
          <Image src={currentUrl} alt="Avatar" fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-stone-500">
            {initials}
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          {uploading ? (
            <i className="bx bx-loader-alt animate-spin text-white text-xl" />
          ) : (
            <i className="bx bx-camera text-white text-xl" />
          )}
        </div>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFile}
      />
      <button
        type="button"
        onClick={() => !uploading && fileRef.current?.click()}
        className="text-xs text-amber-600 hover:text-amber-700 font-medium transition-colors"
        disabled={uploading}
      >
        {uploading ? "Mengupload..." : "Ganti foto"}
      </button>
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [fullName, setFullName] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        const { data } = await axios.get("/profile");
        setProfile(data.data);
        setFullName(data.data.fullName ?? "");
        setContactInfo(data.data.contactInfo ?? "");
        setShippingAddress(data.data.shippingAddress ?? "");
      } catch {
        toast.error("Gagal memuat profil.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const { data } = await axios.put("/profile", {
        fullName: fullName || undefined,
        contactInfo: contactInfo || undefined,
        shippingAddress: shippingAddress || undefined,
      });
      setProfile((prev) => ({ ...prev, ...data.data }));
      toast.success("Profil berhasil disimpan.");
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Gagal menyimpan profil.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Password baru tidak cocok.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password baru minimal 8 karakter.");
      return;
    }
    setSavingPassword(true);
    try {
      await axios.put("/profile/password", { currentPassword, newPassword });
      toast.success("Password berhasil diubah. Silakan login kembali.");
      setTimeout(() => logout(), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Gagal mengubah password.");
    } finally {
      setSavingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-xl font-bold text-stone-900 dark:text-stone-50">
        Profil Saya
      </h1>

      {/* Strike Warning */}
      {profile?.strikeCount > 0 && <StrikeBadge count={profile.strikeCount} />}

      {/* Avatar & Info Dasar */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <AvatarUpload
            currentUrl={profile?.avatarUrl}
            username={profile?.username}
            onUpload={(url) =>
              setProfile((prev) => ({ ...prev, avatarUrl: url }))
            }
          />
          <div className="flex-1 space-y-1 text-center sm:text-left">
            <p className="text-lg font-semibold text-stone-900 dark:text-stone-50">
              {profile?.username}
            </p>
            <p className="text-sm text-stone-500 dark:text-stone-400">
              {profile?.email}
            </p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
              <span className="inline-flex items-center gap-1 text-xs bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 px-2 py-1 rounded-md">
                <i className="bx bx-user" />
                {profile?.role === "admin" ? "Admin" : "User"}
              </span>
              {profile?.isEmailVerified && (
                <span className="inline-flex items-center gap-1 text-xs bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-md">
                  <i className="bx bx-check-circle" />
                  Email Terverifikasi
                </span>
              )}
              {profile?.strikeCount > 0 && (
                <span className="inline-flex items-center gap-1 text-xs bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-1 rounded-md">
                  <i className="bx bx-error-circle" />
                  {profile.strikeCount} Strike
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Form Edit Profil */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-6">
        <h2 className="text-base font-semibold text-stone-900 dark:text-stone-50 mb-4">
          Informasi Profil
        </h2>
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="fullName">Nama Lengkap</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Masukkan nama lengkap"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="contactInfo">Info Kontak</Label>
            <Input
              id="contactInfo"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              placeholder="Contoh: wa.me/628xxx"
            />
            <p className="text-xs text-stone-500">
              Ditampilkan ke pihak lain hanya saat transaksi berlangsung.
            </p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="shippingAddress">Alamat Pengiriman</Label>
            <Textarea
              id="shippingAddress"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              placeholder="Masukkan alamat lengkap"
              rows={3}
            />
          </div>
          <Button
            type="submit"
            className="bg-amber-500 hover:bg-amber-600 text-white"
            disabled={savingProfile}
          >
            {savingProfile ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </form>
      </div>

      {/* Ganti Password */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-6">
        <h2 className="text-base font-semibold text-stone-900 dark:text-stone-50 mb-4">
          Ganti Password
        </h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="currentPassword">Password Saat Ini</Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Masukkan password saat ini"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="newPassword">Password Baru</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimal 8 karakter"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ulangi password baru"
              required
            />
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="border-stone-300 dark:border-stone-700"
                disabled={
                  !currentPassword ||
                  !newPassword ||
                  !confirmPassword ||
                  savingPassword
                }
              >
                {savingPassword ? "Memproses..." : "Ganti Password"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Ganti Password?</AlertDialogTitle>
                <AlertDialogDescription>
                  Semua sesi login akan diakhiri dan kamu perlu login ulang
                  setelah password diganti.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleChangePassword}
                  className="bg-amber-500 hover:bg-amber-600 text-white"
                >
                  Ya, Ganti Password
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </form>
      </div>
    </div>
  );
}
