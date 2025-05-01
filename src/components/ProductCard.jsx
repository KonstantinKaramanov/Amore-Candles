// src/components/ProductCard.jsx

import React from 'react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product, showFullDescription = false }) => {
  const { addToCart } = useCart();

  const truncatedDescription =
    product.description.length > 60
      ? product.description.slice(0, 60) + '...'
      : product.description;

  return (
    <div className="border p-4 rounded shadow">
      <img
        src={product.images[0]}
        alt={product.name}
        className="w-full h-48 object-cover mb-2"
      />
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="text-gray-600">
        {showFullDescription ? product.description : truncatedDescription}
      </p>
      {showFullDescription && product.aromas && product.aromas.length > 0 && (
        <select className="mt-2 border rounded px-2 py-1">
          {product.aromas.map((aroma, index) => (
            <option key={index} value={aroma}>
              {aroma}
            </option>
          ))}
        </select>
      )}
      <div className="mt-2 flex justify-between items-center">
        <span className="text-pink-600 font-bold">{product.price} лв</span>
        <button
          onClick={() => addToCart(product)}
          className="bg-pink-500 text-white px-4 py-1 rounded"
        >
          Добави в количката
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
