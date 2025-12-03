import React, { useCallback, useState } from "react";

export default function FileDropZone({ onFilesSelected }) {
  const [isActive, setIsActive] = useState(false);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsActive(false);
      const files = Array.from(e.dataTransfer.files || []);
      if (files.length) onFilesSelected(files);
    },
    [onFilesSelected]
  );

  const handleChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length) onFilesSelected(files);
  };

  const prevent = (e) => {
    e.preventDefault();
    if (e.type === "dragenter") setIsActive(true);
    if (e.type === "dragleave") setIsActive(false);
  };

  return (
    <div className="w-full">
      <label className="block text-xs font-medium text-slate-200 mb-1">
        Files to encrypt
      </label>

      <div
        className={`flex flex-col items-center justify-center rounded-xl border border-dashed px-4 py-6 text-center text-xs transition ${
          isActive
            ? "border-blue-500 bg-slate-900/80"
            : "border-slate-700 bg-slate-900/40 hover:border-blue-500/70"
        }`}
        onDrop={handleDrop}
        onDragOver={prevent}
        onDragEnter={prevent}
        onDragLeave={prevent}
      >
        <input
          type="file"
          multiple
          className="hidden"
          id="file-input"
          onChange={handleChange}
        />
        <label htmlFor="file-input" className="cursor-pointer">
          <div className="space-y-1">
            <p className="text-slate-100 text-sm">Click to choose files</p>
            <p className="text-slate-400 text-xs">
              or drag and drop here
            </p>
          </div>
        </label>
      </div>
    </div>
  );
}
