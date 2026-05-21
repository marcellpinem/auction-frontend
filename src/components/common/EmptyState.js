import { Inbox } from "lucide-react";

export default function EmptyState({
  title = "Tidak ada data",
  description,
  action,
}) {
  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-[32px]
        border
        border-[#e8e8e8]
        bg-white
        px-6
        py-14

        sm:px-10
        sm:py-16
      "
    >
      {/* BACKGROUND */}
      <div
        className="
          absolute
          left-1/2
          top-0
          h-[220px]
          w-[220px]
          -translate-x-1/2
          rounded-full
          bg-[rgba(2,74,216,0.05)]
          blur-3xl
        "
      />

      <div
        className="
          relative
          z-10
          flex
          flex-col
          items-center
          justify-center
          text-center
        "
      >
        {/* ICON */}
        <div
          className="
            flex
            h-20
            w-20
            items-center
            justify-center
            rounded-[28px]
            border
            border-[#ececec]
            bg-[#fafafa]
            shadow-[0_8px_30px_rgba(0,0,0,0.04)]
          "
        >
          <Inbox className="h-9 w-9 text-[#9a9a9a]" />
        </div>

        {/* CONTENT */}
        <div className="mt-7 max-w-md">
          <h3
            className="
              text-[24px]
              font-semibold
              tracking-[-0.8px]
              text-[#1a1a1a]
            "
          >
            {title}
          </h3>

          {description && (
            <p
              className="
                mt-3
                text-[15px]
                leading-7
                text-[#636363]
              "
            >
              {description}
            </p>
          )}
        </div>

        {/* ACTION */}
        {action && <div className="mt-8">{action}</div>}
      </div>
    </div>
  );
}
