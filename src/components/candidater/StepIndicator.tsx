const steps = [
  { number: "01", label: "Informations" },
  { number: "02", label: "Profil sportif" },
  { number: "03", label: "Photo" },
  { number: "04", label: "Vérification" },
];

export default function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div>
      <div className="grid grid-cols-4 gap-2">
        {steps.map((step, index) => (
          <div
            key={step.number}
            className={`h-[2px] w-full ${
              index + 1 <= currentStep ? "bg-orange-500" : "bg-white/15"
            }`}
          />
        ))}
      </div>
      <div className="mt-3 grid grid-cols-4 gap-2">
        {steps.map((step, index) => {
          const isActive = index + 1 === currentStep;
          return (
            <div key={step.number}>
              <p className={`text-xs font-bold ${isActive ? "text-orange-500" : "text-neutral-600"}`}>
                {step.number}
              </p>
              <p className={`text-xs ${isActive ? "text-white" : "text-neutral-600"}`}>
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
