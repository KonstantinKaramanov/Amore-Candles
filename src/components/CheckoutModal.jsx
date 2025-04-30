import { useState, useEffect } from "react";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useCart } from "../context/CartContext";
import { createPaymentIntent, sendOfficeOrder, savePaidOrder } from "../firebase";
import DeliveryForm from "./DeliveryForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function CheckoutModal({ isOpen, onClose }) {
  const { cart, clearCart } = useCart();
  const [mode, setMode] = useState("pay");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-lg">
        <div className="flex mb-4">
          <button
            className={`flex-1 p-2 ${mode === "pay" ? "bg-pink-600 text-white" : "bg-gray-200"}`}
            onClick={() => setMode("pay")}
          >
            Плати с карта
          </button>
          <button
            className={`flex-1 p-2 ${mode === "office" ? "bg-pink-600 text-white" : "bg-gray-200"}`}
            onClick={() => setMode("office")}
          >
            Доставка до офис
          </button>
        </div>

        {mode === "pay" ? (
          <Elements stripe={stripePromise}>
            <StripeForm cart={cart} onClose={onClose} clearCart={clearCart} />
          </Elements>
        ) : (
          <OfficeForm cart={cart} onClose={onClose} clearCart={clearCart} />
        )}
      </div>
    </div>
  );
}

function StripeForm({ cart, onClose, clearCart }) {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState("");
  const [courier, setCourier] = useState("ekont");
  const [office, setOffice] = useState("");
  const [note, setNote] = useState("");

  const total = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  useEffect(() => {
    createPaymentIntent({ amount: total }).then((res) => setClientSecret(res.data.clientSecret));
  }, [total]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!office) return alert("Изберете офис за доставка.");

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.href },
      redirect: "if_required",
    });

    if (error) return alert(error.message);

    await savePaidOrder({ cart, courier, office, note });
    alert("Поръчката е приета!");
    clearCart();
    onClose();
  };

  if (!clientSecret) return <p>Зареждане...</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <DeliveryForm {...{ courier, setCourier, office, setOffice, note, setNote }} />
      <button
        disabled={!stripe}
        className="w-full bg-pink-600 text-white py-3 rounded-lg"
      >
        Потвърди и плати {total.toFixed(2)} лв
      </button>
    </form>
  );
}

function OfficeForm({ cart, onClose, clearCart }) {
  const [courier, setCourier] = useState("ekont");
  const [office, setOffice] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!office) return alert("Моля, изберете офис за доставка.");
    setLoading(true);
    try {
      await sendOfficeOrder({ cart, courier, office, note });
      alert("Поръчката беше изпратена успешно!");
      clearCart();
      onClose();
    } catch {
      alert("Грешка при изпращане на поръчката.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DeliveryForm {...{ courier, setCourier, office, setOffice, note, setNote }} />
      <button
        disabled={loading}
        className="w-full bg-pink-600 text-white py-3 rounded-lg"
      >
        Потвърди поръчката (наложен платеж)
      </button>
    </form>
  );
}
