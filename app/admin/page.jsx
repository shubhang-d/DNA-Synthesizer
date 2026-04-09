"use client";

import { useState, useEffect } from "react";

export default function AdminPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/orders");
        if (res.ok) {
          setOrders(await res.json());
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

  return (
    <div className="max-w-3xl mx-auto py-16">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">User</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Price</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td className="border p-2 text-sm">{o.id.slice(0, 8)}</td>
              <td className="border p-2 text-sm">{o.user?.email}</td>
              <td className="border p-2 text-sm">{o.status}</td>
              <td className="border p-2 text-sm">${o.price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
