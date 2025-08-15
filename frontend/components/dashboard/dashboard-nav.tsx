"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

const navItems = [
  { id: "overview", label: "Overview", href: "/dashboard" },
  { id: "documents", label: "My documents", href: "/dashboard/documents" },
  { id: "departments", label: "Departments", href: "/dashboard/departments" },
  {
    id: "notifications",
    label: "Notifications",
    href: "/dashboard/notifications",
  },
  { id: "settings", label: "Settings", href: "/dashboard/settings" },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex space-x-8 overflow-x-auto">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "py-3 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap",
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
