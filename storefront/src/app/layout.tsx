import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Maxwell's Electrónica",
  description: "Tienda omnicanal de electrónica en Honduras",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="px-6 py-4 border-b flex items-center gap-3">
          <img src="/branding/logo.png" alt="Maxwell's Electrónica" className="h-8 w-auto" />
          <span className="font-semibold">Maxwell's Electrónica</span>
        </header>
        <main className="p-6">
          {children}
        </main>
        <footer className="px-6 py-8 border-t text-sm opacity-70">
          © {new Date().getFullYear()} Maxwell's Electrónica — Honduras
        </footer>
      </body>
    </html>
  );
}
