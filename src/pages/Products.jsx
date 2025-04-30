// pages/Products.jsx
import React, { useEffect, useState } from "react";
import { fetchProducts } from "../utils/contentful";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";

export default function Products({ onCheckout }) {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const load = async () => {
      const data = await fetchProducts();
      setProducts(data);
    };
    load();
  }, []);

  return (
    <main className="pt-24 p-6">
      <h1 className="text-3xl font-semibold text-center mb-6">Нашите свещи</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={() => addToCart(product)}
            onCheckout={onCheckout}
          />
        ))}
      </div>
    </main>
  );
}


