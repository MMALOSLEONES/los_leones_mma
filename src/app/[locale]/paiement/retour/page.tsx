import PaymentReturn from "@/components/paiement/PaymentReturn";

export default async function PaymentReturnPage({
  searchParams,
}: {
  searchParams: Promise<{ demande_id?: string }>;
}) {
  const { demande_id } = await searchParams;

  return <PaymentReturn demandeId={demande_id ?? null} />;
}