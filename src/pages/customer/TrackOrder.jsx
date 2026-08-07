import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";

export default function TrackOrder() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [order, setOrder] = useState(null);

  if (!state) {
    navigate("/menu", { replace: true });
    return null;
  }

  const { orderId } = state;

  async function loadOrder() {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    setOrder(data);
  }

  useEffect(() => {
    loadOrder();

    const channel = supabase
      .channel("track-order")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
        },
        (payload) => {
          if (payload.new.id === orderId) {
            loadOrder();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (!order) {
    return (
      <div className="min-h-screen flex justify-center items-center text-xl font-semibold">
        Loading...
      </div>
    );
  }

  const steps = [
    "Order Created",
    "Waiting for Payment Verification",
    "Payment Verified",
    "Preparing",
    "Ready for Pickup",
    "Completed",
  ];

  const currentIndex = steps.indexOf(order.status);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-lg w-full">

        <h1 className="text-3xl font-bold text-center">
          📦 Track Your Order
        </h1>

        <p className="text-center mt-2 text-gray-500">
          Order #{order.order_number}
        </p>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
          <p className="text-gray-500 text-sm">Current Status</p>

          <h2 className="text-2xl font-bold text-blue-700 mt-2">
            {order.status}
          </h2>
        </div>

        <div className="mt-8">

          {steps.map((step, index) => {

            const completed = index <= currentIndex;

            return (
              <div key={step} className="flex">

                <div className="flex flex-col items-center mr-4">

                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold
                    ${
                      completed
                        ? "bg-green-500 text-white"
                        : "bg-gray-300 text-gray-500"
                    }`}
                  >
                    {completed ? "✓" : ""}
                  </div>

                  {index < steps.length - 1 && (
                    <div
                      className={`w-1 h-12 ${
                        completed
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    />
                  )}

                </div>

                <div className="pb-8">

                  <h3
                    className={`font-semibold ${
                      completed
                        ? "text-green-700"
                        : "text-gray-500"
                    }`}
                  >
                    {step}
                  </h3>

                </div>

              </div>
            );

          })}

        </div>

        <div className="mt-4 rounded-xl bg-yellow-50 border border-yellow-200 p-4">

          {order.status === "Order Created" && (
            <p>Your order has been received.</p>
          )}

          {order.status === "Waiting for Payment Verification" && (
            <p>Waiting for our cashier to verify your payment.</p>
          )}

          {order.status === "Payment Verified" && (
            <p>✅ Payment verified. Your order will be sent to the kitchen shortly.</p>
          )}

          {order.status === "Preparing" && (
            <p>👨‍🍳 Our chefs are preparing your order.</p>
          )}

          {order.status === "Ready for Pickup" && (
            <p>🎉 Your order is ready! Please collect it at the counter.</p>
          )}

          {order.status === "Completed" && (
            <p>❤️ Thank you! Enjoy your meal.</p>
          )}

        </div>

        <button
          onClick={() => navigate("/menu")}
          className="w-full mt-8 bg-yellow-500 hover:bg-yellow-600 text-white py-4 rounded-xl font-bold"
        >
          Back to Menu
        </button>

      </div>
    </div>
  );
}