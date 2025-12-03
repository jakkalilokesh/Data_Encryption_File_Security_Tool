import React, { useState } from "react";
import axios from "axios";
import { ArchiveRestore } from "lucide-react";
import ModeSelector, { MODES } from "../components/ModeSelector";

const API_BASE = "http://localhost:8000";

export default function DecryptPage() {
  const [bundle, setBundle] = useState(null);
  const [mode, setMode] = useState(MODES.SINGLE);
  const [password, setPassword] = useState("");
  const [x25519Priv, setX25519Priv] = useState("");
  const [rsaPriv, setRsaPriv] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [report, setReport] = useState(null);

  const handleBundleChange = (e) => {
    const [file] = e.target.files || [];
    if (file) setBundle(file);
  };

  const isKeyOnlyMode =
    mode === MODES.SINGLE_X25519_KEY || mode === MODES.SINGLE_RSA_KEY;

const handleDecrypt = async () => {
  if (!bundle) {
    setStatus("Select an encrypted bundle (.zip) first.");
    return;
  }
  if (!password && !isKeyOnlyMode) {
    setStatus("Password is required for this mode.");
    return;
  }

  const fd = new FormData();
  fd.append("bundle", bundle);
  if (!isKeyOnlyMode) {
    fd.append("password", password);
  }

  let url = "";
  if (mode === MODES.SINGLE) url = "/decrypt/single";
  if (mode === MODES.DUAL_X25519 || mode === MODES.DOUBLE_X25519) {
    if (!x25519Priv) {
      setStatus("X25519 private key (Base64) is required.");
      return;
    }
    fd.append("private_key_b64", x25519Priv);
    url =
      mode === MODES.DUAL_X25519
        ? "/decrypt/dual-x25519"
        : "/decrypt/double-x25519";
  }
  if (mode === MODES.DOUBLE_RSA) {
    if (!rsaPriv) {
      setStatus("RSA private key (PEM) is required.");
      return;
    }
    fd.append("recipient_rsa_private_pem", rsaPriv);
    url = "/decrypt/double-rsa";
  }
  if (mode === MODES.SINGLE_X25519_KEY) {
    if (!x25519Priv) {
      setStatus("X25519 private key (Base64) is required.");
      return;
    }
    fd.append("private_key_b64", x25519Priv);
    url = "/decrypt/single-x25519";
  }
  if (mode === MODES.SINGLE_RSA_KEY) {
    if (!rsaPriv) {
      setStatus("RSA private key (PEM) is required.");
      return;
    }
    fd.append("recipient_rsa_private_pem", rsaPriv);
    url = "/decrypt/single-rsa";
  }

  try {
    setBusy(true);
    setStatus("Decrypting...");
    setReport(null);

    const res = await axios.post(API_BASE + url, fd);
    const { zip_b64, report: r } = res.data;

    const byteChars = atob(zip_b64);
    const byteNumbers = Array.from(byteChars, (c) => c.charCodeAt(0));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/zip" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "decrypted_files.zip";
    link.click();

    setReport(r || null);
    setStatus("Done. Files downloaded.");

    // --- CLEAR SENSITIVE FIELDS ---
    setPassword("");
    setX25519Priv("");
    setRsaPriv("");
    setBundle(null);

    // reset native bundle input element if present
    const bundleInput = document.getElementById("bundle-input");
    if (bundleInput) bundleInput.value = "";

  } catch (e) {
    console.error(e);
    setStatus("Decryption failed (wrong password/mode/keys?).");
  } finally {
    setBusy(false);
  }
};

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-semibold">
          Decrypt bundle
        </h1>
        <p className="text-sm text-slate-400">
          Upload the encrypted ZIP, enter password and/or keys, and recover the
          original files.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.1fr,1fr] items-start">
        {/* LEFT: bundle + password */}
        <div className="space-y-4 text-sm">
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-200">
              Encrypted bundle (.zip)
            </label>

            <label
              htmlFor="bundle-input"
              className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-3 text-sm hover:border-blue-500/80"
            >
              <div className="flex items-center gap-3">
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-800">
                  <ArchiveRestore className="h-4 w-4 text-slate-100" />
                </div>
                <div>
                  <p className="text-xs text-slate-100">
                    {bundle ? bundle.name : "Click to choose encrypted ZIP"}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    File created by this tool
                  </p>
                </div>
              </div>
              <span className="rounded-lg bg-slate-800 px-3 py-1 text-[11px] text-slate-200">
                Browse
              </span>
            </label>

            <input
              id="bundle-input"
              type="file"
              accept=".zip"
              onChange={handleBundleChange}
              className="hidden"
            />

            {bundle && (
              <p className="mt-1 text-[11px] text-slate-400">
                Size:{" "}
                <span className="font-mono text-slate-100">
                  {(bundle.size / (1024 * 1024)).toFixed(2)} MB
                </span>
              </p>
            )}
          </div>

          {!isKeyOnlyMode && (
            <div className="space-y-1">
              <label className="block text-xs text-slate-300">
                Password
              </label>
              <input
              type="password"
              autoComplete="new-password"    // prefer "new-password" to avoid autofill
              name={`pwd_${Date.now()}`}     // unique name helps avoid autofill
              id={`pwd_${Date.now()}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter a strong password (≥10 characters)"
              />
            </div>
          )}

          {isKeyOnlyMode && (
            <p className="text-[11px] text-slate-400">
              Key-only mode: only your private key is required.
            </p>
          )}
        </div>

        {/* RIGHT: mode + keys + button */}
        <div className="space-y-4 text-sm">
          <div className="space-y-3">
            <p className="text-slate-200 font-medium">
              Decryption settings
            </p>

            <div>
              <label className="block text-xs text-slate-300 mb-1">
                Decryption mode
              </label>
              <ModeSelector mode={mode} onChange={setMode} />
            </div>

            {(mode === MODES.DUAL_X25519 ||
              mode === MODES.DOUBLE_X25519 ||
              mode === MODES.SINGLE_X25519_KEY) && (
              <div className="space-y-1">
                <label className="block text-xs text-slate-300 mb-1">
                  X25519 private key (Base64)
                </label>
                <textarea
                  value={x25519Priv}
                  onChange={(e) => setX25519Priv(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"
                />
              </div>
            )}

            {(mode === MODES.DOUBLE_RSA ||
              mode === MODES.SINGLE_RSA_KEY) && (
              <div className="space-y-1">
                <label className="block text-xs text-slate-300 mb-1">
                  RSA private key (PEM)
                </label>
                <textarea
                  value={rsaPriv}
                  onChange={(e) => setRsaPriv(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDecrypt}
              disabled={busy}
              className="btn-soft-press inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {busy ? "Decrypting..." : "Decrypt & download files"}
            </button>
            <p className="text-[11px] text-slate-500">{status}</p>
          </div>
        </div>
      </div>

      {/* Integrity report (kept simple) */}
      {report && (
        <div className="mt-4 space-y-2 text-xs text-slate-200">
          <p className="font-semibold">Integrity report</p>
          <p className="text-[11px] text-emerald-400">
            {report.verified
              ? "OK · AEAD tag valid"
              : "Verification failed"}
          </p>
          <div className="max-h-52 overflow-auto rounded-lg border border-slate-800 bg-slate-950/60">
            <table className="min-w-full text-[11px]">
              <thead className="bg-slate-900/80">
                <tr>
                  <th className="px-2 py-1 text-left font-semibold">
                    File
                  </th>
                  <th className="px-2 py-1 text-left font-semibold">
                    Size
                  </th>
                  <th className="px-2 py-1 text-left font-semibold">
                    SHA-256
                  </th>
                </tr>
              </thead>
              <tbody>
                {report.files.map((f) => (
                  <tr key={f.name} className="border-t border-slate-800">
                    <td className="px-2 py-1 font-mono">
                      {f.name}
                    </td>
                    <td className="px-2 py-1 font-mono">
                      {f.size}
                    </td>
                    <td className="px-2 py-1 font-mono text-[10px]">
                      {f.sha256}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
