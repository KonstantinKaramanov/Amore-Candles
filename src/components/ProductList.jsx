import React from "react";
import { useCart } from "../context/CartContext";
import products from "../data/products";

const ProductList = () => {
  const { addToCart } = useCart();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.id} className="border rounded-2xl shadow p-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover rounded-xl"
          />
          <h2 className="text-xl font-semibold mt-2">{product.name}</h2>
          <p className="text-gray-600">{product.description}</p>
          <p className="font-bold mt-2">${product.price}</p>
          <button
            className="mt-2 bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
            onClick={() => addToCart(product)}
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProductList;

