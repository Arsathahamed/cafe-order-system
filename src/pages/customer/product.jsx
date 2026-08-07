import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../services/supabase";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
export default function Product() {
  const { id } = useParams();
const navigate = useNavigate();
const { addToCart } = useCart();

const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [addons, setAddons] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    loadProduct();
  }, [id]);

  async function loadProduct() {
    // Product
    const { data: productData } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    setProduct(productData);

  if (productData) {
  setTotalPrice(Number(productData.price) * quantity);
}

    // Variants
    const { data: variantData } = await supabase
      .from("product_variants")
      .select("*")
      .eq("product_id", id);

    setVariants(variantData || []);

   if (variantData && variantData.length > 0) {
  setSelectedVariant(variantData[0]);
  setTotalPrice(Number(variantData[0].price) * quantity);
}

    // Add-ons
    const { data: addonData } = await supabase
      .from("product_addons")
      .select("*")
      .eq("product_id", id);

    setAddons(addonData || []);
  }

  if (!product) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Page Content */}
      <div className="max-w-3xl mx-auto pb-32">

        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-80 object-cover rounded-b-3xl shadow-lg"
        />

        <div className="bg-white rounded-2xl shadow-lg p-6 -mt-8 relative mx-4">

          <h1 className="text-3xl font-bold">
            {product.name}
          </h1>

          <p className="text-gray-500 mt-3 leading-7">
            {product.description}
          </p>

        </div>

        <div className="px-4 mt-8">

          {variants.length > 0 && (
            <>
              <h2 className="text-xl font-bold mb-4">
                Choose Variant
              </h2>

              {variants.map((variant) => (
                <label
                  key={variant.id}
                  className={`flex justify-between items-center rounded-xl p-4 mb-3 cursor-pointer border-2 transition-all ${
                    selectedVariant?.id === variant.id
                      ? "border-yellow-500 bg-yellow-50 shadow-md"
                      : "border-gray-200 hover:border-yellow-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-4">

                    <input
                      type="radio"
                      name="variant"
                      checked={selectedVariant?.id === variant.id}
                    onChange={() => {
  setSelectedVariant(variant);

  const addonTotal = selectedAddons.reduce(
    (sum, item) => sum + Number(item.price),
    0
  );

  const basePrice = Number(variant.price);

  setTotalPrice((basePrice + addonTotal) * quantity);
}}
                      className="w-5 h-5 accent-yellow-500"
                    />

                    <div>
                      <h3 className="font-semibold">
                        {variant.name}
                      </h3>

                      <p className="text-sm text-gray-500">
                        Choose this option
                      </p>
                    </div>

                  </div>

                  <div className="font-bold text-yellow-600">
                    ₹{variant.price}
                  </div>
                </label>
              ))}
            </>
          )}

          {addons.length > 0 && (
            <>
              <h2 className="text-xl font-bold mt-8 mb-4">
                Add-ons
              </h2>

              {addons.map((addon) => (
                <label
                  key={addon.id}
                  className={`flex justify-between items-center rounded-xl p-4 mb-3 cursor-pointer border-2 transition-all ${
                    selectedAddons.some(
                      (item) => item.id === addon.id
                    )
                      ? "border-yellow-500 bg-yellow-50 shadow-md"
                      : "border-gray-200 hover:border-yellow-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-4">

                    <input
                      type="checkbox"
                      checked={selectedAddons.some(
                        (item) => item.id === addon.id
                      )}
                      onChange={(e) => {
                        let updatedAddons;

                        if (e.target.checked) {
                          updatedAddons = [...selectedAddons, addon];
                        } else {
                          updatedAddons = selectedAddons.filter(
                            (item) => item.id !== addon.id
                          );
                        }

                        setSelectedAddons(updatedAddons);

                        const addonTotal = updatedAddons.reduce(
                          (sum, item) => sum + Number(item.price),
                          0
                        );

const basePrice = Number(
  selectedVariant?.price || product.price
);

setTotalPrice((basePrice + addonTotal) * quantity);
                      }}
                      className="w-5 h-5 accent-yellow-500"
                    />

                    <div>
                      <h3 className="font-semibold">
                        {addon.name}
                      </h3>

                      <p className="text-sm text-gray-500">
                        Optional add-on
                      </p>
                    </div>

                  </div>

                  <div className="font-bold text-yellow-600">
                    +₹{addon.price}
                  </div>
                </label>
              ))}
            </>
          )}
<div className="mt-8 mb-6 bg-white border border-gray-200 rounded-2xl shadow-sm p-5 flex items-center justify-between">

  <h3 className="font-semibold text-lg">
    Quantity
  </h3>

  <div className="flex items-center gap-4">

    <button
      onClick={() => {
        if (quantity > 1) {
          const newQty = quantity - 1;
          setQuantity(newQty);

          const basePrice = Number(selectedVariant?.price || product.price);

          const addonTotal = selectedAddons.reduce(
            (sum, item) => sum + Number(item.price),
            0
          );

          setTotalPrice((basePrice + addonTotal) * newQty);
        }
      }}
      className="w-11 h-11 rounded-full border border-gray-300 hover:bg-gray-100 transition"
    >
      -
    </button>

    <span className="text-xl font-bold w-8 text-center">
      {quantity}
    </span>

    <button
      onClick={() => {
        const newQty = quantity + 1;
        setQuantity(newQty);

        const basePrice = Number(selectedVariant?.price || product.price);

        const addonTotal = selectedAddons.reduce(
          (sum, item) => sum + Number(item.price),
          0
        );

        setTotalPrice((basePrice + addonTotal) * newQty);
      }}
      className="w-11 h-11 rounded-full bg-yellow-500 hover:bg-yellow-600 text-white shadow transition"
    >
      +
    </button>

  </div>

</div>
        </div>

      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-xl z-50">

        <div className="max-w-3xl mx-auto flex justify-between items-center px-5 py-4">

          <div>
            <p className="text-sm text-gray-500">
              Total
            </p>

            <p className="text-2xl font-bold">
              ₹{totalPrice}
            </p>
          </div>

         <button
  onClick={() => {

   const unitPrice =
  Number(selectedVariant?.price || product.price) +
  selectedAddons.reduce(
    (sum, item) => sum + Number(item.price),
    0
  );

addToCart({
  id: product.id,
  name: product.name,
  image: product.image_url,
  variant: selectedVariant,
  addons: selectedAddons,
  quantity,
  unitPrice,
});

    navigate("/cart");
  }}
  className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-4 rounded-xl font-bold"
>
  🛒 Add to Order
</button>

        </div>

      </div>

    </div>
  );
}