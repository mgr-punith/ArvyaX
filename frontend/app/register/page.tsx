"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      router.push("/login");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center from-forest via-moss to-ocean px-4">
      <div className="bg-cream rounded-2xl p-10 w-full max-w-md shadow-2xl">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl text-forest tracking-tight">ArvyaX</h1>
          <p className="text-sage text-sm mt-2">Begin your nature journey</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-moss uppercase tracking-wide">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="px-4 py-3 rounded-lg border border-mist text-forest text-sm focus:outline-none focus:border-moss transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-moss uppercase tracking-wide">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              className="px-4 py-3 rounded-lg border border-mist text-forest text-sm focus:outline-none focus:border-moss transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-moss uppercase tracking-wide">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="px-4 py-3 rounded-lg border border-mist text-forest text-sm focus:outline-none focus:border-moss transition-colors"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 py-3 rounded-lg bg-moss text-cream font-medium text-sm hover:bg-forest transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sage text-sm mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-moss font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}