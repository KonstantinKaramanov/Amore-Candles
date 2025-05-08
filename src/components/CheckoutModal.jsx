import React, { useState } from "react";
import {
  createPaymentIntent,
  sendOfficeOrder,
  savePaidOrder,
} from "../firebase";

export default function CheckoutModal({ cart = [], onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [courier, setCourier] = useState("Speedy");
  const [office, setOffice] = useState("");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);

  const total = (Array.isArray(cart) ? cart : []).reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const qualifiesForFreeDelivery = paymentMethod === "card" && total >= 100;

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
    const digits = phone.replace(/\D/g, "");
    return digits.length >= 10;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (total <= 0) {
      alert("Количката е празна.");
      return;
    }

    if (!validateEmail(email)) {
      alert("Моля, въведете валиден имейл адрес.");
      return;
    }

    if (!validatePhone(phone)) {
      alert("Моля, въведете валиден телефонен номер с поне 10 цифри.");
      return;
    }

    setLoading(true);

    const sanitizedCart = Array.isArray(cart)
      ? cart.map(({ id, name, price, quantity }) => ({
          id,
          name,
          price,
          quantity,
        }))
      : [];

    const payload = {
      cart: sanitizedCart,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      courier,
      office: office.trim(),
      note: note.trim(),
    };

    console.log("Final payload before send:", payload);

    try {
      if (paymentMethod === "cod") {
        await sendOfficeOrder(payload);
        alert("Поръчката е приета! Ще платите в офис.");
      } else {
        await savePaidOrder(payload);
        await createPaymentIntent({ amount: total });
        alert("Поръчката е приета! Ще платите с карта.");
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

        <div className="text-center text-sm font-medium mb-2 p-2 rounded bg-blue-100 text-blue-700">
          Доставката до офис е за сметка на получателя.
        </div>

        {qualifiesForFreeDelivery && (
          <div className="text-center text-sm font-medium mb-4 p-2 rounded bg-green-100 text-green-800">
            Безплатна доставка при поръчки над 100 лв с карта!
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

