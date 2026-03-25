import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Zap, BarChart3, Shield } from "lucide-react";
// import NavButtons from "@/components/nav-buttons";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-white/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <span>📎</span>
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              BiTracky
            </span>
          </div>
          <div className="flex gap-3">
            <a href="/login" className="inline-flex">
              <Button variant="ghost">Sign In</Button>
            </a>
            <a href="/register" className="inline-flex">
              <Button>Sign Up</Button>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center space-y-6 animate-fadeIn">
          <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold">
            ✨ Professional link management solution
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground">
            Shorten, Share &{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Track
            </span>{" "}
            Links
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            BiTracky helps you create shortened links, track clicks, and manage all your links professionally and easily.
          </p>

          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <a href="/register" className="inline-flex">
              <Button size="lg" className="gap-2 text-base">
                Get Started Free <ArrowRight size={20} />
              </Button>
            </a>
            <Button size="lg" variant="outline">
              View Demo
            </Button>
          </div>
        </div>

        {/* Feature Preview */}
        <div className="mt-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl border border-primary/20 p-8 sm:p-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="text-primary" size={32} />
              </div>
              <h3 className="font-semibold mb-2">Create Instantly</h3>
              <p className="text-sm text-muted-foreground">
                Create shortened links in seconds with custom URLs
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-secondary/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="text-secondary" size={32} />
              </div>
              <h3 className="font-semibold mb-2">Track Analytics</h3>
              <p className="text-sm text-muted-foreground">
                View click counts and detailed statistics for each link
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="text-accent" size={32} />
              </div>
              <h3 className="font-semibold mb-2">Secure & Fast</h3>
              <p className="text-sm text-muted-foreground">
                Safe, fast and authenticated with JWT tokens
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Key Features</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to manage links professionally
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: "Professional Dashboard",
              description: "Clean, easy-to-use interface with all relevant information",
            },
            {
              title: "Custom Links",
              description: "Choose your own slug or let the system generate it automatically",
            },
            {
              title: "Link Management",
              description: "Edit, delete, and search your links easily",
            },
            {
              title: "API Ready",
              description: "Integrate with your application via RESTful API",
            },
          ].map((feature, i) => (
            <Card key={i} className="p-6">
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20 p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Join thousands of users using BiTracky to manage links efficiently
          </p>
          <a href="/register" className="inline-flex">
            <Button size="lg" className="gap-2">
              Create Free Account <ArrowRight size={20} />
            </Button>
          </a>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-20 bg-muted/30 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 font-bold text-lg mb-4">
                <span>📎</span>
                <span>BiTracky</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Professional URL shortening solution for everyone
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Links</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">About Us</a></li>
                <li><a href="#" className="hover:text-primary">Terms</a></li>
                <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Contact</a></li>
                <li><a href="#" className="hover:text-primary">FAQ</a></li>
                <li><a href="#" className="hover:text-primary">Blog</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 BiTracky. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}