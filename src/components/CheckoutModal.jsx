// ✅ Full CheckoutModal.jsx (scrollable, free shipping, name & email collection)
import React, { useState } from "react";
import {
  useStripe,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js";
import {
  createPaymentIntent,
  savePaidOrder,
  sendOfficeOrder,
} from "../firebase";

const CheckoutModal = ({ cart, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();

  const rawTotal = cart.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
  const formattedTotal = new Intl.NumberFormat("bg-BG", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rawTotal);

  const [amount] = useState(rawTotal);
  const [note, setNote] = useState("");
  const [courier, setCourier] = useState("Speedy");
  const [office, setOffice] = useState("");
  const [payLater, setPayLater] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMsg("");

    if (!customerName || !customerEmail.includes("@")) {
      setErrorMsg("Моля, въведете валидно име и имейл.");
      setLoading(false);
      return;
    }

    if (!office && courier !== "Ekont") {
      setErrorMsg("Моля, изберете офис за доставка.");
      setLoading(false);
      return;
    }

    try {
      if (payLater) {
        await sendOfficeOrder({ cart, courier, office, note, name: customerName, email: customerEmail });
        alert("Поръчката е приета! Ще платите при получаване.");
        onClose();
        return;
      }

      if (!stripe || !elements) throw new Error("Stripe not loaded yet");

      const res = await createPaymentIntent({ amount });
      const clientSecret = res.data.clientSecret;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (result.error) throw new Error(result.error.message);

      if (result.paymentIntent.status === "succeeded") {
        await savePaidOrder({ cart, courier, office, note, name: customerName, email: customerEmail });
        alert("Плащането е успешно! Поръчката е приета.");
        onClose();
      }
    } catch (err) {
      setErrorMsg(err.message || "Възникна грешка при плащането.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Checkout</h2>

        {/* Free Shipping Note */}
        <p className="text-sm text-green-700 font-medium mb-2">
          🚚 Безплатна доставка за поръчки над 100 лв!
        </p>

        {/* Name & Email */}
        <label className="text-sm text-gray-700 mb-1 block">Име и фамилия</label>
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Пример: Мария Иванова"
          className="border p-2 w-full mb-3"
        />

        <label className="text-sm text-gray-700 mb-1 block">Имейл за потвърждение</label>
        <input
          type="email"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          placeholder="you@example.com"
          className="border p-2 w-full mb-3"
        />

        {/* Amount */}
        <input
          type="text"
          value={formattedTotal}
          disabled
          className="border p-2 w-full mb-3 bg-gray-100 cursor-not-allowed"
        />

        {/* Courier */}
        <select
          value={courier}
          onChange={(e) => setCourier(e.target.value)}
          className="border p-2 w-full mb-3"
        >
          <option value="Speedy">Speedy</option>
          <option value="Ekont">Ekont</option>
        </select>

        {/* Embedded Maps */}
        {courier === "Speedy" && (
          <div className="mb-4">
            <iframe
              src="https://services.speedy.bg/officesmap_v2/?src=sws"
              width="100%"
              height="400"
              style={{ border: 0 }}
              loading="lazy"
              title="Speedy Map"
            ></iframe>
          </div>
        )}

        {courier === "Ekont" && (
          <div className="mb-4">
          <iframe
            src="https://www.econt.com/find-office"
            width="100%"
            height="400"
            style={{ border: 0 }}
            loading="lazy"
            title="Ekont Map"
          ></iframe>
        </div>
      )}

        {/* Office input */}
        <label className="text-sm text-gray-700 mb-1 block">
          Въведете адреса на офиса, който избрахте от картата по-горе:
        </label>
        <input
          type="text"
          placeholder="Напр. ул. Алабин 22, София"
          value={office}
          onChange={(e) => setOffice(e.target.value)}
          onFocus={(e) => e.target.select()}
          className="border p-2 w-full mb-1 focus:ring-2 focus:ring-pink-400"
        />
        <p className="text-xs text-gray-500 mb-3">
          * Копирайте адреса от избрания офис и го поставете тук.
        </p>

        {/* Note */}
        <textarea
          placeholder="Бележка към поръчката (по избор)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="border p-2 w-full mb-3 resize-none"
        />

        {/* Pay Later Toggle */}
        <label className="flex items-center mb-3">
          <input
            type="checkbox"
            checked={payLater}
            onChange={() => setPayLater(!payLater)}
            className="mr-2"
          />
          Плащане при доставка (в офис)
        </label>

        {!payLater && (
          <div className="border p-3 rounded mb-3">
            <CardElement options={{ hidePostalCode: true }} />
          </div>
        )}

        {errorMsg && <p className="text-red-600 text-sm mb-2">{errorMsg}</p>}

        <button
          onClick={handleSubmit}
          className="bg-pink-600 text-white w-full py-2 rounded mb-2"
          disabled={loading || (!payLater && (!stripe || !elements))}
        >
          {loading ? "Обработка..." : payLater ? "Поръчай" : "Плати и поръчай"}
        </button>

        <button
          onClick={onClose}
          className="text-sm text-gray-500 underline w-full"
        >
          Отказ
        </button>
      </div>
    </div>
  );
};

export default CheckoutModal;






