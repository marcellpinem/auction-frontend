"use client";

import Link from "next/link";
import Image from "next/image";

import { Clock3, Gavel, Zap } from "lucide-react";

import { formatCurrency } from "@/lib/utils";

import CountdownTimer from "./CountdownTimer";

export default function AuctionCard({ auction }) {
  const {
    id,
    title,
    currentPrice,
    buyNowPrice,
    isBuyNowActive,
    endsAt,
    status,
    imageUrl,
    category,
    totalBids,
  } = auction;

  const isEnded = status === "ended" || status === "cancelled";

  return (
    <Link href={`/auctions/${id}`} className="group block">
      <article
        className="
          overflow-hidden
          rounded-2xl
          border
          border-[#e8e8e8]
          bg-white
          transition-all
          duration-300

          hover:-translate-y-[2px]
          hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)]
        "
      >
        {/* IMAGE */}
        <div
          className="
            relative
            aspect-[4/3]
            overflow-hidden
            bg-[#f2f2f2]
          "
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              loading="eager"
              className="
                object-cover
                transition-transform
                duration-500

                group-hover:scale-[1.03]
              "
              sizes="
                (max-width: 640px) 100vw,
                (max-width: 1024px) 50vw,
                25vw
              "
            />
          ) : (
            <div
              className="
                flex
                h-full
                w-full
                items-center
                justify-center
              "
            >
              <Gavel className="h-9 w-9 text-[#bcbcbc]" />
            </div>
          )}

          {/* STATUS */}
          <div className="absolute left-3 top-3 z-10">
            {isEnded ? (
              <div
                className="
                  rounded-full
                  bg-black/75
                  px-2.5
                  py-1
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.5px]
                  text-white
                  backdrop-blur-sm
                "
              >
                Ended
              </div>
            ) : (
              <div
                className="
                  rounded-full
                  bg-[#16a34a]
                  px-2.5
                  py-1
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.5px]
                  text-white
                "
              >
                Live
              </div>
            )}
          </div>

          {/* BUY NOW */}
          {isBuyNowActive && buyNowPrice && !isEnded && (
            <div className="absolute right-3 top-3 z-10">
              <div
                className="
                    flex
                    items-center
                    gap-1
                    rounded-full
                    bg-[#024ad8]
                    px-2.5
                    py-1
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.5px]
                    text-white
                  "
              >
                <Zap className="h-3 w-3 fill-white" />
                Buy Now
              </div>
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="p-4">
          {/* CATEGORY */}
          <div
            className="
              mb-2.5
              inline-flex
              rounded-full
              bg-[#f3f6fc]
              px-2.5
              py-1
              text-[10px]
              font-medium
              uppercase
              tracking-[0.5px]
              text-[#024ad8]
            "
          >
            {category?.name || "Auction"}
          </div>

          {/* TITLE */}
          <h3
            className="
              line-clamp-2
              min-h-[42px]
              text-[15px]
              font-medium
              leading-[1.45]
              text-[#1f1f1f]
            "
          >
            {title}
          </h3>

          {/* PRICE */}
          <div className="mt-4">
            <p
              className="
                text-[11px]
                font-medium
                uppercase
                tracking-[0.4px]
                text-[#7a7a7a]
              "
            >
              {totalBids > 0 ? "Current Bid" : "Starting Price"}
            </p>

            <div
              className="
                mt-1
                flex
                items-end
                justify-between
                gap-3
              "
            >
              <p
                className="
                  text-[20px]
                  font-semibold
                  tracking-[-0.5px]
                  text-[#1a1a1a]
                "
              >
                {formatCurrency(currentPrice)}
              </p>

              {totalBids > 0 && (
                <span
                  className="
                    shrink-0
                    text-[12px]
                    font-medium
                    text-[#636363]
                  "
                >
                  {totalBids} bids
                </span>
              )}
            </div>
          </div>

          {/* BUY NOW PRICE */}
          {isBuyNowActive && buyNowPrice && !isEnded && (
            <div
              className="
                  mt-4
                  flex
                  items-center
                  justify-between
                  rounded-xl
                  border
                  border-[#dbe7ff]
                  bg-[#f7faff]
                  px-3
                  py-2.5
                "
            >
              <div>
                <p
                  className="
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.5px]
                      text-[#024ad8]
                    "
                >
                  Buy Now
                </p>

                <p
                  className="
                      mt-0.5
                      text-[14px]
                      font-semibold
                      text-[#1a1a1a]
                    "
                >
                  {formatCurrency(buyNowPrice)}
                </p>
              </div>

              <div
                className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-lg
                    bg-[#024ad8]
                  "
              >
                <Zap className="h-3.5 w-3.5 text-white" />
              </div>
            </div>
          )}

          {/* FOOTER */}
          <div
            className="
              mt-4
              flex
              items-center
              justify-between
              border-t
              border-[#f0f0f0]
              pt-3
            "
          >
            {/* TIMER */}
            <div
              className="
                flex
                items-center
                gap-1.5
                text-[12px]
                text-[#636363]
              "
            >
              <Clock3 className="h-3.5 w-3.5 shrink-0" />

              {isEnded ? (
                <span>Auction ended</span>
              ) : endsAt ? (
                <CountdownTimer endsAt={endsAt} compact />
              ) : (
                <span>Waiting activation</span>
              )}
            </div>

            {/* CTA */}
            <span
              className="
                text-[11px]
                font-semibold
                uppercase
                tracking-[0.5px]
                text-[#024ad8]
              "
            >
              View
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
