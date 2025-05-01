// src/components/CheckoutModal.jsx import React, { useState } from "react"; import { createPaymentIntent, sendOfficeOrder, savePaidOrder, } from "../firebase";

export default function CheckoutModal({ cart, onClose }) { const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [phone, setPhone] = useState(""); const [courier, setCourier] = useState("Ekont"); const [office, setOffice] = useState(""); const [note, setNote] = useState(""); const [paymentMethod, setPaymentMethod] = useState("cod"); const [loading, setLoading] = useState(false);

const total = cart.reduce((sum, x) => sum + x.price * x.quantity, 0);

const handleSubmit = async (e) => { e.preventDefault(); if (total <= 0) { alert("Количката е празна."); return; } setLoading(true); const payload = { cart, name, email, phone, courier, office, note }; try { if (paymentMethod === "cod") { await sendOfficeOrder(payload); alert("Поръчката е приета! Ще платите в офис."); } else { await savePaidOrder(payload); const { data } = await createPaymentIntent({ amount: total }); // redirect using Stripe.js or pass clientSecret to <Elements> checkout form } onClose(); } catch (err) { console.error(err); alert("Грешка при обработка."); } finally { setLoading(false); } };

return ( <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center overflow-auto p-4"> <form
onSubmit={handleSubmit}
className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
> <h2 className="text-xl font-bold mb-4 text-center">Завърши поръчката</h2>

<label className="block text-sm font-medium">Име и фамилия</label>
    <input
      className="w-full border rounded p-2 mb-4"
      required
      value={name}
      onChange={(e) => setName(e.target.value)}
    />

    <label className="block text-sm font-medium">Имейл</label>
    <input
      type="email"
      className="w-full border rounded p-2 mb-4"
      required
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />

    <label className="block text-sm font-medium">Телефон за връзка</label>
    <input
      type="tel"
      className="w-full border rounded p-2 mb-4"
      required
      value={phone}
      onChange={(e) => setPhone(e.target.value)}
    />

    <label className="block text-sm font-medium">Метод</label>
    <select
      className="w-full border rounded p-2 mb-4"
      value={paymentMethod}
      onChange={(e) => setPaymentMethod(e.target.value)}
    >
      <option value="cod">Плащане при доставка</option>
      <option value="card">Карта</option>
    </select>

    {paymentMethod === "card" && total >= 100 && (
      <p className="text-green-600 font-semibold text-center mt-2">
        Безплатна доставка за поръчки над 100 лв!
      </p>
    )}

    {paymentMethod === "cod" && (
      <p className="text-sm text-gray-600 mt-2">
        * Доставката се заплаща от клиента при получаване.
      </p>
    )}

    <label className="block text-sm font-medium">Куриер</label>
    <select
      className="w-full border rounded p-2 mb-4"
      value={courier}
      onChange={(e) => setCourier(e.target.value)}
    >
      <option value="Ekont">Ekont</option>
      <option value="Speedy">Speedy</option>
    </select>

    <label className="block text-sm font-medium">Офис (въведете ръчно)</label>
    <input
      className="w-full border rounded p-2 mb-4"
      placeholder="Адрес на офис"
      value={office}
      onChange={(e) => setOffice(e.target.value)}
    />

    <label className="block text-sm font-medium">Бележка (по желание)</label>
    <textarea
      className="w-full border rounded p-2 mb-4"
      rows={2}
      value={note}
      onChange={(e) => setNote(e.target.value)}
    />

    <div className="text-right font-bold text-lg mb-4">
      Обща сума: {total.toFixed(2)} лв.
    </div>

    <div className="flex justify-between items-center">
      <button
        type="button"
        onClick={onClose}
        className="text-gray-600 hover:text-gray-800"
      >
        Отказ
      </button>
      <button
        type="submit"
        disabled={loading}
        className="bg-pink-600 text-white px-4 py-2 rounded"
      >
        {paymentMethod === "cod" ? "Поръчай" : "Плати и поръчай"}
      </button>
    </div>
  </form>
</div>

); }

