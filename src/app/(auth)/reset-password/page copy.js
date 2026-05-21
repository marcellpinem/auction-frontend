"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z
  .object({
    password: z.string().min(8, "Password minimal 8 karakter"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (!token) router.replace("/forgot-password");
  }, [token, router]);

  const onSubmit = async ({ password, confirmPassword }) => {
    try {
      await api.post("/auth/reset-password", {
        token,
        password,
        confirmPassword,
      });
      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch (err) {
      setError("root", {
        message: err.response?.data?.message || "Terjadi kesalahan. Coba lagi.",
      });
    }
  };

  if (!token) return null;

  if (success) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white border border-stone-200 rounded-lg p-8 text-center">
          <div className="w-12 h-12 bg-green-50 border border-green-100 rounded-lg flex items-center justify-center mx-auto mb-6">
            <i className="bx bx-check text-green-600 text-2xl" />
          </div>
          <h1 className="text-xl font-bold text-stone-900 mb-2">
            Password Berhasil Direset
          </h1>
          <p className="text-stone-500 text-[15px] mb-6">
            Semua sesi aktif sudah dikeluarkan. Mengalihkan ke halaman login...
          </p>
          <Link
            href="/login"
            className="text-amber-500 hover:text-amber-600 text-[15px] font-medium transition-colors"
          >
            Login Sekarang
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-stone-200 rounded-lg p-8">
        <div className="w-12 h-12 bg-amber-50 border border-amber-100 rounded-lg flex items-center justify-center mb-6">
          <i className="bx bx-lock text-amber-500 text-2xl" />
        </div>

        <h1 className="text-xl font-bold text-stone-900 mb-2">
          Reset Password
        </h1>
        <p className="text-stone-500 text-[15px] mb-6">
          Buat password baru untuk akunmu.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              Password Baru
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Minimal 8 karakter"
                {...register("password")}
                className="w-full border border-stone-200 rounded-lg px-3 py-2.5 pr-10 text-[15px] text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <i
                  className={`bx ${showPassword ? "bx-hide" : "bx-show"} text-lg`}
                />
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              Konfirmasi Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Ulangi password baru"
                {...register("confirmPassword")}
                className="w-full border border-stone-200 rounded-lg px-3 py-2.5 pr-10 text-[15px] text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <i
                  className={`bx ${showConfirm ? "bx-hide" : "bx-show"} text-lg`}
                />
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {errors.root && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <p className="text-red-700 text-sm">{errors.root.message}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-stone-100 disabled:text-stone-400 text-white font-medium text-[15px] py-2.5 rounded-lg transition-colors"
          >
            {isSubmitting ? "Menyimpan..." : "Reset Password"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="text-stone-500 hover:text-stone-700 text-[15px] transition-colors"
          >
            ← Kembali ke Login
          </Link>
        </div>
      </div>
    </div>
  );
}
