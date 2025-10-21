import { useState } from "react";
import { zodSchema, FormData } from "../_types/FormSchema";
import { ZodError } from "zod";

interface ValidationErrors {
  [key: string]: string;
}

export const useFormValidation = () => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateField = (field: keyof FormData, value: any): string | null => {
    try {
      zodSchema.shape[field].parse(value);
      return null;
    } catch (error) {
      if (error instanceof ZodError) {
        return "Invalid value";
      }
      return "Validation error";
    }
  };

  const validateForm = (data: Partial<FormData>): boolean => {
    try {
      zodSchema.parse(data);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: ValidationErrors = {};
        error.issues.forEach((err:any) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
        return false;
      }
      return false;
    }
  };

  const validateStep = (step: number, data: Partial<FormData>): boolean => {
    const fieldsToValidate: (keyof FormData)[][] = [
      ["location", "state", "landSize", "soilType"], // Step 1
      ["cropType", "previousYield", "targetYield", "budget"], // Step 2
      ["irrigationMethod", "fertilizerUse", "pestIssues"], // Step 3
      [], // Step 4 - optional fields
    ];

    const fields = fieldsToValidate[step - 1];
    const newErrors: ValidationErrors = {};
    let isValid = true;

    fields.forEach((field) => {
      const error = validateField(field, data[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const clearError = (field: keyof FormData) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const clearAllErrors = () => {
    setErrors({});
  };

  return {
    errors,
    validateField,
    validateForm,
    validateStep,
    clearError,
    clearAllErrors,
  };
};