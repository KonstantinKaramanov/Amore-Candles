import React from 'react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p>{product.price} лв.</p>
      <button onClick={() => addToCart(product)}>
        Добави в количката
      </button>
    </div>
  );
};

export default ProductCard;
