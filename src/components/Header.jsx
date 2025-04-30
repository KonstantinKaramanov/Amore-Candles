// src/components/Header.jsx
import React from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingCart } from 'lucide-react';
import logo from "../assets/logo.png"; // Import your logo here

const Header = ({ onCartClick }) => {
  const { cart } = useCart(); // Access cart from context

  return (
    <header className="flex items-center justify-between bg-pink-100 px-7 py-4 shadow-md sticky top-0 z-50 opacity-85">
      {/* Logo Section */}
      <div className="flex items-center">
        <img src={logo} alt="Amore Candles Logo" className="h-11" />
        <h1 className="text-2xl font-bold text-pink-800 ml-2">{/* Removed opacity from here for now */}</h1>
      </div>

      {/* Cart Icon Section */}
      <button className="relative" onClick={onCartClick}>
        <ShoppingCart className="w-6 h-6 text-pink-800" />
        {cart.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full">
            {cart.length}
          </span>
        )}
      </button>
    </header>
  );
};

export default Header;


