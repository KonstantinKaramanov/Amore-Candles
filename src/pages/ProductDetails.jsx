import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProductById } from "../contentful";
import { useCart } from "../context/CartContext";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedFlavor, setSelectedFlavor] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      const data = await fetchProductById(id);
      setProduct(data);
    };
    loadProduct();
  }, [id]);

  if (!product) return <div className="p-8">Зареждане...</div>;

  const handleAddToCart = () => {
    if (product.flavors?.length && !selectedFlavor) {
      alert("Моля, изберете аромат.");
      return;
    }

    addToCart({ ...product, selectedFlavor });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

      {/* Image Carousel */}
      <div className="mb-6">
        <Swiper
          modules={[Pagination, Navigation]}
          spaceBetween={10}
          slidesPerView={1}
          pagination={{ clickable: true }}
          navigation
          className="rounded-lg"
        >
          {product.images.map((img, i) => (
            <SwiperSlide key={i}>
              <img
                src={img}
                alt={`${product.name} ${i + 1}`}
                className="w-full h-auto object-cover rounded-lg"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Flavor Dropdown */}
      {product.flavors && product.flavors.length > 0 && (
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">Аромат:</label>
          <select
            value={selectedFlavor}
            onChange={(e) => setSelectedFlavor(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2"
          >
            <option value="">Избери аромат</option>
            {product.flavors.map((flavor, i) => (
              <option key={i} value={flavor}>{flavor}</option>
            ))}
          </select>
        </div>
      )}

      <p className="text-lg text-gray-700 mb-4">{product.description}</p>
      <p className="text-xl text-pink-600 font-semibold mb-6">
        {product.price.toFixed(2)} лв.
      </p>
      <button
        className="bg-pink-500 text-white px-6 py-2 rounded hover:bg-pink-600"
        onClick={handleAddToCart}
      >
        Добави в количката
      </button>
    </div>
  );
};

export default ProductDetail;
