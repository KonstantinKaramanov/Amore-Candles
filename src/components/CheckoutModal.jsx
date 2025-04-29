import { useState, useEffect } from "react";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { createPaymentIntent } from "../firebase";
import { useCart } from "../context/CartContext";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function CheckoutModal({ isOpen, onClose }) {
  const { cart, clearCart } = useCart();
  const [method, setMethod] = useState("card"); // "card" or "gift"
  const total = cart.reduce((sum, i) => sum + i.price * (i.quantity || 1), 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center">Плащане</h2>

        {/* Toggle Buttons */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded-lg ${method === "card" ? "bg-pink-600 text-white" : "bg-gray-200"}`}
            onClick={() => setMethod("card")}
          >
            Плати с карта
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${method === "gift" ? "bg-pink-600 text-white" : "bg-gray-200"}`}
            onClick={() => setMethod("gift")}
          >
            Изпрати като подарък
          </button>
        </div>

        {/* Render correct form */}
        {method === "card" ? (
          <Elements stripe={stripePromise}>
            <StripeForm total={total} onClose={onClose} onSuccess={clearCart} />
          </Elements>
        ) : (
          <GiftForm onClose={onClose} onSuccess={clearCart} />
        )}
      </div>
    </div>
  );
}

function StripeForm({ total, onClose, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    createPaymentIntent({ amount: total }).then(({ data }) =>
      setClientSecret(data.clientSecret)
    );
  }, [total]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.href },
      redirect: "if_required",
    });
    if (error) {
      alert(error.message);
    } else {
      alert("Успешно плащане! Благодарим Ви!");
      onSuccess();
      onClose();
    }
  };

  if (!clientSecret) return <p>Зареждане...</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <button
        disabled={!stripe}
        className="w-full bg-pink-600 text-white py-3 rounded-lg"
      >
        Плати {total.toFixed(2)} лв
      </button>
    </form>
  );
}

function GiftForm({ onClose, onSuccess }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Gift Order:", { name, address, message });

    alert("Поръчката е изпратена успешно!\nЩе се свържем с Вас за потвърждение.");
    onSuccess();
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Име на получателя"
        className="w-full border rounded-lg p-3"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <textarea
        placeholder="Адрес за доставка"
        className="w-full border rounded-lg p-3"
        rows="3"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        required
      />
      <textarea
        placeholder="Лично съобщение (по желание)"
        className="w-full border rounded-lg p-3"
        rows="2"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        type="submit"
        className="w-full bg-pink-600 text-white py-3 rounded-lg"
      >
        Изпрати подарък
      </button>
    </form>
  );
}