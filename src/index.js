import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./pages/Layout";
import JogoDaVida from "./pages/JogoDaVida";
import Fibonacci from "./pages/Fibonacci";
import Paginacao from './pages/Paginacao';
import Formulario from './pages/Formulario';
import AnotarImagem from './pages/AnotarImagem';
import Inicio from "./pages/Inicio";
import Ops from "./pages/Ops";

export default function App() {
  return (
    <BrowserRouter basename="/git/aprendendoreact/build">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Inicio />} />
          <Route path="fibonacci" element={<Fibonacci />} />
          <Route path="jogodavida" element={<JogoDaVida />} />
          <Route path="paginacao" element={<Paginacao />} />
          <Route path="formulario" element={<Formulario />} />
          <Route path="anotarimagem" element={<AnotarImagem />} />
          <Route path="*" element={<Ops />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
