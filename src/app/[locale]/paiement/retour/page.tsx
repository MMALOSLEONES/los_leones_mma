
"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

type PaymentStatus =
  | "verification"
  | "reussi"
  | "echoue"
  | "erreur";

export default function PaiementRetourPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const locale = params.locale === "en" ? "en" : "fr";
  const demandeId = searchParams.get("demande_id");

  const [status, setStatus] = useState<PaymentStatus>("verification");

  useEffect(() => {
    if (!demandeId) {
      setStatus("erreur");
      return;
    }

    let cancelled = false;
    let attempts = 0;
    let timeout: ReturnType<typeof setTimeout>;

    const verifyPayment = async () => {
      if (cancelled) return;

      attempts++;

      try {
        const response = await fetch(
          `/api/payments/status/${encodeURIComponent(demandeId)}`,
          { cache: "no-store" }
        );

        const result = await response.json();

        if (cancelled) return;

        if (result.confirmed === true || result.payment_status === "reussi") {
          setStatus("reussi");
          return;
        }

        if (result.payment_status === "echoue") {
          setStatus("echoue");
          return;
        }

        if (result.payment_status === "absent") {
          setStatus("erreur");
          return;
        }

        if (attempts >= 12) {
          setStatus("erreur");
          return;
        }
      } catch (error) {
        console.error("Erreur de vérification du paiement :", error);

        if (attempts >= 12) {
          setStatus("erreur");
          return;
        }
      }

      timeout = setTimeout(verifyPayment, 3000);
    };

    verifyPayment();

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [demandeId]);

  const content = {
    fr: {
      verification: {
        label: "VÉRIFICATION DU PAIEMENT",
        title: "UN INSTANT...",
        message: "Nous vérifions la confirmation de ton paiement.",
      },
      reussi: {
        label: "PAIEMENT VALIDÉ",
        title: "CANDIDATURE CONFIRMÉE",
        message:
          "Ton paiement a bien été reçu. Ta candidature est enregistrée et sera examinée par notre équipe.",
      },
      echoue: {
        label: "PAIEMENT NON CONFIRMÉ",
        title: "PAIEMENT ÉCHOUÉ",
        message:
          "Nous n'avons pas pu confirmer ton paiement. Tu peux retourner à la page précédente pour réessayer.",
      },
      erreur: {
        label: "VÉRIFICATION IMPOSSIBLE",
        title: "UN PROBLÈME EST SURVENU",
        message:
          "Nous ne pouvons pas confirmer ton paiement pour le moment. Ne soumets pas une nouvelle candidature. Contacte notre équipe si le problème persiste.",
      },
    },
    en: {
      verification: {
        label: "PAYMENT VERIFICATION",
        title: "PLEASE WAIT...",
        message: "We are checking your payment confirmation.",
      },
      reussi: {
        label: "PAYMENT CONFIRMED",
        title: "APPLICATION CONFIRMED",
        message:
          "Your payment has been received. Your application is registered and will be reviewed by our team.",
      },
      echoue: {
        label: "PAYMENT NOT CONFIRMED",
        title: "PAYMENT FAILED",
        message:
          "We could not confirm your payment. You can return to the previous page and try again.",
      },
      erreur: {
        label: "VERIFICATION UNAVAILABLE",
        title: "SOMETHING WENT WRONG",
        message:
          "We cannot confirm your payment right now. Do not submit another application. Contact our team if the problem persists.",
      },
    },
  };

  const text = content[locale][status];

  return (
    <main className="min-h-screen bg-[#050505] text-[#f5f5f5] flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-2xl text-center">
        <div className="mb-16">
          <p className="text-3xl font-black tracking-[0.2em]">
            LOS LEONES
          </p>
          <p className="mt-2 text-xs tracking-[0.4em] text-[#ff6500]">
            MMA CLUB
          </p>
        </div>

        <div className="border-y border-white/15 py-16">
          <p className="text-xs font-semibold tracking-[0.3em] text-[#ff6500]">
            {text.label}
          </p>

          {status === "verification" && (
            <div className="mx-auto my-10 h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-[#ff6500]" />
          )}

          {status === "reussi" && (
            <div className="my-10 text-4xl text-[#ff6500]">✓</div>
          )}

          {status === "echoue" && (
            <div className="my-10 text-4xl text-[#ff6500]">!</div>
          )}

          {status === "erreur" && (
            <div className="my-10 text-4xl text-[#ff6500]">!</div>
          )}

          <h1 className="text-3xl md:text-5xl font-black tracking-tight">
            {text.title}
          </h1>

          <p className="mx-auto mt-6 max-w-lg text-sm leading-7 text-white/60">
            {text.message}
          </p>
        </div>

        <p className="mt-10 text-[10px] tracking-[0.2em] text-white/40">
          MMA LOS LEONES — DISCIPLINE · FORCE · RESPECT
        </p>
      </div>
    </main>
  );
}
