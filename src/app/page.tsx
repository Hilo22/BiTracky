import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-center">BiTracky</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-center text-sm text-slate-600">Chọn trang bạn muốn vào</p>
          <Link href="/register" className="block">
            <Button className="w-full">Đăng ký</Button>
          </Link>
          <Link href="/login" className="block">
            <Button variant="outline" className="w-full">
              Đăng nhập
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}