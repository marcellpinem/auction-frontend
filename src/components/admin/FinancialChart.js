"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function formatShortDate(dateStr) {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

function formatCurrency(value) {
  if (value >= 1_000_000) return `Rp${(value / 1_000_000).toFixed(1)}jt`;
  if (value >= 1_000) return `Rp${(value / 1_000).toFixed(0)}rb`;
  return `Rp${value}`;
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg px-3 py-2 shadow-sm">
      <p className="text-xs text-stone-500 dark:text-stone-400 mb-1">
        {formatShortDate(label)}
      </p>
      <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
        {new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(payload[0].value)}
      </p>
    </div>
  );
}

export default function FinancialChart({ data = [] }) {
  const hasData = data.some((d) => d.amount > 0);

  if (!hasData) {
    return (
      <div className="flex items-center justify-center h-48 text-stone-400 dark:text-stone-600 text-sm">
        Belum ada data pemasukan pada periode ini.
      </div>
    );
  }

  const chartData = data.map((d) => ({ date: d.date, amount: d.amount }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart
        data={chartData}
        margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="feeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="currentColor"
          className="text-stone-200 dark:text-stone-800"
        />
        <XAxis
          dataKey="date"
          tickFormatter={formatShortDate}
          tick={{ fontSize: 11, fill: "currentColor" }}
          className="text-stone-400 dark:text-stone-500"
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tickFormatter={formatCurrency}
          tick={{ fontSize: 11, fill: "currentColor" }}
          className="text-stone-400 dark:text-stone-500"
          tickLine={false}
          axisLine={false}
          width={56}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="amount"
          stroke="#F59E0B"
          strokeWidth={2}
          fill="url(#feeGradient)"
          dot={false}
          activeDot={{ r: 4, fill: "#F59E0B", strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
