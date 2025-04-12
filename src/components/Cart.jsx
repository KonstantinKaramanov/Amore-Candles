// src/components/Cart.jsx
import React from "react";

import { useCart } from '../context/CartContext';


const Cart = () => {
  const { cart, removeFromCart } = useCart(); // Access the cart and remove function

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold">Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between items-center border-b py-4">
              <span>{item.name}</span>
              <button
                onClick={() => removeFromCart(item.id)} // Remove item from cart
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="mt-4">
            <span className="font-bold">Total: </span>
            ${cart.reduce((total, item) => total + item.price, 0).toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;



