import React, { useState } from 'react';
import { useCart } from "../context/CartContext";

const CheckoutModal = ({ isOpen, onClose }) => {
  const { cart } = useCart();
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);

  const totalAmount = cart.reduce(
    (acc, item) => acc + (parseFloat(item.price) || 0) * (item.quantity || 1),
    0
  );

  const formatBGN = (price) =>
    new Intl.NumberFormat("bg-BG", {
      style: "currency",
      currency: "BGN",
    }).format(price);

  const handleCheckout = () => {
    setIsCheckoutSuccess(true);
    setTimeout(() => {
      alert("Успешна поръчка! Благодарим Ви!");
      onClose();
    }, 2000);
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="bg-white p-6 rounded-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold text-center mb-4">Плащане</h2>

        <div className="space-y-4">
          {cart.length === 0 ? (
            <p className="text-center text-gray-500">Количката е празна.</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <p>{item.name}</p>
                <p>
                  {item.quantity || 1} x {formatBGN(item.price)}
                </p>
              </div>
            ))
          )}
        </div>

        <div className="mt-4 flex justify-between font-bold">
          <p>Общо:</p>
          <p>{formatBGN(totalAmount)}</p>
        </div>

        {isCheckoutSuccess ? (
          <div className="text-center text-green-500 font-bold mt-4">
            Поръчката е приета!
          </div>
        ) : (
          <div className="mt-6 flex justify-between">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              onClick={onClose}
            >
              Затвори
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              onClick={handleCheckout}
            >
              Потвърди поръчка
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;

