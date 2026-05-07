// src/app/(public)/auctions/layout.js
import Navbar from "@/components/common/Navbar";

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
