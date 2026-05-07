"use client";

import { formatCurrency } from "@/lib/utils";
import { ArrowDownLeft, ArrowUpRight, Lock } from "lucide-react";

export default function BalanceCard({
  availableBalance = 0,
  heldBalance = 0,
  onTopUp,
  onWithdraw,
}) {
  return (
    <div className="bg-white border border-stone-200 rounded-lg p-6">
      <p className="text-sm text-stone-500 mb-1">Total Saldo</p>
      <p className="text-3xl font-bold text-stone-900 mb-6">
        {formatCurrency(availableBalance + heldBalance)}
      </p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-stone-50 border border-stone-200 rounded-lg p-4">
          <p className="text-xs text-stone-500 mb-1">Tersedia</p>
          <p className="text-lg font-semibold text-stone-900">
            {formatCurrency(availableBalance)}
          </p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center gap-1 mb-1">
            <Lock className="w-3 h-3 text-amber-600" />
            <p className="text-xs text-amber-600">Di-hold</p>
          </div>
          <p className="text-lg font-semibold text-amber-700">
            {formatCurrency(heldBalance)}
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onTopUp}
          className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
        >
          <ArrowDownLeft className="w-4 h-4" />
          Top Up
        </button>
        <button
          onClick={onWithdraw}
          className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-stone-50 text-stone-700 text-sm font-medium py-2.5 rounded-lg border border-stone-200 transition-colors"
        >
          <ArrowUpRight className="w-4 h-4" />
          Withdraw
        </button>
      </div>
    </div>
  );
}
