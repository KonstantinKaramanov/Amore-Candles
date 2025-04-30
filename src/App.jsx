import React, { useState, useEffect } from "react";
import ProductList from "./components/ProductList";
import { CartProvider } from "./context/CartContext";
import CartPreview from "./components/CartPreview";
import Header from "./components/Header";
import CheckoutModal from "./components/CheckoutModal"; // ✅ import modal
import { useCart } from "./context/CartContext";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import herovid from "./assets/herovid.mp4";

// ✅ Load Stripe public key
const stripePromise = loadStripe("pk_test_YOUR_PUBLIC_KEY"); // 🔁 replace with your Stripe public key

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false); // ✅ state for modal
  const { cart } = useCart(); // ✅ get cart

  const handleCartClick = () => {
    setIsCartOpen((prev) => !prev);
  };

  useEffect(() => {
    const videoElement = document.getElementById("hero-video");
    const preventContextMenu = (event) => event.preventDefault();
    const preventTouchStart = (event) => event.preventDefault();

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
    <CartProvider>
      <Elements stripe={stripePromise}>
        <div className="min-h-screen bg-white text-gray-800 font-sans">
          <Header onCartClick={handleCartClick} />

          {/* 🎥 Hero section */}
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
              Your browser does not support the video tag.
            </video>

            <div className="relative z-10 flex flex-col items-center justify-center h-screen text-white text-center px-4">
              <h1 className="text-4xl font-bold mb-4 shimmer-text">Добре дошли в Amore Candles</h1>
              <p className="text-lg mb-8 drop-shadow-[1px_1px_3px_rgba(0,0,0,0.7)]">
                Намерете перфектния аромат за всеки повод
              </p>
              <button className="bg-pink-500 bg-opacity-60 py-2 px-6 text-lg font-semibold hover:bg-opacity-80 transition duration-300">
                <a href="#products">Купете сега</a>
              </button>
            </div>
          </div>

          {/* 🕯 Products */}
          <main className="pt-32 p-6" id="products">
            <h1 className="text-3xl font-semibold mb-4 text-center">Нашите свещи</h1>
            <ProductList />
          </main>

          {/* 🛒 Cart */}
          {isCartOpen && <CartPreview />}

          {/* ✅ Checkout Button (visible always or when cart open) */}
          <div className="text-center mt-6">
            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="bg-green-600 text-white py-2 px-4 rounded"
            >
              Приключи поръчката
            </button>
          </div>

          {/* ✅ Modal */}
          {isCheckoutOpen && (
            <CheckoutModal cart={cart} onClose={() => setIsCheckoutOpen(false)} />
          )}

          {/* 📦 Footer */}
          <footer className="bg-pink-100 p-4 text-center text-sm mt-10">
            &copy; 2025 Amore Candles Boutique. All rights reserved.
          </footer>
        </div>
      </Elements>
    </CartProvider>
  );
}

export default App;

