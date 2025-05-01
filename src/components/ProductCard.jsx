// src/components/ProductCard.jsx
import React from 'react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product, showFullDescription, onCheckout }) => {
  const { addToCart } = useCart();

  const truncatedDescription = product.description?.length > 60
    ? product.description.slice(0, 60) + '...'
    : product.description;

  return (
    <div className="border rounded-xl shadow p-4">
      <img
        src={product.images?.[0]}
        alt={product.name}
        className="w-full h-48 object-cover rounded-xl"
      />
      <h2 className="text-xl font-semibold mt-2">{product.name}</h2>
      <p className="text-gray-600">
        {showFullDescription ? product.description : truncatedDescription}
      </p>

      {showFullDescription && product.aromas?.length > 0 && (
        <select className="mt-2 border rounded px-2 py-1 w-full">
          {product.aromas.map((aroma, idx) => (
            <option key={idx} value={aroma}>{aroma}</option>
          ))}
        </select>
      )}

      <p className="font-bold mt-2 text-pink-600">{product.price.toFixed(2)} лв.</p>
      <button
        className="mt-2 w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600"
        onClick={() => {
          addToCart(product);
          if (onCheckout) onCheckout();
        }}
      >
        Добави в количката
      </button>
    </div>
  );
};

export default ProductCard;
