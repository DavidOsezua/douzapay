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
            index < currentStep ? "" : "bg-dark-stroke-3"
          }`}
          style={
            index < currentStep
              ? {
                  background:
                    "linear-gradient(128.62deg, #E3F7FF 11.02%, #D3BBF1 93.11%)",
                }
              : undefined
          }
        />
      ))}
    </div>
  );
};

export default StepIndicator;
