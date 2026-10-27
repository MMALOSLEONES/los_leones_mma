"use client";

import { btnOutline } from "@/components/dashboard/fields";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="rounded-md border border-red-500/40 bg-red-500/10 p-6">
      <h2 className="font-bold text-red-400">Impossible de charger cette page</h2>
      <p className="mt-2 text-sm text-neutral-400">{error.message}</p>
      <p className="mt-2 text-xs text-neutral-500">
        Vérifie que Laravel tourne et que la route appelée existe.
      </p>
      <button onClick={reset} className={`${btnOutline} mt-4`}>
        RÉESSAYER
      </button>
    </div>
  );
}
