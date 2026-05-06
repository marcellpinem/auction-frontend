"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Gavel,
  Users,
  Tag,
  BarChart3,
  LogOut,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import axios from "@/lib/axios";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/auctions", label: "Auctions", icon: Gavel },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/categories", label: "Categories", icon: Tag },
];

function isActive(item, pathname) {
  if (item.exact) return pathname === item.href;
  return pathname.startsWith(item.href);
}

function SidebarContent({ pathname, user, onLinkClick, onLogout }) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-5">
        <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center shrink-0">
          <ShieldCheck className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-stone-900 dark:text-stone-100 text-[15px] hidden md:block">
          Admin Panel
        </span>
      </div>

      <Separator className="bg-stone-200 dark:bg-stone-800" />

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item, pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onLinkClick}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-colors",
                active
                  ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                  : "text-stone-600 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100",
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="hidden md:block">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <Separator className="bg-stone-200 dark:bg-stone-800" />

      {/* User & Logout */}
      <div className="px-2 py-4 space-y-0.5">
        <div className="flex items-center gap-3 px-3 py-2.5">
          <div className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center shrink-0">
            <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase">
              {user?.username?.[0] ?? "A"}
            </span>
          </div>
          <div className="hidden md:block min-w-0">
            <p className="text-[13px] font-medium text-stone-900 dark:text-stone-100 truncate">
              {user?.username}
            </p>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
              Administrator
            </p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium w-full transition-colors text-stone-600 hover:bg-red-50 hover:text-red-600 dark:text-stone-400 dark:hover:bg-red-500/10 dark:hover:text-red-400"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span className="hidden md:block">Logout</span>
        </button>
      </div>
    </div>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout");
    } catch {}
    logout();
    router.replace("/login");
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden sm:flex flex-col w-14 md:w-56 h-screen bg-white dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 fixed left-0 top-0 z-30">
        <SidebarContent
          pathname={pathname}
          user={user}
          onLinkClick={() => {}}
          onLogout={handleLogout}
        />
      </aside>

      {/* Mobile Header */}
      <header className="sm:hidden fixed top-0 left-0 right-0 z-30 h-14 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center">
            <ShieldCheck className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-stone-900 dark:text-stone-100 text-[15px]">
            Admin Panel
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(true)}
          className="w-9 h-9"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <>
          <div
            className="sm:hidden fixed inset-0 z-40 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="sm:hidden fixed left-0 top-0 bottom-0 z-50 w-64 bg-white dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800">
            <div className="flex items-center justify-between px-4 py-5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-bold text-stone-900 dark:text-stone-100 text-[15px]">
                  Admin Panel
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileOpen(false)}
                className="w-8 h-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <Separator className="bg-stone-200 dark:bg-stone-800" />
            <nav className="px-2 py-4 space-y-0.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item, pathname);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-colors",
                      active
                        ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                        : "text-stone-600 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100",
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <Separator className="bg-stone-200 dark:bg-stone-800" />
            <div className="px-2 py-4">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium w-full transition-colors text-stone-600 hover:bg-red-50 hover:text-red-600 dark:text-stone-400 dark:hover:bg-red-500/10 dark:hover:text-red-400"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </aside>
        </>
      )}
    </>
  );
}
