"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation"; // 💡 Modification 1 : Ajout de useParams
import FormField from "@/components/candidater/FormField";

export default function LoginPage() {
  const router = useRouter();
  
  const params = useParams(); // 💡 Modification 2 : Récupérer le paramètre de langue
  const locale = params?.locale || "fr";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Connexion impossible.");
      }

      // 💡 Modification 3 : Rediriger vers /fr/dashboard ou /en/dashboard dynamiquement
      router.push(`/${locale}/dashboard`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Une erreur est survenue."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-md border border-white/10 bg-neutral-950 p-8">
        <p className="text-xs font-semibold tracking-[0.3em] text-orange-500">
          LOS LEONES
        </p>
        <h1 className="mt-3 text-2xl font-extrabold text-white">
          ESPACE AGENT
        </h1>
        <p className="mt-2 text-sm text-neutral-400">
          Connexion réservée à l&apos;administration.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <FormField
            label="Email"
            type="email"
            required
            value={email}
            onChange={setEmail}
            placeholder="agent@losleones-mma.sn"
          />
          <FormField
            label="Mot de passe"
            type="password"
            required
            value={password}
            onChange={setPassword}
          />

          {error && (
            <div className="rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || !email || !password}
            className="w-full rounded-md bg-orange-500 px-6 py-3 text-xs font-bold tracking-widest text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting ? "CONNEXION..." : "SE CONNECTER"}
          </button>
        </form>
      </div>
    </main>
  );
}
