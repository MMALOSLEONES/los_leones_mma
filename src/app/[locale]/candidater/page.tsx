"use client";

import { useState } from "react";
import {
  ApplicationFormData,
  initialApplicationData,
} from "@/components/types/application";
import StepIndicator from "@/components/candidater/StepIndicator";
import StepInformations from "@/components/candidater/StepInformations";
import StepProfilSportif from "@/components/candidater/StepProfilSportif";
import StepPhoto from "@/components/candidater/StepPhoto";
import StepVerification from "@/components/candidater/StepVerification";
import ConfirmationScreen from "@/components/candidater/ConfirmationScreen";

export default function CandidaterPage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<ApplicationFormData>(initialApplicationData);
  const [submitted, setSubmitted] = useState(false);
  const [referenceCode, setReferenceCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const update = (fields: Partial<ApplicationFormData>) => {
    setData((prev) => ({ ...prev, ...fields }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError("");

    try {
      // Le fichier ne peut pas passer dans du JSON : on envoie un formulaire
      // "multipart" avec les champs d'un côté et la photo de l'autre.
      const { photo, ...fields } = data;
      const body = new FormData();
      body.append("data", JSON.stringify(fields));
      if (photo) body.append("photo", photo);

      // Pas de header Content-Type : le navigateur l'ajoute avec le bon séparateur
      const response = await fetch("/api/candidatures", { method: "POST", body });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || `Erreur serveur (${response.status}).`);
      }

      setReferenceCode(result.referenceCode ?? "");
      setSubmitted(true);
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

  if (submitted) {
    return (
      <main className="mx-auto max-w-3xl px-4 lg:px-8">
        <ConfirmationScreen referenceCode={referenceCode} />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 lg:px-8">
      <p className="text-xs font-semibold tracking-[0.3em] text-orange-500">CANDIDATURE</p>
      <h1 className="mt-3 text-4xl font-extrabold text-white sm:text-5xl">DEVENIR UN LEONE</h1>
      <p className="mt-3 text-sm text-neutral-400">
        Moins de 5 minutes. Aucun compte à créer. Réservé aux personnes majeures.
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
          <StepInformations data={data} update={update} onNext={() => setStep(2)} />
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
          />
        )}
      </div>
    </main>
  );
}
