import React, { useState } from "react";
import { createPaymentIntent, savePaidOrder } from "../firebase";

const CheckoutModal = ({ cart, onClose }) => {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [courier, setCourier] = useState("Ekont");
  const [office, setOffice] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    try {
      setLoading(true);
      const result = await createPaymentIntent({ amount });
      const clientSecret = result.data.clientSecret;
      console.log("Client Secret:", clientSecret);

      await savePaidOrder({ cart, courier, office, note });
      alert("Order saved! Proceed with Stripe Elements if needed.");
      onClose();
    } catch (error) {
      alert("Error during checkout: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Checkout</h2>

        <input
          type="number"
          placeholder="Amount (BGN)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 w-full mb-3"
        />

        <select
          value={courier}
          onChange={(e) => setCourier(e.target.value)}
          className="border p-2 w-full mb-3"
        >
          <option value="Ekont">Ekont</option>
          <option value="Speedy">Speedy</option>
        </select>

        <input
          type="text"
          placeholder="Office name or ID"
          value={office}
          onChange={(e) => setOffice(e.target.value)}
          className="border p-2 w-full mb-3"
        />

        <textarea
          placeholder="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="border p-2 w-full mb-3"
        />

        <button
          onClick={handlePay}
          className="bg-pink-500 text-white px-4 py-2 rounded w-full mb-2"
          disabled={loading}
        >
          {loading ? "Processing..." : "Pay and Submit Order"}
        </button>

        <button
          onClick={onClose}
          className="text-sm text-gray-500 underline w-full"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CheckoutModal;


