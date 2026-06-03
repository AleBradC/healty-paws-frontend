import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ApolloProviderWrapper } from "./ApolloProviderWrapper";
import { Header } from "./components/features/Header/Header";
import { AuthenticationProvider } from "./context/AuthenticationContext";
import { Loading } from "./components/ui/Loading/Loading";
import { Footer } from "./components/features/Footer/Footer";
import { ProtectedRoute } from "./router/ProtectedRoute/ProtectedRoute";
import { PublicRoute } from "./router/PublicRoute/PublicRoute";

const HomePage = lazy(() => import("./pages/home/HomePage"));
const DoctorsPage = lazy(() => import("./pages/doctors/DoctorsPage"));
// Auth Pages
const LoginPage = lazy(() => import("./pages/auth/login/LoginPage"));
const RegisterRolePage = lazy(
  () => import("./pages/auth/register/RegisterRolePage"),
);
const RegisterDoctorPage = lazy(
  () => import("./pages/auth/register/RegisterDoctorPage"),
);
const RegisterOwnerPage = lazy(
  () => import("./pages/auth/register/RegisterOwnerPage"),
);

const ResetPasswordPage = lazy(
  () => import("./pages/auth/register/ResetPasswordPage"),
);
// Dashboard Pages
const DoctorDashboardPage = lazy(
  () => import("./pages/dashboard/doctor/DoctorDashboardPage"),
);
const OwnerDashboardPage = lazy(
  () => import("./pages/dashboard/owner/OwnerDashboardPage"),
);

// Appointment & Patient Pages
const AppointmentDetailsPage = lazy(
  () => import("./pages/appointment-details/AppointmentDetailsPage"),
);
const AppointmentSummaryPage = lazy(
  () => import("./pages/appointment-summary/AppointmentSummaryPage"),
);
const PatientSummaryPage = lazy(
  () => import("./pages/patient-summary/PatientSummaryPage"),
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
                <Route path="/" element={<HomePage />} />
                <Route element={<PublicRoute />}>
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
                    path="/auth/reset-password"
                    element={<ResetPasswordPage />}
                  />
                </Route>

                {/* Any authenticated user — both owners and doctors. */}
                <Route element={<ProtectedRoute />}>
                  <Route
                    path="/appointment-summary/:appointmentId"
                    element={<AppointmentSummaryPage />}
                  />
                </Route>

                {/* Owner-only. */}
                <Route element={<ProtectedRoute allowedRoles={["owner"]} />}>
                  <Route path="/doctors" element={<DoctorsPage />} />
                  <Route
                    path="/dashboard/owner"
                    element={<OwnerDashboardPage />}
                  />
                </Route>

                {/* Doctor-only. */}
                <Route element={<ProtectedRoute allowedRoles={["doctor"]} />}>
                  <Route
                    path="/dashboard/doctor"
                    element={<DoctorDashboardPage />}
                  />
                  <Route
                    path="/appointment-details/:appointmentId"
                    element={<AppointmentDetailsPage />}
                  />
                  <Route
                    path="/patient-summary/:petId"
                    element={<PatientSummaryPage />}
                  />
                </Route>

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
