"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => router.back()}
    >
      <ArrowLeft size={18} />
    </Button>
  );
}
