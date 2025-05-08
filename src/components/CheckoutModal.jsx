import React, { useState } from "react";
import {
  createPaymentIntent,
  sendOfficeOrder,
} from "../firebase";
import PaymentForm from "./PaymentForm";

export default function CheckoutModal({ cart = [], onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [courier, setCourier] = useState("Speedy");
  const [office, setOffice] = useState("");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [cardStep, setCardStep] = useState(false);
  const [pendingOrderPayload, setPendingOrderPayload] = useState(null);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const qualifiesForFreeDelivery = paymentMethod === "card" && total >= 100;

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => phone.replace(/\D/g, "").length >= 10;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (total <= 0) return alert("Количката е празна.");
    if (!validateEmail(email)) return alert("Моля, въведете валиден имейл адрес.");
    if (!validatePhone(phone)) return alert("Моля, въведете валиден телефонен номер с поне 10 цифри.");

    setLoading(true);

    const payload = {
      cart: cart.map(({ id, name, price, quantity }) => ({ id, name, price, quantity })),
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      courier,
      office: office.trim(),
      note: note.trim(),
    };

    try {
      if (paymentMethod === "cod") {
        await sendOfficeOrder(payload);
        alert("Поръчката е приета! Ще платите в офис.");
        onClose();
      } else {
        const result = await createPaymentIntent({ amount: total });

        if (!result || !result.data || !result.data.clientSecret) {
          console.error("❌ Missing clientSecret!", result);
          alert("Проблем при създаване на плащането.");
          return;
        }

        console.log("✅ Received clientSecret:", result.data.clientSecret);
        setClientSecret(result.data.clientSecret);
        setPendingOrderPayload(payload);
        setCardStep(true);
      }
    } catch (err) {
      console.error(err);
      alert("Възникна грешка при обработката.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      {cardStep && clientSecret ? (
        <PaymentForm
          clientSecret={clientSecret}
          onSuccess={async () => {
            if (pendingOrderPayload) {
              const { savePaidOrder } = await import("../firebase");
              await savePaidOrder(pendingOrderPayload);
            }
            alert("Плащането мина успешно!");
            onClose();
          }}
          onError={(msg) => alert("Грешка при плащането: " + msg)}
        />
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white animate-fadeIn rounded-lg shadow-lg p-6 w-full max-w-md overflow-y-auto max-h-[90vh]"
        >
          <h2 className="text-xl font-bold mb-4 text-center">Завършване на поръчка</h2>

          <div className="space-y-3">
            <input className="w-full border rounded p-2" required placeholder="Име и фамилия" value={name} onChange={(e) => setName(e.target.value)} />
            <input className="w-full border rounded p-2" type="email" required placeholder="Имейл" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className="w-full border rounded p-2" type="tel" required placeholder="Телефон" value={phone} onChange={(e) => setPhone(e.target.value)} />

            <select className="w-full border rounded p-2" value={courier} onChange={(e) => setCourier(e.target.value)}>
              <option value="Speedy">Speedy</option>
              <option value="Ekont">Ekont</option>
            </select>

            {courier === "Speedy" && <iframe src="https://services.speedy.bg/officesmap_v2/?src=sws" width="100%" height="300" className="border rounded" title="Speedy карта" loading="lazy" />}
            {courier === "Ekont" && <iframe src="https://www.econt.com/find-office" width="100%" height="300" className="border rounded" title="Ekont карта" loading="lazy" />}

            <input className="w-full border rounded p-2" placeholder="Адрес или офис" value={office} onChange={(e) => setOffice(e.target.value)} />
            <textarea className="w-full border rounded p-2" rows={2} placeholder="Бележка (по избор)" value={note} onChange={(e) => setNote(e.target.value)} />

            <select className="w-full border rounded p-2" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <option value="cod">Плащане при доставка</option>
              <option value="card">Карта</option>
            </select>

            <div className="text-right font-semibold text-pink-700 mt-2">
              Общо: {total.toFixed(2)} лв.
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="text-center text-sm font-medium p-2 rounded bg-blue-100 text-blue-700">
              Доставката до офис е за сметка на получателя.
            </div>
            {qualifiesForFreeDelivery && (
              <div className="text-center text-sm font-medium p-2 rounded bg-green-100 text-green-800">
                Безплатна доставка при поръчки над 100 лв с карта!
              </div>
            )}
          </div>

          <div className="flex justify-between items-center mt-6">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-600 hover:text-black transition"
            >
              Отказ
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition"
            >
              {paymentMethod === "cod" ? "Поръчай" : "Плати с карта"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}



