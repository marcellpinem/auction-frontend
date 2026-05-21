import { Inter, Geist_Mono } from "next/font/google";

import "./globals.css";

import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";

import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata = {
  title: "AuctionHub",
  description: "Modern real-time online auction platform.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`
        ${inter.variable}
        ${geistMono.variable}
      `}
    >
      <body
        className="
          min-h-screen
          bg-[#f7f7f7]
          font-sans
          text-[#1a1a1a]
          antialiased
        "
      >
        <AuthProvider>
          <NotificationProvider>
            <div className="flex min-h-screen flex-col">{children}</div>

            <Toaster
              position="top-right"
              richColors
              toastOptions={{
                classNames: {
                  toast:
                    "!rounded-2xl !border !border-[#e8e8e8] !bg-white !shadow-[0_12px_32px_rgba(0,0,0,0.08)]",
                  title: "!text-[14px] !font-semibold !text-[#1a1a1a]",
                  description: "!text-[13px] !text-[#636363]",
                },
              }}
            />
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
