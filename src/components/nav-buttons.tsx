"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function NavButtons() {
  const router = useRouter();

  return (
    <div className="flex gap-3">
      <Button variant="ghost" onClick={() => router.push('/login')}>
        Sign In
      </Button>
      <Button onClick={() => router.push('/register')}>
        Sign Up
      </Button>
    </div>
  );
}
