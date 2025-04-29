import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchProducts } from "../contentful";  // your existing Contentful fetch
import { useCart } from "../context/CartContext"; // assuming you have a CartContext

export default function ProductDetails() {
  const { id } = useParams();                     // get the dynamic part of the URL
  const { addToCart } = useCart();                 // add to cart function
  const [product, setProduct] = useState(null);    // product to display
  const [loading, setLoading] = useState(true);    // loading state

  useEffect(() => {
    async function loadProduct() {
      const allProducts = await fetchProducts();
      const found = allProducts.find((p) => p.id === id);
      setProduct(found);
      setLoading(false);
    }
    loadProduct();
  }, [id]);

  if (loading) return <div className="p-8 text-center">Зареждане...</div>;

  if (!product) return (
    <div className="p-8 text-center">
      Продуктът не е намерен.
    </div>
  );

  return (
    <section className="max-w-5xl mx-auto py-12 px-6 grid md:grid-cols-2 gap-8">
      <img
        src={product.image}
        alt={product.name}
        className="rounded-2xl shadow-md w-full object-cover"
      />
      <div>
        <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
        <p className="text-gray-600 mb-6">{product.description}</p>
        <div className="text-2xl font-semibold text-pink-700 mb-6">
          {new Intl.NumberFormat("bg-BG", {
            style: "currency",
            currency: "BGN",
          }).format(product.price)}
        </div>
        <button
          onClick={() => addToCart(product)}
          className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-xl transition-all"
        >
          Добави в количката
        </button>
      </div>
    </section>
  );
}
