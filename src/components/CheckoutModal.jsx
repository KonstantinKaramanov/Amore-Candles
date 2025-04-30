// ✅ CheckoutModal.jsx (updated button label + amount format)
import React, { useState, useEffect } from "react";
import {
  useStripe,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js";
import {
  createPaymentIntent,
  savePaidOrder,
  sendOfficeOrder,
  getCourierOffices,
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
  const [officeOptions, setOfficeOptions] = useState([]);
  const [payLater, setPayLater] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchOffices = async () => {
      try {
        const res = await getCourierOffices({ courier });
        console.log("Offices loaded:", res.data);
        setOfficeOptions(res.data?.data || []);
      } catch (error) {
        console.error("Failed to load offices:", error);
        setOfficeOptions([]);
      }
    };
    fetchOffices();
  }, [courier]);

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMsg("");

    if (!office) {
      setErrorMsg("Моля, изберете офис за доставка.");
      setLoading(false);
      return;
    }

    try {
      if (payLater) {
        await sendOfficeOrder({ cart, courier, office, note });
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
        await savePaidOrder({ cart, courier, office, note });
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
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Checkout</h2>

        {/* Amount (formatted, disabled) */}
        <input
          type="text"
          value={formattedTotal}
          disabled
          className="border p-2 w-full mb-3 bg-gray-100 cursor-not-allowed"
        />

        {/* Courier Select */}
        <select
          value={courier}
          onChange={(e) => setCourier(e.target.value)}
          className="border p-2 w-full mb-3"
        >
          <option value="Ekont">Ekont</option>
          <option value="Speedy">Speedy</option>
        </select>

        {/* Office Select */}
        <select
          value={office}
          onChange={(e) => setOffice(e.target.value)}
          className="border p-2 w-full mb-3"
        >
          <option value="">Изберете офис</option>
          {officeOptions.map((opt, index) => (
            <option key={index} value={opt.name || opt.address}>
              {opt.name} — {opt.address}
            </option>
          ))}
        </select>

        {/* Optional note */}
        <textarea
          placeholder="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="border p-2 w-full mb-3 resize-none"
        />

        {/* Payment method toggle */}
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
          {loading
            ? "Обработка..."
            : payLater
            ? "Поръчай"
            : "Плати и поръчай"}
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



