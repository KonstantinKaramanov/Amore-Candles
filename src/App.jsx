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
<div className="relative min-h-screen overflow-hidden">
  <video
    className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none"
    autoPlay
    loop
    muted
    playsInline // ✅ Prevent iOS fullscreen takeover
  >
    <source src={herovid} type="video/mp4" />
    Your browser does not support the video tag.
  </video>

  <div className="relative z-10 flex flex-col items-center justify-center h-screen text-white text-center px-4">
  <h1 className="text-4xl font-bold mb-4 drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)]">
    Добре дошли в Amore Candles
  </h1>
  <p className="text-lg mb-8 drop-shadow-[1px_1px_3px_rgba(0,0,0,0.7)]">
    Намерете перфектния аромат за всеки повод
  </p>
  <button className="bg-pink-500 bg-opacity-60 py-2 px-6 text-lg font-semibold hover:bg-opacity-80 transition duration-300">
    <a href="#products">Купете сега</a>
  </button>
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

