"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function LinksPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft size={18} />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">My Links</h1>
          <p className="text-muted-foreground">View all your shortened links</p>
        </div>
      </div>

      <div className="mt-8 p-8 bg-muted/50 rounded-lg text-center">
        <p className="text-muted-foreground">This feature is coming soon!</p>
      </div>
    </div>
  );
}
