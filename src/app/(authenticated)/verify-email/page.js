"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, updateUser, logout } = useAuth();

  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [resending, setResending] = useState(false);

  const verifyCalledRef = useRef(false);

  const handleVerify = useCallback(
    async (token) => {
      setStatus("verifying");
      try {
        await api.post("/auth/verify-email", { token });
        updateUser({ isEmailVerified: true });
        setStatus("success");
        setTimeout(() => router.push("/dashboard"), 2000);
      } catch (err) {
        setStatus("error");
        setMessage(
          err.response?.data?.message ||
            "Token tidak valid atau sudah expired.",
        );
      }
    },
    [updateUser, router],
  );

  useEffect(() => {
    const token = searchParams.get("token");
    if (token && !verifyCalledRef.current) {
      verifyCalledRef.current = true;
      handleVerify(token);
    }
  }, [searchParams, handleVerify]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  const handleResend = async () => {
    setResending(true);
    try {
      await api.post("/auth/resend-verification");
      setCooldown(60);
      setMessage("Email verifikasi telah dikirim ulang.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Gagal mengirim ulang email.");
    } finally {
      setResending(false);
    }
  };

  if (status === "verifying") {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-stone-600 text-[15px]">Memverifikasi email...</p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <i className="bx bx-check text-green-600 text-2xl" />
          </div>
          <h1 className="text-xl font-bold text-stone-900 mb-2">
            Email Terverifikasi
          </h1>
          <p className="text-stone-500 text-[15px]">
            Mengalihkan ke dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-stone-200 rounded-lg p-8">
        {/* Icon */}
        <div className="w-12 h-12 bg-amber-50 border border-amber-100 rounded-lg flex items-center justify-center mb-6">
          <i className="bx bx-envelope text-amber-500 text-2xl" />
        </div>

        <h1 className="text-xl font-bold text-stone-900 mb-2">
          Verifikasi Email
        </h1>
        <p className="text-stone-500 text-[15px] mb-6">
          Kami sudah mengirim link verifikasi ke{" "}
          <span className="text-stone-700 font-medium">{user?.email}</span>. Cek
          inbox atau folder spam kamu.
        </p>

        {/* Error state */}
        {status === "error" && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-6">
            <p className="text-red-700 text-sm">{message}</p>
          </div>
        )}

        {/* Resend feedback */}
        {status === "idle" && message && (
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-6">
            <p className="text-green-700 text-sm">{message}</p>
          </div>
        )}

        <button
          onClick={handleResend}
          disabled={resending || cooldown > 0}
          className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-stone-100 disabled:text-stone-400 text-white font-medium text-[15px] py-2.5 rounded-lg transition-colors mb-4"
        >
          {resending
            ? "Mengirim..."
            : cooldown > 0
              ? `Kirim ulang dalam ${cooldown}s`
              : "Kirim Ulang Email"}
        </button>

        <button
          onClick={logout}
          className="w-full text-stone-500 hover:text-stone-700 text-[15px] py-2 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
