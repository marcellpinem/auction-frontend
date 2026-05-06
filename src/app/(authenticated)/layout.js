"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AuthenticatedLayout({ children }) {
  const { isAuthenticated, isEmailVerified, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (!isEmailVerified && pathname !== "/verify-email") {
      router.replace("/verify-email");
    }
  }, [isLoading, isAuthenticated, isEmailVerified, pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;
  if (!isEmailVerified && pathname !== "/verify-email") return null;

  return <>{children}</>;
}
