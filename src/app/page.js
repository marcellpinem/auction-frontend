"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { Gavel, ArrowRight, ShieldCheck, Zap, Clock3 } from "lucide-react";

import axios from "@/lib/axios";

import AuctionCard from "@/components/common/AuctionCard";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Aman & Terverifikasi",
    desc: "Semua auction melewati proses verifikasi sebelum tayang untuk menjaga kualitas dan keamanan transaksi.",
  },
  {
    icon: Zap,
    title: "Instant Buy",
    desc: "Tidak ingin menunggu bidding selesai? Gunakan Buy Now dan selesaikan transaksi secara instan.",
  },
  {
    icon: Clock3,
    title: "Fair Auto Extend",
    desc: "Bid di detik terakhir akan memperpanjang waktu auction secara otomatis untuk menjaga fairness.",
  },
];

export default function HomePage() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axios.get("/auctions", {
          params: {
            status: "active",
            sort: "ending_soon",
            limit: 8,
          },
        });

        setAuctions(res.data.data.auctions);
      } catch {
        // silent fail
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      {/* HERO */}
      <section className="border-b border-[#e8e8e8] bg-white">
        <div
          className="
            mx-auto
            max-w-[1366px]
            px-4
            py-14

            sm:px-6
            sm:py-20

            lg:px-8
            lg:py-24
          "
        >
          <div
            className="
              grid
              items-center
              gap-14

              lg:grid-cols-2
            "
          >
            {/* LEFT */}
            <div className="max-w-2xl">
              {/* BADGE */}
              <div
                className="
                  mb-6
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-[#d7e3ff]
                  bg-[#edf3ff]
                  px-4
                  py-1.5
                  text-sm
                  font-medium
                  text-[#024ad8]
                "
              >
                <Gavel className="h-4 w-4" />
                Trusted Online Auction Platform
              </div>

              {/* TITLE */}
              <h1
                className="
                  text-[38px]
                  font-semibold
                  leading-[1.05]
                  tracking-[-1.8px]
                  text-[#1a1a1a]

                  sm:text-[52px]

                  lg:text-[68px]
                "
              >
                Win Rare Items Through
                <span className="block text-[#024ad8]">Real-Time Auctions</span>
              </h1>

              {/* DESC */}
              <p
                className="
                  mt-6
                  max-w-xl
                  text-[16px]
                  leading-7
                  text-[#525252]

                  sm:text-[18px]
                "
              >
                Bid transparently, monitor auctions in real-time, and secure
                high-value products with a competitive pricing system designed
                for fairness.
              </p>

              {/* ACTION */}
              <div
                className="
                  mt-8
                  flex
                  flex-col
                  gap-3

                  sm:flex-row
                "
              >
                <Link
                  href="/auctions"
                  className="
                    inline-flex
                    h-12
                    items-center
                    justify-center
                    gap-2
                    rounded-[4px]
                    bg-[#024ad8]
                    px-7
                    text-[14px]
                    font-semibold
                    uppercase
                    tracking-[0.7px]
                    text-white
                    transition-opacity
                    hover:opacity-90
                  "
                >
                  Explore Auctions
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/register"
                  className="
                    inline-flex
                    h-12
                    items-center
                    justify-center
                    rounded-[4px]
                    border
                    border-[#cfcfcf]
                    bg-white
                    px-7
                    text-[14px]
                    font-semibold
                    uppercase
                    tracking-[0.7px]
                    text-[#1a1a1a]
                    transition-colors
                    hover:bg-[#f7f7f7]
                  "
                >
                  Create Account
                </Link>
              </div>
            </div>

            {/* RIGHT */}
            <div
              className="
                relative
                overflow-hidden
                rounded-[28px]
                border
                border-[#e8e8e8]
                bg-white
                p-5
                shadow-[0_20px_60px_rgba(0,0,0,0.06)]
              "
            >
              <div
                className="
                  absolute
                  inset-0
                  bg-[radial-gradient(circle_at_top_right,rgba(2,74,216,0.08),transparent_45%)]
                "
              />

              <div className="relative">
                <div
                  className="
                    mb-4
                    flex
                    items-center
                    justify-between
                  "
                >
                  <div>
                    <p className="text-sm font-medium text-[#1a1a1a]">
                      Live Auctions
                    </p>

                    <p className="mt-1 text-sm text-[#636363]">Ending soon</p>
                  </div>

                  <div
                    className="
                      rounded-full
                      bg-[#edf3ff]
                      px-3
                      py-1
                      text-xs
                      font-semibold
                      uppercase
                      tracking-[0.6px]
                      text-[#024ad8]
                    "
                  >
                    Active
                  </div>
                </div>

                {loading ? (
                  <div
                    className="
                      grid
                      grid-cols-1
                      gap-4

                      sm:grid-cols-2
                    "
                  >
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className="
                          overflow-hidden
                          rounded-2xl
                          border
                          border-[#e8e8e8]
                          bg-white
                        "
                      >
                        <div className="aspect-[4/3] animate-pulse bg-[#efefef]" />

                        <div className="space-y-3 p-4">
                          <div className="h-3 w-20 animate-pulse rounded bg-[#efefef]" />

                          <div className="h-4 w-full animate-pulse rounded bg-[#efefef]" />

                          <div className="h-5 w-24 animate-pulse rounded bg-[#efefef]" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : auctions.length === 0 ? (
                  <div
                    className="
                      flex
                      flex-col
                      items-center
                      justify-center
                      rounded-2xl
                      border
                      border-dashed
                      border-[#d8d8d8]
                      bg-[#fafafa]
                      px-6
                      py-20
                      text-center
                    "
                  >
                    <Gavel className="mb-4 h-10 w-10 text-[#b3b3b3]" />

                    <p className="text-[15px] text-[#636363]">
                      No active auctions available.
                    </p>
                  </div>
                ) : (
                  <div
                    className="
                      grid
                      grid-cols-1
                      gap-4

                      sm:grid-cols-2
                    "
                  >
                    {auctions.slice(0, 4).map((auction) => (
                      <AuctionCard key={auction.id} auction={auction} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section
        className="
          mx-auto
          max-w-[1366px]
          px-4
          py-14

          sm:px-6
          sm:py-16

          lg:px-8
        "
      >
        {/* HEADER */}
        <div
          className="
            mb-8
            flex
            flex-col
            gap-4

            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >
          <div>
            <p
              className="
                text-sm
                font-semibold
                uppercase
                tracking-[1px]
                text-[#024ad8]
              "
            >
              Marketplace
            </p>

            <h2
              className="
                mt-2
                text-[28px]
                font-semibold
                tracking-[-1px]
                text-[#1a1a1a]
              "
            >
              Active Auctions
            </h2>

            <p className="mt-2 text-[15px] text-[#636363]">
              Auctions currently receiving bids from users.
            </p>
          </div>

          <Link
            href="/auctions"
            className="
              inline-flex
              items-center
              gap-2
              text-[15px]
              font-medium
              text-[#024ad8]
            "
          >
            View all auctions
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div
            className="
              grid
              grid-cols-1
              gap-5

              sm:grid-cols-2

              lg:grid-cols-3

              xl:grid-cols-4
            "
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="
                  overflow-hidden
                  rounded-2xl
                  border
                  border-[#e8e8e8]
                  bg-white
                "
              >
                <div className="aspect-[4/3] animate-pulse bg-[#efefef]" />

                <div className="space-y-3 p-4">
                  <div className="h-3 w-20 animate-pulse rounded bg-[#efefef]" />

                  <div className="h-4 w-full animate-pulse rounded bg-[#efefef]" />

                  <div className="h-5 w-24 animate-pulse rounded bg-[#efefef]" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="
              grid
              grid-cols-1
              gap-5

              sm:grid-cols-2

              lg:grid-cols-3

              xl:grid-cols-4
            "
          >
            {auctions.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        )}
      </section>

      {/* FEATURES */}
      <section className="border-t border-[#e8e8e8] bg-white">
        <div
          className="
            mx-auto
            max-w-[1366px]
            px-4
            py-16

            sm:px-6

            lg:px-8
          "
        >
          {/* HEADER */}
          <div className="max-w-2xl">
            <p
              className="
                text-sm
                font-semibold
                uppercase
                tracking-[1px]
                text-[#024ad8]
              "
            >
              Why Choose Us
            </p>

            <h2
              className="
                mt-2
                text-[32px]
                font-semibold
                tracking-[-1.2px]
                text-[#1a1a1a]
              "
            >
              Built For Transparent & Competitive Auctions
            </h2>
          </div>

          {/* GRID */}
          <div
            className="
              mt-10
              grid
              grid-cols-1
              gap-5

              md:grid-cols-3
            "
          >
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="
                    rounded-[24px]
                    border
                    border-[#e8e8e8]
                    bg-[#fafafa]
                    p-7
                  "
              >
                <div
                  className="
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-2xl
                      bg-[#edf3ff]
                    "
                >
                  <Icon className="h-5 w-5 text-[#024ad8]" />
                </div>

                <h3
                  className="
                      mt-5
                      text-[20px]
                      font-semibold
                      text-[#1a1a1a]
                    "
                >
                  {title}
                </h3>

                <p
                  className="
                      mt-3
                      text-[15px]
                      leading-7
                      text-[#636363]
                    "
                >
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
