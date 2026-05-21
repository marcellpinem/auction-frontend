"use client";

import { useEffect } from "react";

import { useRouter, usePathname } from "next/navigation";

import { Loader2 } from "lucide-react";

import { useAuth } from "@/context/AuthContext";

import Navbar from "@/components/common/Navbar";

export default function AuthenticatedLayout({ children }) {
  const { isAuthenticated, isEmailVerified, isLoading, user } = useAuth();

  const router = useRouter();

  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (user?.role === "admin") {
      router.replace("/admin");
      return;
    }

    if (!isEmailVerified && pathname !== "/verify-email") {
      router.replace("/verify-email");
    }
  }, [isLoading, isAuthenticated, isEmailVerified, user, pathname, router]);

  if (isLoading) {
    return (
      <div
        className="
          relative
          flex
          min-h-screen
          items-center
          justify-center
          overflow-hidden
          bg-[#f5f7fb]
        "
      >
        {/* BACKGROUND */}
        <div
          className="
            absolute
            left-[-120px]
            top-[-120px]
            h-[320px]
            w-[320px]
            rounded-full
            bg-[rgba(2,74,216,0.08)]
            blur-3xl
          "
        />

        <div
          className="
            absolute
            bottom-[-140px]
            right-[-120px]
            h-[320px]
            w-[320px]
            rounded-full
            bg-[rgba(245,158,11,0.08)]
            blur-3xl
          "
        />

        {/* LOADER */}
        <div
          className="
            relative
            z-10
            flex
            flex-col
            items-center
            gap-5
          "
        >
          <div
            className="
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-[28px]
              border
              border-white/70
              bg-white/80
              shadow-[0_10px_40px_rgba(0,0,0,0.06)]
              backdrop-blur
            "
          >
            <Loader2
              className="
                h-8
                w-8
                animate-spin
                text-[#024ad8]
              "
            />
          </div>

          <div className="text-center">
            <h2
              className="
                text-[18px]
                font-semibold
                tracking-[-0.4px]
                text-[#1a1a1a]
              "
            >
              Loading Session
            </h2>

            <p
              className="
                mt-1
                text-[14px]
                text-[#636363]
              "
            >
              Verifying your account access.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  if (user?.role === "admin") return null;

  if (!isEmailVerified && pathname !== "/verify-email") {
    return null;
  }

  return (
    <div
      className="
        min-h-screen
        bg-[#f5f7fb]
      "
    >
      {/* PAGE BACKGROUND */}
      <div
        className="
          fixed
          inset-0
          -z-10
          overflow-hidden
        "
      >
        <div
          className="
            absolute
            left-[-120px]
            top-[-120px]
            h-[300px]
            w-[300px]
            rounded-full
            bg-[rgba(2,74,216,0.05)]
            blur-3xl
          "
        />

        <div
          className="
            absolute
            bottom-[-120px]
            right-[-120px]
            h-[320px]
            w-[320px]
            rounded-full
            bg-[rgba(245,158,11,0.06)]
            blur-3xl
          "
        />
      </div>

      <Navbar />

      <main
        className="
          relative
          mx-auto
          w-full
          max-w-7xl
          px-4
          py-6

          sm:px-6
          sm:py-8

          lg:px-8
          lg:py-10
        "
      >
        {children}
      </main>
    </div>
  );
}
