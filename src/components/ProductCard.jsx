// src/components/ProductCard.jsx
import React from "react";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart(product);
  };

  return (
    <div className="border rounded-2xl shadow p-4 flex flex-col h-full bg-white">
      {/* Responsive Image Container */}
      <div className="w-full aspect-square sm:aspect-[4/3] max-h-72 sm:max-h-60 bg-white rounded-xl mb-4 overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-contain p-2"
        />
      </div>

      {/* Product Info */}
      <h3 className="text-xl font-semibold">{product.name}</h3>
      <p className="text-gray-600 text-sm flex-1 whitespace-pre-line">
        {product.description}
      </p>

      {/* Price */}
      <p className="font-bold mt-2">
        {new Intl.NumberFormat("bg-BG", {
          style: "currency",
          currency: "BGN",
        }).format(product.price)}
      </p>

      {/* Add to Cart */}
      <button
        onClick={handleAdd}
        className="mt-4 bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition-colors"
      >
        Добави в количката
      </button>
    </div>
  );
}
