import type { Tone } from "@/lib/labels";

const tones: Record<Tone, string> = {
  pending: "border-orange-500/40 text-orange-400",
  success: "border-green-500/40 text-green-400",
  danger: "border-red-500/40 text-red-400",
  neutral: "border-white/20 text-neutral-400",
};

export default function StatusBadge({
  label,
  tone,
}: {
  label: string;
  tone: Tone;
}) {
  return (
    <span
      className={`rounded border px-2 py-0.5 text-[10px] font-bold tracking-widest ${tones[tone]}`}
    >
      {label.toUpperCase()}
    </span>
  );
}
