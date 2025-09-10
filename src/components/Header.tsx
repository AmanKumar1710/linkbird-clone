"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function Header() {
  const pathname = usePathname() || "/";
  const crumbs = pathname.split("/").filter(Boolean);

  return (
    <header className="bg-white border-b px-6 py-3 flex items-center">
      <nav className="flex items-center gap-2 text-sm text-gray-600">
        <Link href="/">Home</Link>
        {crumbs.map((c, i) => (
          <span key={i}>
            {" / "}
            <Link href={`/${crumbs.slice(0, i + 1).join("/")}`}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </Link>
          </span>
        ))}
      </nav>
    </header>
  );
}
