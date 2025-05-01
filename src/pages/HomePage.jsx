// src/pages/HomePage.jsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import ProductList from "../components/ProductList";
import herovid from "../assets/herovid.mp4";

export default function HomePage({ onCheckout }) {
  useEffect(() => {
    const video = document.getElementById("hero-video");
    if (!video) return;
    const prevent = e => e.preventDefault();
    video.addEventListener("contextmenu", prevent);
    video.addEventListener("touchstart", prevent);
    return () => {
      video.removeEventListener("contextmenu", prevent);
      video.removeEventListener("touchstart", prevent);
    };
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
          <h1 className="text-4xl font-bold mb-4 shimmer-text">
            Добре дошли в Amore Candles
          </h1>
          <p className="text-lg mb-8 drop-shadow-[1px_1px_3px_rgba(0,0,0,0.7)]">
            Намерете перфектния аромат за всеки повод
          </p>
          <Link to="/products">
            <button className="relative overflow-hidden px-6 py-2 text-lg font-semibold text-white bg-pink-500 rounded-lg shadow-lg hover:bg-pink-600 transition duration-300">
  <span className="relative z-10">Купи сега ✨</span>
  <span className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/40 to-white/20 opacity-0 hover:opacity-100 animate-shimmer" />
</button>
          </Link>
        </div>
      </div>

      <main className="pt-32 p-6">
        <h2 className="text-3xl font-semibold mb-4 text-center">Нашите свещи</h2>
        <ProductList featuredOnly onCheckout={onCheckout} />
        <div className="text-center mt-8">
          <Link
            to="/products"
            className="inline-block bg-pink-500 text-white px-6 py-2 rounded hover:bg-pink-600 transition duration-300"
          >
            Виж всички продукти
          </Link>
        </div>
      </main>
    </>
  );
}
