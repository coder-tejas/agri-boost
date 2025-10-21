import { useTranslations } from "next-intl";
import { MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormData, formSchema } from "../../_types/FormSchema";
import FormField from "../FormField";

interface LocationStepProps {
  formData: Partial<FormData>;
  updateFormData: (field: keyof FormData, value: string | number) => void;
  errors?: { [key: string]: string };
}

const LocationStep = ({ formData, updateFormData, errors = {} }: LocationStepProps) => {
  const t = useTranslations("crop-analysis.questionnaire");

  return (
    <Card>
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="flex items-center text-xl sm:text-2xl">
          <MapPin className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-primary flex-shrink-0" />
          <span className="break-words">{t("step1.title")}</span>
        </CardTitle>
        <CardDescription className="text-base sm:text-lg">
          {t("step1.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {Object.entries(formSchema.Farmer).map(([key, config]) => (
            <FormField
              key={key}
              fieldKey={key as keyof FormData}
              config={config}
              value={formData[key as keyof FormData] ?? ""}
              onChange={updateFormData}
              error={errors[key]}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationStep;