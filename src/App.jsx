// src/App.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation, Link, BrowserRouter } from "react-router-dom";
import { CartProvider, useCart } from "./context/CartContext";
import Header from "./components/Header";
import CartPreview from "./components/CartPreview";
import CheckoutModal from "./components/CheckoutModal";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51RJbz2CSPMytO5Yuu1lkVE4s7VHWDwFQtronKZEgs3HJy27jjItiPRounFZ9ueq0t3iaDTyObZtVhkBt4zo2JYBr00ppOih5yG"
);

function Layout() {
  const { cart } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const location = useLocation();

  const openCheckout = () => {
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  return (
    <>
      <Header onCartClick={() => setCartOpen(!cartOpen)} />
      <Routes>
        <Route path="/" element={<HomePage onCheckout={openCheckout} />} />
        <Route path="/products" element={<ProductsPage onCheckout={openCheckout} />} />
      </Routes>

      {cartOpen && (
        <CartPreview
          onClose={() => setCartOpen(false)}
          onCheckout={openCheckout}
        />
      )}

      {checkoutOpen && (
        <CheckoutModal cart={cart} onClose={() => setCheckoutOpen(false)} />
      )}

      {location.pathname === "/" && (
        <footer className="bg-pink-100 p-4 text-center text-sm mt-10">
          &copy; 2025 Amore Candles Boutique. All rights reserved.
        </footer>
      )}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Elements stripe={stripePromise}>
          <Layout />
        </Elements>
      </CartProvider>
    </BrowserRouter>
  );
}
