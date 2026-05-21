"use client";

import { useEffect, useState } from "react";

import Head from "next/head";

import axios from "@/lib/axios";

import { formatCurrency } from "@/lib/utils";

import {
  Gavel,
  Package,
  Trophy,
  Wallet,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";

const StatCard = ({ icon: Icon, label, value, accent, description }) => (
  <div
    className="
      group
      relative
      overflow-hidden
      rounded-[28px]
      border
      border-[#e8e8e8]
      bg-white
      p-6
      transition-all
      duration-300

      hover:-translate-y-[2px]
      hover:shadow-[0_16px_40px_rgba(0,0,0,0.06)]
    "
  >
    {/* BACKGROUND */}
    <div
      className={`
        absolute
        right-0
        top-0
        h-28
        w-28
        rounded-full
        blur-3xl
        opacity-40

        ${accent}
      `}
    />

    <div className="relative z-10">
      {/* TOP */}
      <div
        className="
          flex
          items-start
          justify-between
          gap-4
        "
      >
        <div
          className="
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-2xl
            border
            border-[#ececec]
            bg-[#fafafa]
          "
        >
          <Icon className="h-6 w-6 text-[#1a1a1a]" />
        </div>

        <div
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-xl
            bg-[#f5f7fb]
            text-[#024ad8]
          "
        >
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </div>

      {/* CONTENT */}
      <div className="mt-8">
        <p
          className="
            text-[12px]
            font-semibold
            uppercase
            tracking-[0.7px]
            text-[#737373]
          "
        >
          {label}
        </p>

        <h3
          className="
            mt-3
            break-words
            text-[30px]
            font-semibold
            tracking-[-1.2px]
            text-[#1a1a1a]
          "
        >
          {value}
        </h3>

        <p
          className="
            mt-3
            text-[14px]
            leading-6
            text-[#636363]
          "
        >
          {description}
        </p>
      </div>
    </div>
  </div>
);

export default function DashboardPage() {
  const [stats, setStats] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("/dashboard/stats");

        setStats(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = stats
    ? [
        {
          icon: Gavel,
          label: "Active Bids",
          value: stats.activeBids,
          accent: "bg-[rgba(2,74,216,0.18)]",
          description: "Auctions where you currently have active bids.",
        },

        {
          icon: Package,
          label: "Auctions Created",
          value: stats.totalAuctionsCreated,
          accent: "bg-[rgba(24,24,27,0.12)]",
          description: "Total auctions you have published on the platform.",
        },

        {
          icon: Trophy,
          label: "Auctions Won",
          value: stats.totalWonAuctions,
          accent: "bg-[rgba(22,163,74,0.16)]",
          description: "Successful auctions won from your bidding activity.",
        },

        {
          icon: Wallet,
          label: "Available Balance",
          value: formatCurrency(stats.availableBalance),
          accent: "bg-[rgba(2,74,216,0.16)]",
          description: "Funds currently available for bids and transactions.",
        },

        {
          icon: TrendingUp,
          label: "Held Balance",
          value: formatCurrency(stats.heldBalance),
          accent: "bg-[rgba(249,115,22,0.16)]",
          description: "Balance temporarily held during active auctions.",
        },
      ]
    : [];

  return (
    <>
      <Head>
        <title>Dashboard • AuctionHub</title>
      </Head>

      <div className="space-y-8">
        {/* HERO */}
        <section
          className="
            relative
            overflow-hidden
            rounded-[32px]
            border
            border-[#e8e8e8]
            bg-white
            px-6
            py-8

            sm:px-8
            sm:py-10
          "
        >
          {/* BG */}
          <div
            className="
              absolute
              -right-20
              top-[-80px]
              h-[240px]
              w-[240px]
              rounded-full
              bg-[rgba(2,74,216,0.06)]
              blur-3xl
            "
          />

          <div className="relative z-10">
            <div
              className="
                inline-flex
                items-center
                rounded-full
                border
                border-[#dbe7ff]
                bg-[#f5f8ff]
                px-3
                py-1.5
                text-[11px]
                font-semibold
                uppercase
                tracking-[0.6px]
                text-[#024ad8]
              "
            >
              Account Overview
            </div>

            <h1
              className="
                mt-5
                text-[34px]
                font-semibold
                leading-[1.1]
                tracking-[-1.5px]
                text-[#1a1a1a]

                sm:text-[42px]
              "
            >
              Dashboard
            </h1>

            <p
              className="
                mt-4
                max-w-2xl
                text-[15px]
                leading-7
                text-[#636363]
              "
            >
              Monitor your auction activity, track balances, and manage your
              bidding performance in one place.
            </p>
          </div>
        </section>

        {/* LOADING */}
        {loading ? (
          <div
            className="
              grid
              grid-cols-1
              gap-5

              sm:grid-cols-2
              xl:grid-cols-3
            "
          >
            {Array.from({
              length: 5,
            }).map((_, i) => (
              <div
                key={i}
                className="
                  h-[230px]
                  animate-pulse
                  rounded-[28px]
                  border
                  border-[#ececec]
                  bg-white
                "
              />
            ))}
          </div>
        ) : !stats ? (
          <div
            className="
              rounded-[28px]
              border
              border-[#e8e8e8]
              bg-white
              p-8
            "
          >
            <p
              className="
                text-[15px]
                text-[#636363]
              "
            >
              Failed to load dashboard statistics.
            </p>
          </div>
        ) : (
          <div
            className="
              grid
              grid-cols-1
              gap-5

              sm:grid-cols-2
              xl:grid-cols-3
            "
          >
            {cards.map((card) => (
              <StatCard key={card.label} {...card} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
