import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface NavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onSubmit?: () => void;
}

const NavigationButtons = ({
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  onSubmit,
}: NavigationButtonsProps) => {
  const t = useTranslations("crop-analysis.questionnaire");
  const isLastStep = currentStep === totalSteps;
  const isFirstStep = currentStep === 1;

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
      <Button
        variant="outline"
        size="lg"
        onClick={onPrev}
        disabled={isFirstStep}
        className="text-base sm:text-lg px-4 sm:px-6 py-2 sm:py-3 w-full sm:w-auto order-2 sm:order-1"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        {t("buttons.previous")}
      </Button>

      <Button
        variant="ghost"
        size="lg"
        asChild
        className="w-full sm:w-auto order-3 sm:order-2"
      >
        <Link href="/crop-analysis/upload" className="text-sm sm:text-base">
          {t("buttons.backToUpload")}
        </Link>
      </Button>

      {isLastStep ? (
        <Button
          size="lg"
          className="text-base sm:text-lg px-6 sm:px-8 py-2 sm:py-3 w-full sm:w-auto order-1 sm:order-3"
          onClick={onSubmit}
        >
          {t("buttons.submit")}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      ) : (
        <Button
          size="lg"
          onClick={onNext}
          className="text-base sm:text-lg px-6 sm:px-8 py-2 sm:py-3 w-full sm:w-auto order-1 sm:order-3"
        >
          {t("buttons.next")}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      )}
    </div>
  );
};

export default NavigationButtons;