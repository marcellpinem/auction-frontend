"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";

export default function WithdrawModal({
  open,
  onOpenChange,
  availableBalance = 0,
  onSuccess,
}) {
  const [amount, setAmount] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setAmount("");
    setAccountName("");
    setAccountNumber("");
    setErrors({});
    onOpenChange(false);
  };

  const validate = () => {
    const errs = {};
    const num = parseInt(amount);
    if (!amount || isNaN(num)) errs.amount = "Nominal wajib diisi";
    else if (num < 10000) errs.amount = "Minimum withdraw Rp10.000";
    else if (num > availableBalance)
      errs.amount = "Nominal melebihi saldo tersedia";
    if (!accountName.trim()) errs.accountName = "Nama rekening wajib diisi";
    if (!accountNumber.trim())
      errs.accountNumber = "Nomor rekening wajib diisi";
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) return setErrors(errs);

    setLoading(true);
    try {
      await onSuccess({ amount: parseInt(amount), accountName, accountNumber });
      handleClose();
    } catch (e) {
      setErrors({ general: e.message || "Gagal melakukan withdraw" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Withdraw Saldo</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="bg-stone-50 border border-stone-200 rounded-lg px-4 py-3">
            <p className="text-xs text-stone-500">Saldo tersedia</p>
            <p className="text-lg font-semibold text-stone-900">
              {formatCurrency(availableBalance)}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="withdraw-amount">Nominal</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-stone-500">
                Rp
              </span>
              <Input
                id="withdraw-amount"
                type="number"
                placeholder="0"
                className="pl-9"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setErrors((p) => ({ ...p, amount: "" }));
                }}
                disabled={loading}
              />
            </div>
            {errors.amount && (
              <p className="text-[12px] text-red-500">{errors.amount}</p>
            )}
            <button
              type="button"
              onClick={() => {
                setAmount(String(availableBalance));
                setErrors((p) => ({ ...p, amount: "" }));
              }}
              className="text-[12px] text-amber-600 hover:text-amber-700 transition-colors"
            >
              Tarik semua saldo
            </button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="account-name">Nama Rekening</Label>
            <Input
              id="account-name"
              placeholder="Sesuai nama di rekening bank"
              value={accountName}
              onChange={(e) => {
                setAccountName(e.target.value);
                setErrors((p) => ({ ...p, accountName: "" }));
              }}
              disabled={loading}
            />
            {errors.accountName && (
              <p className="text-[12px] text-red-500">{errors.accountName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="account-number">Nomor Rekening</Label>
            <Input
              id="account-number"
              placeholder="Nomor rekening tujuan"
              value={accountNumber}
              onChange={(e) => {
                setAccountNumber(e.target.value);
                setErrors((p) => ({ ...p, accountNumber: "" }));
              }}
              disabled={loading}
            />
            {errors.accountNumber && (
              <p className="text-[12px] text-red-500">{errors.accountNumber}</p>
            )}
          </div>

          {errors.general && (
            <p className="text-[12px] text-red-500">{errors.general}</p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-amber-500 hover:bg-amber-600 text-white"
          >
            {loading ? "Memproses..." : "Withdraw"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
