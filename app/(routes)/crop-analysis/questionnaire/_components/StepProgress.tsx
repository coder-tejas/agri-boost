import { useTranslations } from "next-intl";
import { Progress } from "@/components/ui/progress";

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  progressValue: number;
}

const StepProgress = ({ currentStep, totalSteps, progressValue }: StepProgressProps) => {
  const t = useTranslations("crop-analysis.questionnaire");

  return (
    <div className="mb-4 sm:mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs sm:text-sm font-medium text-foreground">
          {t("progress.stepOf", {
            current: currentStep,
            total: totalSteps,
          })}
        </span>
        <span className="text-xs sm:text-sm text-muted-foreground">
          {t("progress.percentComplete", {
            percent: Math.round(progressValue),
          })}
        </span>
      </div>
      <Progress value={progressValue} className="h-2" />
    </div>
  );
};

export default StepProgress;