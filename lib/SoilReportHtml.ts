
export function generateSoilReportHTML(analysisData: any): string {
  const {
    soil_summary,
    recommended_crops,
    fertilizer_plan,
    pesticide_plan,
    irrigation_strategy,
    soil_improvement_plan,
    sustainability_practices,
    climate_specific_tips,
    confidence_score,
    estimated_yield_increase_percent,
  } = analysisData;

  return `
  <html>
    <head>
      <title>Soil Health Report</title>
      <style>
        body {
          font-family: "Segoe UI", Arial, sans-serif;
          margin: 0;
          padding: 32px;
          color: #1a1a1a;
          background: #fafafa;
        }
        h1, h2, h3 {
          color: #2b4a2f;
          margin-bottom: 8px;
        }
        h1 {
          border-bottom: 3px solid #8bc34a;
          padding-bottom: 8px;
          font-size: 28px;
        }
        .section {
          background: #fff;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        ul {
          margin: 0;
          padding-left: 20px;
        }
        li {
          margin-bottom: 6px;
        }
        .badge {
          display: inline-block;
          background: #e0f2f1;
          color: #00796b;
          padding: 4px 10px;
          border-radius: 6px;
          font-weight: 600;
        }
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 10px;
        }
        .footer {
          text-align: center;
          margin-top: 32px;
          font-size: 13px;
          color: #777;
        }
      </style>
    </head>
    <body>
      <h1>Soil Health Analysis Report</h1>

      <div class="section">
        <h2>Overview</h2>
        <p><strong>Confidence Score:</strong> ${confidence_score || "N/A"}%</p>
        <p><strong>Estimated Yield Increase:</strong> ${estimated_yield_increase_percent || "N/A"}%</p>
      </div>

      <div class="section">
        <h2>Soil Summary</h2>
        <div class="summary-grid">
          <p><strong>pH:</strong> ${soil_summary?.pH || "N/A"}</p>
          <p><strong>Nutrient Balance:</strong> ${soil_summary?.nutrient_balance || "N/A"}</p>
          <p><strong>Organic Carbon:</strong> ${soil_summary?.organic_carbon || "N/A"}</p>
          <p><strong>Key Observations:</strong> ${soil_summary?.key_observations || "N/A"}</p>
        </div>
      </div>

      <div class="section">
        <h2>Recommended Crops</h2>
        <ul>
          ${recommended_crops
            ?.map(
              (c: any) =>
                `<li><strong>${c.crop}</strong> – ${c.reason}</li>`
            )
            .join("") || "<li>No data available</li>"}
        </ul>
      </div>

      <div class="section">
        <h2>Fertilizer Plan</h2>
        <ul>
          ${fertilizer_plan
            ?.map(
              (f: any) => `
              <li>
                <strong>${f.type}</strong> (${f.quantity_per_acre}) – 
                <em>${f.application_stage}</em><br/>
                <small>${f.rationale}</small>
              </li>`
            )
            .join("") || "<li>No data available</li>"}
        </ul>
      </div>

      <div class="section">
        <h2>Pesticide Plan</h2>
        <ul>
          ${pesticide_plan
            ?.map(
              (p: any) => `
              <li>
                <strong>${p.pest}</strong><br/>
                Recommended: ${p.recommended_pesticide}<br/>
                <em>${p.application_method}</em><br/>
                <small>${p.safety_notes}</small>
              </li>`
            )
            .join("") || "<li>No data available</li>"}
        </ul>
      </div>

      <div class="section">
        <h2>Irrigation Strategy</h2>
        <p><strong>Recommended Method:</strong> ${irrigation_strategy?.recommended_method || "N/A"}</p>
        <p><strong>Frequency:</strong> ${irrigation_strategy?.frequency || "N/A"}</p>
        <p><strong>Water Saving Tips:</strong> ${irrigation_strategy?.water_saving_tips || "N/A"}</p>
      </div>

      <div class="section">
        <h2>Soil Improvement Plan</h2>
        <ul>
          ${soil_improvement_plan
            ?.map(
              (m: any) =>
                `<li><strong>${m.method}</strong> – ${m.benefit}</li>`
            )
            .join("") || "<li>No data available</li>"}
        </ul>
      </div>

      <div class="section">
        <h2>Sustainability Practices</h2>
        <ul>
          ${sustainability_practices
            ?.map(
              (s: any) =>
                `<li><strong>${s.practice}</strong> – ${s.benefit}</li>`
            )
            .join("") || "<li>No data available</li>"}
        </ul>
      </div>

      <div class="section">
        <h2>Climate-Specific Tips</h2>
        <ul>
          ${climate_specific_tips
            ?.map(
              (t: any) =>
                `<li><strong>${t.tip}</strong> – ${t.description}</li>`
            )
            .join("") || "<li>No data available</li>"}
        </ul>
      </div>

      <div class="footer">
        Generated by <strong>AgriBoost AI</strong> | Empowering Smarter Farming Decisions 🌱
      </div>
    </body>
  </html>
  `;
}