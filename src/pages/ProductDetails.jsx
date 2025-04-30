import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchProducts } from "../contentful";
import { useCart } from "../context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      const products = await fetchProducts();
      const found = products.find((p) => p.id === id);
      setProduct(found);
      setLoading(false);
    }
    loadProduct();
  }, [id]);

  if (loading) return <p className="p-6">Зареждане...</p>;
  if (!product) return <p className="p-6">Продуктът не е намерен.</p>;

  return (
    <section className="max-w-5xl mx-auto py-12 px-6 grid md:grid-cols-2 gap-8">
      <img src={product.image} alt={product.name} className="rounded-2xl w-full" />
      <div>
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
        <p className="mb-4">{product.description}</p>
        <p className="text-2xl font-semibold text-pink-600 mb-6">
          {product.price.toFixed(2)} лв
        </p>
        <button
          className="bg-pink-600 text-white px-6 py-3 rounded-lg"
          onClick={() => addToCart(product)}
        >
          Добави в количката
        </button>
      </div>
    </section>
  );
}
