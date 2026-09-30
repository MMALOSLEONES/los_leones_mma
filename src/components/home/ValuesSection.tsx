const values = [
  {
    title: "DISCIPLINE",
    description: "La progression commence par la discipline.",
  },
  {
    title: "FORCE",
    description: "Développer son corps et son mental.",
  },
  {
    title: "RESPECT",
    description: "Respecter ses partenaires, ses coachs et ses adversaires.",
  },
  {
    title: "DÉTERMINATION",
    description: "Continuer même lorsque le combat devient difficile.",
  },
];

export default function ValuesSection() {
  return (
    <section className="border-y border-white/10 bg-neutral-950">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
        {values.map((value) => (
          <div key={value.title} className="bg-black px-6 py-12">
            <span className="text-xs font-bold tracking-widest text-orange-500">
              0{values.indexOf(value) + 1}
            </span>
            <h3 className="mt-4 text-lg font-bold text-white">
              {value.title}
            </h3>
            <p className="mt-2 text-sm text-neutral-400">
              {value.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
