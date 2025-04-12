import { useCart } from '../context/CartContext';

const CartPreview = ({ onClose }) => {
  const { cart, removeFromCart } = useCart();

  const formatBGN = (price) =>
    new Intl.NumberFormat("bg-BG", {
      style: "currency",
      currency: "BGN",
    }).format(price);

  return (
    <div className="fixed top-16 right-4 bg-white shadow-lg rounded-lg w-80 z-50 border border-pink-200 p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-lg">Твоята количка</h3>
        <button onClick={onClose} className="text-sm text-pink-500">Затвори</button>
      </div>
      {cart.length === 0 ? (
        <p className="text-sm text-gray-500">Количката е празна.</p>
      ) : (
        <>
          <ul className="space-y-2">
            {cart.map((item) => (
              <li key={item.id} className="flex justify-between items-center">
                <span>{item.name}</span>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-xs text-red-500"
                >
                  Премахни
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4 font-semibold">
            Общо:{" "}
            {formatBGN(
              cart.reduce((total, item) => total + (parseFloat(item.price) || 0), 0)
            )}
          </div>
          <button
            className="mt-2 w-full bg-pink-500 text-white py-2 rounded"
            onClick={() => alert("Плащането ще бъде добавено скоро!")}
          >
            Плащане
          </button>
        </>
      )}
    </div>
  );
};

export default CartPreview;

