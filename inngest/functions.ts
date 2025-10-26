import { inngest } from "./client";
import { GoogleGenAI } from "@google/genai"
import * as dotenv from "dotenv"
import { uploadToImagekit } from "@/services/UploadFile";
import { db } from "@/configs/db";
import { userSoilAnalysis } from "@/configs/schema";
import moment from "moment";
dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  // apiEndpoint: "https://asia-south1-aiplatform.googleapis.com"
});

export const GenerateCropYeild = inngest.createFunction(
  { id: "ai/generate-crop-yeild" },
  { event: "ai/generate-crop-yeild" },
  async ({ event, step }) => {
    const { userName, userEmail, soil_test_file, other_data } = event.data
    console.log("Event.data",event.data);
    
    const uploadImageUrls = await step.run("UploadImage", async () => {
      if (soil_test_file !== null) {
        const soil_test_file_url = await uploadToImagekit(soil_test_file, `soil_test_file _${userName}`);

        return soil_test_file_url?.url;
      }
      return null
    })

    const prompt = `
    **Prompt for Gemini API**

You are an advanced agricultural AI advisor specializing in precision farming and soil-based decision-making.
 Your task is to analyze the given soil health card (image link) and provided contextual data about the farm to generate comprehensive, 
 data-driven recommendations for improving crop yield, soil health, and sustainability.
 **IMPORTANT INFO**
 The land size is in acer
 The Target and Previous yield is in quitals/acre
 The Budget is in Rupees

---
**Input Data:**

* **Soil Health Card (ImageKit URL):** ${uploadImageUrls}
* **Other Data : ** ${other_data}
---
**Your Task:**
1. Analyze the soil health card image — extract relevant metrics like pH, organic carbon, NPK levels, micronutrient content, salinity, etc.
2. Combine it with the contextual data to form a clear picture of the farm's current condition.
3. Predict and recommend the following for maximum yield and sustainability:
---
** Output (in JSON format only ) no other things, just json or nothing:**
{
  "soil_summary": {
    "pH": "",
    "nutrient_balance": "",
    "organic_carbon": "",
    "key_observations": ""
  },
  "recommended_crops": [
    { "crop": "", "reason": "" },
    { "crop": "", "reason": "" }
  ],
  "fertilizer_plan": [
    { "type": "", "quantity_per_acre": "", "application_stage": "", "rationale": "" }
  ],
  "pesticide_plan": [
    { "pest": "", "recommended_pesticide": "", "application_method": "", "safety_notes": "" }
  ],
  "irrigation_strategy": {
    "recommended_method": "",
    "frequency": "",
    "water_saving_tips": ""
  },
  "soil_improvement_plan": [
    { "method": "", "benefit": "", "duration": "" }
  ],
  "climate_specific_tips": [
    { "tip": "", "reason": "" }
  ],
  "sustainability_practices": [
    { "practice": "", "impact": "" }
  ],
  "estimated_yield_increase_percent": "",
  "confidence_score": "(not text only numbers ) in % or marks"
}


**Additional Notes for the Model:**

* Focus on local climate compatibility and long-term soil health, not just short-term yield.
* Mention organic or low-cost alternatives where applicable.
* If soil data is missing or unclear, infer logically from context and location.
* Be concise, factual, and actionable—avoid generic advice.
* Recommendations should be regionally realistic and scientifically backed.
`
    console.log(prompt);

    const GeneratePrediction = await step.run("GeneratePrediction", async () => {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
      });
      console.log(response);
      return response;
    })
    const SaveToDB = await step.run("SaveToDB", async () => {
      try {
        const result = await db.insert(userSoilAnalysis).values(
          {
            soilTestData: uploadImageUrls,
            FieldData: other_data,
            SoilAnaysisData: GeneratePrediction,
            userEmail: userEmail,
            createdOn: moment().format("YYYY-MM-DD"),

          }
        ).returning()
        return result
      } catch (error) {
        console.error("Database insert error", error);
        throw new Error(`Failed to insert data in db ${error}`);
      }
    })
    return GeneratePrediction;

  }


)