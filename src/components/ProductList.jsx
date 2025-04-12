import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { fetchProducts } from "../contentful"; // Import the fetchProducts function

const ProductList = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      const fetchedProducts = await fetchProducts();
      setProducts(fetchedProducts);
    };

    getProducts();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.sys.id} className="border rounded-2xl shadow p-4">
          <img
            src={product.fields.image.fields.file.url}
            alt={product.fields.name}
            className="w-full h-48 object-cover rounded-xl"
          />
          <h2 className="text-xl font-semibold mt-2">{product.fields.name}</h2>
          <p className="text-gray-600">{product.fields.description}</p>
          <p className="font-bold mt-2">${product.fields.price}</p>
          <button
            className="mt-2 bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
            onClick={() => addToCart(product)}
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProductList;

