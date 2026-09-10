import { MessageCircle } from "lucide-react";
import { contactInfo } from "@/data/site";

type WhatsAppButtonProps = {
  message?: string;
  variant?: "floating" | "inline" | "outline";
  className?: string;
};

export default function WhatsAppButton({
  message = "Bonjour, je souhaite en savoir plus sur Los Leones.",
  variant = "inline",
  className = "",
}: WhatsAppButtonProps) {
  const url = `https://wa.me/${contactInfo.whatsappNumber}?text=${encodeURIComponent(
    message
  )}`;

  if (variant === "floating") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contacter Los Leones sur WhatsApp"
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-black shadow-lg shadow-orange-500/30 transition hover:bg-orange-400 ${className}`}
      >
        <MessageCircle size={18} />
        WHATSAPP
      </a>
    );
  }

  if (variant === "outline") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center gap-2 rounded-md border border-white/20 px-4 py-2 text-sm font-medium text-white transition hover:border-white/40 ${className}`}
      >
        <MessageCircle size={16} />
        WHATSAPP
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-2 text-sm text-neutral-300 transition hover:text-orange-500 ${className}`}
    >
      <MessageCircle size={16} />
      WhatsApp
    </a>
  );
}
