"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Fingerprint } from "lucide-react";
import { Vortex } from "../../../src/components/ui/vortex";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const router = useRouter();
  const sess = useSession();
  const status = sess?.status;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });
    setLoading(false);
    if (res?.error) {
      alert("Verification failed. Please check credentials or ensure Prisma database is running.");
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
        {/* Left: illustration + intro */}
        <div className="flex flex-col items-start gap-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
            <Fingerprint className="w-8 h-8" />
          </div>
          <div>
             <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2">Welcome Back</h1>
             <p className="text-slate-400 leading-relaxed text-sm">Sign in to access the DNA diffusion network. Authenticate to manage synthetic workflows, configure generative models, and access secure compute resources.</p>
          </div>
          <div className="mt-2 text-xs text-slate-500 tracking-wider uppercase">Secure Node • Enclave Connection Active</div>
        </div>

        {/* Right: form */}
        <div className="bg-slate-950/45 p-8 rounded-2xl border border-slate-700/60 shadow-xl shadow-black/20">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Researcher Node Email</label>
              <input
                type="email"
                {...register("email")}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-mono text-sm"
                placeholder="node@dnadiffusion.com"
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1.5">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Access Key</label>
              <input
                type="password"
                {...register("password")}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-mono text-sm"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-red-400 text-xs mt-1.5">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <input id="remember" type="checkbox" className="h-4 w-4 rounded border-slate-600 text-indigo-500 focus:ring-indigo-500 bg-slate-800" defaultChecked />
                <label htmlFor="remember" className="text-sm text-slate-400">Remember node</label>
              </div>
              <a href="#" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">Recover Key?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-4 flex items-center justify-center py-3 rounded-lg font-medium shadow-lg transition-all duration-200 ${loading ? 'bg-slate-700 text-slate-400' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'}`}
            >
              {loading ? "Verifying..." : "Authenticate"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500 pt-6 border-t border-slate-700/50">
            No active clearance? <a href="/auth/register" className="text-emerald-400 hover:text-emerald-300 transition-colors">Request Access</a>
          </div>
        </div>
      </div>
      </Vortex>
    </div>
  );
}
