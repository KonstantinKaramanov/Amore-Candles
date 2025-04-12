import React, { useState } from 'react';
import { useCart } from "../context/CartContext";

const CheckoutModal = ({ isOpen, onClose }) => {
  const { cart } = useCart();
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false); // Track checkout success
  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Simulate Checkout Process (For Now)
  const handleCheckout = () => {
    // Here we simulate a successful checkout by setting state
    setIsCheckoutSuccess(true);
    setTimeout(() => {
      alert("Checkout successful! Your order has been placed."); // Show success message
      onClose(); // Close the modal after success
    }, 2000); // Add a 2-second delay to simulate the checkout process
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      <div className="bg-white p-6 rounded-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold text-center mb-4">Checkout</h2>
        
        {/* Cart Items */}
        <div className="space-y-4">
          {cart.length === 0 ? (
            <p className="text-center">Your cart is empty!</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex justify-between">
                <p>{item.name}</p>
                <p>{item.quantity} x ${item.price}</p>
              </div>
            ))
          )}
        </div>

        {/* Total Amount */}
        <div className="mt-4 flex justify-between font-bold">
          <p>Total:</p>
          <p>${totalAmount.toFixed(2)}</p>
        </div>

        {/* Checkout Success Message */}
        {isCheckoutSuccess ? (
          <div className="text-center text-green-500 font-bold mt-4">
            Your order has been placed!
          </div>
        ) : (
          <div className="mt-6 flex justify-between">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              onClick={onClose}
            >
              Close
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              onClick={handleCheckout} // Handle checkout action here
            >
              Proceed to Payment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;
