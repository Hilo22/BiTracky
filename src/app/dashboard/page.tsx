"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Copy, ExternalLink, Trash2, Edit2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LinkItem {
  id: string;
  originalUrl: string;
  title: string;
  slug: string;
  clicks: number;
  createdAt: string;
}

export default function DashboardPage() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    originalUrl: "",
    title: "",
    slug: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch links khi component mount
  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/links");
      setLinks(response.data.data || []);
      setError("");
    } catch (err) {
        setError("Failed to load links");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await axios.post("/api/links", formData);
      setFormData({ originalUrl: "", title: "", slug: "" });
      setShowForm(false);
      await fetchLinks();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Error creating link");
      } else {
        setError("Error creating link");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteLink = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this link?")) return;
    try {
      await axios.delete(`/api/links/${slug}`);
      await fetchLinks();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Error deleting link");
      } else {
        setError("Error deleting link");
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied!");
  };

  const filteredLinks = links.filter((link) =>
    link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Links</h1>
          <p className="section-subtitle">
            Create, manage and track your shortened links
          </p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="gap-2"
        >
          <Plus size={18} />
          Create New Link
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="card-base border-destructive/30 bg-destructive/5 p-4">
          <p className="text-destructive">{error}</p>
        </div>
      )}

      {/* Create Link Form */}
      {showForm && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Create New Link</h3>
          <form onSubmit={handleCreateLink} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">Original URL *</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com/very/long/url"
                value={formData.originalUrl}
                onChange={(e) =>
                  setFormData({ ...formData, originalUrl: e.target.value })
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Link name (optional)"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Short Code</Label>
                <Input
                  id="slug"
                  placeholder="abc123 (optional)"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={submitting}>
                {submitting ? "Creating..." : "Create Link"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search by title or short code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Links List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin">⏳</div>
          <p className="text-muted-foreground mt-2">Loading...</p>
        </div>
      ) : filteredLinks.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">
            {searchTerm ? "No links found" : "You haven't created any links yet"}
          </p>
          {!searchTerm && (
            <Button onClick={() => setShowForm(true)}>Create your first link</Button>
          )}
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredLinks.map((link) => (
            <Card key={link.id} className="p-6 hover:shadow-lg">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold truncate">
                      {link.title || "Untitled"}
                    </h3>
                    <span className="badge-primary text-xs">
                      {link.clicks} clicks
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Short Code:
                      </p>
                      <div className="flex items-center gap-2">
                        <code className="text-sm bg-muted/50 px-3 py-1 rounded font-mono">
                          {process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/r/{link.slug}
                        </code>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          onClick={() =>
                            copyToClipboard(
                              `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/r/${link.slug}`
                            )
                          }
                        >
                          <Copy size={16} />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Original URL:
                      </p>
                      <div className="flex items-center gap-2">
                        <a 
                          href={link.originalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline truncate"
                        >
                          {link.originalUrl}
                        </a>
                        <a href={link.originalUrl} target="_blank" rel="noopener noreferrer" className="inline-flex">
                          <Button
                            size="icon-sm"
                            variant="ghost"
                          >
                            <ExternalLink size={16} />
                          </Button>
                        </a>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Created: {new Date(link.createdAt).toLocaleDateString("en-US")}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="icon-sm"
                    variant="ghost"
                  >
                    <Edit2 size={16} />
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDeleteLink(link.slug)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
