import React, { useState } from "react"; import { createPaymentIntent, sendOfficeOrder, savePaidOrder, } from "../firebase";

export default function CheckoutModal({ cart, onClose }) { const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [phone, setPhone] = useState(""); const [courier, setCourier] = useState("Ekont"); const [officeAddress, setOfficeAddress] = useState(""); const [note, setNote] = useState(""); const [paymentMethod, setPaymentMethod] = useState("cod"); const [loading, setLoading] = useState(false);

const total = cart.reduce((sum, x) => sum + x.price * x.quantity, 0);

const handleSubmit = async (e) => { e.preventDefault(); if (total <= 0) { alert("Количката е празна."); return; } setLoading(true); const payload = { cart, name, email, phone, courier, office: officeAddress, note, }; try { if (paymentMethod === "cod") { await sendOfficeOrder(payload); alert("Поръчката е приета! Ще платите в офис."); } else { await savePaidOrder(payload); const { data } = await createPaymentIntent({ amount: total }); // Stripe integration goes here } onClose(); } catch (err) { console.error(err); alert("Грешка при обработка."); } finally { setLoading(false); } };

return ( <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center overflow-auto"> <form
onSubmit={handleSubmit}
className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md m-4"
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

    <label className="block text-sm font-medium">Телефон</label>
    <input
      type="tel"
      className="w-full border rounded p-2 mb-4"
      required
      value={phone}
      onChange={(e) => setPhone(e.target.value)}
    />

    <label className="block text-sm font-medium">Куриер</label>
    <select
      className="w-full border rounded p-2 mb-4"
      value={courier}
      onChange={(e) => setCourier(e.target.value)}
    >
      <option value="Ekont">Ekont</option>
      <option value="Speedy">Speedy</option>
    </select>

    <div className="mb-4">
      <p className="text-sm mb-1">Използвайте картата на сайта на куриера, за да намерите най-близкия офис:</p>
      <a
        href={courier === "Ekont" ? "https://www.econt.com/offices" : "https://services.speedy.bg/office_locator/"}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline"
      >
        Карта на {courier}
      </a>
    </div>

    <label className="block text-sm font-medium">Адрес на офис</label>
    <input
      className="w-full border rounded p-2 mb-4"
      placeholder="Напишете адреса на избрания офис"
      value={officeAddress}
      onChange={(e) => setOfficeAddress(e.target.value)}
    />

    <label className="block text-sm font-medium">Бележка (по желание)</label>
    <textarea
      className="w-full border rounded p-2 mb-4"
      rows={2}
      value={note}
      onChange={(e) => setNote(e.target.value)}
    />

    <label className="block text-sm font-medium">Метод на плащане</label>
    <select
      className="w-full border rounded p-2 mb-4"
      value={paymentMethod}
      onChange={(e) => setPaymentMethod(e.target.value)}
    >
      <option value="cod">Плащане при доставка</option>
      <option value="card">Карта</option>
    </select>

    {paymentMethod === "card" ? (
      <div className="text-green-600 text-sm mb-4 font-medium">
        Безплатна доставка при плащане с карта над 100 лв!
      </div>
    ) : (
      <div className="text-yellow-600 text-sm mb-4">
        Доставката е за ваша сметка при плащане в офис.
      </div>
    )}

    <div className="font-bold text-right mb-4">Общо: {total.toFixed(2)} лв.</div>

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

