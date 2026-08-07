import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export default function Cart() {
    const navigate = useNavigate();
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    subtotal,
  } = useCart();

 useEffect(() => {
  if (cartItems.length === 0) {
    const timer = setTimeout(() => {
      navigate("/menu", { replace: true });
    }, 300);

    return () => clearTimeout(timer);
  }
}, [cartItems, navigate]);

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="max-w-3xl mx-auto p-5 pb-36">

        <h1 className="text-3xl font-bold mb-6">
          Your Order
        </h1>

        {cartItems.map((item, index) => (

          <div
            key={index}
            className="bg-white rounded-2xl shadow p-5 mb-5"
          >

            <div className="flex justify-between">

              <div>

                <h2 className="text-xl font-bold">
                  {item.name}
                </h2>

                {item.variant && (
                  <p className="text-gray-500 mt-1">
                    {item.variant.name}
                  </p>
                )}

                {item.addons?.length > 0 && (

                  <div className="mt-2">

                    {item.addons.map((addon) => (
                      <p
                        key={addon.id}
                        className="text-sm text-gray-500"
                      >
                        + {addon.name}
                      </p>
                    ))}

                  </div>

                )}

              </div>

              <div className="font-bold text-yellow-600">
                ₹{item.unitPrice}
              </div>

            </div>

            <div className="flex justify-between items-center mt-6">

              <div className="flex items-center gap-3">

                <button
                  onClick={() =>
                    updateQuantity(
                      index,
                      Math.max(1, item.quantity - 1)
                    )
                  }
                  className="w-10 h-10 rounded-full border"
                >
                  -
                </button>

                <span className="font-bold">
                  {item.quantity}
                </span>

                <button
                  onClick={() =>
                    updateQuantity(
                      index,
                      item.quantity + 1
                    )
                  }
                  className="w-10 h-10 rounded-full bg-yellow-500 text-white"
                >
                  +
                </button>

              </div>

              <button
                onClick={() => removeFromCart(index)}
                className="text-red-500"
              >
                Remove
              </button>

            </div>

          </div>

        ))}

      </div>

     <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-xl">
  <div className="max-w-3xl mx-auto p-5">

    <div className="flex justify-between mb-4">
      <div>
        <p className="text-gray-500">Subtotal</p>
        <h2 className="text-3xl font-bold">₹{subtotal}</h2>
      </div>
    </div>

<div className="flex gap-3">

  <button
    onClick={() => navigate("/menu")}
    className="flex-1 border-2 border-yellow-500 text-yellow-600 py-4 rounded-xl font-bold"
  >
    + Add More Items
  </button>

  <button
    onClick={() => navigate("/checkout")}
    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-4 rounded-xl font-bold"
  >
    Continue →
  </button>

</div>

        </div>

      </div>

    </div>
  );
}