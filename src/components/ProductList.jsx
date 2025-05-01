// src/components/ProductList.jsx
import React, { useEffect, useState } from "react";
import { fetchProducts } from "../utils/contentful";
import ProductCard from "./ProductCard";

const ProductList = ({ onCheckout, showFullDescription }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await fetchProducts();
      setProducts(data);
    };
    load();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          showFullDescription={showFullDescription}
          onCheckout={onCheckout}
        />
      ))}
    </div>
  );
};

export default ProductList;
