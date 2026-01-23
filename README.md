# AgriBoost 🌱

AgriBoost is an AI-powered precision agriculture platform that analyzes soil health reports and farm-specific data to generate actionable, data-driven recommendations for improving crop yield, soil health, and long-term sustainability.

The system combines computer vision (for soil card analysis), large language models (Gemini), and an event-driven backend (Inngest) to provide farmers with scientifically grounded insights in a simple, accessible interface.

---

## Key Features

* 📸 Soil Health Card Analysis (image upload + OCR/vision via Gemini)
* 📊 Personalized Crop Yield Prediction
* 🌾 Crop Recommendation Engine
* 🧪 Fertilizer & Nutrient Planning
* 🐛 Pest Management Strategy
* 💧 Irrigation Optimization
* 🌍 Climate-Specific Tips
* ♻️ Sustainability & Soil Improvement Plans
* 📄 PDF Report Generation
* 🔐 Secure Authentication with Clerk
* 🌐 Multi-language Support (next-intl)
* ⚡ Event-driven AI pipeline using Inngest

---

## Architecture Overview

AgriBoost follows a modern event-driven, serverless-friendly architecture:

```
Frontend (Next.js App Router)
      |
      v
/api/results  --->  Inngest Event  --->  AI Pipeline (Gemini)
      |                    |
      |                    v
      |              ImageKit Upload
      |                    |
      v                    v
/api/inngest/status  <---  PostgreSQL (Drizzle ORM)
```

* **Next.js 15 (App Router)** for UI and API routes
* **Clerk** for authentication and session management
* **Inngest** for background job orchestration
* **Google Gemini** for vision + reasoning
* **ImageKit** for secure image storage
* **PostgreSQL + Drizzle ORM** for persistence

---

## Tech Stack

* Framework: Next.js 15, React 18, TypeScript
* Styling: Tailwind CSS, shadcn/ui
* Auth: Clerk
* AI: Google Gemini (Vision + Text)
* Jobs / Workflow: Inngest
* Storage: ImageKit
* Database: PostgreSQL (Drizzle ORM)
* i18n: next-intl
* PDF Generation: Puppeteer

---

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/agri-boost.git
cd agri-boost
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Environment Variables

Create a `.env.local` file:

```env
# Auth
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=

# AI
GEMINI_API_KEY=

# Inngest
INNGEST_SIGNING_KEY=

# Database
DATABASE_URL=

# ImageKit
IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_URL_ENDPOINT=
```

### 4. Run services

```bash
pnpm dev:inngest
```

This runs:

* Next.js app
* Inngest Dev Server (event dashboard)

Open:

* App: [http://localhost:3000](http://localhost:3000)
* Inngest UI: [http://localhost:8288](http://localhost:8288)

---

## AI Pipeline Flow

1. User uploads soil test image + farm details
2. `/api/results` triggers `ai/generate-crop-yield` event
3. Inngest executes steps:

   * Upload image to ImageKit
   * Call Gemini Vision + Text
   * Normalize structured JSON output
   * Store results in PostgreSQL
4. Frontend polls `/api/inngest/status` until completion
5. Results are cached and rendered
6. PDF report can be generated and downloaded

---

## Folder Highlights

```
app/                → Next.js routes & UI
inngest/            → Background workflows
services/           → API clients (ImageKit, Inngest, etc.)
configs/            → DB & schema
components/ui/      → shadcn UI components
lib/                → Utilities & PDF templates
```

---

## Security Model

* Browser authentication handled by Clerk
* Server-to-server communication secured via API keys
* Inngest control-plane never exposed to frontend
* Image uploads use signed URLs
* Dev-only API bypass available for Postman testing

---

## Roadmap

* Real-time weather API integration
* Regional crop price prediction
* Satellite NDVI-based soil health scoring
* Offline-first mobile PWA
* Farmer-to-farmer knowledge graph

---

## License

This project is licensed under the GNU GPL v3.0.

---

AgriBoost is built as a full-stack, production-grade AI system — not a demo — with proper orchestration, security boundaries, and data pipelines suitable for real-world agricultural decision support.
