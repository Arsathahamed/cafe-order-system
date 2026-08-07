import { useState } from "react";
import { supabase } from "../services/supabase";

export default function AddonModal({
  productId,
  addon,
  onClose,
  onSuccess,
}){
 const [name, setName] = useState(addon?.name || "");
const [price, setPrice] = useState(addon?.price || "");

 async function saveAddon() {
  if (!name || !price) {
    alert("Please enter add-on name and price.");
    return;
  }

  let error;

  if (addon) {
    ({ error } = await supabase
      .from("product_addons")
      .update({
        name,
        price: Number(price),
      })
      .eq("id", addon.id));
  } else {
    ({ error } = await supabase
      .from("product_addons")
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
  {addon ? "Edit Add-on" : "Add Add-on"}
</h2>

        <input
          className="w-full border rounded-lg p-3 mb-4"
          placeholder="Add-on Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full border rounded-lg p-3 mb-4"
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Cancel
          </button>

          <button
            onClick={saveAddon}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {addon ? "Update Add-on" : "Save Add-on"}
          </button>
        </div>

      </div>
    </div>
  );
}