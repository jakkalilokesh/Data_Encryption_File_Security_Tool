import React from "react";
import { Routes, Route } from "react-router-dom";
import LayoutShell from "./components/LayoutShell";
import Dashboard from "./pages/Dashboard";
import EncryptPage from "./pages/EncryptPage";
import DecryptPage from "./pages/DecryptPage";
import KeysPage from "./pages/KeysPage";

export default function App() {
  return (
    <LayoutShell>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/encrypt" element={<EncryptPage />} />
        <Route path="/decrypt" element={<DecryptPage />} />
        <Route path="/keys" element={<KeysPage />} />
      </Routes>
    </LayoutShell>
  );
}
