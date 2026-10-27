"use client";

import { useState } from "react";

type FormFieldProps = {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string | null;
  min?: number | string;
  max?: number | string;
  inputMode?: "numeric" | "tel" | "text" | "email";
};

export default function FormField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  error,
  min,
  max,
  inputMode,
}: FormFieldProps) {
  const [touched, setTouched] = useState(false);

  // L'erreur n'apparaît qu'après avoir quitté le champ (sinon "7" afficherait
  // déjà "numéro invalide"). Un champ date ne change qu'une fois la date
  // complète : on peut le valider tout de suite.
  const showError = Boolean(error) && (touched || type === "date");

  return (
    <div>
      <label className="block text-xs font-semibold tracking-widest text-neutral-400">
        {label.toUpperCase()}{" "}
        {required && <span className="text-orange-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        min={min}
        max={max}
        inputMode={inputMode}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setTouched(true)}
        placeholder={placeholder}
        aria-invalid={showError}
        className={`mt-2 w-full rounded-md border bg-neutral-900 px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none ${
          showError
            ? "border-red-500/60 focus:border-red-500"
            : "border-white/15 focus:border-orange-500"
        }`}
      />
      {showError && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  );
}
