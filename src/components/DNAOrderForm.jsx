"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  validateDNA,
  calculateGCContent,
  getReverseComplement,
  calculatePrice,
} from "@/lib/dnaUtils";
import { loadStripe } from "@stripe/stripe-js";

// schema for form validation
const orderSchema = z.object({
  sequence: z
    .string()
    .min(1, "Sequence is required")
    .refine(validateDNA, "Only A, T, C, and G allowed"),
  scale: z.enum(["small", "medium", "large"]).optional(),
  purification: z.enum(["none", "hplc", "gel"]).optional(),
  vector: z.string().optional(),
});

export default function DNAOrderForm() {
  const [price, setPrice] = useState(0);
  const [gc, setGc] = useState(0);
  const [reverse, setReverse] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      scale: "small",
      purification: "none",
      vector: "",
    },
  });

  const seqValue = watch("sequence");
  const scaleValue = watch("scale");
  const purValue = watch("purification");

  useEffect(() => {
    const cleaned = seqValue ? seqValue.replace(/\s+/g, "") : "";
    setGc(calculateGCContent(cleaned));
    setReverse(getReverseComplement(cleaned));
    setPrice(calculatePrice(cleaned.length, { scale: scaleValue, purification: purValue }));
  }, [seqValue, scaleValue, purValue]);

  async function onSubmit(data) {
    try {
      // create order first
      const resp = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!resp.ok) throw new Error("Network response was not ok");
      const result = await resp.json();
      console.log("order created", result);

      // create stripe checkout session
      const sessionResp = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(result.price * 100),
          orderId: result.id,
        }),
      });
      const sessionData = await sessionResp.json();
      if (!sessionResp.ok) throw new Error(sessionData.error || "Checkout error");

      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
      stripe.redirectToCheckout({ sessionId: sessionData.sessionId });
    } catch (err) {
      console.error(err);
      alert("Failed to submit order");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block font-medium">DNA Sequence</label>
        <textarea
          {...register("sequence")}
          rows={6}
          className="mt-1 w-full border rounded p-2"
        />
        {errors.sequence && (
          <p className="text-red-600">{errors.sequence.message}</p>
        )}
      </div>
      <div>
        <label className="block font-medium">Scale</label>
        <select {...register("scale")} className="mt-1 border rounded p-1">
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>
      <div>
        <label className="block font-medium">Purification</label>
        <select
          {...register("purification")}
          className="mt-1 border rounded p-1"
        >
          <option value="none">None</option>
          <option value="hplc">HPLC</option>
          <option value="gel">Gel</option>
        </select>
      </div>
      <div>
        <label className="block font-medium">Cloning Vector</label>
        <input
          {...register("vector")}
          type="text"
          className="mt-1 w-full border rounded p-2"
          placeholder="e.g. pUC19"
        />
      </div>

      {/* calculated outputs */}
      <div className="mt-4">
        <p>Length: {seqValue ? seqValue.replace(/\s+/g, "").length : 0}</p>
        <p>GC content: {gc.toFixed(2)}%</p>
        <p>Reverse complement: {reverse}</p>
        <p className="font-bold">Price: ${price.toFixed(2)}</p>
      </div>

      <button
        type="submit"
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Submit Order
      </button>
    </form>
  );
}
