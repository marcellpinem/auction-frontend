"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Gavel,
  Menu,
  X,
  Bell,
  Wallet,
  User,
  LogOut,
  LayoutDashboard,
  Package,
  Bookmark,
  ClipboardList,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const NAV_LINKS = [{ label: "Browse Auction", href: "/auctions" }];

const AUTH_NAV = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Auction Saya", href: "/my-auctions", icon: Package },
  { label: "Bid Saya", href: "/my-bids", icon: Gavel },
  { label: "Watchlist", href: "/watchlist", icon: Bookmark },
  { label: "Wallet", href: "/wallet", icon: Wallet },
  { label: "Transaksi", href: "/transactions", icon: ClipboardList },
];

export default function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success("Berhasil logout.");
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-stone-800 dark:text-stone-100"
          >
            <Gavel className="w-5 h-5 text-amber-500" />
            <span>AuctionHub</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg text-[15px] transition-colors ${
                  pathname.startsWith(link.href)
                    ? "bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-100 font-medium"
                    : "text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800/50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <Link
                  href="/notifications"
                  className="relative p-2 rounded-lg text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  <Bell className="w-5 h-5" />
                </Link>

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen((v) => !v)}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs font-bold">
                      {user?.username?.[0]?.toUpperCase() ?? "U"}
                    </div>
                  </button>

                  {userMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 top-full mt-1 w-52 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg shadow-sm z-20 py-1 overflow-hidden">
                        <div className="px-3 py-2 border-b border-stone-100 dark:border-stone-800">
                          <p className="text-sm font-medium text-stone-800 dark:text-stone-100">
                            {user?.username}
                          </p>
                          <p className="text-xs text-stone-400 truncate">
                            {user?.email}
                          </p>
                        </div>
                        {AUTH_NAV.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 text-[15px] text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                          >
                            <item.icon className="w-4 h-4 text-stone-400" />
                            {item.label}
                          </Link>
                        ))}
                        <div className="border-t border-stone-100 dark:border-stone-800 mt-1 pt-1">
                          <Link
                            href="/profile"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 text-[15px] text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                          >
                            <User className="w-4 h-4 text-stone-400" />
                            Profile
                          </Link>
                          <button
                            onClick={() => {
                              setUserMenuOpen(false);
                              handleLogout();
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-[15px] text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Logout
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-[15px] text-stone-600 dark:text-stone-300 hover:text-stone-800 dark:hover:text-stone-100 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-3 py-1.5 text-[15px] bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors font-medium"
                >
                  Daftar
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-4 py-3 space-y-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2 rounded-lg text-[15px] transition-colors ${
                pathname.startsWith(link.href)
                  ? "bg-stone-100 dark:bg-stone-800 font-medium text-stone-800 dark:text-stone-100"
                  : "text-stone-600 dark:text-stone-300"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {!isAuthenticated && (
            <div className="flex gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex-1 text-center px-3 py-2 text-[15px] border border-stone-200 dark:border-stone-700 rounded-lg text-stone-600 dark:text-stone-300"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="flex-1 text-center px-3 py-2 text-[15px] bg-amber-500 text-white rounded-lg font-medium"
              >
                Daftar
              </Link>
            </div>
          )}
          {isAuthenticated && (
            <div className="pt-2 border-t border-stone-100 dark:border-stone-800 space-y-1">
              {AUTH_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[15px] text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                >
                  <item.icon className="w-4 h-4 text-stone-400" />
                  {item.label}
                </Link>
              ))}
              <button
                onClick={() => {
                  setMobileOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[15px] text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
