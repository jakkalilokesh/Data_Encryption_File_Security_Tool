import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Copy, KeyRound, ArrowRight } from "lucide-react";

const API_BASE = "http://localhost:8000";

export default function KeysPage() {
  const [xPub, setXPub] = useState("");
  const [xPriv, setXPriv] = useState("");
  const [rsaPub, setRsaPub] = useState("");
  const [rsaPriv, setRsaPriv] = useState("");
  const [status, setStatus] = useState("");

  const copy = (text) => {
    navigator.clipboard.writeText(text || "");
    setStatus("Copied to clipboard.");
    setTimeout(() => setStatus(""), 1500);
  };

  const fetchX25519 = async () => {
    const res = await axios.get(API_BASE + "/keys/x25519");
    setXPub(res.data.public_key);
    setXPriv(res.data.private_key);
    setStatus("Generated X25519 key pair.");
  };

  const fetchRSA = async () => {
    const res = await axios.get(API_BASE + "/keys/rsa");
    setRsaPub(res.data.public_key);
    setRsaPriv(res.data.private_key);
    setStatus("Generated RSA key pair.");
  };

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="page-title-underline text-xl sm:text-2xl font-semibold">
          Keys & Generation
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Generate the key pairs for X25519 and RSA.
          Keys should be generated and stored securely by users only.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="app-card p-4 space-y-3 text-xs"
        >
          <div className="flex items-center gap-2 text-slate-200">
            <KeyRound className="h-4 w-4 text-brand-400" />
            <span className="font-semibold text-sm">
              X25519 Key Pair (dual / double X25519, key-only)
            </span>
          </div>

          <button
            onClick={fetchX25519}
            className="btn-soft-press inline-flex items-center gap-1 rounded-xl bg-brand-600 px-3 py-1.5 text-[11px] font-medium text-white shadow hover:bg-brand-500"
          >
            Generate X25519 Keys
            <ArrowRight className="h-3 w-3" />
          </button>

          <div>
            <p className="font-semibold mb-1 text-slate-200">
              Public Key (Base64)
            </p>
            <div className="relative">
              <textarea
                readOnly
                value={xPub}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-2.5 py-2 text-[11px] text-slate-100 h-16"
              />
              <button
                onClick={() => copy(xPub)}
                className="btn-soft-press absolute bottom-2 right-2 inline-flex items-center rounded-lg bg-slate-800 px-2 py-1 text-[10px] text-slate-200 hover:bg-slate-700"
              >
                <Copy className="mr-1 h-3 w-3" />
                Copy
              </button>
            </div>
          </div>

          <div>
            <p className="font-semibold mb-1 text-slate-200">
              Private Key (Base64)
            </p>
            <div className="relative">
              <textarea
                readOnly
                value={xPriv}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-2.5 py-2 text-[11px] text-slate-100 h-16"
              />
              <button
                onClick={() => copy(xPriv)}
                className="btn-soft-press absolute bottom-2 right-2 inline-flex items-center rounded-lg bg-slate-800 px-2 py-1 text-[10px] text-slate-200 hover:bg-slate-700"
              >
                <Copy className="mr-1 h-3 w-3" />
                Copy
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="app-card p-4 space-y-3 text-xs"
        >
          <div className="flex items-center gap-2 text-slate-200">
            <KeyRound className="h-4 w-4 text-emerald-400" />
            <span className="font-semibold text-sm">
              RSA Key Pair (double RSA, key-only RSA)
            </span>
          </div>

          <button
            onClick={fetchRSA}
            className="btn-soft-press inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1.5 text-[11px] font-medium text-white shadow hover:bg-emerald-500"
          >
            Generate RSA Keys
            <ArrowRight className="h-3 w-3" />
          </button>

          <div>
            <p className="font-semibold mb-1 text-slate-200">
              Public Key (PEM)
            </p>
            <div className="relative">
              <textarea
                readOnly
                value={rsaPub}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-2.5 py-2 text-[11px] text-slate-100 h-20"
              />
              <button
                onClick={() => copy(rsaPub)}
                className="btn-soft-press absolute bottom-2 right-2 inline-flex items-center rounded-lg bg-slate-800 px-2 py-1 text-[10px] text-slate-200 hover:bg-slate-700"
              >
                <Copy className="mr-1 h-3 w-3" />
                Copy
              </button>
            </div>
          </div>

          <div>
            <p className="font-semibold mb-1 text-slate-200">
              Private Key (PEM)
            </p>
            <div className="relative">
              <textarea
                readOnly
                value={rsaPriv}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-2.5 py-2 text-[11px] text-slate-100 h-24"
              />
              <button
                onClick={() => copy(rsaPriv)}
                className="btn-soft-press absolute bottom-2 right-2 inline-flex items-center rounded-lg bg-slate-800 px-2 py-1 text-[10px] text-slate-200 hover:bg-slate-700"
              >
                <Copy className="mr-1 h-3 w-3" />
                Copy
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <p className="text-[11px] text-slate-500">{status}</p>
    </div>
  );
}
