"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Brain, AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import { Vortex } from "../../../src/components/ui/vortex";
import Link from "next/link";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirm: z.string().min(6, "Please confirm your password"),
}).refine((d) => d.password === d.confirm, {
  message: "Passwords do not match",
  path: ["confirm"],
});

export default function RegisterPage() {
  const router = useRouter();
  const { status } = useSession();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (status === "authenticated") router.push("/dashboard");
  }, [status, router]);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError("");
    const resp = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: data.name, email: data.email, password: data.password }),
    });
    if (resp.ok) {
      await signIn("credentials", { redirect: false, email: data.email, password: data.password });
      router.push("/dashboard");
    } else {
      const err = await resp.json();
      setServerError(err.error || "Registration failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Vortex
        backgroundColor="#020617"
        rangeY={700}
        particleCount={240}
        baseHue={200}
        className="min-h-screen flex items-center justify-center p-4"
      >
        <div className="w-full max-w-5xl bg-slate-900/80 backdrop-blur-xl border border-slate-700/70 rounded-2xl shadow-2xl p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* Left panel */}
          <div className="flex flex-col items-start gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Brain className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2">Create Account</h1>
              <p className="text-slate-400 leading-relaxed text-sm">
                Register to access the DNA diffusion platform. Your account gives you access to the synthesis pipeline, library, and analytics.
              </p>
            </div>
            <div className="space-y-2.5 w-full">
              {["Access the DNA Sequence Generator", "Store sequences in your private library", "View analytics across all generations"].map((f) => (
                <div key={f} className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <div className="bg-slate-800/30 p-8 rounded-2xl border border-slate-700/50">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              {serverError && (
                <div className="flex gap-3 p-3.5 rounded-lg bg-red-500/10 border border-red-500/30">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-300">{serverError}</p>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                <input
                  type="text"
                  {...register("name")}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm"
                  placeholder="Dr. Alan Grant"
                />
                {errors.name && <p className="text-red-400 text-xs mt-1.5">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email</label>
                <input
                  type="email"
                  {...register("email")}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm"
                  placeholder="you@example.com"
                />
                {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Password</label>
                <input
                  type="password"
                  {...register("password")}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm"
                  placeholder="At least 6 characters"
                />
                {errors.password && <p className="text-red-400 text-xs mt-1.5">{errors.password.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Confirm Password</label>
                <input
                  type="password"
                  {...register("confirm")}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm"
                  placeholder="••••••••"
                />
                {errors.confirm && <p className="text-red-400 text-xs mt-1.5">{errors.confirm.message}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 flex items-center justify-center gap-2 py-3 rounded-lg font-medium shadow-lg transition-all duration-200 bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating account…" : "Create Account"}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            <div className="mt-5 text-center text-sm text-slate-500 pt-5 border-t border-slate-700/50">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </Vortex>
    </div>
  );
}
