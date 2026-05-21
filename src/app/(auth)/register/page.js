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
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

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
    <main className="min-h-screen bg-white">
      <div className="mx-auto flex min-h-screen max-w-341.5 items-center justify-center px-6 py-16">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl border border-[#e8e8e8] bg-white shadow-[0_2px_8px_rgba(26,26,26,0.08)] lg:grid-cols-2">
          {/* LEFT PANEL */}
          <div className="relative hidden overflow-hidden bg-[#f7f7f7] p-12 lg:flex lg:flex-col lg:justify-between">
            {/* Chevron Decoration */}
            <div className="absolute -left-10 top-0 h-40 w-20 skew-x-[-25deg] bg-[#024ad8]/30" />

            <div className="relative z-10 max-w-sm">
              <p className="mb-4 text-sm font-medium uppercase tracking-[1px] text-[#024ad8]">
                BidSpace Platform
              </p>

              <h1 className="text-5xl font-medium leading-none text-[#1a1a1a]">
                Create your account.
              </h1>

              <p className="mt-6 text-base leading-relaxed text-[#3d3d3d]">
                Start participating in auctions, manage bids, and access your
                personalized dashboard securely.
              </p>
            </div>

            <div className="relative z-10">
              <div className="rounded-2xl border border-[#e8e8e8] bg-white p-6">
                <p className="text-sm leading-relaxed text-[#636363]">
                  Enterprise-grade authentication with secure password handling
                  and email verification workflow.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="flex items-center bg-white px-6 py-12 sm:px-10 lg:px-14">
            <div className="w-full">
              {/* HEADER */}
              <div className="mb-10">
                <h2 className="text-[32px] font-medium leading-none text-[#1a1a1a]">
                  Register
                </h2>

                <p className="mt-3 text-base text-[#636363]">
                  Create a new account to continue
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* EMAIL */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#1a1a1a]">
                    Email
                  </label>

                  <input
                    {...register("email")}
                    type="email"
                    placeholder="you@example.com"
                    className="h-11 w-full rounded-lg border border-[#c2c2c2] bg-white px-4 text-[15px] text-[#1a1a1a] outline-none transition-colors focus:border-[#1a1a1a]"
                  />

                  {errors.email && (
                    <p className="text-sm text-[#b3262b]">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* PASSWORD */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#1a1a1a]">
                    Password
                  </label>

                  <div className="relative">
                    <input
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimum 8 characters"
                      className="h-11 w-full rounded-lg border border-[#c2c2c2] bg-white px-4 pr-11 text-[15px] text-[#1a1a1a] outline-none transition-colors focus:border-[#1a1a1a]"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#636363]"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {errors.password && (
                    <p className="text-sm text-[#b3262b]">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* CONFIRM PASSWORD */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#1a1a1a]">
                    Confirm Password
                  </label>

                  <div className="relative">
                    <input
                      {...register("confirmPassword")}
                      type={showConfirm ? "text" : "password"}
                      placeholder="Repeat your password"
                      className="h-11 w-full rounded-lg border border-[#c2c2c2] bg-white px-4 pr-11 text-[15px] text-[#1a1a1a] outline-none transition-colors focus:border-[#1a1a1a]"
                    />

                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#636363]"
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {errors.confirmPassword && (
                    <p className="text-sm text-[#b3262b]">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#024ad8] px-6 text-[14px] font-semibold uppercase tracking-[0.7px] text-white transition-colors disabled:bg-[#c2c2c2]"
                >
                  {isLoading && <Loader2 size={16} className="animate-spin" />}

                  {isLoading ? "Creating Account..." : "Create Account"}
                </button>
              </form>

              {/* FOOTER */}
              <div className="mt-10 border-t border-[#e8e8e8] pt-6">
                <p className="text-sm text-[#636363]">
                  Already have an account?{" "}
                  <Link href="/login" className="font-medium text-[#024ad8]">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
