"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useEffect, useState } from "react";

import {
  Gavel,
  Bell,
  Wallet,
  User,
  LogOut,
  LayoutDashboard,
  Package,
  Bookmark,
  ClipboardList,
  Search,
  X,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";
import { toast } from "sonner";
import Image from "next/image";

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
  const router = useRouter();
  const searchParams = useSearchParams();

  const { isAuthenticated, user, logout } = useAuth();

  const { unreadCount, fetchUnreadCount } = useNotification();

  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const [search, setSearch] = useState(searchParams.get("search") || "");

  const isAuctionPage = pathname.startsWith("/auctions");

  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCount();
    }
  }, [isAuthenticated, fetchUnreadCount]);

  const handleLogout = async () => {
    await logout();
    toast.success("Berhasil logout.");
  };

  const handleSearch = (e) => {
    e.preventDefault();

    const query = search.trim();

    setMobileSearchOpen(false);

    if (!query) {
      router.push("/auctions");
      return;
    }

    router.push(`/auctions?search=${encodeURIComponent(query)}`);
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[#e8e8e8] bg-white">
        <div className="mx-auto max-w-[1366px] px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* LEFT */}
            <div className="flex items-center gap-4 lg:gap-10">
              {/* LOGO */}
              <Link href="/" className="flex shrink-0 items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-[#024ad8]">
                  <Gavel className="h-4 w-4 text-white" />
                </div>

                <span className="hidden text-[18px] font-medium text-[#1a1a1a] sm:block">
                  AuctionHub
                </span>
              </Link>
            </div>

            {/* RIGHT */}
            <div className="flex shrink-0 items-center gap-1 sm:gap-2">
              {/* DESKTOP SEARCH */}
              {!isAuctionPage && (
                <form onSubmit={handleSearch} className="hidden md:flex">
                  <div className="relative">
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search auctions..."
                      className="
                        h-11
                        w-[220px]
                        rounded-[4px]
                        border
                        border-[#c2c2c2]
                        bg-white
                        px-4
                        pr-11
                        text-[15px]
                        text-[#1a1a1a]
                        outline-none
                        transition-colors
                        placeholder:text-[#636363]
                        focus:border-[#1a1a1a]

                        lg:w-[320px]
                      "
                    />

                    <button
                      type="submit"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#636363]"
                    >
                      <Search className="h-4 w-4" />
                    </button>
                  </div>
                </form>
              )}

              {/* MOBILE SEARCH */}
              {!isAuctionPage && (
                <button
                  onClick={() => setMobileSearchOpen(true)}
                  className="flex h-11 w-11
                    items-center
                    justify-center
                    rounded-[4px]
                    border border-transparent text-[#1a1a1a] transition-colors hover:border-[#e8e8e8] hover:bg-[#f7f7f7] md:hidden
                  "
                >
                  <Search className="h-5 w-5" />
                </button>
              )}

              {isAuthenticated ? (
                <>
                  {/* NOTIFICATION */}
                  <Link
                    href="/notifications"
                    className="
                      relative
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-[4px]
                      border
                      border-transparent
                      text-[#636363]
                      transition-colors
                      hover:border-[#e8e8e8]
                      hover:bg-[#f7f7f7]
                    "
                  >
                    <Bell className="h-5 w-5" />

                    {unreadCount > 0 && (
                      <span
                        className="
                          absolute
                          right-2
                          top-2
                          flex
                          h-4
                          min-w-4
                          items-center
                          justify-center
                          rounded-full
                          bg-[#024ad8]
                          px-1
                          text-[10px]
                          font-bold
                          text-white
                        "
                      >
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </Link>

                  {/* USER MENU */}
                  <div className="relative">
                    <button
                      onClick={() => setUserMenuOpen((v) => !v)}
                      className="
                        flex
                        items-center
                        gap-3
                        rounded-[4px]
                        border
                        border-transparent
                        p-1.5
                        transition-colors
                        hover:border-[#e8e8e8]
                        hover:bg-[#f7f7f7]
                      "
                    >
                      {/* <div
                        className="
                          flex
                          h-8
                          w-8
                          items-center
                          justify-center
                          rounded-full
                          bg-[#024ad8]
                          text-xs
                          font-semibold
                          text-white
                        "
                      >
                        {user?.username?.[0]?.toUpperCase() ?? "U"}
                      </div> */}

                      <div
                        className="
    flex
    h-8
    w-8
    items-center
    justify-center
    overflow-hidden
    rounded-full
    bg-[#024ad8]
    text-xs
    font-semibold
    text-white
  "
                      >
                        {user?.avatar_url ? (
                          <Image
                            src={user.avatar_url}
                            alt={user?.username ?? "User avatar"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          (user?.username?.[0]?.toUpperCase() ?? "U")
                        )}
                      </div>

                      {/* DESKTOP USER INFO */}
                      <div className="hidden text-left xl:block">
                        <p className="text-sm font-medium text-[#1a1a1a]">
                          {user?.username}
                        </p>

                        <p className="max-w-[140px] truncate text-xs text-[#636363]">
                          {user?.email}
                        </p>
                      </div>
                    </button>

                    {userMenuOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setUserMenuOpen(false)}
                        />

                        <div
                          className="
                            absolute
                            right-0
                            top-full
                            z-20
                            mt-2
                            w-64
                            overflow-hidden
                            rounded-2xl
                            border
                            border-[#e8e8e8]
                            bg-white
                            shadow-[0_8px_24px_rgba(26,26,26,0.12)]
                          "
                        >
                          {/* HEADER */}
                          <div className="border-b border-[#e8e8e8] p-4">
                            <p className="text-sm font-medium text-[#1a1a1a]">
                              {user?.username}
                            </p>

                            <p className="mt-1 text-xs text-[#636363]">
                              {user?.email}
                            </p>
                          </div>

                          {/* NAVIGATION */}
                          <div className="p-2">
                            {AUTH_NAV.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setUserMenuOpen(false)}
                                className={`
                                  flex
                                  items-center
                                  gap-3
                                  rounded-lg
                                  px-3
                                  py-2.5
                                  text-[15px]
                                  transition-colors

                                  ${
                                    pathname.startsWith(item.href)
                                      ? "bg-[#f7f7f7] text-[#1a1a1a]"
                                      : "text-[#3d3d3d] hover:bg-[#f7f7f7]"
                                  }
                                `}
                              >
                                <item.icon className="h-4 w-4 text-[#636363]" />

                                {item.label}
                              </Link>
                            ))}
                          </div>

                          {/* FOOTER */}
                          <div className="border-t border-[#e8e8e8] p-2">
                            <Link
                              href="/profile"
                              onClick={() => setUserMenuOpen(false)}
                              className="
                                flex
                                items-center
                                gap-3
                                rounded-lg
                                px-3
                                py-2.5
                                text-[15px]
                                text-[#3d3d3d]
                                transition-colors
                                hover:bg-[#f7f7f7]
                              "
                            >
                              <User className="h-4 w-4 text-[#636363]" />
                              Profile
                            </Link>

                            <button
                              onClick={() => {
                                setUserMenuOpen(false);
                                handleLogout();
                              }}
                              className="
                                flex
                                w-full
                                items-center
                                gap-3
                                rounded-lg
                                px-3
                                py-2.5
                                text-left
                                text-[15px]
                                text-[#b3262b]
                                transition-colors
                                hover:bg-[#fff5f5]
                              "
                            >
                              <LogOut className="h-4 w-4" />
                              Logout
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  {/* LOGIN */}
                  <Link
                    href="/login"
                    className="
                      hidden
                      px-4
                      py-2
                      text-[15px]
                      font-medium
                      text-[#1a1a1a]

                      sm:block
                    "
                  >
                    Login
                  </Link>

                  {/* REGISTER */}
                  <Link
                    href="/register"
                    className="
                      flex
                      h-11
                      items-center
                      rounded-[4px]
                      bg-[#024ad8]
                      px-4
                      text-[13px]
                      font-semibold
                      uppercase
                      tracking-[0.7px]
                      text-white

                      sm:px-6
                      sm:text-[14px]
                    "
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE SEARCH OVERLAY */}
      {mobileSearchOpen && !isAuctionPage && (
        <div
          className="
            fixed
            inset-0
            z-[60]
            bg-white

            md:hidden
          "
        >
          <div className="border-b border-[#e8e8e8] px-4 py-3">
            <div className="flex items-center gap-3">
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <input
                    autoFocus
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search auctions..."
                    className="
                      h-11
                      w-full
                      rounded-[4px]
                      border
                      border-[#c2c2c2]
                      bg-white
                      px-4
                      pr-11
                      text-[15px]
                      text-[#1a1a1a]
                      outline-none
                      placeholder:text-[#636363]
                      focus:border-[#1a1a1a]
                    "
                  />

                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#636363]"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>
              </form>

              <button
                onClick={() => setMobileSearchOpen(false)}
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-[4px]
                  border
                  border-[#e8e8e8]
                "
              >
                <X className="h-5 w-5 text-[#1a1a1a]" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
