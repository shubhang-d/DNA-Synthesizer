"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function RegisterPage() {
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
    const resp = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (resp.ok) {
      // automatically sign in after registration
      await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });
      router.push("/dashboard");
    } else {
      const err = await resp.json();
      alert("Registration failed: " + (err.error || "unknown"));
    }
  };

  return (
    <div className="max-w-md mx-auto py-16">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium">Name</label>
          <input
            type="text"
            {...register("name")}
            className="mt-1 w-full border rounded p-2"
          />
          {errors.name && (
            <p className="text-red-600">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            {...register("email")}
            className="mt-1 w-full border rounded p-2"
          />
          {errors.email && (
            <p className="text-red-600">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="block font-medium">Password</label>
          <input
            type="password"
            {...register("password")}
            className="mt-1 w-full border rounded p-2"
          />
          {errors.password && (
            <p className="text-red-600">{errors.password.message}</p>
          )}
        </div>
        <button
          type="submit"
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Register
        </button>
      </form>
    </div>
  );
}
