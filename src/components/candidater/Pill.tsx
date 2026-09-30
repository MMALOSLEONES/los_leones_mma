type PillProps = {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

export default function Pill({ active, onClick, children }: PillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md border px-4 py-2 text-xs font-semibold tracking-wide transition ${
        active
          ? "border-orange-500 bg-orange-500 text-black"
          : "border-white/20 text-neutral-300 hover:border-white/40"
      }`}
    >
      {children}
    </button>
  );
}
