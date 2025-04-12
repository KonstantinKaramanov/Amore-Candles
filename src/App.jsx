import React, { useState } from "react";
import ProductList from "./components/ProductList";
import { CartProvider } from "./context/CartContext";
import Cart from "./components/Cart";
import Header from "./components/Header"; // ✅ New
import CartPreview from "./components/CartPreview"; // ✅ New
import herovid from "./assets/herovid.mp4";
// import logo from "./assets/logo.png"; // ✅ New


function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleCartClick = () => {
    setIsCartOpen((prev) => !prev);
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-white text-gray-800 font-sans">
        {/* ✅ Header with logo + cart icon */}
        <Header onCartClick={handleCartClick} />
        {/* <img src={logo} alt="Amore Candles Logo" className="h-10" /> */}
        {/* <header className="bg-pink-100 p-4 flex justify-center items-center shadow fixed top-0 left-0 right-0 z-30 opacity-80"> */}

        {/* 🛒 Full cart section (maybe used later in checkout) */}


        {/* 🎥 Hero section with video background */}
        <div className="relative h-screen overflow-hidden">
          <video
            className="absolute top-0 left-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
          >
            <source src={herovid} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <div className="absolute top-1/3 left-0 w-full text-center text-white z-20">
            <h1 className="text-4xl font-bold mb-4">Welcome to Amore Candles</h1>
            <p className="text-lg mb-8">
              Find the perfect fragrance for every occasion
            </p>
            <button className="bg-pink-500 bg-opacity-60 py-2 px-6 full text-lg font-semibold hover:bg-opacity-80 transition duration-300">
              Shop Now
            </button>
          </div>
        </div>

        {/* 🕯 Product list */}
        <main className="pt-32 p-6">
          <h1 className="text-3xl font-semibold mb-4 text-center">
            Our Candles
          </h1>
          <ProductList />
        </main>

        {/* 🛒 Full cart section (maybe used later in checkout) */}
        <Cart />

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



// {/* Header */}
// <header className="bg-pink-100 p-4 flex justify-center items-center shadow fixed top-0 left-0 right-0 z-30 opacity-80">
// <img src={logo} alt="Amore Candles Logo" className="h-10" />
// </header>