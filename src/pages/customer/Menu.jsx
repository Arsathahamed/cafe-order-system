import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import { Link } from "react-router-dom";
export default function Menu() {
  const [categories, setCategories] = useState([]);
const [products, setProducts] = useState([]);
  useEffect(() => {
  fetchCategories();
  fetchProducts();
}, []);

 async function fetchCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*");

  if (error) {
    console.error(error);
    return;
  }

  setCategories(data || []);
}
async function fetchProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_available", true);

  if (error) {
    console.error(error);
    return;
  }

  setProducts(data || []);
}

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="bg-[#061B33] text-white p-5 shadow">
        <h1 className="text-3xl font-bold text-yellow-400">
          OVER
        </h1>
        <p className="text-sm text-gray-300">
          Fresh • Hot • Delicious
        </p>
      </div>

      <div className="p-5">

        {categories.map((category) => (
          <div key={category.id} className="mb-8">

            <h2 className="text-2xl font-bold mb-4">
              {category.name}
            </h2>

            <div className="bg-white rounded-xl p-5 shadow">
<div className="grid md:grid-cols-2 gap-4">
  {products
    .filter((product) => product.category_id === category.id)
    .map((product) => (
      <div
        key={product.id}
        className="bg-white rounded-xl shadow p-4 flex gap-4"
      >
        <img
          src={
            product.image_url ||
            "https://placehold.co/120x120?text=No+Image"
          }
          alt={product.name}
          className="w-28 h-28 object-cover rounded-lg"
        />

        <div className="flex-1">
          <h3 className="text-xl font-bold">
            {product.name}
          </h3>

          <p className="text-gray-500 text-sm">
            {product.description}
          </p>

          <div className="mt-2 font-bold text-yellow-600">
            ₹{product.price}
          </div>

        <Link
  to={`/menu/${product.id}`}
  className="inline-block mt-3 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
>
  Add
</Link>
        </div>
      </div>
    ))}
</div>
            </div>

          </div>
        ))}

      </div>

    </div>
  );
}