import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import OrderModal from "../../components/OrderModal";
import { FiEye } from "react-icons/fi";
export default function Orders() {
  const [orders, setOrders] = useState([]);
const [selectedOrder, setSelectedOrder] = useState(null);
  async function loadOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setOrders(data);
    }
  }

 useEffect(() => {
  loadOrders();

  const channel = supabase
    .channel("orders-realtime")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "orders",
      },
      () => {
        loadOrders();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);
function getStatusBadge(status) {
  switch (status) {
    case "Order Created":
      return (
        <span className="px-3 py-1 rounded-full bg-gray-200 text-gray-700 font-semibold">
          Order Created
        </span>
      );

case "Awaiting Customer Payment":
  return (
    <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-semibold">
      Awaiting Customer Payment
    </span>
  );

case "Waiting for Payment Verification":
  return (
    <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 font-semibold">
      Waiting for Payment Verification
    </span>
  );

    case "Payment Submitted":
case "Payment Verified":
  return (
    <span className="px-3 py-1 rounded-full text-xs md:text-sm whitespace-nowrap bg-blue-100 text-blue-700 font-semibold">
      Payment Verified
    </span>
  );

    case "Preparing":
      return (
        <span className="px-3 py-1 rounded-full text-xs md:text-sm whitespace-nowrap bg-blue-100 text-blue-700 font-semibold">
          Preparing
        </span>
      );

    case "Ready for Pickup":
      return (
       <span className="px-3 py-1 rounded-full text-xs md:text-sm whitespace-nowrap bg-blue-100 text-blue-700 font-semibold">
          Ready
        </span>
      );

    case "Completed":
      return (
       <span className="px-3 py-1 rounded-full text-xs md:text-sm whitespace-nowrap bg-blue-100 text-blue-700 font-semibold">
          Completed
        </span>
      );

    case "Cancelled":
      return (
        <span className="px-3 py-1 rounded-full text-xs md:text-sm whitespace-nowrap bg-blue-100 text-blue-700 font-semibold">
          Cancelled
        </span>
      );

    default:
      return status;
  }
}
async function updateStatus(id, status) {
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id);

  if (!error) {
    loadOrders();
  }
}
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Orders
      </h1>

      <div className="hidden md:block bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-yellow-500 text-white">
            <tr>
              <th className="p-4 text-left">Order</th>
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-left">Mobile</th>
              <th className="p-4 text-left">Amount</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Time</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-bold">
                  #{order.order_number}
                </td>

                <td className="p-4">
                  {order.customer_name}
                </td>

                <td className="p-4">
                  {order.mobile}
                </td>

                <td className="p-4">
                  ₹{order.subtotal}
                </td>
<td className="p-4">
  {getStatusBadge(order.status)}
</td>
              

                <td className="p-4">
                  {new Date(order.created_at).toLocaleTimeString()}
                </td>
                <td className="p-4">

<div className="flex flex-col gap-2">

<button
  onClick={() => setSelectedOrder(order)}
  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-semibold transition"
>
  <FiEye size={18} />
  View
</button>

  {order.status === "Waiting for Payment Verification" && (
    <button
      onClick={() => updateStatus(order.id, "Payment Verified")}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
    >
      ✔ Verify Payment
    </button>
)}

  {order.status === "Ready for Pickup" && (
    <button
      onClick={() => updateStatus(order.id, "Completed")}
      className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg"
    >
      ✔ Complete
    </button>
  )}

</div>

</td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
      <div className="md:hidden space-y-4">

  {orders.map((order) => (

    <div
      key={order.id}
      className="bg-white rounded-xl shadow p-4"
    >

    <div className="flex flex-wrap justify-between items-start gap-2">

        <h2 className="font-bold text-lg">
          #{order.order_number}
        </h2>

        {getStatusBadge(order.status)}

      </div>

      <div className="mt-4 space-y-2 text-sm">

        <div>
          <span className="font-semibold">Customer:</span>{" "}
          {order.customer_name}
        </div>

        <div>
          <span className="font-semibold">Mobile:</span>{" "}
          {order.mobile}
        </div>

        <div>
          <span className="font-semibold">Amount:</span>{" "}
          ₹{order.subtotal}
        </div>

        <div>
          <span className="font-semibold">Time:</span>{" "}
          {new Date(order.created_at).toLocaleTimeString()}
        </div>

      </div>

      <div className="mt-4 flex flex-col gap-2">

        <button
          onClick={() => setSelectedOrder(order)}
          className="flex justify-center items-center gap-2 border border-slate-300 rounded-lg py-2"
        >
          <FiEye size={18} />
          View
        </button>

        {order.status === "Waiting for Payment Verification" && (
          <button
            onClick={() =>
              updateStatus(order.id, "Payment Verified")
            }
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
          >
            ✔ Verify Payment
          </button>
        )}

        {order.status === "Ready for Pickup" && (
          <button
            onClick={() =>
              updateStatus(order.id, "Completed")
            }
            className="w-full bg-green-700 hover:bg-green-800 text-white py-2 rounded-lg transition"
          >
            ✔ Complete
          </button>
        )}

      </div>

    </div>

  ))}

</div>
      <OrderModal
  order={selectedOrder}
  onClose={() => setSelectedOrder(null)}
/>
    </div>
  );
}