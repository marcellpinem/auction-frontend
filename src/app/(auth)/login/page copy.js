"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { loginSchema } from "@/lib/zodSchemas/auth.schema";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await api.post("/auth/login", data);
      const { accessToken, user } = res.data.data;
      login(accessToken, user);

      if (!user.isEmailVerified) {
        router.push("/verify-email");
      } else if (user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login gagal");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-stone-900">Selamat Datang</h1>
          <p className="text-sm text-stone-500 mt-1">Login ke akun kamu</p>
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
                type="email"
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
                  placeholder="Password kamu"
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

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm text-amber-600 hover:text-amber-700 transition-colors"
              >
                Lupa password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-medium text-[15px] rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              {isLoading ? "Login..." : "Login"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-stone-500 mt-4">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="text-amber-600 hover:text-amber-700 font-medium transition-colors"
          >
            Daftar sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}
