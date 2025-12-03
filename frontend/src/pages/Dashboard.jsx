import React from "react";
import { Link } from "react-router-dom";
import { Lock, Unlock, KeyRound } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-10">
      {/* Centered hero */}
      <section className="text-center space-y-4 max-w-xl">
        <h1 className="text-2xl sm:text-3xl font-semibold">
          Secure File Encryption
        </h1>
        <p className="text-sm text-slate-400">
          Encrypt and decrypt files using modern cryptography. Use passwords
          or public keys, and download everything as a single encrypted bundle.
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/encrypt"
            className="btn-soft-press inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow hover:bg-blue-500"
          >
            <Lock className="mr-2 h-4 w-4" />
            Encrypt Files
          </Link>
          <Link
            to="/decrypt"
            className="btn-soft-press inline-flex items-center justify-center rounded-xl bg-slate-800 px-5 py-2 text-sm font-medium text-slate-100 hover:bg-slate-700"
          >
            <Unlock className="mr-2 h-4 w-4" />
            Decrypt Bundle
          </Link>
        </div>
      </section>

      {/* Three simple cards */}
      <section className="grid w-full max-w-4xl gap-4 md:grid-cols-3">
        <div className="app-card p-4 text-sm flex flex-col gap-2">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/15">
            <Lock className="h-5 w-5 text-blue-400" />
          </div>
          <h2 className="text-sm font-semibold">Encrypt</h2>
          <p className="text-xs text-slate-400">
            Select one or more files and create a secure encrypted ZIP bundle.
          </p>
          <Link
            to="/encrypt"
            className="mt-auto text-xs text-blue-400 hover:text-blue-300"
          >
            Open Encrypt →
          </Link>
        </div>

        <div className="app-card p-4 text-sm flex flex-col gap-2">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15">
            <Unlock className="h-5 w-5 text-emerald-400" />
          </div>
          <h2 className="text-sm font-semibold">Decrypt</h2>
          <p className="text-xs text-slate-400">
            Upload an encrypted bundle, enter the correct password / keys and
            recover your files.
          </p>
          <Link
            to="/decrypt"
            className="mt-auto text-xs text-emerald-400 hover:text-emerald-300"
          >
            Open Decrypt →
          </Link>
        </div>

        <div className="app-card p-4 text-sm flex flex-col gap-2">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-500/15">
            <KeyRound className="h-5 w-5 text-slate-100" />
          </div>
          <h2 className="text-sm font-semibold">Keys</h2>
          <p className="text-xs text-slate-400">
            Generate X25519 and RSA key pairs for the key-based modes.
          </p>
          <Link
            to="/keys"
            className="mt-auto text-xs text-sky-400 hover:text-sky-300"
          >
            Open Keys →
          </Link>
        </div>
      </section>
    </div>
  );
}
