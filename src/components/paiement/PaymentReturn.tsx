"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

type PaymentState = "loading" | "success" | "pending" | "failed" | "error";

export default function PaymentReturn({
  demandeId,
}: {
  demandeId: string | null;
}) {
  const t = useTranslations("Payment.return");
  const confirmation = useTranslations("Payment.confirmation");
  const locale = useLocale();

  const [state, setState] = useState<PaymentState>("loading");
  const [errorMessage, setErrorMessage] = useState("");

  const checkPayment = useCallback(async () => {
    if (!demandeId) {
      setState("error");
      setErrorMessage(t("errors.invalidReference"));
      return;
    }

    setState("loading");
    setErrorMessage("");

    try {
      const response = await fetch(
        `/api/payments/status/${encodeURIComponent(demandeId)}`,
        { cache: "no-store" }
      );

      const data = await response.json();

      if (!response.ok) {
        setState("error");
        setErrorMessage(
          response.status === 404
            ? t("errors.notFound")
            : t("errors.server")
        );
        return;
      }

      if (data.confirmed === true && data.payment_status === "reussi") {
        setState("success");
      } else if (data.payment_status === "echoue") {
        setState("failed");
      } else if (
        data.payment_status === "initie" ||
        data.payment_status === "absent"
      ) {
        setState("pending");
      } else {
        setState("error");
        setErrorMessage(t("errors.server"));
      }
    } catch {
      setState("error");
      setErrorMessage(t("errors.server"));
    }
  }, [demandeId, t]);

  useEffect(() => {
    checkPayment();
  }, [checkPayment]);

  const isLoading = state === "loading";

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#050505] px-5 py-20">
      <div className="w-full max-w-xl border border-white/10 bg-[#0b0b0b] px-6 py-12 text-center sm:px-12">
        <p className="mb-5 text-xs font-semibold tracking-[0.3em] text-[#ff6500]">
          {state === "success"
            ? confirmation("eyebrow")
            : t("eyebrow")}
        </p>

        {isLoading && (
          <>
            <div className="mx-auto mb-8 h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-[#ff6500]" />
            <h1 className="text-2xl font-bold uppercase text-white">
              {t("title")}
            </h1>
            <p className="mt-4 text-sm leading-7 text-white/60">
              {t("loading")}
            </p>
          </>
        )}

        {state === "success" && (
          <>
            <div className="mx-auto mb-7 flex h-14 w-14 items-center justify-center rounded-full border border-[#ff6500] text-2xl text-[#ff6500]">
              ✓
            </div>
            <h1 className="text-2xl font-bold uppercase text-white">
              {confirmation("title")}
            </h1>
            <p className="mt-5 text-sm leading-7 text-white/60">
              {confirmation("description")}
            </p>
            <p className="mt-4 text-sm font-semibold text-[#ff6500]">
              {confirmation("processing")}
            </p>
          </>
        )}

        {state === "pending" && (
          <>
            <h1 className="text-2xl font-bold uppercase text-white">
              {t("pendingTitle")}
            </h1>
            <p className="mt-5 text-sm leading-7 text-white/60">
              {t("pendingDescription")}
            </p>
          </>
        )}

        {state === "failed" && (
          <>
            <h1 className="text-2xl font-bold uppercase text-white">
              {t("failedTitle")}
            </h1>
            <p className="mt-5 text-sm leading-7 text-white/60">
              {t("failedDescription")}
            </p>
          </>
        )}

        {state === "error" && (
          <>
            <h1 className="text-2xl font-bold uppercase text-white">
              {t("failedTitle")}
            </h1>
            <p className="mt-5 text-sm leading-7 text-white/60">
              {errorMessage}
            </p>
          </>
        )}

        <div className="mt-10 flex flex-col justify-center gap-3">
          {state !== "success" && (
            <button
              type="button"
              onClick={checkPayment}
              disabled={isLoading}
              className="w-full bg-[#ff6500] px-6 py-4 text-xs font-bold tracking-widest text-black transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t("retry")}
            </button>
          )}

          <a
            href={`/${locale}`}
            className="w-full border border-white/20 px-6 py-4 text-xs font-bold tracking-widest text-white transition hover:border-[#ff6500] hover:text-[#ff6500]"
          >
            {state === "success" ? confirmation("home") : t("home")}
          </a>
        </div>
      </div>
    </main>
  );
}