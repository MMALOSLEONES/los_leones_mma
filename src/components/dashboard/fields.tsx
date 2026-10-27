// Champs et boutons partagés par tout le dashboard, dans le même style que le site.

const inputClass =
  "mt-2 w-full rounded-md border border-white/15 bg-neutral-900 px-4 py-3 text-sm text-white focus:border-orange-500 focus:outline-none";
const labelClass = "block text-xs font-semibold tracking-widest text-neutral-400";

export const btnPrimary =
  "rounded-md bg-orange-500 px-4 py-2 text-xs font-bold tracking-widest text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-40";
export const btnOutline =
  "rounded-md border border-white/20 px-4 py-2 text-xs font-bold tracking-widest text-white transition hover:border-white/40 disabled:cursor-not-allowed disabled:opacity-40";
export const btnDanger =
  "px-2 py-2 text-xs font-semibold text-red-400 transition hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-40";

type Option = { value: string; label: string };

export function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
}) {
  return (
    <div>
      <label className={labelClass}>{label.toUpperCase()}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  rows = 5,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  required?: boolean;
}) {
  return (
    <div>
      <label className={labelClass}>
        {label.toUpperCase()}{" "}
        {required && <span className="text-orange-500">*</span>}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className={`${inputClass} resize-none`}
      />
    </div>
  );
}
