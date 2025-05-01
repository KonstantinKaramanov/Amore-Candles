import React, { useEffect, useState } from "react";
import { fetchFeaturedProducts } from "../contentful";
import ProductCard from "./ProductCard";

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchFeaturedProducts().then(setProducts);
  }, []);

  if (!products.length) return null;

  return (
    <section className="pt-20 pb-10 px-6">
      <h2 className="text-3xl font-semibold text-center mb-6">Популярни продукти</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
