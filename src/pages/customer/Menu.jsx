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

      {/* Header */}
      <div className="bg-[#061B33] text-white p-5 shadow">
        <h1 className="text-3xl font-bold text-yellow-400">
          OVER
        </h1>

        <p className="text-sm text-gray-300">
          Bites & Drinks
        </p>
      </div>

      <div className="p-3 md:p-5">

        {categories.map((category) => {

          const categoryProducts = products.filter(
            (product) => product.category_id === category.id
          );

          if (categoryProducts.length === 0) {
            return null;
          }

          return (
            <div
              key={category.id}
              className="mb-8"
            >

              <h2 className="text-xl md:text-2xl font-bold mb-4">
                {category.name}
              </h2>

              <div className="bg-white rounded-xl p-3 md:p-5 shadow">

                <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-3">

                  {categoryProducts.map((product) => (

                    <div
                      key={product.id}
                      className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
                    >

                      <img
                        src={
                          product.image_url ||
                          "https://placehold.co/300x220?text=No+Image"
                        }
                        alt={product.name}
                        className="w-full h-32 sm:h-40 md:h-44 object-cover"
                      />

                      <div className="p-3 md:p-4">

                        <h3 className="text-sm sm:text-base md:text-lg font-bold line-clamp-2 min-h-[40px]">
                          {product.name}
                        </h3>

                        <p className="text-gray-500 text-xs sm:text-sm mt-1 line-clamp-2">
                          {product.description}
                        </p>

                        <div className="mt-2 font-bold text-yellow-600 text-sm sm:text-base">
                          ₹{product.price}
                        </div>

                        <Link
                          to={`/menu/${product.id}`}
                          className="block text-center mt-3 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg font-semibold text-sm"
                        >
                          Add
                        </Link>

                      </div>

                    </div>

                  ))}

                </div>

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}