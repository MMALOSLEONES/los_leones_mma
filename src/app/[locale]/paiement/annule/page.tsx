
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function PaymentCancelPage() {
  const t = useTranslations("Payment.cancel");

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#050505] px-5 py-20">
      <div className="w-full max-w-xl border border-white/10 bg-[#0b0b0b] px-6 py-12 text-center sm:px-12">
        <p className="mb-5 text-xs font-semibold tracking-[0.3em] text-[#ff6500]">
          {t("eyebrow")}
        </p>

        <div className="mx-auto mb-7 flex h-14 w-14 items-center justify-center rounded-full border border-[#ff6500] text-2xl text-[#ff6500]">
          !
        </div>

        <h1 className="text-2xl font-bold uppercase text-white">
          {t("title")}
        </h1>

        <p className="mt-5 text-sm leading-7 text-white/60">
          {t("description")}
        </p>

        <div className="mt-10 flex flex-col justify-center gap-3">
          <Link
            href="/candidater"
            className="w-full bg-[#ff6500] px-6 py-4 text-xs font-bold tracking-widest text-black transition hover:bg-white"
          >
            {t("retry")}
          </Link>

          <Link
            href="/"
            className="w-full border border-white/20 px-6 py-4 text-xs font-bold tracking-widest text-white transition hover:border-[#ff6500] hover:text-[#ff6500]"
          >
            {t("home")}
          </Link>
        </div>
      </div>
    </main>
  );
}