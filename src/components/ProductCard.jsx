// src/components/ProductCard.jsx
import React from "react";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product, onCheckout }) {
  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart(product);
    // no auto-open checkout
  };

  return (
    <div className="border rounded-2xl shadow p-4 flex flex-col">
      <img
        src={product.images[0]}
        alt={product.name}
        className="w-full h-48 object-cover rounded-xl mb-4"
      />
      <h3 className="text-xl font-semibold">{product.name}</h3>
      <p className="text-gray-600 flex-1">{product.description}</p>
      <p className="font-bold mt-2">
        {new Intl.NumberFormat("bg-BG", {
          style: "currency",
          currency: "BGN",
        }).format(product.price)}
      </p>
      <button
        onClick={handleAdd}
        className="mt-4 bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
      >
        Добави в количката
      </button>
    </div>
  );
}
