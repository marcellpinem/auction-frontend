"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { registerSchema } from "@/lib/zodSchemas/auth.schema";
import api from "@/lib/axios";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await api.post("/auth/register", data);
      toast.success("Registrasi berhasil! Silakan login.");
      router.push("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registrasi gagal");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-stone-900">Buat Akun</h1>
          <p className="text-sm text-stone-500 mt-1">
            Daftar untuk mulai bidding
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-stone-200 rounded-lg p-6 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Email
              </label>
              <input
                {...register("email")}
                type="text"
                placeholder="kamu@email.com"
                className="w-full px-3 py-2 text-[15px] border border-stone-200 rounded-lg bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimal 8 karakter"
                  className="w-full px-3 py-2 pr-10 text-[15px] border border-stone-200 rounded-lg bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Konfirmasi Password
              </label>
              <div className="relative">
                <input
                  {...register("confirmPassword")}
                  type={showConfirm ? "text" : "password"}
                  placeholder="Ulangi password"
                  className="w-full px-3 py-2 pr-10 text-[15px] border border-stone-200 rounded-lg bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-medium text-[15px] rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              {isLoading ? "Mendaftar..." : "Daftar"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-stone-500 mt-4">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="text-amber-600 hover:text-amber-700 font-medium transition-colors"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
