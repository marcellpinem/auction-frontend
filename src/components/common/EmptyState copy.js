import { Inbox } from "lucide-react";

export default function EmptyState({ title = "Tidak ada data", description }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center mb-4">
        <Inbox className="w-6 h-6 text-stone-400" />
      </div>
      <p className="font-medium text-stone-700 dark:text-stone-300">{title}</p>
      {description && (
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-xs">
          {description}
        </p>
      )}
    </div>
  );
}
