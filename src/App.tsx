import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ApolloProviderWrapper } from "./ApolloProviderWrapper";
import { Header } from "./components/Header/Header";
import { AuthenticationProvider } from "./context/AuthenticationContext";
import { Loading } from "./components/Loading/Loading";
import { Footer } from "./components/Footer/Footer";

const HomePage = lazy(() => import("./pages/home/HomePage"));
const DoctorsPage = lazy(() => import("./pages/doctors/DoctorsPage"));
// Auth Pages
const LoginPage = lazy(() => import("./pages/auth/login/LoginPage"));
const RegisterRolePage = lazy(
  () => import("./pages/auth/register/RegisterRolePage")
);
const RegisterDoctorPage = lazy(
  () => import("./pages/auth/register/RegisterDoctorPage")
);
const RegisterOwnerPage = lazy(
  () => import("./pages/auth/register/RegisterOwnerPage")
);
const RegistrationSuccessPage = lazy(
  () => import("./pages/auth/register/RegistrationSuccessPage")
);
const ResetPasswordPage = lazy(
  () => import("./pages/auth/register/ResetPasswordPage")
);
// Dashboard Pages
const DoctorDashboardPage = lazy(
  () => import("./pages/dashboard/doctor/DoctorDashboardPage")
);
const PatientDashboardPage = lazy(
  () => import("./pages/dashboard/owner/PatientDashboardPage")
);

// Appointment & Patient Pages
const AppointmentDetailsPage = lazy(
  () => import("./pages/appointment-details/AppointmentDetailsPage")
);
const AppointmentSummaryPage = lazy(
  () => import("./pages/appointment-summary/AppointmentSummaryPage")
);
const PatientSummaryPage = lazy(
  () => import("./pages/patient-summary/PatientSummaryPage")
);

function App() {
  return (
    <ApolloProviderWrapper>
      <BrowserRouter>
        <AuthenticationProvider>
          <Header />

          <main>
            <Suspense
              fallback={
                <Loading
                  isLoading={true}
                  message="Loading..."
                  variant="fullscreen"
                  minDuration={1000}
                />
              }
            >
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/doctors" element={<DoctorsPage />} />

                {/* Auth Routes */}
                <Route path="/auth/login" element={<LoginPage />} />
                <Route path="/auth/register" element={<RegisterRolePage />} />
                <Route
                  path="/auth/register/doctor"
                  element={<RegisterDoctorPage />}
                />
                <Route
                  path="/auth/register/owner"
                  element={<RegisterOwnerPage />}
                />
                <Route
                  path="/auth/register/success"
                  element={<RegistrationSuccessPage />}
                />
                <Route
                  path="/auth/reset-password"
                  element={<ResetPasswordPage />}
                />

                {/* Protected Dashboard Routes */}
                <Route
                  path="/dashboard/doctor"
                  element={<DoctorDashboardPage />}
                />
                <Route
                  path="/dashboard/owner"
                  element={<PatientDashboardPage />}
                />

                {/* Detailed Views */}
                <Route
                  path="/appointment-summary/:appointmentId"
                  element={<AppointmentSummaryPage />}
                />
                <Route
                  path="/appointment-details/:appointmentId"
                  element={<AppointmentDetailsPage />}
                />
                <Route
                  path="/patient-summary/:petId"
                  element={<PatientSummaryPage />}
                />

                <Route
                  path="*"
                  element={
                    <div
                      style={{
                        padding: "4rem",
                        textAlign: "center",
                        color: "var(--color-text)",
                      }}
                    >
                      <h2>404</h2>
                      <p>Page Not Found</p>
                    </div>
                  }
                />
              </Routes>
            </Suspense>
          </main>

          <Footer />
        </AuthenticationProvider>
      </BrowserRouter>
    </ApolloProviderWrapper>
  );
}

export default App;
