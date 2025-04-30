import React, { useState, useEffect } from "react";
import {
  useStripe,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js";
import {
  createPaymentIntent,
  savePaidOrder,
  getCourierOffices,
} from "../firebase";

const CheckoutModal = ({ cart, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [courier, setCourier] = useState("Ekont");
  const [office, setOffice] = useState("");
  const [officeOptions, setOfficeOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchOffices = async () => {
      try {
        const res = await getCourierOffices({ courier });
        setOfficeOptions(res.data);
      } catch (error) {
        console.error("Failed to load offices:", error);
        setOfficeOptions([]);
      }
    };

    fetchOffices();
  }, [courier]);

  const handlePay = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      if (!stripe || !elements) {
        throw new Error("Stripe not loaded yet");
      }

      const res = await createPaymentIntent({ amount });
      const clientSecret = res.data.clientSecret;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

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

        <select
          value={office}
          onChange={(e) => setOffice(e.target.value)}
          className="border p-2 w-full mb-3"
        >
          <option value="">Изберете офис</option>
          {officeOptions.map((opt) => (
            <option key={opt.id} value={opt.name}>
              {opt.name} — {opt.address}
            </option>
          ))}
        </select>

        <textarea
          placeholder="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="border p-2 w-full mb-3"
        />

        <div className="border p-3 rounded mb-3">
          <CardElement options={{ hidePostalCode: true }} />
        </div>

        {errorMsg && <p className="text-red-600 text-sm mb-2">{errorMsg}</p>}

        <button
          onClick={handlePay}
          className="bg-pink-600 text-white w-full py-2 rounded mb-2"
          disabled={loading || !stripe || !elements}
        >
          {loading ? "Обработка..." : "Плати и поръчай"}
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


