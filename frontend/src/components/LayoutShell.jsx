import React from "react";
import { NavLink } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

export default function LayoutShell({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top navbar */}
      <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600/20">
              <ShieldCheck className="h-5 w-5 text-blue-500" />
            </div>
            <div className="select-none">
              <p className="text-sm font-semibold">Secure Encryption Tool</p>
              <p className="text-[11px] text-slate-400">Safe • Simple • Modern</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-4 text-xs sm:text-sm font-medium">
            {[
              { to: "/", label: "Home" },
              { to: "/encrypt", label: "Encrypt" },
              { to: "/decrypt", label: "Decrypt" },
              { to: "/keys", label: "Keys" },
            ].map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `px-2 py-1 transition-colors ${
                    isActive
                      ? "text-blue-400 border-b-2 border-blue-500"
                      : "text-slate-300 hover:text-slate-100"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Page */}
      <main className="flex-1 app-fade-in">
        <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
      </main>

      {/* Footer */}
      <footer className="mt-10 border-t border-slate-800 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Secure Encryption Tool</p>
          <p className="text-[11px] text-slate-600">
            Powered by AES-256-GCM • XChaCha20-Poly1305 • Argon2id
          </p>
        </div>
      </footer>
    </div>
  );
}
