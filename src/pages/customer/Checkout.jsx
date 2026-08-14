import { supabase } from "../../services/supabase";
import { useState, useEffect } from "react";
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

  // Loyalty
  const [completedOrders, setCompletedOrders] = useState(0);
  const [rewardType, setRewardType] = useState(null);
  const [rewardProducts, setRewardProducts] = useState([]);
  const [selectedReward, setSelectedReward] = useState(null);
  const [checkingLoyalty, setCheckingLoyalty] = useState(false);

  /*
   * Check customer's completed orders
   */
  async function checkLoyalty() {
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setCompletedOrders(0);
      setRewardType(null);
      setRewardProducts([]);
      setSelectedReward(null);
      return;
    }

    setCheckingLoyalty(true);

    const { count, error } = await supabase
      .from("orders")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("mobile", mobile)
      .eq("status", "Completed");

    if (error) {
      console.error("Loyalty check error:", error);
      setCheckingLoyalty(false);
      return;
    }

    const completed = count || 0;

    setCompletedOrders(completed);

    /*
     * 4 completed = 5th order = 50% OFF
     * 9 completed = 10th order = FREE
     */
    if (completed % 10 === 9) {
      setRewardType("FREE");
      await loadRewardProducts();
    } else if (completed % 10 === 4) {
      setRewardType("50%");
      await loadRewardProducts();
    } else {
      setRewardType(null);
      setRewardProducts([]);
      setSelectedReward(null);
    }

    setCheckingLoyalty(false);
  }

  /*
   * Load reward products
   */
  async function loadRewardProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("id, name, price, image_url")
      .eq("is_available", true)
      .order("name");

    if (error) {
      console.error("Reward products error:", error);
      return;
    }

    /*
     * Exclude Scoop Cookie Tin
     */
    const filteredProducts = (data || []).filter(
      (product) =>
        product.name.trim().toLowerCase() !==
        "over loaded cookie tin ( the classic )".toLowerCase()
    );

    setRewardProducts(filteredProducts);
  }

  /*
   * Check loyalty when mobile number is entered
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (/^[6-9]\d{9}$/.test(mobile)) {
        checkLoyalty();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [mobile]);

  /*
   * Calculate reward discount
   */
const rewardPrice = selectedReward
  ? rewardType === "FREE"
    ? 0
    : Number(selectedReward.price) / 2
  : 0;

const finalTotal =
  Number(subtotal) + Number(rewardPrice);

  /*
   * Place Order
   */
  const handlePlaceOrder = async () => {
    if (!customerName.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    /*
     * If customer is eligible, reward selection is required
     */
    if (rewardType && !selectedReward) {
      alert("Please select your loyalty reward.");
      return;
    }

    /*
     * Create Order
     */
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name: customerName,
        mobile: mobile,
        subtotal: finalTotal,
      })
      .select()
      .single();

    if (orderError) {
      console.error(orderError);
      alert("Failed to place order.");
      return;
    }

    /*
     * Normal cart items
     */
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

    /*
     * Add loyalty reward item
     */
    if (selectedReward) {
      const originalPrice = Number(selectedReward.price);

      const rewardPrice =
        rewardType === "FREE"
          ? 0
          : originalPrice / 2;

      items.push({
        order_id: order.id,
        product_id: selectedReward.id,
        product_name: `${selectedReward.name} (Loyalty Reward)`,
        variant_name: null,
        addons: [],
        quantity: 1,
        unit_price: rewardPrice,
        total: rewardPrice,
      });
    }

    /*
     * Save order items
     */
    const { error: itemError } = await supabase
      .from("order_items")
      .insert(items);

    if (itemError) {
      console.error(itemError);

      /*
       * Remove order if items failed
       */
      await supabase
        .from("orders")
        .delete()
        .eq("id", order.id);

      alert("Failed to save order items.");
      return;
    }

    clearCart();

    /*
     * Go to payment
     */
    navigate("/payment", {
  state: {
    orderId: order.id,
    orderNumber: order.order_number,
    customerName,
    mobile,
    subtotal: finalTotal,
    originalSubtotal: subtotal,
    rewardType,
    rewardProduct: selectedReward,
    rewardPrice,
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

        {/* Customer Details */}
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
              onChange={(e) =>
                setCustomerName(e.target.value)
              }
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
              onChange={(e) =>
                setMobile(
                  e.target.value.replace(/\D/g, "")
                )
              }
              placeholder="9876543210"
              className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-yellow-400"
            />

          </div>

          {checkingLoyalty && (
            <p className="text-sm text-gray-500 mt-3">
              Checking your loyalty rewards...
            </p>
          )}

        </div>

        {/* Loyalty Reward */}
        {rewardType && !checkingLoyalty && (
          <div className="mt-5 bg-yellow-50 border-2 border-yellow-400 rounded-2xl p-5">

            <div className="text-center">

              <div className="text-3xl mb-2">
                🎉
              </div>

              <h2 className="text-xl font-bold text-yellow-700">
                Loyalty Reward Unlocked!
              </h2>

              <p className="text-sm text-gray-600 mt-2">
                You have completed{" "}
                <strong>{completedOrders}</strong>{" "}
                orders.
              </p>

              <p className="font-bold text-yellow-700 mt-2">
                {rewardType === "FREE"
                  ? "Choose ONE product FREE"
                  : "Choose ONE product at 50% OFF"}
              </p>

            </div>

            <div className="mt-5 space-y-3">

              {rewardProducts.map((product) => {

                const isSelected =
                  selectedReward?.id === product.id;

                const rewardPrice =
                  rewardType === "FREE"
                    ? 0
                    : Number(product.price) / 2;

                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() =>
                      setSelectedReward(product)
                    }
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition ${
                      isSelected
                        ? "border-yellow-500 bg-yellow-100"
                        : "border-gray-200 bg-white hover:border-yellow-300"
                    }`}
                  >

                    {product.image_url && (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}

                    <div className="flex-1">

                      <p className="font-bold">
                        {product.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        Regular: ₹{product.price}
                      </p>

                      <p className="font-bold text-green-600">
                        Reward Price: ₹{rewardPrice}
                      </p>

                    </div>

                    {isSelected && (
                      <div className="text-yellow-600 text-xl">
                        ✓
                      </div>
                    )}

                  </button>
                );
              })}

            </div>

          </div>
        )}

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow p-5 mt-5">

          <div className="flex justify-between text-lg">
            <span>Subtotal</span>

            <span className="font-bold">
              ₹{subtotal}
            </span>
          </div>

          {selectedReward && (
  <>
    <div className="flex justify-between text-green-600 mt-3">
      <span>
        Loyalty Reward
      </span>

      <span className="font-bold">
        {rewardType === "FREE"
          ? "FREE"
          : `₹${rewardPrice}`}
      </span>
    </div>

    <div className="flex justify-between text-sm text-gray-500 mt-2">
      <span>
        {selectedReward.name}
      </span>

      <span>
        {rewardType === "FREE"
          ? "FREE"
          : "50% OFF"}
      </span>
    </div>
  </>
)}

          <hr className="my-4" />

          <div className="flex justify-between text-xl font-bold">

            <span>
              Total
            </span>

            <span className="text-yellow-600">
              ₹{finalTotal}
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