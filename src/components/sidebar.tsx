"use client";

import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Link2, Settings, BarChart3, LogOut } from "lucide-react";
import axios from "axios";
import SidebarNavigation from "@/components/sidebar-navigation";
import { Button } from "@/components/ui/button";

const menuItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Links", href: "/dashboard/links", icon: Link2 },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="flex flex-col h-full p-6 bg-gradient-to-b from-background to-muted/20 border-r border-border">
      {/* Logo */}
      <div className="mb-8">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white font-bold text-lg">
            📎
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">BiTracky</h1>
            <p className="text-xs text-muted-foreground">Link Manager</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <SidebarNavigation items={menuItems} currentPath={pathname} />

      {/* Logout Button */}
      <div className="space-y-3 mt-auto pt-6 border-t border-border">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut size={20} />
          Logout
        </Button>
      </div>
    </div>
  );
}