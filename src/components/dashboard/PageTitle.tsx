export default function PageTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-8">
      <p className="text-xs font-semibold tracking-[0.3em] text-orange-500">
        {eyebrow}
      </p>
      <h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">
        {title}
      </h1>
      {description && (
        <p className="mt-2 text-sm text-neutral-400">{description}</p>
      )}
    </div>
  );
}
