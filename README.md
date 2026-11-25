# Navique — Smart Indoor Navigation Platform

Navique is a full-stack indoor wayfinding web application built for complex multi-floor venues such as shopping malls and hospitals. Visitors can browse interactive floor maps, search across all floors, generate step-by-step routes (including step-free wheelchair routing), test simulated emergency evacuations, and ask a multilingual AI assistant for directions in English, Telugu, or Hindi.

## Project Structure

```text
├── frontend/
│   └── src/
│       ├── components/         # Interactive map canvas, workspace, landing page, AI panel, modals
│       ├── data/               # Multi-floor graph datasets (Mall & Hospital) and translations
│       ├── services/           # Assistant API client with offline rule-based fallback
│       ├── types/              # Shared TypeScript interfaces
│       ├── utils/              # Multi-floor Dijkstra pathfinding engine
│       ├── App.tsx
│       ├── index.css
│       └── main.tsx
├── backend/
│   ├── routes/
│   │   └── assistant.ts        # POST /api/assistant endpoint and payload validation
│   ├── services/
│   │   └── geminiService.ts    # Server-side Gemini model integration
│   └── app.ts                  # Express server setup and Vite/static asset wiring
├── public/
│   └── assets/maps/            # Cleaned 4-floor architectural maps for Mall & Hospital
├── index.html
├── server.ts                   # Application entry point
└── vite.config.ts
```

## Key Features

- **Two Independent 4-Floor Venues**: Dedicated interactive maps, directories, and corridor graphs for **Navique Shopping Mall** (GF–3F) and **City Care Hospital** (GF–3F).
- **Multi-Floor Pathfinding**: Dijkstra-based routing across corridors, lifts, escalators, and stairs with distance and walking-time estimates.
- **Wheelchair-Friendly Routing**: Step-free mode recalculates routes to avoid stairs and escalators, routing exclusively via accessible lifts and corridors.
- **Emergency Evacuation & SOS Demo**: Interactive hazard scenarios with danger-zone overlays, blocked-corridor avoidance, nearest safe-exit routing, and a simulated SOS request flow.
- **QR Checkpoint Positioning**: Predefined building QR checkpoints to quickly set your current floor and location.
- **Multilingual Support (EN / తెలుగు / हिन्दी)**: Localized interface labels, floor directories, turn-by-turn directions, and AI assistant responses.

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment variables**

   ```bash
   cp .env.example .env
   ```

   Add your `GEMINI_API_KEY` in `.env` to enable live LLM responses on `/api/assistant`. If no API key is configured, the frontend automatically falls back to the built-in offline building assistant.

3. **Run in development**

   ```bash
   npm run dev
   ```

   Open `http://localhost:3000`.

4. **Type-check & build for production**

   ```bash
   npm run lint
   npm run build
   ```

## API Reference

### `POST /api/assistant`

Accepts a visitor question along with active building context (current location, language, wheelchair mode, emergency scenario, and place directory) and returns a grounded navigation response:

```json
{
  "reply": "Apollo Pharmacy is located on Ground Floor (GF)...",
  "targetPlaceId": "mall_gf_apollo",
  "suggestEmergencyExit": false
}
```
