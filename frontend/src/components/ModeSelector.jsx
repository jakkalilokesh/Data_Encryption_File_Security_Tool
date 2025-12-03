import React from "react";

export const MODES = {
  SINGLE: "single",
  DUAL_X25519: "dual-x25519",
  DOUBLE_X25519: "double-x25519",
  DOUBLE_RSA: "double-rsa",
  SINGLE_X25519_KEY: "single-x25519",
  SINGLE_RSA_KEY: "single-rsa",
};

const labels = {
  [MODES.SINGLE]: "Single (Password Only)",
  [MODES.DUAL_X25519]: "Dual-Lock (Password + X25519)",
  [MODES.DOUBLE_X25519]: "Double (Password + X25519)",
  [MODES.DOUBLE_RSA]: "Double (Password + RSA)",
  [MODES.SINGLE_X25519_KEY]: "Key-Only (X25519 Public Key)",
  [MODES.SINGLE_RSA_KEY]: "Key-Only (RSA Public Key)",
};

export default function ModeSelector({ mode, onChange }) {
  return (
    <div className="space-y-2">
      <p className="font-medium text-xs text-slate-300 uppercase tracking-wide">
        Encryption Mode
      </p>
      <select
        value={mode}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
      >
        {Object.values(MODES).map((m) => (
          <option key={m} value={m} className="bg-slate-900 text-slate-100">
            {labels[m]}
          </option>
        ))}
      </select>
    </div>
  );
}
