// components/Stepper.tsx
import { useTranslations } from "next-intl";
import { Progress } from "@/components/ui/progress";

interface StepperProps {
  activeIndex: number;
}

export const Stepper = ({ activeIndex }: StepperProps) => {
  const t = useTranslations("crop-analysis.upload.stepper");
  const steps = [
    { label: t("step1") },
    { label: t("step2") },
    { label: t("step3") },
  ];

  return (
    <div className="mb-6 md:mb-8">
      {/* Desktop/Tablet Stepper */}
      <div className="hidden sm:block">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, idx) => (
            <div
              key={step.label}
              className={`flex items-center space-x-2 ${
                idx > activeIndex ? "opacity-50" : ""
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                  idx === activeIndex
                    ? "bg-gradient-to-br from-primary-500 to-secondary-600 text-white"
                    : "bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400"
                }`}
              >
                {idx + 1}
              </div>
              <span
                className={`font-semibold text-sm md:text-base ${
                  idx === activeIndex
                    ? "text-primary-600 dark:text-primary-400"
                    : "text-neutral-500 dark:text-neutral-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Stepper */}
      <div className="sm:hidden">
        <div className="flex items-center justify-center mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-semibold bg-gradient-to-br from-primary-500 to-secondary-600 text-white">
              {activeIndex + 1}
            </div>
            <span className="font-semibold text-primary-600 dark:text-primary-400">
              {steps[activeIndex].label}
            </span>
          </div>
        </div>
        <div className="text-center text-xs text-neutral-500 dark:text-neutral-400 mb-3">
          Step {activeIndex + 1} of {steps.length}
        </div>
      </div>

      <Progress
        value={((activeIndex + 1) / steps.length) * 100}
        className="h-2"
      />
    </div>
  );
};