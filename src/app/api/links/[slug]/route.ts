import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { getDb } from "@/lib/db";
import { z } from "zod";

export const dynamic = 'force-dynamic';

const updateLinkSchema = z.object({
  title: z.string().optional(),
  slug: z.string().min(3, "Mã rút gọn phải ít nhất 3 ký tự").optional(),
});

// GET: Lấy chi tiết một link
export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const link = await getDb().link.findUnique({
      where: { slug },
      select: {
        id: true,
        originalUrl: true,
        title: true,
        slug: true,
        clicks: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    if (!link) {
      return NextResponse.json(
        { error: "Link không tồn tại" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: link });
  } catch (error) {
    console.error("Lỗi GET /api/links/:slug:", error);
    return NextResponse.json(
      { error: "Lỗi hệ thống, thử lại sau" },
      { status: 500 }
    );
  }
}

// PUT: Cập nhật link
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const cookiesStore = await cookies();
    const token = cookiesStore.get("session")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return NextResponse.json({ error: "Lỗi hệ thống" }, { status: 500 });
    }

    const secret = new TextEncoder().encode(jwtSecret);
    let payload;
    try {
      ({ payload } = await jwtVerify(token, secret));
    } catch {
      return NextResponse.json({ error: "Token không hợp lệ" }, { status: 401 });
    }

    const userId = payload.userId as string;

    // Kiểm tra xem link có tồn tại và thuộc về user
    const existingLink = await getDb().link.findUnique({
      where: { slug },
    });

    if (!existingLink) {
      return NextResponse.json(
        { error: "Link không tồn tại" },
        { status: 404 }
      );
    }

    if (existingLink.userId !== userId) {
      return NextResponse.json(
        { error: "Bạn không có quyền cập nhật link này" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validatedData = updateLinkSchema.parse(body);

    // Kiểm tra nếu slug mới đã được sử dụng
    if (validatedData.slug && validatedData.slug !== slug) {
      const slugExists = await getDb().link.findUnique({
        where: { slug: validatedData.slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: "Mã rút gọn này đã được sử dụng" },
          { status: 400 }
        );
      }
    }

    const updatedLink = await getDb().link.update({
      where: { slug },
      data: {
        ...(validatedData.title && { title: validatedData.title }),
        ...(validatedData.slug && { slug: validatedData.slug }),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Cập nhật link thành công!",
      data: updatedLink,
    });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error("Lỗi PUT /api/links/:slug:", error);
    return NextResponse.json(
      { error: "Lỗi hệ thống, thử lại sau" },
      { status: 500 }
    );
  }
}

// DELETE: Xóa link
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const cookiesStore = await cookies();
    const token = cookiesStore.get("session")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return NextResponse.json({ error: "Lỗi hệ thống" }, { status: 500 });
    }

    const secret = new TextEncoder().encode(jwtSecret);
    let payload;
    try {
      ({ payload } = await jwtVerify(token, secret));
    } catch {
      return NextResponse.json({ error: "Token không hợp lệ" }, { status: 401 });
    }

    const userId = payload.userId as string;

    // Kiểm tra xem link có tồn tại và thuộc về user
    const link = await getDb().link.findUnique({
      where: { slug },
    });

    if (!link) {
      return NextResponse.json(
        { error: "Link không tồn tại" },
        { status: 404 }
      );
    }

    if (link.userId !== userId) {
      return NextResponse.json(
        { error: "Bạn không có quyền xóa link này" },
        { status: 403 }
      );
    }

    await getDb().link.delete({
      where: { slug },
    });

    return NextResponse.json({
      success: true,
      message: "Xóa link thành công!",
    });
  } catch (error) {
    console.error("Lỗi DELETE /api/links/:slug:", error);
    return NextResponse.json(
      { error: "Lỗi hệ thống, thử lại sau" },
      { status: 500 }
    );
  }
}
