import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormData, formSchema } from "../../_types/FormSchema";
import FormField from "../FormField";
import FormSummary from "../FormSummary";

interface ReviewStepProps {
  formData: Partial<FormData>;
  updateFormData: (field: keyof FormData, value: string | number) => void;
  errors?: { [key: string]: string };
}

const ReviewStep = ({ formData, updateFormData, errors = {} }: ReviewStepProps) => {
  const t = useTranslations("crop-analysis.questionnaire");

  return (
    <Card>
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-xl sm:text-2xl">
          {t("step4.title")}
        </CardTitle>
        <CardDescription className="text-base sm:text-lg">
          {t("step4.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
        {Object.entries(formSchema.AdditionalInfo ?? {}).map(([key, config]) => (
          <FormField
            key={key}
            fieldKey={key as keyof FormData}
            config={config}
            value={formData[key as keyof FormData] ?? ""}
            onChange={updateFormData}
            fullWidth
            error={errors[key]}
          />
        ))}

        <FormSummary formData={formData} />
      </CardContent>
    </Card>
  );
};

export default ReviewStep;