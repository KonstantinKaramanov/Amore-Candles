// src/pages/Products.jsx

import React from 'react';
import ProductList from '../components/ProductList';

const Products = () => {
  return (
    <main className="pt-24 p-6">
      <h1 className="text-3xl font-semibold text-center mb-6">Нашите свещи</h1>
      <ProductList showFullDescription={true} />
    </main>
  );
};

export default Products;
