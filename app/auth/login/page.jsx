"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Fingerprint, AlertCircle, ArrowRight } from "lucide-react";
import { Vortex } from "../../../src/components/ui/vortex";
import Link from "next/link";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const router = useRouter();
  const { status } = useSession();
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    if (status === "authenticated") router.push("/dashboard");
  }, [status, router]);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setAuthError("");
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });
    setLoading(false);
    if (res?.error) {
      setAuthError("Incorrect email or password. If you don't have an account, sign up below.");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Vortex
        backgroundColor="#020617"
        rangeY={700}
        particleCount={240}
        baseHue={165}
        className="min-h-screen flex items-center justify-center p-4"
      >
        <div className="w-full max-w-5xl bg-slate-900/80 backdrop-blur-xl border border-slate-700/70 rounded-2xl shadow-2xl shadow-emerald-900/10 p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* Left panel */}
          <div className="flex flex-col items-start gap-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <Fingerprint className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2">Welcome Back</h1>
              <p className="text-slate-400 leading-relaxed text-sm">
                Sign in to access the DNA diffusion platform. Only registered researchers can access the synthesis pipeline.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 w-full">
              <p className="text-xs text-amber-300 font-medium mb-1">Don't have an account?</p>
              <p className="text-xs text-slate-400 mb-3">
                You must register first before you can sign in. New accounts are approved instantly.
              </p>
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 text-sm font-medium text-amber-300 hover:text-amber-200 transition-colors"
              >
                Create an account <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right: form */}
          <div className="bg-slate-950/45 p-8 rounded-2xl border border-slate-700/60 shadow-xl shadow-black/20">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

              {authError && (
                <div className="flex gap-3 p-3.5 rounded-lg bg-red-500/10 border border-red-500/30">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-300">{authError}</p>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email</label>
                <input
                  type="email"
                  {...register("email")}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-mono text-sm"
                  placeholder="you@example.com"
                />
                {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Password</label>
                <input
                  type="password"
                  {...register("password")}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-mono text-sm"
                  placeholder="••••••••"
                />
                {errors.password && <p className="text-red-400 text-xs mt-1.5">{errors.password.message}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 flex items-center justify-center gap-2 py-3 rounded-lg font-medium shadow-lg transition-all duration-200 bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing in…" : "Sign In"}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-500 pt-5 border-t border-slate-700/50">
              No account yet?{" "}
              <Link href="/auth/register" className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium">
                Register here
              </Link>
            </div>
          </div>
        </div>
      </Vortex>
    </div>
  );
}
