"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface NavigationItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface NavigationProps {
  items: NavigationItem[];
  currentPath: string;
}

export default function SidebarNavigation({
  items,
  currentPath,
}: NavigationProps) {
  return (
    <nav className="flex-1 space-y-2">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-3">
        Menu
      </p>
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentPath === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              isActive
                ? "bg-primary text-primary-foreground font-semibold shadow-md"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Icon size={20} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
