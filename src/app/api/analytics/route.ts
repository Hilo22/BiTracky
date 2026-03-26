import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { getDb } from "@/lib/db";

// Prevent this route from being prerendered at build time
export const dynamic = 'force-dynamic';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "secret");

export async function GET(request: NextRequest) {
  try {
    // Extract and verify JWT token
    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await jwtVerify(token, secret);
    const userId = payload.payload.userId as string;

    // Get query parameters for date range filtering
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Build date filter
    const dateFilter: { gte?: Date; lte?: Date } = {};
    if (startDate) dateFilter.gte = new Date(startDate);
    if (endDate) dateFilter.lte = new Date(endDate);

    // Fetch user's links with click data
    const links = await getDb().link.findMany({
      where: {
        userId,
        ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter }),
      },
      select: {
        id: true,
        slug: true,
        originalUrl: true,
        title: true,
        clicks: true,
        createdAt: true,
      },
      orderBy: { clicks: "desc" },
    });

    // Calculate aggregate statistics
    const totalLinksCount = links.length;
    const totalClicksCount = links.reduce((sum, link) => sum + link.clicks, 0);
    const avgClicksPerLink = totalLinksCount > 0 ? totalClicksCount / totalLinksCount : 0;

    // Generate chart data (clicks per day for last 30 days if no date filter)
    const chartData: { date: string; clicks: number }[] = [];

    if (!startDate && !endDate) {
      // Generate last 30 days of data
      const today = new Date();
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];

        const dayClicks = links
          .filter((link) => {
            const linkDate = new Date(link.createdAt).toISOString().split("T")[0];
            return linkDate === dateStr;
          })
          .reduce((sum, link) => sum + link.clicks, 0);

        chartData.push({
          date: new Date(dateStr).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          clicks: dayClicks,
        });
      }
    } else {
      // Generate data for selected date range
      const start = startDate ? new Date(startDate) : new Date();
      const end = endDate ? new Date(endDate) : new Date();

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = new Date(d).toISOString().split("T")[0];

        const dayClicks = links
          .filter((link) => {
            const linkDate = new Date(link.createdAt).toISOString().split("T")[0];
            return linkDate === dateStr;
          })
          .reduce((sum, link) => sum + link.clicks, 0);

        chartData.push({
          date: new Date(dateStr).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          clicks: dayClicks,
        });
      }
    }

    // Get top performing links
    const topLinks = links.slice(0, 5).map((link) => ({
      slug: link.slug,
      title: link.title || link.originalUrl,
      clicks: link.clicks,
      url: link.originalUrl,
    }));

    return NextResponse.json({
      totalLinks: totalLinksCount,
      totalClicks: totalClicksCount,
      avgClicksPerLink: Math.round(avgClicksPerLink * 100) / 100,
      topLinks,
      chartData,
      links: links.map((link) => ({
        slug: link.slug,
        clicks: link.clicks,
        created: new Date(link.createdAt).toLocaleDateString(),
      })),
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("service error")) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    console.error("Analytics error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
