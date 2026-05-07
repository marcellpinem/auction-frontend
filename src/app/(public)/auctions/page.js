import { Suspense } from "react";
import AuctionsContent from "./AuctionsContent";

export default function AuctionsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg overflow-hidden animate-pulse"
                >
                  <div className="aspect-4/3 bg-stone-100 dark:bg-stone-800" />
                  <div className="p-3 space-y-2">
                    <div className="h-3 bg-stone-100 dark:bg-stone-800 rounded w-1/3" />
                    <div className="h-4 bg-stone-100 dark:bg-stone-800 rounded w-full" />
                    <div className="h-5 bg-stone-100 dark:bg-stone-800 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <AuctionsContent />
    </Suspense>
  );
}
