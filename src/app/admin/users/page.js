"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import UserManageList from "@/components/admin/UserManageList";
import EmptyState from "@/components/common/EmptyState";
import Pagination from "@/components/common/Pagination";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Users } from "lucide-react";

const LIMIT = 20;

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 p-4 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 animate-pulse">
      <div className="w-10 h-10 rounded-full bg-stone-200 dark:bg-stone-700 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 w-40 bg-stone-200 dark:bg-stone-700 rounded" />
        <div className="h-3 w-64 bg-stone-200 dark:bg-stone-700 rounded" />
      </div>
      <div className="flex gap-2 shrink-0">
        <div className="h-8 w-20 bg-stone-200 dark:bg-stone-700 rounded" />
        <div className="h-8 w-16 bg-stone-200 dark:bg-stone-700 rounded" />
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: LIMIT };
      if (search) params.search = search;
      if (statusFilter !== "all") params.status = statusFilter;
      if (roleFilter !== "all") params.role = roleFilter;

      const res = await api.get("/admin/users", { params });
      setUsers(res.data.data.users);
      setTotal(res.data.data.pagination.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, roleFilter]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      try {
        const params = { page, limit: LIMIT };
        if (search) params.search = search;
        if (statusFilter !== "all") params.status = statusFilter;
        if (roleFilter !== "all") params.role = roleFilter;

        const res = await api.get("/admin/users", { params });
        if (!cancelled) {
          setUsers(res.data.data.users);
          setTotal(res.data.data.pagination.total);
        }
      } catch (err) {
        if (!cancelled) console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [page, search, statusFilter, roleFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleStatusChange = (val) => {
    setPage(1);
    setStatusFilter(val);
  };

  const handleRoleChange = (val) => {
    setPage(1);
    setRoleFilter(val);
  };

  // ─── Optimistic Updates ───────────────────────────────────────────────────

  const handleSuspended = (userId) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              is_suspended: true,
              suspended_until: new Date(Date.now() + 86400000).toISOString(),
            }
          : u,
      ),
    );
  };

  const handleUnsuspended = (userId) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, is_suspended: false, suspended_until: null }
          : u,
      ),
    );
  };

  const handleBanned = (userId) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              is_banned: true,
              is_suspended: false,
              suspended_until: null,
            }
          : u,
      ),
    );
  };

  const handleMadeAdmin = (userId) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: "admin" } : u)),
    );
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-stone-900 dark:text-stone-100">
          User Management
        </h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
          Kelola akun user — suspend, ban, atau promote ke admin.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-2 flex-1">
          <Input
            placeholder="Cari username atau email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" variant="outline" size="icon">
            <Search className="w-4 h-4" />
          </Button>
        </form>
        <Select value={statusFilter} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="banned">Banned</SelectItem>
          </SelectContent>
        </Select>
        <Select value={roleFilter} onValueChange={handleRoleChange}>
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Role</SelectItem>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Total */}
      {!loading && (
        <p className="text-sm text-stone-500 dark:text-stone-400">
          {total} user ditemukan
        </p>
      )}

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      ) : users.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Tidak ada user"
          description="Tidak ada user yang sesuai dengan filter yang dipilih."
        />
      ) : (
        <UserManageList
          users={users}
          onSuspended={handleSuspended}
          onUnsuspended={handleUnsuspended}
          onBanned={handleBanned}
          onMadeAdmin={handleMadeAdmin}
        />
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
