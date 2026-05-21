"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages, onPageChange }) {
  const router = useRouter();

  const pathname = usePathname();

  const searchParams = useSearchParams();

  const goToPage = (p) => {
    if (p < 1 || p > totalPages) return;

    if (onPageChange) {
      onPageChange(p);
      return;
    }

    const params = new URLSearchParams(searchParams.toString());

    params.set("page", p);

    router.push(`${pathname}?${params.toString()}`);
  };

  const getPages = () => {
    const pages = [];

    const delta = 1;

    const left = Math.max(2, page - delta);

    const right = Math.min(totalPages - 1, page + delta);

    pages.push(1);

    if (left > 2) {
      pages.push("...");
    }

    for (let i = left; i <= right; i++) {
      pages.push(i);
    }

    if (right < totalPages - 1) {
      pages.push("...");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div
      className="
        flex
        flex-wrap
        items-center
        justify-center
        gap-2
      "
    >
      {/* PREV */}
      <NavButton onClick={() => goToPage(page - 1)} disabled={page === 1}>
        <ChevronLeft className="h-4 w-4" />
      </NavButton>

      {/* PAGES */}
      <div
        className="
          flex
          items-center
          gap-2
        "
      >
        {getPages().map((p, i) =>
          p === "..." ? (
            <span
              key={`ellipsis-${i}`}
              className="
                px-1
                text-[14px]
                font-medium
                text-[#9a9a9a]
              "
            >
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => goToPage(p)}
              className={`
                relative
                flex
                h-11
                min-w-[44px]
                items-center
                justify-center
                rounded-2xl
                border
                px-4
                text-[14px]
                font-semibold
                transition-all
                duration-200

                ${
                  p === page
                    ? `
                      border-[#024ad8]
                      bg-[#024ad8]
                      text-white
                      shadow-[0_10px_25px_rgba(2,74,216,0.22)]
                    `
                    : `
                      border-[#e7e7e7]
                      bg-white
                      text-[#4b4b4b]

                      hover:-translate-y-[1px]
                      hover:border-[#d8d8d8]
                      hover:bg-[#fafafa]
                    `
                }
              `}
            >
              {p}
            </button>
          ),
        )}
      </div>

      {/* NEXT */}
      <NavButton
        onClick={() => goToPage(page + 1)}
        disabled={page === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </NavButton>
    </div>
  );
}

function NavButton({ children, disabled, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex
        h-11
        w-11
        items-center
        justify-center
        rounded-2xl
        border
        transition-all
        duration-200

        ${
          disabled
            ? `
              cursor-not-allowed
              border-[#ededed]
              bg-[#f8f8f8]
              text-[#c4c4c4]
            `
            : `
              border-[#e7e7e7]
              bg-white
              text-[#4b4b4b]

              hover:-translate-y-[1px]
              hover:border-[#d8d8d8]
              hover:bg-[#fafafa]
            `
        }
      `}
    >
      {children}
    </button>
  );
}
