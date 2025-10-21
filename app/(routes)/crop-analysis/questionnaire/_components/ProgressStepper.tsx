import { useTranslations } from "next-intl";
import { Progress } from "@/components/ui/progress";

interface ProgressStepperProps {
  currentStep: number;
}

const ProgressStepper = ({ currentStep }: ProgressStepperProps) => {
  const t = useTranslations("crop-analysis.questionnaire");

  const steps = [
    { id: 1, label: t("stepper.uploadComplete"), completed: true },
    { id: 2, label: t("stepper.fillQuestionnaire"), completed: false },
    { id: 3, label: t("stepper.getResults"), completed: false },
  ];

  return (
    <>
      {/* Desktop/Tablet View */}
      <div className="mb-6 sm:mb-8 hidden sm:block">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step) => {
            const isActive = step.id === currentStep;
            const isCompleted = step.completed;
            const isUpcoming = step.id > currentStep;

            return (
              <div
                key={step.id}
                className={`flex items-center space-x-2 ${
                  isUpcoming ? "opacity-50" : ""
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                    isCompleted
                      ? "bg-primary-400 text-white"
                      : isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isCompleted ? "✓" : step.id}
                </div>
                <span
                  className={`text-sm md:text-base ${
                    isCompleted
                      ? "text-green-800 font-semibold"
                      : isActive
                      ? "font-semibold text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
        <Progress value={66} className="h-2" />
      </div>

      {/* Mobile View */}
      <div className="mb-4 sm:hidden">
        <div className="flex items-center justify-center mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
              {currentStep}
            </div>
            <span className="font-semibold text-primary">
              {steps[currentStep - 1]?.label}
            </span>
          </div>
        </div>
        <div className="text-center text-xs text-muted-foreground mb-3">
          Step {currentStep} of {steps.length}
        </div>
        <Progress value={66} className="h-2" />
      </div>
    </>
  );
};

export default ProgressStepper;