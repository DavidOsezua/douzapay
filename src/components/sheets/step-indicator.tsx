interface StepIndicatorProps {
  totalSteps: number;
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  totalSteps,
  currentStep,
}) => {
  return (
    <div className="flex items-center gap-2.5">
      {Array.from({ length: totalSteps }, (_, index) => (
        <div
          key={index}
          className={`h-2 w-14 rounded-full ${
            index < currentStep ? "bg-dark-primary-main" : "bg-dark-stroke-3"
          }`}
        />
      ))}
    </div>
  );
};

export default StepIndicator;
