import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import {
  calculateGCContent,
  calculatePrice,
} from "@/lib/dnaUtils";

export async function POST(req) {
  try {
    const data = await req.json();
    const { sequence, scale, purification, vector } = data;

    // sanitize sequence
    const cleanedSeq = sequence.replace(/\s+/g, "").toUpperCase();
    const length = cleanedSeq.length;
    const gcContent = calculateGCContent(cleanedSeq);
    const price = calculatePrice(length, { scale, purification });

    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
    const order = await prisma.order.create({
      data: {
        sequence: cleanedSeq,
        length,
        gcContent,
        scale,
        purification,
        vector,
        price,
        userId: session.user.id,
      },
    });

    return new Response(JSON.stringify(order), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to create order" }), {
      status: 500,
    });
  }
}

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });
    return new Response(JSON.stringify(orders), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to fetch orders" }), {
      status: 500,
    });
  }
}
