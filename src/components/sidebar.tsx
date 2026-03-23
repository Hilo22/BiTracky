"use client"; // Bắt buộc vì có tương tác người dùng

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Link2, LogOut, User } from "lucide-react"; // Import Icon xịn ở đây
import axios from "axios";

const menuItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Links", href: "/dashboard/links", icon: Link2 },
  { label: "Profile", href: "/profile", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      router.push("/login");
      router.refresh(); // Để Middleware quét lại ngay lập tức
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="flex flex-col h-full p-4 text-slate-700">
      <div className="mb-10 px-2">
        <h1 className="text-2xl font-bold text-blue-600">BiTracky</h1>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href; // Kiểm tra xem có đang ở trang này không
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive 
                ? "bg-blue-50 text-blue-600 font-medium" 
                : "hover:bg-slate-100"
              }`}
            >
              <Icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Nút Logout nằm dưới cùng */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-2 mt-auto text-red-500 hover:bg-red-50 rounded-lg transition-colors"
      >
        <LogOut size={20} />
        Đăng xuất
      </button>
    </div>
  );
}