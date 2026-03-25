"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
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
    <Button
      onClick={handleLogout}
      variant="ghost"
      className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
    >
      <LogOut size={20} />
      Logout
    </Button>
  );
}
