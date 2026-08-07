import { useLocation, useNavigate } from "react-router-dom";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const { state } = useLocation();

  if (!state) {
    navigate("/menu", { replace: true });
    return null;
  }

  const {
    orderNumber,
    customerName,
    mobile,
    subtotal,
  } = state;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-5">

      <div className="bg-white rounded-3xl shadow-lg p-8 max-w-md w-full text-center">

        <div className="text-6xl mb-4">
          🎉
        </div>

       <h1 className="text-3xl font-bold">
  Order Submitted!
</h1>

        <p className="text-gray-500 mt-2">
          Thank you for your order.
        </p>

        <div className="mt-8 text-left space-y-3">

          <div className="flex justify-between">
            <span className="font-medium">Order No</span>
            <span className="font-bold">
              #{orderNumber}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Name</span>
            <span>{customerName}</span>
          </div>

          <div className="flex justify-between">
            <span>Mobile</span>
            <span>{mobile}</span>
          </div>

          <div className="flex justify-between text-lg font-bold border-t pt-3">
            <span>Total</span>
            <span className="text-yellow-600">
              ₹{subtotal}
            </span>
          </div>
          <div className="flex justify-between border-t pt-3">
  <span>Estimated Time</span>
  <span className="font-semibold">
    10–15 mins
  </span>
</div>

        </div>

<div className="bg-green-50 border border-green-200 rounded-xl p-4 mt-8">

  <p className="font-semibold text-green-700">
    ✅ Payment Submitted
  </p>

  <p className="text-sm text-gray-600 mt-2">
    Thank you! Our cashier will verify your payment shortly.
    Your order is now in the queue.
  </p>

</div>

<div className="mt-8 space-y-3">

  <button
    onClick={() =>
      navigate("/track-order", {
        state: {
          orderId: state.orderId,
        },
      })
    }
    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold"
  >
    📍 Track Order
  </button>

  <button
    onClick={() => navigate("/menu")}
    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-4 rounded-xl font-bold"
  >
    Order Another
  </button>

</div>

      </div>

    </div>
  );
}