# Navique – AI-Powered Indoor Navigation System

Navique is an AI-powered indoor navigation web application designed to help visitors navigate complex indoor environments such as shopping malls and hospitals. It provides interactive multi-floor maps, intelligent place search, accessible route planning, and emergency assistance features to make indoor navigation easier, safer, and more convenient.

## 🌟 Key Features

### 🗺️ Smart Indoor Navigation
- Interactive indoor maps for shopping malls and hospitals.
- Multi-floor navigation with floor selection.
- Search for places, facilities, and important locations.
- View detailed information about selected places.
- Find routes between the current location and destination.
- Shortest-path navigation using Dijkstra's algorithm.

### ♿ Accessible Navigation
- Wheelchair-friendly route planning.
- Avoids stairs and escalators when accessible alternatives are available.
- Uses accessible lifts and pathways.
- Considers blocked paths and restricted areas during route calculation.

### 🤖 AI Navigation Assistant
- AI-powered navigation assistance using the Google Gemini API.
- Helps users find locations and understand navigation options.
- Supports multiple languages.
- Includes a rule-based fallback assistant when the AI service is unavailable.

### 🚨 Emergency Assistance
- Emergency assistance interface.
- Safe exit finder for emergency evacuation.
- SOS assistance demonstration.
- Emergency alerts and danger-zone visualization.
- Routes that consider blocked paths and danger zones.

### 📍 QR Checkpoint Demonstration
- Predefined QR checkpoint locations.
- Demonstrates location updates using checkpoint selection.
- Helps simulate indoor positioning during navigation.

### 🌐 Multilingual Support
- English
- Telugu
- Hindi

## 🏢 Supported Buildings

Navique currently includes two demonstration environments:

| Building | Floors |
|---|---|
| Navique Shopping Mall | Ground Floor – 3rd Floor |
| City Care Hospital | Ground Floor – 3rd Floor |

Each building has its own indoor map and location data.

## 🛠️ Tech Stack

**Frontend**
- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- Lucide React
- Motion

**Backend**
- Node.js
- Express.js
- TypeScript
- Google Gemini API

**Algorithms**
- Dijkstra's Shortest Path Algorithm
- Graph-based pathfinding
- Accessibility-aware route calculation

## 📂 Project Structure

```text
Navique/
│
├── backend/
│   ├── routes/
│   │   └── assistant.ts
│   ├── services/
│   │   └── geminiService.ts
│   └── app.ts
│
├── frontend/
│   └── src/
│       ├── components/
│       ├── data/
│       ├── services/
│       ├── types/
│       ├── utils/
│       └── App.tsx
│
├── public/
│   └── assets/
│       └── maps/
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── server.ts
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## ⚙️ Getting Started

Follow these steps to run Navique locally.

### 1. Clone the Repository

```bash
git clone https://github.com/sasiddiq-07/Navique.git
```

### 2. Navigate to the Project Folder

```bash
cd Navique
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the project root using `.env.example` as a reference.

Add your Google Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key
```

Replace `your_gemini_api_key` with your actual API key.

Get your API key from [Google AI Studio](https://aistudio.google.com/).

**Important:** Never upload your actual API key or `.env` file to GitHub.

### 5. Start the Development Server

```bash
npm run dev
```

Open the local URL displayed in your terminal to access Navique.

## 🧪 Available Commands

| Command | Description |
|---|---|
| `npm install` | Installs project dependencies |
| `npm run dev` | Starts the development server |
| `npm run lint` | Runs the linting checks |
| `npm run build` | Builds the frontend for production |
| `npm run start` | Starts the Node.js application |

## 🧭 How Navigation Works

Navique represents indoor locations as nodes in a graph and the available paths between them as edges.

1. The user selects a building and floor.
2. The user searches for a destination.
3. The application identifies the starting point and destination.
4. Dijkstra's algorithm calculates a suitable route.
5. Accessibility preferences and restricted paths are considered during route calculation.
6. The application displays the route on the interactive indoor map.

## 🔐 Environment Variables

| Variable | Purpose |
|---|---|
| `GEMINI_API_KEY` | API key used for Google Gemini integration |

Refer to `.env.example` for the environment configuration used by the project.

## 🚀 Future Enhancements

- Real-time indoor positioning.
- Actual camera-based QR code scanning.
- Live emergency service integration.
- Admin dashboard for managing building maps and locations.
- More buildings and indoor environments.
- Additional language support.
- Real-time updates for temporary closures and restricted areas.

## 📌 Project Scope

Navique is currently a working prototype with predefined building maps and demonstration workflows.

The QR checkpoint feature uses predefined checkpoint selections rather than live camera scanning. Emergency alerts and SOS assistance demonstrate the intended user experience and are not connected to real emergency services.

AI-generated assistance is provided to support navigation and does not replace official emergency instructions.

## 👨‍💻 Contributors

**Siddiq** – Project Development

_Add other team members and their contributions here._

## 📄 License

This project is developed for educational and demonstration purposes. Add a license to this repository if you intend to distribute or reuse the project under specific terms.

---

<p align="center">
  <strong>Navique – Navigate Indoors. Move Smarter. Stay Safer.</strong>
</p>
  "suggestEmergencyExit": false
}
```
