import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// This shows up in the browser tab and in search/social previews.
export const metadata: Metadata = {
  title: "Nutripantry",
  description: "Your pantry, with nutrition.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {/* A nav bar rendered on EVERY page, because it lives in the layout. */}
        <header className="border-b bg-white">
          <nav className="mx-auto flex max-w-4xl items-center gap-6 px-4 py-3">
            <Link href="/" className="font-bold text-emerald-700">
              Nutripantry
            </Link>
            <Link
              href="/pantry"
              className="text-sm text-zinc-600 hover:text-zinc-900"
            >
              Pantry
            </Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
