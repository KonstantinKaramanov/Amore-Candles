// App.jsx
import { Routes, Route, useLocation, Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { CartProvider, useCart } from "./context/CartContext";
import CartPreview from "./components/CartPreview";
import Header from "./components/Header";
import CheckoutModal from "./components/CheckoutModal";
import Products from "./pages/Products";
import ProductList from "./components/ProductList";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import herovid from "./assets/herovid.mp4";

const stripePromise = loadStripe("pk_test_51RJbz2CSPMytO5Yuu1lkVE4s7VHWDwFQtronKZEgs3HJy27jjItiPRounFZ9ueq0t3iaDTyObZtVhkBt4zo2JYBr00ppOih5yG");

function HomePage({ onCheckout }) {
  useEffect(() => {
    const videoElement = document.getElementById("hero-video");
    const preventContextMenu = (e) => e.preventDefault();
    const preventTouchStart = (e) => e.preventDefault();

    if (videoElement) {
      videoElement.addEventListener("contextmenu", preventContextMenu);
      videoElement.addEventListener("touchstart", preventTouchStart);

      return () => {
        videoElement.removeEventListener("contextmenu", preventContextMenu);
        videoElement.removeEventListener("touchstart", preventTouchStart);
      };
    }
  }, []);

  return (
    <>
      <div className="relative min-h-screen overflow-hidden">
        <video
          id="hero-video"
          className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={herovid} type="video/mp4" />
        </video>

        <div className="relative z-10 flex flex-col items-center justify-center h-screen text-white text-center px-4">
          <h1 className="text-4xl font-bold mb-4 shimmer-text">Добре дошли в Amore Candles</h1>
          <p className="text-lg mb-8 drop-shadow-[1px_1px_3px_rgba(0,0,0,0.7)]">
            Намерете перфектния аромат за всеки повод
          </p>
          <Link to="/products">
            <button className="bg-pink-500 bg-opacity-60 py-2 px-6 text-lg font-semibold hover:bg-opacity-80 transition duration-300">
              Купи сега
            </button>
          </Link>
        </div>
      </div>

      <main className="pt-32 p-6" id="products">
        <h1 className="text-3xl font-semibold mb-4 text-center">Нашите свещи</h1>
        <ProductList onCheckout={onCheckout} />
      </main>
    </>
  );
}

function Layout() {
  const { cart } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const location = useLocation();

  const openCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <>
      <Header onCartClick={() => setIsCartOpen(!isCartOpen)} />

      <Routes>
        <Route path="/" element={<HomePage onCheckout={openCheckout} />} />
        <Route path="/products" element={<Products onCheckout={openCheckout} />} />
      </Routes>

      {isCartOpen && (
        <CartPreview
          onClose={() => setIsCartOpen(false)}
          onCheckout={openCheckout}
        />
      )}

      {isCheckoutOpen && (
        <CheckoutModal cart={cart} onClose={() => setIsCheckoutOpen(false)} />
      )}

      {location.pathname === "/" && (
        <footer className="bg-pink-100 p-4 text-center text-sm mt-10">
          &copy; 2025 Amore Candles Boutique. All rights reserved.
        </footer>
      )}
    </>
  );
}

function App() {
  return (
    <CartProvider>
      <Elements stripe={stripePromise}>
        <Layout />
      </Elements>
    </CartProvider>
  );
}

export default App;
