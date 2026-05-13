"use client";

import { useState, useEffect, useRef } from "react";
import axiosInstance from "@/lib/axios";
import FinancialChart from "@/components/admin/FinancialChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrendingUp, DollarSign, Calendar, Clock } from "lucide-react";

const PERIOD_OPTIONS = [
  { label: "Hari Ini", value: "day" },
  { label: "7 Hari", value: "week" },
  { label: "30 Hari", value: "month" },
  { label: "Custom", value: "custom" },
];

function formatRupiah(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount ?? 0);
}

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatCard({ title, value, icon: Icon, loading }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-stone-500 dark:text-stone-400">
            {title}
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950 flex items-center justify-center">
            <Icon size={16} className="text-amber-500" />
          </div>
        </div>
        {loading ? (
          <div className="h-7 w-32 bg-stone-200 dark:bg-stone-700 rounded animate-pulse" />
        ) : (
          <p className="text-xl font-bold text-stone-900 dark:text-stone-100">
            {value}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const [period, setPeriod] = useState("month");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [overview, setOverview] = useState(null);
  const [overviewLoading, setOverviewLoading] = useState(true);

  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });
  const [txLoading, setTxLoading] = useState(true);
  const [txPage, setTxPage] = useState(1);

  const overviewAbort = useRef(null);
  const txAbort = useRef(null);

  useEffect(() => {
    if (period === "custom") return;
    overviewAbort.current?.abort();
    overviewAbort.current = new AbortController();
    const signal = overviewAbort.current.signal;

    async function load() {
      setOverviewLoading(true);
      try {
        const res = await axiosInstance.get("/admin/financial/overview", {
          params: { period },
          signal,
        });
        setOverview(res.data.data);
      } catch (err) {
        if (err.name !== "CanceledError") console.error(err);
      } finally {
        setOverviewLoading(false);
      }
    }
    load();
    return () => overviewAbort.current?.abort();
  }, [period]);

  useEffect(() => {
    txAbort.current?.abort();
    txAbort.current = new AbortController();
    const signal = txAbort.current.signal;

    async function load() {
      setTxLoading(true);
      try {
        const res = await axiosInstance.get("/admin/financial/transactions", {
          params: { page: txPage, limit: 20 },
          signal,
        });
        setTransactions(res.data.data.transactions);
        setPagination(res.data.data.pagination);
      } catch (err) {
        if (err.name !== "CanceledError") console.error(err);
      } finally {
        setTxLoading(false);
      }
    }
    load();
    return () => txAbort.current?.abort();
  }, [txPage]);

  async function handleCustomApply() {
    if (!customStart || !customEnd) return;
    overviewAbort.current?.abort();
    overviewAbort.current = new AbortController();
    setOverviewLoading(true);
    try {
      const res = await axiosInstance.get("/admin/financial/overview", {
        params: {
          period: "custom",
          startDate: customStart,
          endDate: customEnd,
        },
        signal: overviewAbort.current.signal,
      });
      setOverview(res.data.data);
    } catch (err) {
      if (err.name !== "CanceledError") console.error(err);
    } finally {
      setOverviewLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold text-stone-900 dark:text-stone-100">
          Dashboard Admin
        </h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
          Overview pemasukan platform dari fee transaksi.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total All-Time"
          value={formatRupiah(overview?.totalAllTime)}
          icon={TrendingUp}
          loading={overviewLoading}
        />
        <StatCard
          title="Bulan Ini"
          value={formatRupiah(overview?.totalThisMonth)}
          icon={Calendar}
          loading={overviewLoading}
        />
        <StatCard
          title="Minggu Ini"
          value={formatRupiah(overview?.totalThisWeek)}
          icon={Clock}
          loading={overviewLoading}
        />
      </div>

      {/* Chart Section */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="text-base font-semibold">
              Pemasukan Fee
            </CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              {PERIOD_OPTIONS.map((opt) => (
                <Button
                  key={opt.value}
                  size="sm"
                  variant={period === opt.value ? "default" : "outline"}
                  className={
                    period === opt.value
                      ? "bg-amber-500 hover:bg-amber-600 text-white border-0"
                      : ""
                  }
                  onClick={() => setPeriod(opt.value)}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>

          {period === "custom" && (
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <Input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="w-40 text-sm"
              />
              <span className="text-stone-400 text-sm">—</span>
              <Input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="w-40 text-sm"
              />
              <Button
                size="sm"
                className="bg-amber-500 hover:bg-amber-600 text-white border-0"
                onClick={handleCustomApply}
                disabled={!customStart || !customEnd}
              >
                Terapkan
              </Button>
            </div>
          )}
        </CardHeader>

        <CardContent>
          {overviewLoading ? (
            <div className="h-55 bg-stone-100 dark:bg-stone-800 rounded-lg animate-pulse" />
          ) : (
            <FinancialChart data={overview?.chartData ?? []} />
          )}
        </CardContent>
      </Card>

      {/* Fee Transaction History */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">
              Riwayat Fee Masuk
            </CardTitle>
            <span className="text-sm text-stone-500 dark:text-stone-400">
              {pagination.total} transaksi
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {txLoading ? (
            <div className="space-y-px">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-12 bg-stone-100 dark:bg-stone-800 animate-pulse"
                />
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-stone-400 dark:text-stone-600 text-sm">
              Belum ada pemasukan fee.
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Auction</TableHead>
                    <TableHead>Buyer</TableHead>
                    <TableHead className="text-right">Fee</TableHead>
                    <TableHead>Waktu</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="font-mono text-xs text-stone-500">
                        {tx.id}
                      </TableCell>
                      <TableCell className="text-sm max-w-45 truncate">
                        {tx.auction_title ?? "—"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {tx.buyer_username ?? "—"}
                      </TableCell>
                      <TableCell className="text-right text-sm font-medium text-green-600 dark:text-green-400">
                        +{formatRupiah(tx.amount)}
                      </TableCell>
                      <TableCell className="text-xs text-stone-500">
                        {formatDate(tx.created_at)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-stone-200 dark:border-stone-800">
                  <span className="text-xs text-stone-500">
                    Halaman {pagination.page} dari {pagination.totalPages}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={txPage <= 1}
                      onClick={() => setTxPage((p) => p - 1)}
                    >
                      Sebelumnya
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={txPage >= pagination.totalPages}
                      onClick={() => setTxPage((p) => p + 1)}
                    >
                      Berikutnya
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
