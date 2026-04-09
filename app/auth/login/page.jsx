"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const router = useRouter();
  const sess = useSession();
  const session = sess?.data;
  const status = sess?.status;

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });
    if (res?.error) {
      alert("Login failed: " + res.error);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Left: illustration + intro */}
        <div className="flex flex-col items-start gap-4">
          <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-blue-50 to-violet-50 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 6c4 0 4 12 8 12s4-12 8-12" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 18c4 0 4-12 8-12s4 12 8 12" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Welcome back</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Sign in to manage orders, track progress, and download QC reports. Secure, fast and designed for researchers.</p>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">Need help? <a href="/contact" className="text-blue-600 hover:underline">Contact support</a></div>
        </div>

        {/* Right: form */}
        <div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
              <input
                type="email"
                {...register("email")}
                className="mt-1 w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="you@university.edu"
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
              <input
                type="password"
                {...register("password")}
                className="mt-1 w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input id="remember" type="checkbox" className="h-4 w-4 text-blue-600" />
                <label htmlFor="remember" className="text-sm text-slate-600 dark:text-slate-400">Remember me</label>
              </div>
              <a href="#" className="text-sm text-blue-600 hover:underline">Forgot password?</a>
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow"
            >
              Sign in
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
            Don’t have an account? <a href="/auth/register" className="text-blue-600 hover:underline">Create one</a>
          </div>
        </div>
      </div>
    </div>
  );
}
