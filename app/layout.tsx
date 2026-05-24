import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Nav from "@/components/Nav";
import AuthButton from "@/components/AuthButton";
import { Toaster } from "@/components/ui/sonner";
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
        <header className="border-b bg-background">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
            <Nav />
            <AuthButton />
          </div>
        </header>
        {children}
        {/* Renders toast notifications (e.g. "Logged 200g chicken breast"). */}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
