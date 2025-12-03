import React, { useState, useMemo } from "react";
import axios from "axios";
import FileDropZone from "../components/FileDropZone";
import ModeSelector, { MODES } from "../components/ModeSelector";
import AlgorithmSelector from "../components/AlgorithmSelector";
import { ChevronDown, ChevronRight, X } from "lucide-react";

const API_BASE = "http://localhost:8000";

function computePasswordStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 2) return { label: "Weak", level: 1 };
  if (score <= 4) return { label: "Medium", level: 2 };
  return { label: "Strong", level: 3 };
}

export default function EncryptPage() {
  const [files, setFiles] = useState([]);
  const [mode, setMode] = useState(MODES.SINGLE);
  const [algo, setAlgo] = useState("xchacha20-poly1305");
  const [password, setPassword] = useState("");
  const [x25519Pub, setX25519Pub] = useState("");
  const [rsaPub, setRsaPub] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [openFolders, setOpenFolders] = useState({});

  const totalSize = useMemo(
    () => files.reduce((acc, f) => acc + (f.size || 0), 0),
    [files]
  );

  const handleFilesSelected = (newFiles) => {
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const isKeyOnlyMode =
    mode === MODES.SINGLE_X25519_KEY || mode === MODES.SINGLE_RSA_KEY;

  const pwdInfo = computePasswordStrength(password);

  const folderGroups = useMemo(() => {
    const groups = {};
    files.forEach((f, idx) => {
      const path = f.webkitRelativePath || f.name;
      const parts = path.split("/");
      const folder =
        parts.length > 1 ? parts.slice(0, -1).join("/") : "(root)";
      const name = parts[parts.length - 1];
      if (!groups[folder]) groups[folder] = [];
      groups[folder].push({ idx, file: f, name, fullPath: path });
    });
    return groups;
  }, [files]);

  const toggleFolder = (folder) => {
    setOpenFolders((prev) => ({
      ...prev,
      [folder]: !(prev[folder] ?? true),
    }));
  };

  const removeFileByIndex = (idxToRemove) => {
    setFiles((prev) => prev.filter((_, i) => i !== idxToRemove));
  };

  const clearAll = () => {
    setFiles([]);
  };

  const buildFormData = () => {
    const fd = new FormData();
    files.forEach((f) => fd.append("files", f));
    if (!isKeyOnlyMode) {
      fd.append("password", password);
    }
    fd.append("algo", algo);
    if (
      mode === MODES.DUAL_X25519 ||
      mode === MODES.DOUBLE_X25519 ||
      mode === MODES.SINGLE_X25519_KEY
    ) {
      fd.append("recipient_public_key_b64", x25519Pub);
    }
    if (
      mode === MODES.DOUBLE_RSA ||
      mode === MODES.SINGLE_RSA_KEY
    ) {
      fd.append("recipient_rsa_public_pem", rsaPub);
    }
    return fd;
  };

const handleEncrypt = async () => {
  if (!files.length) {
    setStatus("Select at least one file to encrypt.");
    return;
  }
  if (!isKeyOnlyMode) {
    if (!password) {
      setStatus("Password is required for this mode.");
      return;
    }
    if (password.length < 10) {
      setStatus("Password must be at least 10 characters.");
      return;
    }
  }
  if (
    (mode === MODES.DUAL_X25519 ||
      mode === MODES.DOUBLE_X25519 ||
      mode === MODES.SINGLE_X25519_KEY) &&
    !x25519Pub
  ) {
    setStatus("Recipient X25519 public key is required.");
    return;
  }
  if (
    (mode === MODES.DOUBLE_RSA ||
      mode === MODES.SINGLE_RSA_KEY) &&
    !rsaPub
  ) {
    setStatus("Recipient RSA public key is required.");
    return;
  }

  try {
    setBusy(true);
    setStatus("Encrypting...");

    let url = "";
    if (mode === MODES.SINGLE) url = "/encrypt/single";
    if (mode === MODES.DUAL_X25519) url = "/encrypt/dual-x25519";
    if (mode === MODES.DOUBLE_X25519) url = "/encrypt/double-x25519";
    if (mode === MODES.DOUBLE_RSA) url = "/encrypt/double-rsa";
    if (mode === MODES.SINGLE_X25519_KEY) url = "/encrypt/single-x25519";
    if (mode === MODES.SINGLE_RSA_KEY) url = "/encrypt/single-rsa";

    const fd = buildFormData();
    const res = await axios.post(API_BASE + url, fd);
    const { zip_b64 } = res.data;

    const byteChars = atob(zip_b64);
    const byteNumbers = Array.from(byteChars, (c) => c.charCodeAt(0));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/zip" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "encrypted_bundle.zip";
    link.click();

    setStatus("Done. Encrypted bundle downloaded.");

    // --- CLEAR SENSITIVE FIELDS & FILES ---
    setPassword("");              // clear password
    setX25519Pub("");             // clear x25519 public key field
    setRsaPub("");                // clear rsa public key field
    setFiles([]);                 // clear selected files list (UI)
    setOpenFolders({});           // reset folder collapse state

    // reset native file input (if present in DOM)
    const fileInput = document.getElementById("file-input");
    if (fileInput) fileInput.value = "";

  } catch (e) {
    console.error(e);
    setStatus("Encryption failed.");
  } finally {
    setBusy(false);
  }
};

  const barWidth =
    pwdInfo.level === 1 ? "33%" : pwdInfo.level === 2 ? "66%" : "100%";
  const barColor =
    pwdInfo.level === 1
      ? "bg-rose-500"
      : pwdInfo.level === 2
      ? "bg-amber-400"
      : "bg-emerald-500";

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-semibold">
          Encrypt files
        </h1>
        <p className="text-sm text-slate-400">
          Choose files, pick a mode and algorithm, and create one encrypted ZIP
          bundle.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.3fr,1fr] items-start">
        {/* LEFT: files */}
        <div className="space-y-4">
          <FileDropZone onFilesSelected={handleFilesSelected} />

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <p className="text-slate-200 font-medium">Selected files</p>
              {files.length > 0 && (
                <button
                  onClick={clearAll}
                  type="button"
                  className="text-[11px] text-rose-300 hover:text-rose-200"
                >
                  Clear all
                </button>
              )}
            </div>

            <p className="text-xs text-slate-400">
              Count:{" "}
              <span className="font-mono text-slate-100">
                {files.length}
              </span>{" "}
              · Total size:{" "}
              <span className="font-mono text-slate-100">
                {(totalSize / (1024 * 1024)).toFixed(2)} MB
              </span>
            </p>

            {files.length > 0 ? (
              <div className="mt-1 max-h-52 overflow-auto rounded-lg border border-slate-800 bg-slate-950/50 p-2 text-xs">
                {Object.entries(folderGroups).map(
                  ([folder, items]) => {
                    const open = openFolders[folder] ?? true;
                    return (
                      <div key={folder} className="mb-1">
                        <button
                          type="button"
                          onClick={() => toggleFolder(folder)}
                          className="flex items-center gap-1 text-slate-200"
                        >
                          {open ? (
                            <ChevronDown className="h-3 w-3" />
                          ) : (
                            <ChevronRight className="h-3 w-3" />
                          )}
                          <span className="font-mono">
                            {folder}
                          </span>
                        </button>
                        {open && (
                          <div className="ml-5 mt-1 space-y-1">
                            {items.map((it) => (
                              <div
                                key={it.idx}
                                className="flex items-center justify-between"
                              >
                                <span className="truncate">
                                  {it.name}{" "}
                                  <span className="text-[10px] text-slate-500">
                                    ({(it.file.size / 1024).toFixed(
                                      1
                                    )}{" "}
                                    KB)
                                  </span>
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeFileByIndex(it.idx)
                                  }
                                  className="ml-2 inline-flex items-center rounded-full bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-200 hover:bg-rose-600 hover:text-white"
                                >
                                  <X className="mr-0.5 h-3 w-3" />
                                  remove
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                No files selected yet.
              </p>
            )}
          </div>
        </div>

        {/* RIGHT: settings */}
        <div className="space-y-4 text-sm">
          {/* Mode + algo */}
          <div className="space-y-3">
            <p className="text-slate-200 font-medium">
              Encryption settings
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  Encryption mode
                </label>
                <ModeSelector mode={mode} onChange={setMode} />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  Algorithm (AEAD)
                </label>
                <AlgorithmSelector algo={algo} onChange={setAlgo} />
              </div>
            </div>
          </div>

          {/* Password */}
          {!isKeyOnlyMode && (
            <div className="space-y-1">
              <label className="block text-xs text-slate-300 mb-1">
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
              <div className="mt-1">
                <div className="h-1.5 w-full rounded-full bg-slate-800">
                  <div
                    className={`h-1.5 rounded-full ${barColor}`}
                    style={{ width: barWidth }}
                  />
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  Strength:{" "}
                  <span className="font-semibold">
                    {pwdInfo.label}
                  </span>
                </p>
              </div>
            </div>
          )}

          {isKeyOnlyMode && (
            <p className="text-[11px] text-slate-400">
              Key-only mode: no password used, only public/private keys.
            </p>
          )}

          {/* Keys */}
          {(mode === MODES.DUAL_X25519 ||
            mode === MODES.DOUBLE_X25519 ||
            mode === MODES.SINGLE_X25519_KEY) && (
            <div className="space-y-1">
              <label className="block text-xs text-slate-300 mb-1">
                Recipient X25519 public key (Base64)
              </label>
              <textarea
                value={x25519Pub}
                onChange={(e) => setX25519Pub(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"
              />
            </div>
          )}

          {(mode === MODES.DOUBLE_RSA ||
            mode === MODES.SINGLE_RSA_KEY) && (
            <div className="space-y-1">
              <label className="block text-xs text-slate-300 mb-1">
                Recipient RSA public key (PEM)
              </label>
              <textarea
                value={rsaPub}
                onChange={(e) => setRsaPub(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
              />
            </div>
          )}

          {/* Button + status */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleEncrypt}
              disabled={busy}
              className="btn-soft-press inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {busy ? "Encrypting..." : "Encrypt & download bundle"}
            </button>
            <p className="text-[11px] text-slate-500">{status}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
