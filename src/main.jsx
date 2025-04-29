import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // Make sure Tailwind is imported here
import { CartProvider } from "./context/CartContext";
import { BrowserRouter } from "react-router-dom";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider>
        <App />
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
);
