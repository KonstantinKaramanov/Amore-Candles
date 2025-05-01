// src/components/ProductList.jsx
import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { fetchProducts } from "../../contentful";

export default function ProductList({ featuredOnly = false, onCheckout }) {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    (async () => {
      const all = await fetchProducts();
      setProducts(all);
    })();
  }, []);

  const display = featuredOnly
    ? products.filter((p) => p.featured)
    : products;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {display.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onCheckout={onCheckout}
        />
      ))}
    </div>
  );
}
