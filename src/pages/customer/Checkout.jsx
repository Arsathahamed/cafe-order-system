import { supabase } from "../../services/supabase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export default function Checkout() {
  const navigate = useNavigate();
  const {
  cartItems,
  subtotal,
  clearCart,
} = useCart();

  const [customerName, setCustomerName] = useState("");
  const [mobile, setMobile] = useState("");

  const handlePlaceOrder = async () => {
  if (!customerName.trim()) {
    alert("Please enter your name.");
    return;
  }

  if (!/^[6-9]\d{9}$/.test(mobile)) {
    alert("Please enter a valid 10-digit mobile number.");
    return;
  }

  // Create Order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_name: customerName,
      mobile: mobile,
      subtotal: subtotal,
    })
    .select()
    .single();

  if (orderError) {
    console.error(orderError);
    alert("Failed to place order.");
    return;
  }

  // Create Order Items
  const items = cartItems.map((item) => ({
    order_id: order.id,
    product_id: item.id,
    product_name: item.name,
    variant_name: item.variant?.name || null,
    addons: item.addons,
    quantity: item.quantity,
    unit_price: item.unitPrice,
    total: item.unitPrice * item.quantity,
  }));

  const { error: itemError } = await supabase
    .from("order_items")
    .insert(items);

  if (itemError) {
    console.error(itemError);
    alert("Failed to save order items.");
    return;
  }

  clearCart();

  navigate("/payment", {
  state: {
    orderId: order.id,
    orderNumber: order.order_number,
    customerName,
    mobile,
    subtotal,
  },
});
};

  return (
    <div className="min-h-screen bg-gray-100 pb-32">

      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto px-5 py-4 flex items-center justify-between">

          <button
            onClick={() => navigate("/cart")}
            className="text-yellow-600 font-semibold"
          >
            ← Back
          </button>

          <h1 className="text-xl font-bold">
            Checkout
          </h1>

          <div className="w-12"></div>

        </div>
      </div>

      {/* Form */}
      <div className="max-w-md mx-auto p-5">

        <div className="bg-white rounded-2xl shadow p-5">

          <h2 className="text-lg font-bold mb-5">
            Customer Details
          </h2>

          <div className="mb-5">
            <label className="block mb-2 font-medium">
              Name
            </label>

            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter your name"
              className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Mobile Number
            </label>

            <input
              type="tel"
              maxLength={10}
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="9876543210"
              className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow p-5 mt-5">

          <div className="flex justify-between text-lg">
            <span>Subtotal</span>
            <span className="font-bold">
              ₹{subtotal}
            </span>
          </div>

          <hr className="my-4" />

          <div className="flex justify-between text-xl font-bold">
            <span>Total</span>
            <span className="text-yellow-600">
              ₹{subtotal}
            </span>
          </div>

        </div>

      </div>

      {/* Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-xl">

        <div className="max-w-md mx-auto p-5">

         <button
  onClick={handlePlaceOrder}
  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-4 rounded-xl text-lg font-bold"
>
  Place Order →
</button>

        </div>

      </div>

    </div>
  );
}