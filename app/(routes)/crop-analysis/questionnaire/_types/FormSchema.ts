import { z } from "zod";

export const farmerInfoSchema = {
  location: {
    label: "step1.fields.location.label",
    type: "text",
    placeholder: "step1.fields.location.placeholder"
  },
  state: {
    label: "step1.fields.state.label",
    type: "select",
    placeholder: "step1.fields.state.placeholder",
    options: [
      { value: "punjab", label: "step1.fields.state.options.punjab" },
      { value: "haryana", label: "step1.fields.state.options.haryana" },
      { value: "uttarPradesh", label: "step1.fields.state.options.uttarPradesh" },
      { value: "maharashtra", label: "step1.fields.state.options.maharashtra" },
      { value: "gujarat", label: "step1.fields.state.options.gujarat" },
      { value: "rajasthan", label: "step1.fields.state.options.rajasthan" },
      { value: "other", label: "step1.fields.state.options.other" }
    ],
  },
  landSize: {
    label: "step1.fields.landSize.label",
    type: "number",
    placeholder: "step1.fields.landSize.placeholder"
  },
  soilType: {
    label: "step1.fields.soilType.label",
    type: "select",
    placeholder: "step1.fields.soilType.placeholder",
    options: [
      { value: "clay", label: "step1.fields.soilType.options.clay" },
      { value: "sandy", label: "step1.fields.soilType.options.sandy" },
      { value: "loamy", label: "step1.fields.soilType.options.loamy" },
      { value: "silty", label: "step1.fields.soilType.options.silty" },
      { value: "mixed", label: "step1.fields.soilType.options.mixed" }
    ],
  }
} as const;

export const soilInfoSchema = {
  cropType: {
    label: "step2.fields.cropType.label",
    type: "select",
    placeholder: "step2.fields.cropType.placeholder",
    options: [
      { value: "wheat", label: "step2.fields.cropType.options.wheat" },
      { value: "rice", label: "step2.fields.cropType.options.rice" },
      { value: "corn", label: "step2.fields.cropType.options.corn" },
      { value: "cotton", label: "step2.fields.cropType.options.cotton" },
      { value: "sugarcane", label: "step2.fields.cropType.options.sugarcane" },
      { value: "soybeans", label: "step2.fields.cropType.options.soybeans" },
      { value: "vegetables", label: "step2.fields.cropType.options.vegetables" },
      { value: "fruits", label: "step2.fields.cropType.options.fruits" },
      { value: "other", label: "step2.fields.cropType.options.other" }
    ]
  },
  previousYield: {
    label: "step2.fields.previousYield.label",
    type: "number",
    placeholder: "step2.fields.previousYield.placeholder"
  },
  targetYield: {
    label: "step2.fields.targetYield.label",
    type: "number",
    placeholder: "step2.fields.targetYield.placeholder"
  },
  budget: {
    label: "step2.fields.budget.label",
    type: "number",
    placeholder: "step2.fields.budget.placeholder"
  },
} as const;

export const yieldSchema = {
  irrigationMethod: {
    label: "step3.fields.irrigationMethod.label",
    type: "select",
    placeholder: "step3.fields.irrigationMethod.placeholder",
    options: [
      { value: "drip", label: "step3.fields.irrigationMethod.options.drip" },
      { value: "sprinkler", label: "step3.fields.irrigationMethod.options.sprinkler" },
      { value: "flood", label: "step3.fields.irrigationMethod.options.flood" },
      { value: "furrow", label: "step3.fields.irrigationMethod.options.furrow" },
      { value: "rainfed", label: "step3.fields.irrigationMethod.options.rainfed" },
      { value: "mixed", label: "step3.fields.irrigationMethod.options.mixed" }
    ]
  },
  fertilizerUse: {
    label: "step3.fields.fertilizerUse.label",
    type: "select",
    placeholder: "step3.fields.fertilizerUse.placeholder",
    options: [
      { value: "organic", label: "step3.fields.fertilizerUse.options.organic" },
      { value: "chemical", label: "step3.fields.fertilizerUse.options.chemical" },
      { value: "mixed", label: "step3.fields.fertilizerUse.options.mixed" },
      { value: "minimal", label: "step3.fields.fertilizerUse.options.minimal" },
      { value: "none", label: "step3.fields.fertilizerUse.options.none" }
    ]
  },
  pestIssues: {
    label: "step3.fields.pestIssues.label",
    type: "textarea",
    placeholder: "step3.fields.pestIssues.placeholder"
  },
} as const;

export const additionalInfo = {
  additionalInfoField: {
    label: "step4.fields.additionalInfo.label",
    placeholder: "step4.fields.additionalInfo.placeholder",
    type: "textarea",
  }
} as const;

export const formSchema = {
  Farmer: farmerInfoSchema,
  Soil: soilInfoSchema,
  Yield: yieldSchema,
  AdditionalInfo: additionalInfo
} as const;

export const zodSchema = z.object({
  location: z.string().min(1, "Location is required"),
  state: z.string().min(1, "State is required"),
  cropType: z.string().min(1, "Crop type is required"),
  soilType: z.string().min(1, "Soil type is required"),
  landSize: z.coerce.number().positive("Land size must be positive"),
  irrigationMethod: z.string().min(1, "Irrigation method is required"),
  fertilizerUse: z.string().min(1, "Fertilizer use is required"),
  pestIssues: z.string(),
  previousYield: z.coerce.number().nonnegative("Previous yield cannot be negative"),
  targetYield: z.coerce.number().positive("Target yield must be positive"),
  budget: z.coerce.number().positive("Budget must be positive"),
  additionalInfoField: z.string().optional(),
});

export type FormData = z.infer<typeof zodSchema>;

export type FieldConfig = {
  label: string;
  type: "text" | "number" | "select" | "textarea";
  placeholder: string;
  options?: readonly { value: string; label: string }[];
};