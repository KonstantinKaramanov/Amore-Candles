// // src/components/CartPreview.jsx
// import React from "react";
// import { useCart } from "../context/CartContext";

// export default function CartPreview({ onClose, onCheckout }) {
//   const { cart, removeFromCart } = useCart();
//   const total = cart.reduce(
//     (sum, x) => sum + x.price * x.quantity,
//     0
//   );

//   return (
//     <div className="fixed top-16 right-4 bg-white shadow-lg rounded-lg w-80 z-50 border border-pink-200 p-4">
//       <div className="flex justify-between items-center mb-2">
//         <h3 className="font-semibold text-lg">Твоята количка</h3>
//         <button onClick={onClose} className="text-sm text-pink-500">
//           Затвори
//         </button>
//       </div>
//       {cart.length === 0 ? (
//         <p className="text-sm text-gray-500">Количката е празна.</p>
//       ) : (
//         <>
//           <ul className="space-y-2 max-h-48 overflow-auto">
//             {cart.map((item) => (
//               <li
//                 key={item.id}
//                 className="flex justify-between items-center"
//               >
//                 <span>
//                   {item.name} × {item.quantity}
//                 </span>
//                 <button
//                   onClick={() => removeFromCart(item.id)}
//                   className="text-xs text-red-500"
//                 >
//                   Премахни
//                 </button>
//               </li>
//             ))}
//           </ul>
//           <div className="mt-4 font-semibold">
//             Общо:{" "}
//             {new Intl.NumberFormat("bg-BG", {
//               style: "currency",
//               currency: "BGN",
//             }).format(total)}
//           </div>
//           <button
//             onClick={onCheckout}
//             className="mt-4 w-full bg-pink-500 text-white py-2 rounded"
//           >
//             Приключи поръчката
//           </button>
//         </>
//       )}
//     </div>
//   );
// }
// src/components/CartPreview.jsx
import React from "react";
import { useCart } from "../context/CartContext";

export default function CartPreview({ onClose, onCheckout }) {
  const { cart, removeFromCart } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="fixed top-4 right-4 bg-white rounded-lg shadow-xl p-6 w-80 z-50 animate-slide-in-right transition-all duration-300">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Твоята количка</h3>
        <button
          onClick={onClose}
          className="text-pink-500 hover:text-pink-700 text-sm"
        >
          Затвори
        </button>
      </div>

      {cart.length === 0 ? (
        <p className="text-center text-gray-500 mb-6">Количката е празна</p>
      ) : (
        <>
          <div className="space-y-4 max-h-[50vh] overflow-y-auto">
            {cart.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 border-b border-gray-200/60 pb-3"
              >
                <img
                  src={item.image || item.images?.[0]}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {item.name} × {item.quantity}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 text-xs hover:underline"
                  >
                    Премахни
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 font-semibold text-right text-gray-800">
            Общо: {total.toFixed(2)} лв.
          </div>

          <button
            onClick={onCheckout}
            className="mt-4 w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700 transition"
          >
            Приключи поръчката
          </button>
        </>
      )}
    </div>
  );
}
