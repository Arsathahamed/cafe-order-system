import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../services/supabase";
import AddonModal from "../../components/AddonModal";
import VariantModal from "../../components/VariantModal";

export default function ProductDetails() {
  const { id } = useParams();
const [showModal, setShowModal] = useState(false);
  const [variants, setVariants] = useState([]);
const [addons, setAddons] = useState([]);
const [showAddonModal, setShowAddonModal] = useState(false);
const [editingVariant, setEditingVariant] = useState(null);
const [editingAddon, setEditingAddon] = useState(null);
 useEffect(() => {
  fetchVariants();
  fetchAddons();
}, [id]);

  async function fetchVariants() {
    const { data, error } = await supabase
      .from("product_variants")
      .select("*")
      .eq("product_id", id)
      .order("display_order");

    if (error) {
      console.error(error);
      return;
    }

    setVariants(data);
  }
  async function deleteVariant(variantId) {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this variant?"
  );

  if (!confirmDelete) return;

  const { error } = await supabase
    .from("product_variants")
    .delete()
    .eq("id", variantId);

  if (error) {
    alert(error.message);
    return;
  }

  fetchVariants();
}
  async function fetchAddons() {
  const { data, error } = await supabase
    .from("product_addons")
    .select("*")
    .eq("product_id", id)
    .order("display_order");

  if (error) {
    console.error(error);
    return;
  }

  setAddons(data);
}
async function saveVariant() {
  if (!variantName || !variantPrice) {
    alert("Please enter variant name and price.");
    return;
  }

  const { error } = await supabase
    .from("product_variants")
    .insert({
      product_id: id,
      name: variantName,
      price: Number(variantPrice),
    });

  if (error) {
    alert(error.message);
    return;
  }

  setVariantName("");
  setVariantPrice("");
  setShowModal(false);

  fetchVariants();
}
async function deleteAddon(addonId) {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this add-on?"
  );

  if (!confirmDelete) return;

  const { error } = await supabase
    .from("product_addons")
    .delete()
    .eq("id", addonId);

  if (error) {
    alert(error.message);
    return;
  }

  fetchAddons();
}
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Product Details</h1>
<div className="mb-6">
  <button
    onClick={() => setShowModal(true)}
    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
  >
    + Add Variant
  </button>
</div>
      <h2 className="text-xl font-semibold mb-4">Variants</h2>

      {variants.map((variant) => (
        <div
          key={variant.id}
          className="flex justify-between items-center bg-white p-4 rounded-lg shadow mb-3"
        >
          <div>
            <div className="font-semibold">{variant.name}</div>
            <div>₹{variant.price}</div>
          </div>

          <div className="flex gap-2">
          <button
  onClick={() => {
    setEditingVariant(variant);
    setShowModal(true);
  }}
  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
>
  Edit
</button>

         <button
  onClick={() => deleteVariant(variant.id)}
  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
>
  Delete
</button>
          </div>
        </div>
      ))}
<button
  onClick={() => {
    setEditingAddon(null);
    setShowAddonModal(true);
  }}
  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg mb-4"
>
  + Add Add-on
</button>
      <h2 className="text-xl font-semibold mt-8 mb-4">
  Add-ons
</h2>

{addons.map((addon) => (
  <div
    key={addon.id}
    className="flex justify-between items-center bg-white p-4 rounded-lg shadow mb-3"
  >
    <div>
      <div className="font-semibold">{addon.name}</div>
      <div>₹{addon.price}</div>
    </div>

    <div className="flex gap-2">
    <button
  onClick={() => {
    setEditingAddon(addon);
    setShowAddonModal(true);
  }}
  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
>
  Edit
</button>

     <button
  onClick={() => deleteAddon(addon.id)}
  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
>
  Delete
</button>
    </div>
  </div>
))}
{showModal && (
 <VariantModal
  productId={id}
  variant={editingVariant}
  onClose={() => {
    setShowModal(false);
    setEditingVariant(null);
  }}
  onSuccess={fetchVariants}
/>
)}
{showAddonModal && (
  <AddonModal
    productId={id}
    onClose={() => setShowAddonModal(false)}
    onSuccess={fetchAddons}
  />
)}
{showAddonModal && (
  <AddonModal
    productId={id}
    addon={editingAddon}
    onClose={() => {
      setShowAddonModal(false);
      setEditingAddon(null);
    }}
    onSuccess={fetchAddons}
  />
)}
    </div>
  );
}