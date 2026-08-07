import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import ProductModal from "../../components/ProductModal";
 import { Link } from "react-router-dom";

export default function Products() {
  const [products, setProducts] = useState([]);
const [showModal, setShowModal] = useState(false);
const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        categories(name)
      `)
      .order("display_order", { ascending: true });

    if (error) {
      console.error(error);
      return;
    }

    setProducts(data);
  }
async function deleteProduct(product) {
  const confirmDelete = window.confirm(
    `Are you sure you want to delete "${product.name}"?`
  );

  if (!confirmDelete) return;

  // Delete image from Storage
  if (product.image_url) {
    const path = product.image_url.split("/product-images/")[1];

    if (path) {
      const { error: storageError } = await supabase.storage
        .from("product-images")
        .remove([path]);

      if (storageError) {
        console.error(storageError);
      }
    }
  }

  // Delete product from database
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", product.id);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Product deleted successfully.");

  fetchProducts();
}
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>

      <button
  onClick={() => setShowModal(true)}
  className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
>
  + Add Product
</button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow p-5"
          >
            <img
              src={
                product.image_url ||
                "https://placehold.co/400x250?text=No+Image"
              }
              className="rounded-lg h-48 w-full object-cover"
              alt={product.name}
            />

            <h2 className="font-bold text-xl mt-4">
              {product.name}
            </h2>

            <p className="text-gray-500">
              {product.description}
            </p>

            <div className="mt-3 font-bold text-lg">
              ₹{product.price}
            </div>

            <div className="mt-2 text-sm text-gray-600">
              Category: {product.categories?.name}
            </div>

            <div className="mt-4 flex gap-2">

  <Link
    to={`/admin/products/${product.id}`}
    className="bg-blue-500 text-white px-3 py-2 rounded"
  >
    Manage
  </Link>

  <button
    onClick={() => {
      setEditingProduct(product);
      setShowModal(true);
    }}
    className="bg-green-600 text-white px-3 py-2 rounded"
  >
    Edit
  </button>

  <button
    onClick={() => deleteProduct(product)}
    className="bg-red-500 text-white px-3 py-2 rounded"
  >
    Delete
  </button>

</div>
          </div>
        ))}
      </div>
      {
  showModal && (
  <ProductModal
  product={editingProduct}
  onClose={() => {
    setShowModal(false);
    setEditingProduct(null);
  }}
  onSuccess={fetchProducts}
/>
  )
}
    </div>
  );
}
