// src/components/CartPreview.jsx

import React from 'react';
import { useCart } from '../context/CartContext';

const CartPreview = ({ onClose, onCheckout }) => {
  const { cart, increaseQty, decreaseQty, removeFromCart } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="fixed top-0 right-0 w-80 h-full bg-white shadow-lg p-4 z-50 overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">Количка</h2>
      {cart.length === 0 ? (
        <p>Количката е празна.</p>
      ) : (
        <ul>
          {cart.map((item) => (
            <li key={item.id} className="mb-4">
              <div className="flex justify-between items-center">
                <span>{item.name}</span>
                <div className="flex items-center">
                  <button
                    onClick={() => decreaseQty(item.id)}
                    className="px-2 py-1 bg-gray-200"
                  >
                    –
                  </button>
                  <span className="mx-2">{item.quantity}</span>
                  <button
                    onClick={() => increaseQty(item.id)}
                    className="px-2 py-1 bg-gray-200"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 text-sm ml-2"
                >
                  Премахни
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4">
        <p className="font-semibold">Общо: {total.toFixed(2)} лв</p>
        <button
          onClick={onCheckout}
          className="mt-2 bg-pink-500 text-white px-4 py-2 rounded"
        >
          Поръчай
        </button>
      </div>
      <button onClick={onClose} className="absolute top-2 right-2 text-gray-600">
        ✕
      </button>
    </div>
  );
};

export default CartPreview;
