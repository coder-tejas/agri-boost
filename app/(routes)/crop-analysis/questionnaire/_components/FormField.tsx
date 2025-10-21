import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormData, FieldConfig } from "../_types/FormSchema";

interface FormFieldProps {
  fieldKey: keyof FormData;
  config: FieldConfig;
  value: string | number;
  onChange: (field: keyof FormData, value: string | number) => void;
  fullWidth?: boolean;
  error?: string;
}

const FormField = ({ 
  fieldKey, 
  config, 
  value, 
  onChange, 
  fullWidth = false,
  error 
}: FormFieldProps) => {
  const t = useTranslations("crop-analysis.questionnaire");
  const hasError = !!error;

  return (
    <div
      className={`space-y-2 ${
        fullWidth ? "col-span-full md:col-span-2" : ""
      }`}
    >
      <Label
        htmlFor={fieldKey}
        className={`text-sm sm:text-base font-medium ${
          hasError ? "text-destructive" : ""
        }`}
      >
        {t(config.label)}
        {hasError && <span className="ml-1">*</span>}
      </Label>

      {config.type === "select" ? (
        <Select 
          value={String(value)} 
          onValueChange={(val) => onChange(fieldKey, val)}
        >
          <SelectTrigger 
            className={`h-10 sm:h-12 text-sm sm:text-base ${
              hasError ? "border-destructive focus:ring-destructive" : ""
            }`}
          >
            <SelectValue placeholder={t(config.placeholder)} />
          </SelectTrigger>
          <SelectContent>
            {config.options?.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {t(opt.label)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : config.type === "textarea" ? (
        <Textarea
          id={fieldKey}
          placeholder={t(config.placeholder)}
          value={String(value)}
          onChange={(e) => onChange(fieldKey, e.target.value)}
          className={`min-h-24 sm:min-h-32 text-sm sm:text-base ${
            hasError ? "border-destructive focus:ring-destructive" : ""
          }`}
        />
      ) : (
        <Input
          id={fieldKey}
          type={config.type}
          placeholder={t(config.placeholder)}
          value={value}
          onChange={(e) => {
            const val = config.type === "number" ? Number(e.target.value) : e.target.value;
            onChange(fieldKey, val);
          }}
          className={`h-10 sm:h-12 text-sm sm:text-base ${
            hasError ? "border-destructive focus:ring-destructive" : ""
          }`}
        />
      )}

      {hasError && (
        <p className="text-sm text-destructive mt-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;