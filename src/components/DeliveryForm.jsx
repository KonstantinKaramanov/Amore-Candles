import { useEffect, useState } from "react";

export default function DeliveryForm({ courier, setCourier, office, setOffice, note, setNote }) {
  const [offices, setOffices] = useState([]);

  useEffect(() => {
    import("../data/offices.json").then((data) => {
      setOffices(data.default[courier] || []);
    });
  }, [courier]);

  return (
    <>
      <select
        value={courier}
        onChange={(e) => setCourier(e.target.value)}
        className="w-full p-2 border rounded"
      >
        <option value="speedy">Спиди</option>
<option value="ekont">Еконт</option>
      </select>

      <select
        value={office}
        onChange={(e) => setOffice(e.target.value)}
        className="w-full p-2 border rounded"
        required
      >
        <option value="">Изберете офис</option>
        {offices.map((o) => (
          <option key={o.id} value={o.name}>
            {o.name}
          </option>
        ))}
      </select>

      <textarea
        placeholder="Допълнителна информация (телефон, бележка...)"
        className="w-full p-2 border rounded"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
    </>
  );
}
