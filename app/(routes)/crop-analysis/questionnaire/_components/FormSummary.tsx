import { useTranslations } from "next-intl";
import { FormData } from "../_types/FormSchema";

interface FormSummaryProps {
  formData: Partial<FormData>;
}

const FormSummary = ({ formData }: FormSummaryProps) => {
  const t = useTranslations("crop-analysis.questionnaire");

  const summaryItems = [
    {
      label: t("step4.summary.location"),
      value: `${formData.location}, ${formData.state}`,
    },
    {
      label: t("step4.summary.landSize"),
      value: `${formData.landSize} ${t("step4.summary.acres")}`,
    },
    {
      label: t("step4.summary.cropType"),
      value: formData.cropType,
    },
    {
      label: t("step4.summary.soilType"),
      value: formData.soilType,
    },
    {
      label: t("step4.summary.irrigation"),
      value: formData.irrigationMethod,
    },
    {
      label: t("step4.summary.fertilizerUse"),
      value: formData.fertilizerUse,
    },
    {
      label: t("step4.summary.targetYield"),
      value: formData.targetYield,
    },
    {
      label: t("step4.summary.budget"),
      value: `₹${formData.budget}`,
    },
  ];

  const leftColumn = summaryItems.slice(0, 4);
  const rightColumn = summaryItems.slice(4);

  return (
    <div className="bg-accent p-4 sm:p-6 rounded-lg">
      <h4 className="font-semibold text-base sm:text-lg text-accent-foreground mb-3">
        {t("step4.summary.title")}
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
        <div className="space-y-2">
          {leftColumn.map((item, index) => (
            <p key={index} className="break-words">
              <strong>{item.label}:</strong> {item.value}
            </p>
          ))}
        </div>
        <div className="space-y-2">
          {rightColumn.map((item, index) => (
            <p key={index} className="break-words">
              <strong>{item.label}:</strong> {item.value}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FormSummary;