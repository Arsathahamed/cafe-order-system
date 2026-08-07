import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";

export default function Payment() {
  const navigate = useNavigate();
  const { state } = useLocation();

  if (!state) {
    navigate("/menu", { replace: true });
    return null;
  }

  const {
  orderId,
  orderNumber,
  customerName,
  mobile,
  subtotal,
} = state;

 const handlePaid = async () => {
  const { error } = await supabase
    .from("orders")
    .update({
     status: "Waiting for Payment Verification",
    })
    .eq("id", orderId);

  if (error) {
    alert("Something went wrong.");
    return;
  }

navigate("/order-success", {
  state: {
    orderId,
    orderNumber,
    customerName,
    mobile,
    subtotal,
  },
});
};

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-5">

      <div className="bg-white rounded-3xl shadow-lg p-8 max-w-md w-full">

        <h1 className="text-3xl font-bold text-center">
          Complete Payment
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Please pay using the QR code available at the counter.
        </p>

        <div className="bg-yellow-50 rounded-xl p-5 mt-8">

          <div className="flex justify-between">
            <span>Order No</span>
            <strong>#{orderNumber}</strong>
          </div>

          <div className="flex justify-between mt-3">
            <span>Total</span>
            <strong className="text-xl text-yellow-600">
              ₹{subtotal}
            </strong>
          </div>

        </div>

        <div className="mt-8 bg-gray-50 rounded-xl p-5 text-center">

          📱

          <p className="mt-3 font-semibold">
            Scan the UPI QR available at the counter.
          </p>

          <p className="text-gray-500 text-sm mt-2">
            After completing your payment,
            tap the button below.
          </p>

        </div>

        <button
          onClick={handlePaid}
          className="mt-8 w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold"
        >
          ✓ I've Paid
        </button>

      </div>

    </div>
  );
}