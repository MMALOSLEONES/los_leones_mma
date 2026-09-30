const steps = [
  { number: "01", label: "Informations" },
  { number: "02", label: "Profil sportif" },
  { number: "03", label: "Motivation" },
  { number: "04", label: "Vérification" },
];

export default function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div>
      <div className="grid grid-cols-4 gap-2">
        {steps.map((step, index) => {
          const stepNum = index + 1;
          const filled = stepNum <= currentStep;
          return (
            <div
              key={step.number}
              className={`h-[2px] w-full ${filled ? "bg-orange-500" : "bg-white/15"}`}
            />
          );
        })}
      </div>
      <div className="mt-3 grid grid-cols-4 gap-2">
        {steps.map((step, index) => {
          const stepNum = index + 1;
          const isActive = stepNum === currentStep;
          return (
            <div key={step.number}>
              <p
                className={`text-xs font-bold ${
                  isActive ? "text-orange-500" : "text-neutral-600"
                }`}
              >
                {step.number}
              </p>
              <p
                className={`text-xs ${
                  isActive ? "text-white" : "text-neutral-600"
                }`}
              >
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
