"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, ChevronLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 px-4">
      <Card className="max-w-md w-full p-12 text-center border-0 shadow-xl">
        <div className="mb-6">
          <h1 className="text-7xl font-bold text-primary mb-2">404</h1>
          <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mx-auto">
            <span className="text-4xl">🔍</span>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-2">Trang Không Tìm Thấy</h2>
        <p className="text-muted-foreground mb-8">
          Xin lỗi, link bạn tìm kiếm không tồn tại hoặc đã hết hạn
        </p>

        <div className="space-y-3">
          <Link href="/" className="block">
            <Button className="w-full gap-2" size="lg">
              <Home size={20} />
              Về Trang Chủ
            </Button>
          </Link>
          <Button
            variant="outline"
            className="w-full gap-2"
            size="lg"
            onClick={() => window.history.back()}
          >
            <ChevronLeft size={20} />
            Quay Lại
          </Button>
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Nếu bạn cần giúp đỡ, hãy{" "}
            <Link href="/" className="text-primary hover:underline font-semibold">
              liên hệ với chúng tôi
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
