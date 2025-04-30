import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { fetchProducts } from "../contentful";

const ProductList = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);

  const formatBGN = (price) =>
    new Intl.NumberFormat("bg-BG", {
      style: "currency",
      currency: "BGN",
    }).format(price);

  useEffect(() => {
    const getProducts = async () => {
      const fetchedProducts = await fetchProducts();
      setProducts(fetchedProducts);
    };

    getProducts();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.id} className="border rounded-2xl shadow p-4 bg-white">
          <div className="grid grid-cols-2 gap-2 mb-3">
            {product.images?.slice(0, 2).map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`${product.name} ${i + 1}`}
                className="w-full h-40 object-cover rounded"
              />
            ))}
          </div>
          <h2 className="text-xl font-semibold mt-2">{product.name}</h2>
          <p className="text-gray-600 mb-2">{product.description}</p>
          <p className="font-bold text-pink-600">{formatBGN(product.price)}</p>
          <button
            className="mt-2 bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 w-full"
            onClick={() => addToCart(product)}
          >
            Добави в количката
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
