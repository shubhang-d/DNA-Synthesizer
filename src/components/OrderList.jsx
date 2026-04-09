"use client";

import { useState, useEffect } from "react";

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/orders");
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        } else {
          console.error("Failed to fetch orders");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p>Loading orders...</p>;
  if (orders.length === 0) return <p>No orders found.</p>;

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th className="border p-2">ID</th>
          <th className="border p-2">Date</th>
          <th className="border p-2">Status</th>
          <th className="border p-2">Price</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((o) => (
          <tr key={o.id}>
            <td className="border p-2 text-sm">{o.id.slice(0, 8)}</td>
            <td className="border p-2 text-sm">{new Date(o.createdAt).toLocaleDateString()}</td>
            <td className="border p-2 text-sm">{o.status}</td>
            <td className="border p-2 text-sm">${o.price.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
