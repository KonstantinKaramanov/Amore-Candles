// src/components/ProductCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="border rounded-2xl shadow p-4 bg-white">
      <Link to={`/product/${product.id}`}>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {product.images.slice(0, 2).map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`${product.name} ${i + 1}`}
              className="w-full h-40 object-cover rounded"
            />
          ))}
        </div>
        <h2 className="text-xl font-semibold mt-2 hover:underline">{product.name}</h2>
      </Link>

      <p className="text-gray-600 mb-2">{product.description}</p>
      <p className="font-bold text-pink-600">{product.price.toFixed(2)} лв.</p>

      <button
        onClick={() => addToCart(product)}
        className="mt-2 bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 w-full"
      >
        Добави в количката
      </button>
    </div>
  );
};

export default ProductCard;

