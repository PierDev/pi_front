import React from "react";
import ReactDOM from "react-dom/client";
import "./css/style.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
    <BrowserRouter sx={{ minHeight: "100%"}}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)