import React from "react";

export const ALGOS = [
  { value: "xchacha20-poly1305", label: "XChaCha20-Poly1305" },
  { value: "chacha20-poly1305", label: "ChaCha20-Poly1305" },
  { value: "aes-256-gcm", label: "AES-256-GCM" },
  { value: "aes-256-siv", label: "AES-256-SIV" },
];

export default function AlgorithmSelector({ algo, onChange }) {
  return (
    <div className="space-y-2">
      <p className="font-medium text-xs text-slate-300 uppercase tracking-wide">
        Algorithm (AEAD)
      </p>
      <select
        value={algo}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
      >
        {ALGOS.map((a) => (
          <option key={a.value} value={a.value} className="bg-slate-900">
            {a.label}
          </option>
        ))}
      </select>
    </div>
  );
}
