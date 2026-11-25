
"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import {
  ApplicationFormData,
  initialApplicationData,
} from "@/components/types/application";
import StepIndicator from "@/components/candidater/StepIndicator";
import StepInformations from "@/components/candidater/StepInformations";
import StepProfilSportif from "@/components/candidater/StepProfilSportif";
import StepPhoto from "@/components/candidater/StepPhoto";
import StepVerification from "@/components/candidater/StepVerification";

type PaymentRail = "sn_wave" | "sn_orange";

export default function CandidaterPage() {
  const locale = useLocale();

  const [step, setStep] = useState(1);
  const [data, setData] =
    useState<ApplicationFormData>(initialApplicationData);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [paymentRail, setPaymentRail] = useState<
    PaymentRail | ""
  >("");

  // Conserve l'identifiant pour pouvoir réessayer le paiement
  // sans enregistrer une nouvelle candidature.
  const [demandeId, setDemandeId] = useState<string | null>(null);

  const update = (fields: Partial<ApplicationFormData>) => {
    setData((prev) => ({ ...prev, ...fields }));
  };

  const handleSubmit = async () => {
    if (!paymentRail) {
      setSubmitError("Veuillez choisir un moyen de paiement.");
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      let currentDemandeId = demandeId;

      // 1. Enregistrer la candidature uniquement si elle
      // n'a pas déjà été créée.
      if (!currentDemandeId) {
        const { photos, videos, ...fields } = data;
        const body = new FormData();

        body.append("data", JSON.stringify(fields));

        photos.forEach((photoFile, index) => {
          body.append(`photos[${index}]`, photoFile);
        });

        videos.forEach((videoFile, index) => {
          body.append(`videos[${index}]`, videoFile);
        });

        const response = await fetch("/api/candidatures", {
          method: "POST",
          body,
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            result.message ||
              `Erreur lors de l'enregistrement (${response.status}).`
          );
        }

        // Le contrôleur Laravel retourne l'identifiant dans data.id.
        currentDemandeId = result.data?.id;

        if (!currentDemandeId) {
          throw new Error(
            "La candidature a été enregistrée, mais son identifiant est introuvable."
          );
        }

        setDemandeId(currentDemandeId);
      }

      // 2. Initialiser le paiement auprès de 221 Pay.
      const paymentResponse = await fetch("/api/payments/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          demande_id: currentDemandeId,
          locale,
          rail: paymentRail,
        }),
      });

      const paymentResult = await paymentResponse
        .json()
        .catch(() => ({}));

      if (!paymentResponse.ok) {
        throw new Error(
          paymentResult.message ||
            "Impossible d'initialiser le paiement. Vous pouvez réessayer."
        );
      }

      // 3. Rediriger vers la page de paiement 221 Pay.
      if (!paymentResult.payment_url) {
        throw new Error(
          "Le lien de paiement n'a pas été retourné par le serveur."
        );
      }

      window.location.href = paymentResult.payment_url;
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue. Réessaie dans quelques instants."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 lg:px-8">
      <p className="text-xs font-semibold tracking-[0.3em] text-orange-500">
        CANDIDATURE
      </p>

      <h1 className="mt-3 text-4xl font-extrabold text-white sm:text-5xl">
        DEVENIR UN LEONE
      </h1>

      <p className="mt-3 text-sm text-neutral-400">
        Moins de 5 minutes. Aucun compte à créer. Réservé aux personnes
        majeures.
      </p>

      <div className="mt-10 border-t border-white/10 pt-8">
        <StepIndicator currentStep={step} />
      </div>

      {submitError && (
        <div className="mt-8 rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {submitError}
        </div>
      )}

      <div className="mt-10">
        {step === 1 && (
          <StepInformations
            data={data}
            update={update}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <StepProfilSportif
            data={data}
            update={update}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}

        {step === 3 && (
          <StepPhoto
            data={data}
            update={update}
            onNext={() => setStep(4)}
            onBack={() => setStep(2)}
          />
        )}

        {step === 4 && (
          <StepVerification
            data={data}
            update={update}
            onBack={() => setStep(3)}
            onGoToStep={setStep}
            onSubmit={handleSubmit}
            submitting={submitting}
            paymentRail={paymentRail}
            onPaymentRailChange={setPaymentRail}
          />
        )}
      </div>
    </main>
  );
}
