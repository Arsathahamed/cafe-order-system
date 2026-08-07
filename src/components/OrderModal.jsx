import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

export default function OrderModal({ order, onClose }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!order) return;

    async function loadItems() {
      const { data } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", order.id);

      setItems(data || []);
    }

    loadItems();
  }, [order]);

  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl p-6">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            Order #{order.order_number}
          </h2>

          <button
            onClick={onClose}
            className="text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">

          <div>
            <p className="text-gray-500">Customer</p>
            <h3 className="font-bold">
              {order.customer_name}
            </h3>
          </div>

          <div>
            <p className="text-gray-500">Mobile</p>
            <h3 className="font-bold">
              {order.mobile}
            </h3>
          </div>

          <div>
            <p className="text-gray-500">Status</p>
            <h3 className="font-bold">
              {order.status}
            </h3>
          </div>

          <div>
            <p className="text-gray-500">Total</p>
            <h3 className="font-bold text-green-600">
              ₹{order.subtotal}
            </h3>
          </div>

        </div>

        <hr className="mb-4" />

        <h3 className="font-bold mb-3">
          Ordered Items
        </h3>

        {items.map((item) => (
          <div
            key={item.id}
            className="border rounded-xl p-4 mb-3"
          >
            <div className="flex justify-between">
              <strong>
                {item.quantity} × {item.product_name}
              </strong>

              <strong>
                ₹{item.total}
              </strong>
            </div>

            {item.variant_name && (
              <p className="text-sm text-gray-500 mt-1">
                Variant: {item.variant_name}
              </p>
            )}

            {item.addons?.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-semibold">
                  Add-ons
                </p>

                <ul className="text-sm text-gray-600 list-disc ml-5">
                  {item.addons.map((addon, index) => (
                    <li key={index}>
                      {addon.name} (+₹{addon.price})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}

      </div>
    </div>
  );
}