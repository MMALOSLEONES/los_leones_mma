import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-7xl font-extrabold text-white sm:text-9xl">404</p>
      <h1 className="mt-4 text-2xl font-extrabold tracking-wide text-orange-500 sm:text-3xl">
        YOU LEFT THE CAGE.
      </h1>
      <p className="mt-4 max-w-sm text-neutral-400">
        Cette page n&apos;existe pas ou plus. Retourne sur le terrain
        connu.
      </p>
      <Button href="/" className="mt-8">
        RETOURNER AU CLUB
      </Button>
    </main>
  );
}
