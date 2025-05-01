// src/components/CartPreview.jsx
import React from "react";
import { useCart } from "../context/CartContext";

export default function CartPreview({ onClose, onCheckout }) {
  const { cart, removeFromCart } = useCart();
  const total = cart.reduce(
    (sum, x) => sum + x.price * x.quantity,
    0
  );

  return (
    <div className="fixed top-16 right-4 bg-white shadow-lg rounded-lg w-80 z-50 border border-pink-200 p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-lg">Твоята количка</h3>
        <button onClick={onClose} className="text-sm text-pink-500">
          Затвори
        </button>
      </div>
      {cart.length === 0 ? (
        <p className="text-sm text-gray-500">Количката е празна.</p>
      ) : (
        <>
          <ul className="space-y-2 max-h-48 overflow-auto">
            {cart.map((item) => (
              <li
                key={item.id}
                className="flex justify-between items-center"
              >
                <span>
                  {item.name} × {item.quantity}
                </span>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-xs text-red-500"
                >
                  Премахни
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4 font-semibold">
            Общо:{" "}
            {new Intl.NumberFormat("bg-BG", {
              style: "currency",
              currency: "BGN",
            }).format(total)}
          </div>
          <button
            onClick={onCheckout}
            className="mt-4 w-full bg-pink-500 text-white py-2 rounded"
          >
            Приключи поръчката
          </button>
        </>
      )}
    </div>
  );
}
