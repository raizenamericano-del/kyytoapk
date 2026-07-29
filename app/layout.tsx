import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk" });

export const metadata: Metadata = {
  title: "KyyToAPK - Convert Any Website to Android APK Instantly",
  description: "Advanced Web to APK converter. Build custom Android APK from any URL with icon, splash, permissions, push notifications. Powered by Bubblewrap & TWA.",
  keywords: ["web to apk", "website to apk", "pwa to apk", "twa", "android", "bubblewrap", "KyyToAPK"],
  authors: [{ name: "KyyToAPK Team" }],
  openGraph: {
    title: "KyyToAPK - Web to APK Builder",
    description: "Convert any website into a fully functional Android APK with high customization",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning className="dark">
      <body className={`${inter.variable} ${grotesk.variable} font-sans bg-[#0a0a0b] text-white min-h-screen`}>
        <div className="relative min-h-screen">
          {/* Background Gradients */}
          <div className="pointer-events-none fixed inset-0">
            <div className="absolute inset-0 bg-[#0a0a0b]" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-violet-600/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px]" />
            <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-fuchsia-600/10 rounded-full blur-[100px]" />
          </div>

          <div className="relative z-10">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
