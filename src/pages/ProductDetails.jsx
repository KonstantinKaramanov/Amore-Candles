import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProductById } from "../utils/contentful";
import { useCart } from "../context/CartContext";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      const data = await fetchProductById(id);
      setProduct(data);
    };
    loadProduct();
  }, [id]);

  if (!product) return <div className="p-8">Зареждане...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {product.images.map((img, i) => (
          <img key={i} src={img} alt={product.name} className="rounded-lg w-full" />
        ))}
      </div>
      <p className="text-lg text-gray-700 mb-4">{product.description}</p>
      <p className="text-xl text-pink-600 font-semibold mb-6">
        {product.price.toFixed(2)} лв.
      </p>
      <button
        className="bg-pink-500 text-white px-6 py-2 rounded hover:bg-pink-600"
        onClick={() => addToCart(product)}
      >
        Добави в количката
      </button>
    </div>
  );
};

export default ProductDetail;
