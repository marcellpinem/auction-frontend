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

const QUICK_AMOUNTS = [50000, 100000, 250000, 500000, 1000000];

export default function TopUpModal({ open, onOpenChange, onSuccess }) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setAmount("");
    setError("");
    onOpenChange(false);
  };

  const validate = (val) => {
    const num = parseInt(val);
    if (!val || isNaN(num)) return "Nominal wajib diisi";
    if (num < 10000) return "Minimum top up Rp10.000";
    if (num > 1000000000) return "Maximum top up Rp1.000.000.000";
    return "";
  };

  const handleSubmit = async () => {
    const err = validate(amount);
    if (err) return setError(err);

    setLoading(true);
    try {
      await onSuccess(parseInt(amount));
      handleClose();
    } catch (e) {
      setError(e.message || "Gagal melakukan top up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Top Up Saldo</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Pilih Nominal</Label>
            <div className="grid grid-cols-3 gap-2">
              {QUICK_AMOUNTS.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => {
                    setAmount(String(val));
                    setError("");
                  }}
                  className={`py-2 px-3 rounded-lg text-sm border transition-colors ${
                    amount === String(val)
                      ? "bg-amber-500 border-amber-500 text-white font-medium"
                      : "bg-white border-stone-200 text-stone-700 hover:border-amber-400"
                  }`}
                >
                  {formatCurrency(val)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="topup-amount">Atau masukkan nominal lain</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-stone-500">
                Rp
              </span>
              <Input
                id="topup-amount"
                type="number"
                placeholder="0"
                className="pl-9"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError("");
                }}
                disabled={loading}
              />
            </div>
            {error && <p className="text-[12px] text-red-500">{error}</p>}
            <p className="text-[12px] text-stone-400">
              Min. Rp10.000 — Maks. Rp1.000.000.000
            </p>
          </div>
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
            {loading ? "Memproses..." : "Top Up"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
