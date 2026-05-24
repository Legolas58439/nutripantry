"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// The top navigation bar, shown on every page (it's rendered from the layout).
// It's a Client Component because it uses usePathname() to highlight the link
// for the page you're currently on.
const links = [
  { href: "/pantry", label: "Pantry" },
  { href: "/tracker", label: "Tracker" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1">
      <Link href="/" className="mr-2 text-lg font-bold text-emerald-700">
        Nutripantry
      </Link>
      {links.map((link) => {
        const active =
          pathname === link.href || pathname.startsWith(link.href + "/");
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              active
                ? "bg-emerald-50 text-emerald-700"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
