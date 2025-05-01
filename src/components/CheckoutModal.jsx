import React, { useState } from "react";

export default function CheckoutModal({ cart, onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [courier, setCourier] = useState("Speedy");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const total = cart.reduce((sum, x) => sum + x.price * x.quantity, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Поръчката е приета!");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md overflow-y-auto max-h-screen"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Завърши поръчката</h2>

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
          <option value="Speedy">Speedy</option>
          <option value="Ekont">Ekont</option>
        </select>

        {/* Maps */}
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
          <option value="card">Плащане с карта</option>
        </select>

        {paymentMethod === "card" && total >= 100 && (
          <p className="text-green-600 mb-2 font-semibold">
            Безплатна доставка за поръчки над 100 лв!
          </p>
        )}

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            Затвори
          </button>
          <button
            type="submit"
            className="bg-pink-600 text-white px-4 py-2 rounded"
          >
            Потвърди поръчката
          </button>
        </div>
      </form>
    </div>
  );
}