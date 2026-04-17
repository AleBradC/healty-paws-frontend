# Healthy Paws - Frontend

The frontend application for the Healthy Paws platform, built with React, Vite, and GraphQL.

## 🚀 Tech Stack

- **Core:** React 19, TypeScript
- **Build Tool:** Vite 7
- **API Communication:** Apollo Client (GraphQL)
- **Routing:** React Router 7
- **Testing:** Vitest, React Testing Library
- **Linting:** ESLint, Typescript-ESLint

## 🛠️ Getting Started

### Prerequisites

- **Node.js:** v20 or later (v23.6.0 recommended)
- **npm:** v10 or later

### Installation

1. Clone the repository
2. Navigate to the project directory:
   ```bash
   cd healty-paws-frontend
   ```
3. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
   *Note: `--legacy-peer-deps` is recommended due to specific version requirements for the testing suite.*

### Running the App

- **Development Mode:**
  ```bash
  npm run dev
  ```
  The application will be available at `http://localhost:5173`.

- **Build for Production:**
  ```bash
  npm run build
  ```

- **Preview Production Build:**
  ```bash
  npm run preview
  ```

## 🧪 Testing and Quality

- **Run all tests:**
  ```bash
  npm test
  ```
- **Run tests in watch mode:**
  ```bash
  npm run test:watch
  ```
- **Check code linting:**
  ```bash
  npm run lint
  ```

## ⚙️ CI/CD

This project uses **GitHub Actions** for automated testing and security:

- **Frontend CI:** Automatically lint, test, and build the project on every push or PR to the `dev` branch.
- **Security Audit:** Runs `npm audit` on every push to detect high-severity vulnerabilities.
- **Dependabot:** Automatically checks for dependency updates and opens PRs weekly.
