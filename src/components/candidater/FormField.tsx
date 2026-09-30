type FormFieldProps = {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
};

export default function FormField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
}: FormFieldProps) {
  return (
    <div>
      <label className="block text-xs font-semibold tracking-widest text-neutral-400">
        {label.toUpperCase()} {required && <span className="text-orange-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-md border border-white/15 bg-neutral-900 px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:border-orange-500 focus:outline-none"
      />
    </div>
  );
}
