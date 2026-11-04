import { contactInfo } from "@/data/site";

type WhatsAppButtonProps = {
  message?: string;
  variant?: "floating" | "inline" | "outline";
  className?: string;
};

function WhatsAppIcon({ size = 30 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="22" fill="#25D366" />

      <path
        d="M24 9C15.72 9 9 15.72 9 24C9 26.77 9.76 29.36 11.08 31.58L9 39L16.63 37C18.82 38.28 21.35 39 24 39C32.28 39 39 32.28 39 24C39 15.72 32.28 9 24 9Z"
        fill="white"
      />

      <path
        d="M24 12C17.37 12 12 17.37 12 24C12 26.47 12.75 28.77 14.03 30.67L12.8 35.2L17.44 34C19.32 35.25 21.59 36 24 36C30.63 36 36 30.63 36 24C36 17.37 30.63 12 24 12Z"
        fill="#25D366"
      />

      <path
        d="M19.1 17.5C18.75 17.5 18.2 17.65 17.75 18.15C17.3 18.65 16 19.85 16 22.3C16 24.75 17.8 27.1 18.05 27.45C18.3 27.8 21.55 33.05 26.7 34.1C30.98 34.98 31.85 33.7 32.75 32.55C33.65 31.4 33.65 30.4 33.4 30.2C33.15 30 32.5 29.65 31.5 29.15C30.5 28.65 29.85 28.4 29.55 28.9C29.25 29.4 28.35 30.45 28.05 30.75C27.75 31.05 27.45 31.1 26.95 30.85C26.45 30.6 24.85 30.05 22.95 28.35C21.45 27 20.45 25.35 20.15 24.85C19.85 24.35 20.1 24.1 20.35 23.85C20.55 23.65 20.85 23.3 21.1 23.05C21.35 22.8 21.45 22.6 21.6 22.3C21.75 22 21.7 21.75 21.55 21.5C21.4 21.25 20.4 18.8 20.1 18.15C19.8 17.55 19.45 17.5 19.1 17.5Z"
        fill="white"
        transform="translate(0, -2)"
      />
    </svg>
  );
}

export default function WhatsAppButton({
  message = "Bonjour, je souhaite en savoir plus sur Los Leones.",
  variant = "inline",
  className = "",
}: WhatsAppButtonProps) {
  const url = `https://wa.me/${contactInfo.whatsappNumber}?text=${encodeURIComponent(
    message,
  )}`;

  if (variant === "floating") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contacter Los Leones sur WhatsApp"
        className={`fixed bottom-6 right-6 z-50 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg transition-transform duration-300 hover:scale-110 ${className}`}
      >
        <WhatsAppIcon size={80} />
      </a>
    );
  }

  if (variant === "outline") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contacter Los Leones sur WhatsApp"
        className={`flex items-center gap-2 rounded-md border border-white/20 px-4 py-2 text-sm font-medium text-white transition hover:border-white/40 ${className}`}
      >
        <WhatsAppIcon size={22} />
        WHATSAPP
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contacter Los Leones sur WhatsApp"
      className={`flex items-center gap-2 text-sm text-neutral-300 transition hover:text-orange-500 ${className}`}
    >
      <WhatsAppIcon size={22} />
      WhatsApp
    </a>
  );
}
