import React, { useState, useEffect } from "react";
import ProductList from "./components/ProductList";
import { CartProvider } from "./context/CartContext";
import CartPreview from "./components/CartPreview"; 
import Header from "./components/Header"; 
import herovid from "./assets/herovid.mp4"; 

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleCartClick = () => {
    setIsCartOpen((prev) => !prev);
  };

  useEffect(() => {
    // Prevent right-click on the video element
    const videoElement = document.getElementById("hero-video");
    const preventContextMenu = (event) => event.preventDefault();
    const preventTouchStart = (event) => event.preventDefault();

    if (videoElement) {
      videoElement.addEventListener("contextmenu", preventContextMenu);  // Disable right-click
      videoElement.addEventListener("touchstart", preventTouchStart);    // Disable long-press

      // Cleanup the event listeners when the component is unmounted
      return () => {
        videoElement.removeEventListener("contextmenu", preventContextMenu);
        videoElement.removeEventListener("touchstart", preventTouchStart);
      };
    }
  }, []);

  return (
    <CartProvider>
      <div className="min-h-screen bg-white text-gray-800 font-sans">
        {/* ✅ Header with logo + cart icon */}
        <Header onCartClick={handleCartClick} />

        {/* 🎥 Hero section with video background */}
        <div className="relative h-screen overflow-hidden">
          <video
            id="hero-video"
            className="absolute top-0 left-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
          >
            <source src={herovid} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <div className="absolute top-1/3 left-0 w-full text-center text-white z-20">
            <h1 className="text-4xl font-bold mb-4">Добре дошли в Amore Candles</h1>
            <p className="text-lg mb-8">
                Намерете перфектния аромат за всеки повод
            </p>
            <button className="bg-pink-500 bg-opacity-60 py-2 px-6 full text-lg font-semibold hover:bg-opacity-80 transition duration-300">
              Купете сега
            </button>
          </div>
        </div>

        {/* 🕯 Product list */}
        <main className="pt-32 p-6">
          <h1 className="text-3xl font-semibold mb-4 text-center">
            Нашите свещи
          </h1>
          <ProductList />
        </main>

        {/* ✅ Slide-in cart preview when icon clicked */}
        {isCartOpen && <CartPreview />}

        {/* 📦 Footer */}
        <footer className="bg-pink-100 p-4 text-center text-sm mt-10">
          &copy; 2025 Amore Candles Boutique. All rights reserved.
        </footer>
      </div>
    </CartProvider>
  );
}

export default App;

