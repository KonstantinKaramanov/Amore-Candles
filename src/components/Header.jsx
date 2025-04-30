import React from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from "../assets/logo.png";

const Header = ({ onCartClick }) => {
  const { cart } = useCart();

  return (
    <header className="flex items-center justify-between bg-pink-100 px-6 py-4 shadow-md sticky top-0 z-50 opacity-80">
      {/* ✅ Logo (clickable to home) */}
      <Link to="/" className="flex items-center">
        <img src={logo} alt="Amore Candles Logo" className="h-12" />
        <h1 className="text-2xl font-bold text-pink-800 ml-2"></h1>
      </Link>

      {/* ✅ Cart Icon */}
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



