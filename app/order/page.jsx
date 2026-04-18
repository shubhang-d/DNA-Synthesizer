"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DNAOrderForm from "@/components/DNAOrderForm";

export default function OrderPage() {
  const sess = useSession();
  const status = sess?.status;
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  if (status === "loading") return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto py-16">
      <h1 className="text-2xl font-bold mb-6">Place a DNA Order</h1>
      <DNAOrderForm />
    </div>
  );
}
