# Healthy Paws - Frontend

The frontend application for the Healthy Paws platform, built with React, Vite, and GraphQL.

## 🚀 Tech Stack

- **Core:** React 19, TypeScript
- **Build Tool:** Vite 7
- **API Communication:** Apollo Client (GraphQL)
- **Routing:** React Router 7
- **Testing:** Vitest, React Testing Library

---

## 🛠️ Getting Started

This application can be run standalone for development or as part of the [Healthy Paws Wrapper](https://github.com/AleBradC/healthy-paws-wrapper) which orchestrates the backend and Nginx gateway.

### Prerequisites

- **Node.js:** v20 or later (v23.6.0 recommended)
- **npm:** v10 or later

### Setup Options

#### Option A: Running with Docker (Recommended)
If you want to run the full stack (Frontend + Backend + DB), use the [Wrapper Repository](https://github.com/AleBradC/healthy-paws-wrapper):
```bash
docker-compose up --build
```

#### Option B: Standalone Development

1. Navigate to the project directory:
   ```bash
   cd healty-paws-frontend
   ```
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
   *Note: `--legacy-peer-deps` is required due to specific version requirements for the testing suite.*

### Running the App

- **Development Mode:**
  ```bash
  npm run dev
  ```
  The application will be available at `http://localhost:5173`.
  *Note: When running standalone, it will attempt to connect to the backend at `http://localhost:8080` or via the gateway if configured.*

- **Build for Production:**
  ```bash
  npm run build
  ```

- **Preview Production Build:**
  ```bash
  npm run preview
  ```

---

## 🧪 Testing and Quality

- **Run all tests:** `npm test`
- **Watch mode:** `npm run test:watch`
- **Linting:** `npm run lint`

---

## ⚙️ CI/CD

- **Frontend CI:** Automatically lint, test, and build the project on every push to the `dev` branch.
- **Security Audit:** Runs `npm audit` on every push to detect vulnerabilities.
- **Dependabot:** Automatically checks for dependency updates weekly.
