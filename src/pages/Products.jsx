// src/pages/Products.jsx
import React, { useEffect, useState } from "react";
import { fetchProducts } from "../utils/contentful";
import ProductCard from "../components/ProductCard";
import Header from "../components/Header";
import CartPreview from "../components/CartPreview";
import { useCart } from "../context/CartContext";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  useCart();

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header onCartClick={() => setIsCartOpen((prev) => !prev)} />

      {/* 🧼 Banner / Hero */}
      <section className="bg-pink-100 py-16 text-center">
        <h1 className="text-4xl font-bold mb-2 text-pink-800">Нашите свещи</h1>
        <p className="text-lg text-gray-600">
          Изберете от нашата колекция ръчно направени ароматни свещи
        </p>
      </section>

      {/* 🕯 Product grid */}
      <main className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </main>

      {/* 🛒 Cart Preview */}
      {isCartOpen && <CartPreview onClose={() => setIsCartOpen(false)} />}
    </div>
  );
}

