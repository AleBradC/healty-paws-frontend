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

### Setup & Running the Project

This project is configured to run exclusively via Docker Compose alongside the backend and database. You should run the full stack using the [Healthy Paws Wrapper](https://github.com/AleBradC/healthy-paws-wrapper) repository.

1. Clone and navigate to the wrapper repository:
   ```bash
   git clone https://github.com/AleBradC/healthy-paws-wrapper.git
   cd healthy-paws-wrapper
   ```
2. Start the entire stack:
   ```bash
   docker-compose up --build
   ```

### Accessing the Application

Once the Docker stack is running, the Nginx gateway routes traffic automatically on port 80:

- **Frontend App:** [http://localhost](http://localhost)
- **Apollo Server (GraphQL Sandbox):** [http://localhost/graphql](http://localhost/graphql)

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
