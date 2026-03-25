"use client";

import Link from "next/link";
import { z } from "zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterType = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterType>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterType) => {
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("/api/auth/register", data);
      setMessage(response.data?.message ?? "Registration successful");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.message ?? "Registration failed");
      } else {
        setMessage("Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-purple-100 px-4 py-8">
      <div className="w-full max-w-md animate-fadeIn">
        <Card className="border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-secondary to-primary rounded-t-xl text-white p-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold">📎</span>
              </div>
            </div>
            <CardTitle className="text-center text-2xl font-bold text-white">
              BiTracky
            </CardTitle>
            <p className="text-center text-white/80 text-sm mt-2">
              Join the community of efficient link management
            </p>
          </CardHeader>

          <CardContent className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-foreground mb-1">Create Your Account</h2>
              <p className="text-sm text-muted-foreground">Start shortening links now!</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-semibold">Email</Label>
                <Input
                  id="email"
                  {...register("email")}
                  placeholder="your@email.com"
                  type="email"
                />
                {errors.email && (
                  <p className="text-xs text-destructive font-medium">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="font-semibold">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  placeholder="At least 6 characters"
                />
                {errors.password && (
                  <p className="text-xs text-destructive font-medium">{errors.password.message}</p>
                )}
              </div>

              {message && (
                <div className={`p-3 rounded-lg text-sm font-medium ${
                  message.includes("successful") || message.includes("success")
                    ? "bg-success/10 text-success"
                    : "bg-destructive/10 text-destructive"
                }`}>
                  {message}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-11 font-semibold text-base"
                disabled={loading}
              >
                {loading ? "Processing..." : "Sign Up"}
              </Button>
            </form>

            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-primary hover:text-primary/90 transition-colors">
                  Sign In
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          © 2024 BiTracky. All rights reserved.
        </p>
      </div>
    </div>
  );
}