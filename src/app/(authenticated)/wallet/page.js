"use client";

import { useState, useEffect } from "react";
import BalanceCard from "@/components/wallet/BalanceCard";
import TopUpModal from "@/components/wallet/TopUpModal";
import WithdrawModal from "@/components/wallet/WithdrawModal";
import TransactionList from "@/components/wallet/TransactionList";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";

export default function WalletPage() {
  const [wallet, setWallet] = useState({ availableBalance: 0, heldBalance: 0 });
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({});
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [walletLoading, setWalletLoading] = useState(true);
  const [txLoading, setTxLoading] = useState(true);
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const res = await axiosInstance.get("/wallet");
        if (!cancelled) setWallet(res.data.data);
      } catch {
        if (!cancelled) toast.error("Gagal memuat data wallet");
      } finally {
        if (!cancelled) setWalletLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const [txTrigger, setTxTrigger] = useState(0);
  const refreshTransactions = () => setTxTrigger((n) => n + 1);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setTxLoading(true);
      try {
        const params = { page, limit: 10 };
        if (filter) params.type = filter;
        const res = await axiosInstance.get("/wallet/transactions", { params });
        if (!cancelled) {
          setTransactions(res.data.data.transactions);
          setPagination(res.data.data.pagination);
        }
      } catch {
        if (!cancelled) toast.error("Gagal memuat riwayat transaksi");
      } finally {
        if (!cancelled) setTxLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [filter, page, txTrigger]);

  const handleFilterChange = (val) => {
    setFilter(val);
    setPage(1);
  };

  const handleTopUp = async (amount) => {
    const res = await axiosInstance.post("/wallet/topup", { amount });
    setWallet((prev) => ({
      ...prev,
      availableBalance: res.data.data.availableBalance,
    }));
    toast.success("Top up berhasil");
    refreshTransactions();
  };

  const handleWithdraw = async ({ amount, accountName, accountNumber }) => {
    const res = await axiosInstance.post("/wallet/withdraw", {
      amount,
      accountName,
      accountNumber,
    });
    setWallet((prev) => ({
      ...prev,
      availableBalance: res.data.data.availableBalance,
    }));
    toast.success("Withdraw berhasil");
    refreshTransactions();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-xl font-bold text-stone-900">Wallet</h1>

      {walletLoading ? (
        <div className="bg-white border border-stone-200 rounded-lg p-6 animate-pulse">
          <div className="h-4 w-24 bg-stone-100 rounded mb-3" />
          <div className="h-8 w-40 bg-stone-100 rounded mb-6" />
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="h-16 bg-stone-100 rounded-lg" />
            <div className="h-16 bg-stone-100 rounded-lg" />
          </div>
          <div className="h-10 bg-stone-100 rounded-lg" />
        </div>
      ) : (
        <BalanceCard
          availableBalance={wallet.availableBalance}
          heldBalance={wallet.heldBalance}
          onTopUp={() => setTopUpOpen(true)}
          onWithdraw={() => setWithdrawOpen(true)}
        />
      )}

      <TransactionList
        transactions={transactions}
        pagination={pagination}
        activeFilter={filter}
        onFilterChange={handleFilterChange}
        onPageChange={setPage}
        loading={txLoading}
      />

      <TopUpModal
        open={topUpOpen}
        onOpenChange={setTopUpOpen}
        onSuccess={handleTopUp}
      />

      <WithdrawModal
        open={withdrawOpen}
        onOpenChange={setWithdrawOpen}
        availableBalance={wallet.availableBalance}
        onSuccess={handleWithdraw}
      />
    </div>
  );
}
