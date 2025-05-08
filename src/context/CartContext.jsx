// src/context/CartContext.jsx
import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();
export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  function addToCart(product) {
    setCart((c) => {
      const found = c.find((x) => x.id === product.id);
      if (found) {
        return c.map((x) =>
          x.id === product.id ? { ...x, quantity: x.quantity + 1 } : x
        );
      }
      return [...c, { ...product, quantity: 1 }];
    });
  }
  function removeFromCart(id) {
    setCart((c) => c.filter((x) => x.id !== id));
  }
  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}
// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);
