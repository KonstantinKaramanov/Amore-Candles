

const CheckoutModal = ({ cart, onClose }) => { const [courier, setCourier] = useState("Ekont"); const [office, setOffice] = useState(""); const [note, setNote] = useState(""); const [email, setEmail] = useState(""); const [name, setName] = useState(""); const [phone, setPhone] = useState(""); const [paymentMethod, setPaymentMethod] = useState("cod"); const [isSubmitting, setIsSubmitting] = useState(false);

const total = cart.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);

const handleSubmit = async (e) => { e.preventDefault(); setIsSubmitting(true);

const payload = {
  cart,
  courier,
  office,
  note,
  name,
  email,
  phone
};

try {
  if (paymentMethod === "cod") {
    await sendOfficeOrder(payload);
  } else {
    await savePaidOrder(payload);
    await createPaymentIntent({ amount: total });
  }
  alert("Поръчката е приета!");
  onClose();
} catch (err) {
  console.error(err);
  alert("Възникна грешка при изпращане на поръчката.");
} finally {
  setIsSubmitting(false);
}

};

return ( <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"> <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"> <h2 className="text-xl font-bold mb-4 text-center">Завърши поръчката</h2>

<label className="block text-sm font-medium">Име и фамилия</label>
    <input
      type="text"
      value={name}
      onChange={(e) => setName(e.target.value)}
      required
      className="w-full border rounded p-2 mb-4"
    />

    <label className="block text-sm font-medium">Имейл</label>
    <input
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
      className="w-full border rounded p-2 mb-4"
    />

    <label className="block text-sm font-medium">Телефон за връзка</label>
    <input
      type="tel"
      value={phone}
      onChange={(e) => setPhone(e.target.value)}
      required
      className="w-full border rounded p-2 mb-4"
    />

    <label className="block text-sm font-medium">Куриер</label>
    <select
      value={courier}
      onChange={(e) => setCourier(e.target.value)}
      className="w-full border rounded p-2 mb-4"
    >
      <option value="Ekont">Ekont</option>
      <option value="Speedy">Speedy</option>
    </select>

    <label className="block text-sm font-medium">Офис</label>
    <input
      type="text"
      value={office}
      onChange={(e) => setOffice(e.target.value)}
      placeholder="Изберете офис"
      className="w-full border rounded p-2 mb-4"
    />

    <label className="block text-sm font-medium">Бележка (по желание)</label>
    <textarea
      value={note}
      onChange={(e) => setNote(e.target.value)}
      className="w-full border rounded p-2 mb-4"
      rows={2}
    />

    <label className="block text-sm font-medium">Метод на плащане</label>
    <select
      value={paymentMethod}
      onChange={(e) => setPaymentMethod(e.target.value)}
      className="w-full border rounded p-2 mb-4"
    >
      <option value="cod">Плащане при доставка</option>
      <option value="card">Карта</option>
    </select>

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
        disabled={isSubmitting}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        {paymentMethod === "cod" ? "Поръчай" : "Плати и поръчай"}
      </button>
    </div>
  </form>
</div>

); };

export default CheckoutModal;

