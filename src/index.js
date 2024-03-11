import "crypto-browserify";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BusListProvider } from "./context/busdetails";
import { SelectedBusProvider } from "./context/selectedbus";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BusListProvider>
      <SelectedBusProvider>
        <App />
      </SelectedBusProvider>
    </BusListProvider>
  </React.StrictMode>
);
