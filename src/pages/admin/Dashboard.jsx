import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";

export default function Dashboard() {

  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    preparing: 0,
    ready: 0,
    completed: 0,
  });

 async function loadDashboard() {
  const today = new Date();

  // Start of today (00:00:00)
  today.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .gte("created_at", today.toISOString());

  if (error) {
    console.log(error);
    return;
  }

  setStats({
    revenue: data.reduce(
      (sum, order) => sum + Number(order.subtotal),
      0
    ),

    orders: data.length,

    preparing: data.filter(
      (o) => o.status === "Preparing"
    ).length,

    ready: data.filter(
      (o) => o.status === "Ready for Pickup"
    ).length,

    completed: data.filter(
      (o) => o.status === "Completed"
    ).length,
  });
}

  useEffect(() => {
  loadDashboard();

  const channel = supabase
    .channel("dashboard")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "orders",
      },
      () => {
        loadDashboard();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);

  // 👇 REPLACE YOUR OLD RETURN WITH THE NEW RETURN HERE
return (
  <div>
    <h1 className="text-2xl md:text-3xl font-bold mb-6">
      Dashboard
    </h1>

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-6">

      {/* Revenue */}
      <div className="min-w-[220px] bg-white rounded-2xl shadow-md hover:shadow-lg transition border-l-4 border-green-500 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">
              Today's Revenue
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-green-600 mt-2">
              ₹{stats.revenue}
            </h2>
          </div>

          <div className="text-4xl">
            💰
          </div>
        </div>
      </div>

      {/* Orders */}
      <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition border-l-4 border-blue-500 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">
              Today's Orders
            </p>

            <h2 className="text-2xl md:text-3xl font-bold mt-2">
              {stats.orders}
            </h2>
          </div>

          <div className="text-4xl">
            🛒
          </div>
        </div>
      </div>

      {/* Preparing */}
      <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition border-l-4 border-purple-500 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">
              Preparing
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-purple-600 mt-2">
              {stats.preparing}
            </h2>
          </div>

          <div className="text-4xl">
            👨‍🍳
          </div>
        </div>
      </div>

      {/* Ready */}
      <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition border-l-4 border-orange-500 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">
              Ready
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-orange-600 mt-2">
              {stats.ready}
            </h2>
          </div>

          <div className="text-4xl">
            🍽️
          </div>
        </div>
      </div>

      {/* Completed */}
      <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition border-l-4 border-emerald-500 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">
              Completed
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-emerald-600 mt-2">
              {stats.completed}
            </h2>
          </div>

          <div className="text-4xl">
            ✅
          </div>
        </div>
      </div>

    </div>
  </div>
);
}