import { FormData } from "../_types/FormSchema";
import LocationStep from "./steps/LocationStep";
import SoilStep from "./steps/SoilStep";
import YieldStep from "./steps/YeildStep";
import ReviewStep from "./steps/ReviewStep";

interface StepContentProps {
  currentStep: number;
  formData: Partial<FormData>;
  updateFormData: (field: keyof FormData, value: string | number) => void;
  errors?: { [key: string]: string };
}

const StepContent = ({ 
  currentStep, 
  formData, 
  updateFormData,
  errors = {}
}: StepContentProps) => {
  switch (currentStep) {
    case 1:
      return <LocationStep formData={formData} updateFormData={updateFormData} errors={errors} />;
    case 2:
      return <SoilStep formData={formData} updateFormData={updateFormData} errors={errors} />;
    case 3:
      return <YieldStep formData={formData} updateFormData={updateFormData} errors={errors} />;
    case 4:
      return <ReviewStep formData={formData} updateFormData={updateFormData} errors={errors} />;
    default:
      return null;
  }
};

export default StepContent;