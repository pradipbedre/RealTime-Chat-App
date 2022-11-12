import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import Favicon from "react-favicon";
import fev from './images/logo.png';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Favicon url={fev} />
    <App />
  </BrowserRouter>
);
