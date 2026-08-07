import { useState } from "react";
import { supabase } from "../services/supabase";

export default function VariantModal({
  productId,
  onClose,
  onSuccess,
  variant
}) {
 const [name, setName] = useState(variant?.name || "");
const [price, setPrice] = useState(variant?.price || "");

  async function saveVariant() {

  if (!name || !price) {
    alert("Please enter variant name and price.");
    return;
  }

  let error;

  if (variant) {
    ({ error } = await supabase
      .from("product_variants")
      .update({
        name,
        price: Number(price),
      })
      .eq("id", variant.id));
  } else {
    ({ error } = await supabase
      .from("product_variants")
      .insert({
        product_id: productId,
        name,
        price: Number(price),
      }));
  }

  if (error) {
    alert(error.message);
    return;
  }

  onSuccess();
  onClose();
}

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">
  {variant ? "Edit Variant" : "Add Variant"}
</h2>

        <input
          type="text"
          placeholder="Variant Name"
          className="w-full border rounded-lg p-3 mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Price"
          className="w-full border rounded-lg p-3 mb-6"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={saveVariant}
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
          >
           {variant ? "Update Variant" : "Save Variant"}
          </button>
        </div>
      </div>
    </div>
  );
}