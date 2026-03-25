"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Link2, MousePointerClick, ArrowUpRight } from "lucide-react";

interface LinkAnalytics {
  id: string;
  slug: string;
  title: string;
  clicks: number;
  createdAt: string;
}

interface DailyStats {
  date: string;
  clicks: number;
  linksCreated: number;
}

const COLORS = ["#3B82F6", "#7C3AED", "#00D9FF", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];

export default function AnalyticsPage() {
  const [links, setLinks] = useState<LinkAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/links");
      const linksData = response.data.data || [];
      setLinks(linksData);

      // Calculate daily statistics
      const statsMap: { [key: string]: DailyStats } = {};
      linksData.forEach((link: LinkAnalytics) => {
        const date = new Date(link.createdAt).toLocaleDateString("en-US");
        if (!statsMap[date]) {
          statsMap[date] = { date, clicks: 0, linksCreated: 0 };
        }
        statsMap[date].clicks += link.clicks;
        statsMap[date].linksCreated += 1;
      });

      const sortedStats = Object.values(statsMap).sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      setDailyStats(sortedStats);
      setError("");
    } catch (err) {
      setError("Failed to load analytics");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0);
  const totalLinks = links.length;
  const avgClicks = totalLinks > 0 ? Math.round(totalClicks / totalLinks) : 0;
  const topLinks = [...links].sort((a, b) => b.clicks - a.clicks).slice(0, 5);
  const noClickLinks = links.filter(link => link.clicks === 0).length;

  const topLinksChartData = topLinks.map(link => ({
    name: link.slug,
    clicks: link.clicks,
    fullName: link.title || link.slug,
  }));

  const clickDistribution = [
    { name: "With Clicks", value: totalLinks - noClickLinks },
    { name: "No Clicks", value: noClickLinks },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-lg font-semibold">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Advanced Analytics</h1>
        <Button variant="outline" onClick={fetchAnalytics}>
          Refresh Data
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
          {error}
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Links</p>
              <p className="text-3xl font-bold">{totalLinks}</p>
            </div>
            <Link2 className="text-primary" size={24} />
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Clicks</p>
              <p className="text-3xl font-bold">{totalClicks}</p>
            </div>
            <MousePointerClick className="text-secondary" size={24} />
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Average Clicks</p>
              <p className="text-3xl font-bold">{avgClicks}</p>
            </div>
            <TrendingUp className="text-success" size={24} />
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Inactive Links</p>
              <p className="text-3xl font-bold">{noClickLinks}</p>
            </div>
            <ArrowUpRight className="text-warning" size={24} />
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Links Chart */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Top 5 Performing Links</h2>
          {topLinks.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topLinksChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
                  content={(props: unknown) => {
                    const { active, payload } = props as { active?: boolean; payload?: readonly ({payload: unknown})[]; };
                    if (active && payload?.[0]) {
                      const data = payload[0].payload as { fullName?: unknown; clicks?: unknown };
                      return (
                        <div className="bg-background border border-border rounded p-2 text-xs">
                          <p className="font-semibold">{String(data.fullName)}</p>
                          <p className="text-primary">Clicks: {String(data.clicks)}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="clicks" fill="#3B82F6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-300 text-muted-foreground">
              No data available
            </div>
          )}
        </Card>

        {/* Click Distribution Pie Chart */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Link Status Distribution</h2>
          {totalLinks > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={clickDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry: unknown) => {
                    const typedEntry = entry as { name?: string; value?: number };
                    return `${typedEntry.name}: ${typedEntry.value}`;
                  }}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {clickDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-300 text-muted-foreground">
              No data available
            </div>
          )}
        </Card>
      </div>

      {/* Daily Activity Chart */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Daily Activity</h2>
        {dailyStats.length > 0 ? (
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={dailyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip 
                content={(props: unknown) => {
                  const { active, payload } = props as { active?: boolean; payload?: readonly ({payload: unknown; color?: string; name?: string; value?: number})[]; };
                  if (active && payload?.[0]) {
                    const payloadData = payload[0].payload as { date?: unknown };
                    return (
                      <div className="bg-background border border-border rounded p-2 text-xs">
                        <p className="font-semibold">{String(payloadData.date)}</p>
                        {payload.map((entry: unknown, idx: number) => {
                          const typedEntry = entry as { color?: string; name?: string; value?: unknown };
                          return (
                            <p key={idx} style={{ color: typedEntry.color }}>
                              {String(typedEntry.name)}: {String(typedEntry.value)}
                            </p>
                          );
                        })}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="clicks" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ fill: "#3B82F6", r: 4 }}
                activeDot={{ r: 6 }}
                name="Total Clicks"
              />
              <Line 
                type="monotone" 
                dataKey="linksCreated" 
                stroke="#7C3AED" 
                strokeWidth={2}
                dot={{ fill: "#7C3AED", r: 4 }}
                activeDot={{ r: 6 }}
                name="Links Created"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-320 text-muted-foreground">
            No data available
          </div>
        )}
      </Card>

      {/* Detailed Link Table */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">All Links Performance</h2>
        {links.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr className="text-muted-foreground">
                  <th className="text-left py-3 px-4 font-semibold">Slug</th>
                  <th className="text-left py-3 px-4 font-semibold">Title</th>
                  <th className="text-right py-3 px-4 font-semibold">Clicks</th>
                  <th className="text-left py-3 px-4 font-semibold">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {links.map((link) => (
                  <tr key={link.id} className="hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 font-mono text-primary">{link.slug}</td>
                    <td className="py-3 px-4 truncate">{link.title || "-"}</td>
                    <td className="py-3 px-4 text-right font-semibold">{link.clicks}</td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {new Date(link.createdAt).toLocaleDateString("en-US")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No links yet. Create one to see analytics!
          </div>
        )}
      </Card>
    </div>
  );
}
