"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
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
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;
  if (user?.role === "admin") return null;
  if (!isEmailVerified && pathname !== "/verify-email") return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
