import { inngest } from "./client";
import { GoogleGenAI } from "@google/genai"
import * as dotenv from "dotenv"
import { deleteFromImagekit, uploadToImagekit } from "@/services/UploadFile";
import { db } from "@/configs/db";
import { userSoilAnalysis } from "@/configs/schema";
import moment from "moment";
dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  // apiEndpoint: "https://asia-south1-aiplatform.googleapis.com"
});

export const GenerateCropYeild = inngest.createFunction(
  { id: "ai/generate-crop-yield" },
  { event: "ai/generate-crop-yield" },
  async ({ event, step }) => {
    const { userName, userEmail, soil_test_file, other_data } = event.data
    console.log("Event.data", event.data);

    const uploadImageUrls = await step.run("UploadImage", async () => {
      let soil_test_file_url
      if (soil_test_file !== null) {
        soil_test_file_url = await uploadToImagekit(soil_test_file, `soil_test_file _${userName}`);

        return soil_test_file_url?.url;
      }
      return soil_test_file_url
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
        contents: prompt,
      });

      const rawText =
        response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

      const cleaned = rawText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      let parsed;
      try {
        parsed = JSON.parse(cleaned);
      } catch (e) {
        console.error("LLM returned invalid JSON:", cleaned);
        throw new Error("Gemini returned malformed JSON");
      }

      return parsed;
    });

    const SaveToDB = await step.run("SaveToDB", async () => {
      try {
        const result = await db.insert(userSoilAnalysis).values(
          {
            soilTestData: uploadImageUrls,
            FieldData: other_data,
            analysis: GeneratePrediction,
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
    //     const deleteImage = await step.run("DeleteImage", async () => {
    //   if (soil_test_file !== null) {
    //     await deleteFromImagekit(soil_test_file); // or fileId
    //     return true;
    //   }
    //   return false;
    // });

    return {
      analysis: GeneratePrediction
    };

  }


)

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    const message = await step.run("get-message", async () => {
      return `Hello ${event.data.email}!`;
    });
    return message;
  }
);
export const helloWorldlonger = inngest.createFunction(
  { id: "hello-worldlonger" },
  { event: "test/hello.worldlonger" },
  async ({ event, step }) => {
    // 1. Wait for 50 seconds
    await step.sleep("wait-a-moment", "50s");

    // 2. Continue with the logic
    const jsondata = {
      "analysis": {
        "climate_specific_tips": [
          {
            "reason": "Accurate weather data helps in timely irrigation, pest/disease management, and optimizing planting/harvesting schedules. Given the lack of specific location data, this is critical for localized decision-making.",
            "tip": "Monitor local weather patterns closely (rainfall, temperature, humidity)."
          },
          {
            "reason": "Choosing climate-appropriate varieties minimizes risk and enhances yield stability, especially important in variable climates.",
            "tip": "Select crop varieties resilient to common local climate stresses (e.g., drought, heat, specific pest pressures)."
          }
        ],
        "confidence_score": 75,
        "estimated_yield_increase_percent": "25-45%",
        "fertilizer_plan": [
          {
            "application_stage": "Basal (1/3), V6 stage (1/3), Tasseling/Flowering (1/3)",
            "quantity_per_acre": "60-80 kg/acre (split application)",
            "rationale": "Soil Nitrogen is critically low (246 kg/ha or ~100 kg/acre). Split application improves uptake efficiency and reduces leaching, crucial for crops like Maize. Adjust based on specific crop needs and leaf color charts.",
            "type": "Nitrogen (Urea or CAN)"
          },
          {
            "application_stage": "Basal application at planting",
            "quantity_per_acre": "25-30 kg P2O5/acre (approx. 55-65 kg DAP/acre)",
            "rationale": "Phosphorus is medium (13.5 kg/ha or ~5.5 kg/acre). Ensuring adequate P is essential for root development and energy transfer, especially for early crop establishment. Apply as basal since P is less mobile in soil.",
            "type": "Phosphorus (DAP or SSP)"
          },
          {
            "application_stage": "Basal or split (50% basal, 50% at flowering)",
            "quantity_per_acre": "30-40 kg K2O/acre (approx. 50-65 kg MOP/acre)",
            "rationale": "Potassium is medium (176 kg/ha or ~71 kg/acre). It's vital for water regulation, disease resistance, and fruit/grain filling. Maintaining optimal K levels will support overall crop health and yield.",
            "type": "Potassium (Muriate of Potash - MOP)"
          },
          {
            "application_stage": "Basal or early vegetative stage (soil); Vegetative stage (foliar)",
            "quantity_per_acre": "5-10 kg/acre (or 0.5% foliar spray)",
            "rationale": "Zinc is critically low (0.46 ppm). This is a major limiting factor. Basal application is preferred, but foliar sprays can offer quick relief, especially in alkaline soils where Zn availability is reduced.",
            "type": "Zinc (Zinc Sulfate)"
          },
          {
            "application_stage": "Basal or early vegetative stage (soil); Vegetative stage (foliar)",
            "quantity_per_acre": "1-2 kg/acre (or 0.25% foliar spray)",
            "rationale": "Copper is critically low (0.35 ppm). Copper deficiency can severely impact photosynthesis and lignin formation. Similar to Zinc, basal application is recommended, with foliar options for rapid correction.",
            "type": "Copper (Copper Sulfate)"
          },
          {
            "application_stage": "Basal application",
            "quantity_per_acre": "10-15 kg/acre",
            "rationale": "Sulfur is medium (12.0 ppm). Important for protein synthesis and oil production. Applying a maintenance dose, especially if growing oilseed crops, is beneficial.",
            "type": "Sulfur (Gypsum or elemental S)"
          }
        ],
        "irrigation_strategy": {
          "frequency": "Based on soil moisture sensors and crop evapotranspiration needs, typically 2-3 times per week during peak growth.",
          "recommended_method": "Drip Irrigation or Micro-sprinklers",
          "water_saving_tips": "Implement drip irrigation to minimize water loss and apply water directly to the root zone. Incorporate significant organic matter to improve soil water holding capacity. Mulch around plants to reduce evaporation. Schedule irrigation based on actual plant needs rather than fixed intervals."
        },
        "pesticide_plan": [
          {
            "application_method": "Scouting and Threshold-based application",
            "pest": "General Crop Pests (e.g., stem borers, aphids)",
            "recommended_pesticide": "Integrated Pest Management (IPM) approach",
            "safety_notes": "Prioritize cultural practices (crop rotation, resistant varieties), biological control (beneficial insects), and mechanical methods. Use chemical pesticides only when pest thresholds are crossed. Always read and follow label instructions, wear PPE, and ensure proper disposal."
          },
          {
            "application_method": "Pre-emergence or Post-emergence, inter-cultivation",
            "pest": "Weeds",
            "recommended_pesticide": "Herbicides (e.g., Atrazine for Maize, Glyphosate for no-till pre-emergence) + Cultural practices",
            "safety_notes": "Combine chemical control with manual weeding, mulching, and proper spacing to minimize herbicide use. Avoid herbicide resistance by rotating herbicide modes of action. Ensure drift management and operator safety."
          }
        ],
        "recommended_crops": [
          {
            "crop": "Maize (Corn)",
            "reason": "Maize is a high-demand crop responsive to Nitrogen, which is low in your soil. It also benefits significantly from Zinc supplementation, which is critically low. With proper fertilization and organic matter addition, it can yield well. Wheat is another strong alternative."
          },
          {
            "crop": "Soybean or other Legumes",
            "reason": "Legumes fix atmospheric nitrogen, which can help replenish soil N. While they don't *add* much N for the subsequent crop in the first year, they reduce the need for external N during their growth. They are also relatively tolerant to slightly alkaline soils and will benefit from improved P, K, and micronutrient balance. Ensure adequate Phosphorus, Potassium, Zinc, and Copper."
          }
        ],
        "soil_improvement_plan": [
          {
            "benefit": "Significantly increases organic carbon (current 0.51% is low), improves soil structure, water retention, nutrient availability, and microbial activity. Buffers pH.",
            "duration": "Annual application for at least 3-5 years for noticeable long-term improvement.",
            "method": "Addition of Farmyard Manure (FYM) or Compost"
          },
          {
            "benefit": "Adds organic matter, fixes atmospheric nitrogen, improves soil structure, and reduces weed growth.",
            "duration": "Incorporate green manure crops (e.g., Dhaincha, Sunnhemp, Cowpea) into crop rotation every 2-3 years, terminating before flowering.",
            "method": "Green Manuring with Legumes"
          },
          {
            "benefit": "Retains organic matter, reduces soil erosion, conserves moisture, and improves soil structure over time. Reduces tillage costs.",
            "duration": "Continuous practice over multiple cropping cycles (5+ years) for significant benefits.",
            "method": "Crop Residue Management / No-Till Farming"
          },
          {
            "benefit": "While 7.3 is only slightly alkaline, specific crops might prefer slightly acidic. Increasing organic matter naturally buffers pH and improves micronutrient availability. If reduction is required, use elemental sulfur judiciously.",
            "duration": "Ongoing monitoring, with gradual adjustments over several seasons.",
            "method": "pH Management (if needed for specific crops)"
          }
        ],
        "soil_summary": {
          "key_observations": "The soil is non-saline (EC 0.70 dS/m). The primary limitations are very low organic carbon, low nitrogen, and critical deficiencies in zinc and copper. Addressing these will be crucial for improving fertility and overall soil health.",
          "nutrient_balance": "Low Nitrogen, Medium Phosphorus, Medium Potassium, Low Zinc, Low Copper. Other micronutrients (S, Fe, Mn, B) are in medium range. The slightly alkaline pH may reduce the availability of some micronutrients.",
          "organic_carbon": "0.51% (Low). This indicates poor soil structure, reduced water holding capacity, and limited microbial activity.",
          "pH": "7.3 (Slightly Alkaline)"
        },
        "sustainability_practices": [
          {
            "impact": "Breaks pest and disease cycles, improves soil fertility (especially with legumes), utilizes different nutrient profiles, and enhances biodiversity.",
            "practice": "Crop Rotation (e.g., Legume-Cereal-Vegetable cycle)"
          },
          {
            "impact": "Protects soil from erosion, suppresses weeds, adds organic matter, conserves soil moisture, and can scavenge residual nutrients, preventing leaching.",
            "practice": "Cover Cropping"
          },
          {
            "impact": "Combines organic (FYM, compost, green manure) and inorganic fertilizers, optimizing nutrient use efficiency, reducing chemical dependency, and improving soil health.",
            "practice": "Integrated Nutrient Management (INM)"
          },
          {
            "impact": "Ensures water availability, especially during dry spells, and reduces reliance on external water sources, leading to more sustainable irrigation.",
            "practice": "Water Harvesting and Conservation"
          }
        ]
      }
    }
    const message = await step.run("get-message", async () => {
      return jsondata;
    });

    return message;
  }
);

