"use client";

import { CheckCircle, Clock, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    key: "confirmed_buyer",
    label: "Buyer Siap Bayar",
    description: "Buyer mengkonfirmasi kesiapan pembayaran",
  },
  {
    key: "confirmed_seller",
    label: "Seller Kirim Barang",
    description: "Seller mengkonfirmasi pengiriman barang",
  },
  {
    key: "completed",
    label: "Buyer Terima Barang",
    description: "Buyer mengkonfirmasi penerimaan barang",
  },
];

const statusOrder = [
  "pending",
  "confirmed_buyer",
  "confirmed_seller",
  "completed",
];

const getStepState = (stepKey, currentStatus) => {
  const stepIndex = steps.findIndex((s) => s.key === stepKey);
  const currentIndex = statusOrder.indexOf(currentStatus);

  // completed step index maps to statusOrder index 3
  const stepStatusIndex = stepIndex + 1;

  if (currentIndex > stepStatusIndex) return "done";
  if (currentIndex === stepStatusIndex) return "done";
  if (currentIndex === stepStatusIndex - 1) return "active";
  return "pending";
};

export default function TransactionTimeline({
  status,
  role, // "buyer" | "seller"
  onConfirmReady,
  onConfirmShipped,
  onConfirmReceived,
  loading,
}) {
  const canConfirmReady = role === "buyer" && status === "pending";
  const canConfirmShipped = role === "seller" && status === "confirmed_buyer";
  const canConfirmReceived = role === "buyer" && status === "confirmed_seller";

  return (
    <div className="bg-white border border-stone-200 rounded-lg p-6">
      <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-6">
        Status Transaksi
      </h2>

      <div className="relative">
        {steps.map((step, index) => {
          const state = getStepState(step.key, status);
          const isLast = index === steps.length - 1;

          return (
            <div key={step.key} className="flex gap-4">
              {/* Icon + connector */}
              <div className="flex flex-col items-center">
                <div className="mt-0.5">
                  {state === "done" ? (
                    <CheckCircle className="w-5 h-5 text-amber-500" />
                  ) : state === "active" ? (
                    <Clock className="w-5 h-5 text-amber-400 animate-pulse" />
                  ) : (
                    <Circle className="w-5 h-5 text-stone-300" />
                  )}
                </div>
                {!isLast && (
                  <div
                    className={`w-px flex-1 my-1 ${
                      state === "done" ? "bg-amber-300" : "bg-stone-200"
                    }`}
                    style={{ minHeight: "2rem" }}
                  />
                )}
              </div>

              {/* Content */}
              <div className={`pb-6 ${isLast ? "pb-0" : ""}`}>
                <p
                  className={`text-sm font-semibold ${
                    state === "done"
                      ? "text-stone-900"
                      : state === "active"
                        ? "text-amber-600"
                        : "text-stone-400"
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-xs text-stone-400 mt-0.5">
                  {step.description}
                </p>

                {/* Action buttons */}
                {step.key === "confirmed_buyer" && canConfirmReady && (
                  <Button
                    size="sm"
                    className="mt-3 bg-amber-500 hover:bg-amber-600 text-white"
                    onClick={onConfirmReady}
                    disabled={loading}
                  >
                    Confirm Ready to Pay
                  </Button>
                )}
                {step.key === "confirmed_seller" && canConfirmShipped && (
                  <Button
                    size="sm"
                    className="mt-3 bg-amber-500 hover:bg-amber-600 text-white"
                    onClick={onConfirmShipped}
                    disabled={loading}
                  >
                    Confirm Item Shipped
                  </Button>
                )}
                {step.key === "completed" && canConfirmReceived && (
                  <Button
                    size="sm"
                    className="mt-3 bg-amber-500 hover:bg-amber-600 text-white"
                    onClick={onConfirmReceived}
                    disabled={loading}
                  >
                    Confirm Item Received
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {status === "completed" && (
        <div className="mt-4 pt-4 border-t border-stone-100 text-center">
          <p className="text-sm text-green-600 font-medium">
            Transaksi selesai
          </p>
        </div>
      )}

      {status === "cancelled" && (
        <div className="mt-4 pt-4 border-t border-stone-100 text-center">
          <p className="text-sm text-red-500 font-medium">
            Transaksi dibatalkan
          </p>
        </div>
      )}
    </div>
  );
}
