"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
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
      const res = await login(form);
      localStorage.setItem("user", JSON.stringify(res.data));
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-forest via-moss to-ocean px-4">
      <div className="bg-cream rounded-2xl p-10 w-full max-w-md shadow-2xl">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl text-forest tracking-tight">ArvyaX</h1>
          <p className="text-sage text-sm mt-2">Your nature journal awaits</p>
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
              className="px-4 py-3 rounded-lg border border-mist bg-gray-700 text-forest text-sm focus:outline-none focus:border-moss transition-colors"
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
              className="px-4 py-3 rounded-lg border border-mist bg-gray-700 text-forest text-sm focus:outline-none focus:border-moss transition-colors"
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
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sage text-sm mt-6">
          No account?{" "}
          <Link href="/register" className="text-moss font-semibold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}