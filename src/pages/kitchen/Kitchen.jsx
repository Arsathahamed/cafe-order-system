import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import newOrderSound from "../../assets/sounds/new-order.wav";
import { useRef } from "react";
export default function Kitchen() {
  const [orders, setOrders] = useState([]);
const notification = useRef(null);

useEffect(() => {
  notification.current = new Audio(newOrderSound);
  notification.current.preload = "auto";
}, []);
 async function loadOrders() {
  const { data: ordersData, error } = await supabase
    .from("orders")
    .select("*")
    .in("status", ["Payment Verified", "Preparing"])
    .order("created_at", { ascending: true });

  if (!ordersData) return;

  const ordersWithItems = await Promise.all(
    ordersData.map(async (order) => {
      const { data: items, error: itemsError } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", order.id);

      return {
        ...order,
        items: items || [],
      };
    })
  );

  setOrders(ordersWithItems);
}

 useEffect(() => {
  loadOrders();

  const channel = supabase
  .channel("kitchen-orders")
  .on(
    "postgres_changes",
    {
      event: "UPDATE",
      schema: "public",
      table: "orders",
    },
    (payload) => {
          console.log(payload);
  if (
  payload.old.status !== "Payment Verified" &&
  payload.new.status === "Payment Verified"
) {
  notification.current.currentTime = 0;
  notification.current.play().catch((err) => {
    console.log(err);
  });
}

      loadOrders();
    }
  )
  .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);

  async function updateStatus(id, status) {
    await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);

    loadOrders();
  }
function getElapsedTime(date) {
  const diff = Math.floor(
    (Date.now() - new Date(date)) / 60000
  );

  if (diff < 1) return "Just now";

  if (diff < 60) return `${diff} mins ago`;

  return `${Math.floor(diff / 60)} hrs ago`;
}
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">

      <h1 className="text-2xl md:text-4xl font-bold mb-6 md:mb-8">
        👨‍🍳 Kitchen Display
      </h1>

      {orders.length === 0 ? (
        <div className="text-center text-gray-500 text-lg md:text-2xl mt-20">
          No Orders
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

        {orders.map((order) => {

  const mins = Math.floor(
    (Date.now() - new Date(order.created_at)) / 60000
  );

  return (

    <div
      key={order.id}
      className={`bg-white rounded-3xl shadow-lg p-4 md:p-6 ${
        mins >= 15
          ? "border-4 border-red-500"
          : mins >= 10
          ? "border-4 border-orange-400"
          : "border-2 border-green-400"
      }`}
    >

             <div className="flex flex-wrap justify-between items-start gap-3">

  <div>
    <h2 className="text-2xl md:text-3xl font-bold">
      #{order.order_number}
    </h2>

  
  </div>

  <div className="flex flex-col items-end gap-2">

    <span
      className={`px-3 py-1 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap ${
        order.status === "Payment Verified"
          ? "bg-blue-100 text-blue-700"
          : "bg-purple-100 text-purple-700"
      }`}
    >
      {order.status}
    </span>

    <span
      className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
        mins >= 15
          ? "bg-red-100 text-red-700"
          : mins >= 10
          ? "bg-orange-100 text-orange-700"
          : "bg-green-100 text-green-700"
      }`}
    >
      {mins < 1 ? "Just now" : `${mins} mins`}
    </span>

  </div>

</div>

              <div className="mt-5">

                <h3 className="font-semibold text-base md:text-lg">
                  {order.customer_name}
                </h3>
<div className="mt-6 border-t pt-4">

  <h3 className="font-semibold mb-3">
    Items
  </h3>

{(order.items || []).map((item) => (

    <div
      key={item.id}
      className="mb-4"
    >

      <div className="flex flex-wrap justify-between items-start gap-3">

  <div>

    <div className="font-bold text-base md:text-lg">
      {item.quantity} × {item.product_name}
    </div>

    {item.variant_name && (
      <div className="text-gray-500 text-sm">
        {item.variant_name}
      </div>
    )}

    {item.addons?.length > 0 && (
      <div className="text-sm text-gray-500 mt-1">
        {item.addons.map((addon) => (
          <div key={addon.id}>
            + {addon.name} (+₹{addon.price})
          </div>
        ))}
      </div>
    )}

  </div>

  <strong>
    ₹{item.total}
  </strong>

</div>

      {item.variant_name && (
        <div className="text-sm text-gray-500">
          {item.variant_name}
        </div>
      )}

{item.addons?.length > 0 && (
  <div className="text-sm text-gray-500 mt-1">
    {item.addons.map((addon) => (
      <div key={addon.id}>
        + {addon.name} (+₹{addon.price})
      </div>
    ))}
  </div>
)}

    </div>

  ))}

</div>

                <p className="text-gray-500">
                  ₹{order.subtotal}
                </p>

              </div>

              <div className="mt-8">

                {order.status === "Payment Verified" && (

                  <button
                    onClick={() =>
                      updateStatus(order.id, "Preparing")
                    }
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 md:py-4 rounded-xl font-bold transition"
                  >
                    👨‍🍳 Start Preparing
                  </button>

                )}

                {order.status === "Preparing" && (

                  <button
                    onClick={() =>
                      updateStatus(order.id, "Ready for Pickup")
                    }
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 md:py-4 rounded-xl font-bold transition"
                  >
                    🍽 Ready for Pickup
                  </button>

                )}

              </div>

              </div>

          );

        })}

        </div>
      )}

    </div>
  );
}