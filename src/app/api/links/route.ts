import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { db } from "@/lib/db";
import { nanoid } from "nanoid";
import { z } from "zod";

const linkSchema = z.object({
   originalUrl: z.string().url("Link gốc không hợp lệ (phải có http/https)"),
  title: z.string().optional(),
  slug: z.string().min(3, "Mã rút gọn phải ít nhất 3 ký tự").optional(),
})

export async function POST(req: Request) {
  try {
    const cookiesStore = await cookies();
    const token = cookiesStore.get("session")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("JWT_SECRET không được cấu hình");
      return NextResponse.json({ error: "Lỗi hệ thống" }, { status: 500 });
    }

    const secret = new TextEncoder().encode(jwtSecret);
    let payload;
    try {
      ({ payload } = await jwtVerify(token, secret));
    } catch (jwtError) {
      console.error("JWT verify lỗi:", jwtError);
      return NextResponse.json({ error: "Token không hợp lệ hoặc hết hạn" }, { status: 401 });
    }
    const userId = payload.userId as string;

    const body = await req.json();
    const validatedData = linkSchema.parse(body);

    const finalSlug = validatedData.slug || nanoid(6);
    const isSlugTaken = await db.link.findUnique({
      where: { slug: finalSlug }
    });
    if (isSlugTaken) {
      return NextResponse.json({ error: "Mã rút gọn này đã được sử dụng" }, { status: 400 });
    }

    const newLink = await db.link.create({
      data: {
        originalUrl: validatedData.originalUrl,
        title: validatedData.title || "Untitled Link",
        slug: finalSlug,
        userId: userId,
      },
    });

    return NextResponse.json({
      message: "Tạo link thành công!",
      data: newLink
    }, { status: 201 });

  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }

    console.error("Lỗi API Link:", error);
    return NextResponse.json({ error: "Lỗi hệ thống, thử lại sau" }, { status: 500 });
  }
}

// GET: Lấy danh sách links của user
export async function GET(req: Request) {
  try {
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

    // Lấy query params (sort, filter)
    const url = new URL(req.url);
    const sortBy = url.searchParams.get("sortBy") || "createdAt";
    const order = url.searchParams.get("order") === "asc" ? "asc" : "desc";
    const search = url.searchParams.get("search");

    let whereClause: { userId: string; OR?: Array<{[key: string]: {contains: string; mode: "insensitive"}}>} = { userId };
    if (search) {
      whereClause = {
        userId,
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { slug: { contains: search, mode: "insensitive" } },
          { originalUrl: { contains: search, mode: "insensitive" } },
        ],
      };
    }

    const links = await db.link.findMany({
      where: whereClause,
      orderBy: { [sortBy]: order },
    });

    return NextResponse.json({
      success: true,
      data: links,
      count: links.length,
    });
  } catch (error: unknown) {
    console.error("Lỗi GET /api/links:", error);
    return NextResponse.json(
      { error: "Lỗi hệ thống, thử lại sau" },
      { status: 500 }
    );
  }
}



