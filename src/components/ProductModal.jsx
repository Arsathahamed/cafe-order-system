import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

export default function ProductModal({
    product,
    onClose,
    onSuccess
}) {
  const [categories, setCategories] = useState([]);
const [image, setImage] = useState(null);
 const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    category_id: product?.category_id || "",
});
const [preview, setPreview] = useState(
    product?.image_url || ""
);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("name");

    setCategories(data || []);
  }

  async function saveProduct() {
  let imageUrl = product?.image_url || "";

  // Upload image if selected
  if (image) {
   const fileExt = image.name.split(".").pop();

const fileName = `${crypto.randomUUID()}.${fileExt}`;

   const { data: uploadData, error: uploadError } = await supabase.storage
  .from("product-images")
  .upload(fileName, image);

console.log("Upload Data:", uploadData);
console.log("Upload Error:", uploadError);
console.log("Upload Error Full:", JSON.stringify(uploadError, null, 2));

if (uploadError) {
  alert(uploadError.message);
  return;
}

    if (uploadError) {
      alert(uploadError.message);
      return;
    }

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);

    imageUrl = data.publicUrl;
  }

 let error;

if (product) {
  ({ error } = await supabase
    .from("products")
    .update({
      ...formData,
      price: Number(formData.price),
      image_url: imageUrl,
    })
    .eq("id", product.id));
} else {
  ({ error } = await supabase
    .from("products")
    .insert([
      {
        ...formData,
        price: Number(formData.price),
        image_url: imageUrl,
      },
    ]));
}

  if (error) {
    alert(error.message);
    return;
  }

  alert("Product Added Successfully");

  onSuccess();
  onClose();
}

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg">

      <h2 className="text-2xl font-bold mb-6">
  {product ? "Edit Product" : "Add Product"}
</h2>

        <input
          placeholder="Product Name"
          className="w-full border rounded-lg p-3 mb-3"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
        />

        <textarea
          placeholder="Description"
          className="w-full border rounded-lg p-3 mb-3"
          value={formData.description}
          onChange={(e) =>
            setFormData({
              ...formData,
              description: e.target.value,
            })
          }
        />

        <input
          type="number"
          placeholder="Price"
          className="w-full border rounded-lg p-3 mb-3"
          value={formData.price}
          onChange={(e) =>
            setFormData({
              ...formData,
              price: e.target.value,
            })
          }
        />

        <select
          className="w-full border rounded-lg p-3 mb-5"
          value={formData.category_id}
          onChange={(e) =>
            setFormData({
              ...formData,
              category_id: e.target.value,
            })
          }
        >
          <option value="">Select Category</option>

          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
<input
  type="file"
  accept="image/*"
  className="w-full border rounded-lg p-3 mb-5"
  onChange={(e) => setImage(e.target.files[0])}
/>
        <div className="flex justify-end gap-3">

          <button
            onClick={onClose}
            className="px-5 py-2 border rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={saveProduct}
            className="bg-yellow-500 text-white px-5 py-2 rounded-lg"
          >
            {product ? "Update Product" : "Save Product"}
          </button>

        </div>

      </div>
    </div>
  );
}