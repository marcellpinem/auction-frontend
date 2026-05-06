"use client";

import { useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Format email tidak valid"),
});

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async ({ email }) => {
    try {
      await api.post("/auth/forgot-password", { email });
      setSubmittedEmail(email);
      setSubmitted(true);
    } catch (err) {
      setError("root", {
        message: err.response?.data?.message || "Terjadi kesalahan. Coba lagi.",
      });
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white border border-stone-200 rounded-lg p-8 text-center">
          <div className="w-12 h-12 bg-green-50 border border-green-100 rounded-lg flex items-center justify-center mx-auto mb-6">
            <i className="bx bx-mail-send text-green-600 text-2xl" />
          </div>
          <h1 className="text-xl font-bold text-stone-900 mb-2">
            Cek Email Kamu
          </h1>
          <p className="text-stone-500 text-[15px] mb-1">
            Link reset password sudah dikirim ke
          </p>
          <p className="text-stone-700 font-medium text-[15px] mb-6">
            {submittedEmail}
          </p>
          <p className="text-stone-400 text-sm mb-6">
            Link berlaku selama 1 jam. Cek folder spam jika tidak ada di inbox.
          </p>
          <Link
            href="/login"
            className="text-amber-500 hover:text-amber-600 text-[15px] font-medium transition-colors"
          >
            Kembali ke Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-stone-200 rounded-lg p-8">
        <div className="w-12 h-12 bg-amber-50 border border-amber-100 rounded-lg flex items-center justify-center mb-6">
          <i className="bx bx-lock-open text-amber-500 text-2xl" />
        </div>

        <h1 className="text-xl font-bold text-stone-900 mb-2">Lupa Password</h1>
        <p className="text-stone-500 text-[15px] mb-6">
          Masukkan email kamu dan kami akan kirim link untuk reset password.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              Email
            </label>
            <input
              type="email"
              placeholder="email@contoh.com"
              {...register("email")}
              className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-[15px] text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
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
            {isSubmitting ? "Mengirim..." : "Kirim Link Reset"}
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
