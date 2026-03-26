import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';

// GET: Chuyển hướng đến URL gốc và track click
export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const link = await db.link.findUnique({
      where: { slug },
    });

    if (!link) {
      return NextResponse.redirect(new URL("/404", req.url));
    }

    // Track click request
    await db.link.update({
      where: { slug },
      data: { clicks: { increment: 1 } },
    });

    // Log analytics (ngoài lề, có thể mở rộng sau)
    console.log(`Link clicked: ${slug} -> ${link.originalUrl}`);

    // Redirect to original URL
    return NextResponse.redirect(new URL(link.originalUrl), {
      status: 301, // Permanent redirect
    });
  } catch (error) {
    console.error("Lỗi redirect:", error);
    return NextResponse.json(
      { error: "Trang không tồn tại" },
      { status: 404 }
    );
  }
}
