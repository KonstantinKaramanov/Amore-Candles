import React, { useState } from "react";
import {
  createPaymentIntent,
  sendOfficeOrder,
  savePaidOrder,
} from "../firebase";

export default function CheckoutModal({ cart, onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [courier, setCourier] = useState("Speedy");
  const [office, setOffice] = useState("");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const qualifiesForFreeDelivery = total >= 100;
  const showFreeDelivery =
    qualifiesForFreeDelivery && paymentMethod === "card";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (total <= 0) {
      alert("Количката е празна.");
      return;
    }
    setLoading(true);
    const payload = { cart, name, email, phone, courier, office, note };

    try {
      if (paymentMethod === "cod") {
        await sendOfficeOrder(payload);
        alert("Поръчката е приета! Ще платите в офис.");
      } else {
        await savePaidOrder(payload);
        const { data } = await createPaymentIntent({ amount: total });
        // use data.clientSecret if using Stripe Elements
      }
      onClose();
    } catch (err) {
      console.error(err);
      alert("Възникна грешка при обработката.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md overflow-y-auto max-h-[90vh]"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Завършване на поръчка</h2>

        {qualifiesForFreeDelivery && (
          <div
            className={`text-center text-sm font-medium mb-4 p-2 rounded ${
              paymentMethod === "card"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            Безплатна доставка при поръчки над 100 лв {paymentMethod === "card" ? "с карта!" : "— избери карта за безплатна доставка!"}
          </div>
        )}

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Име и фамилия</label>
            <input
              className="w-full border rounded p-2"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Имейл</label>
            <input
              type="email"
              className="w-full border rounded p-2"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Телефон</label>
            <input
              type="tel"
              className="w-full border rounded p-2"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Куриер</label>
            <select
              className="w-full border rounded p-2"
              value={courier}
              onChange={(e) => setCourier(e.target.value)}
            >
              <option value="Speedy">Speedy</option>
              <option value="Ekont">Ekont</option>
            </select>
          </div>

          {courier === "Speedy" && (
            <iframe
              src="https://services.speedy.bg/officesmap_v2/?src=sws"
              width="100%"
              height="300"
              className="border rounded mb-2"
              title="Speedy карта"
              loading="lazy"
            />
          )}
          {courier === "Ekont" && (
            <iframe
              src="https://www.econt.com/find-office"
              width="100%"
              height="300"
              className="border rounded mb-2"
              title="Ekont карта"
              loading="lazy"
            />
          )}

          <div>
            <label className="block text-sm font-medium">Адрес или офис</label>
            <input
              className="w-full border rounded p-2"
              placeholder="Въведете адреса или офиса"
              value={office}
              onChange={(e) => setOffice(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Бележка (по избор)</label>
            <textarea
              className="w-full border rounded p-2"
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Метод на плащане</label>
            <select
              className="w-full border rounded p-2"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="cod">Плащане при доставка</option>
              <option value="card">Карта</option>
            </select>
          </div>

          <div className="text-right font-semibold text-pink-700 mt-2 mb-3">
            Общо: {total.toFixed(2)} лв.
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={onClose}
            className="text-gray-600 hover:text-black"
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
    </div>
  );
}