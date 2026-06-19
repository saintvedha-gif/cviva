// src/App.jsx
import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams } from "react-router-dom";
import GlobalStyles from "./GlobalStyles";
import { AuthProvider } from "./hooks/useAuth";

import Nav from "./components/Nav";
import Ticker from "./components/Ticker";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Demo from "./components/Demo";
import Stats from "./components/Stats";
import Pricing from "./components/Pricing";
import FAQ from "./components/FAQ";
import CTAFinal from "./components/CTAFinal";
import Footer from "./components/Footer";

import LoginPage from "./components/auth/LoginPage";
import RegisterPage from "./components/auth/RegisterPage";
import ForgotPasswordPage from "./components/auth/ForgotPasswordPage";
import UpdatePasswordPage from "./components/auth/UpdatePasswordPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ConfirmPage from "./components/auth/ConfirmPage";

import PricingPage from "./components/PricingPage";
import CheckoutSuccess from "./components/checkout/CheckoutSuccess";

import DashboardLayout from "./components/dashboard/DashboardLayout";
import DashboardHome from "./components/dashboard/DashboardHome";
import CVListPage from "./components/dashboard/CVListPage";
import CVEditorPage from "./components/dashboard/CVEditorPage";
import CVPreviewPage from "./components/dashboard/CVPreviewPage";
import AnalyticsPage from "./components/dashboard/AnalyticsPage";
import SettingsPage from "./components/dashboard/SettingsPage";
import InteractiveCVPage from "./components/cv/InteractiveCVPage";

const LandingPage = ({ mode, toggleMode }) => {
  const navigate = useNavigate();
  return (
    <>
      <Nav mode={mode} toggleMode={toggleMode} />
      <Ticker />
      <Hero />
      <Features />
      <Demo />
      <Stats />
      <Pricing onSelectPlan={() => navigate("/pricing")} />
      <FAQ />
      <CTAFinal />
      <Footer />
    </>
  );
};

const DashboardWrapper = ({ mode, toggleMode, title, children }) => (
  <ProtectedRoute>
    <DashboardLayout mode={mode} toggleMode={toggleMode} title={title}>
      {children}
    </DashboardLayout>
  </ProtectedRoute>
);

// Wrapper que extrae el :id de la URL y lo pasa como key al CVEditorPage.
// Esto fuerza que React desmonte y remonte el componente cada vez que
// cambia el ID del CV, resolviendo el bug donde el editor no se limpiaba
// al navegar de un CV a otro o al crear uno nuevo.
const CVEditorWrapper = ({ mode, toggleMode }) => {
  const { id } = useParams();
  return (
    <DashboardWrapper mode={mode} toggleMode={toggleMode} title={id ? "Editar CV" : "Nuevo CV"}>
      <CVEditorPage key={id || "new"} />
    </DashboardWrapper>
  );
};

export default function App() {
  const [mode, setMode] = useState("dark");
  const toggleMode = () => setMode(m => m === "dark" ? "light" : "dark");

  return (
    <BrowserRouter>
      <GlobalStyles mode={mode} />
      <AuthProvider>
        <Routes>
          {/* Landing */}
          <Route path="/" element={<LandingPage mode={mode} toggleMode={toggleMode} />} />

          {/* Auth */}
          <Route path="/auth/login"           element={<LoginPage />} />
          <Route path="/auth/register"        element={<RegisterPage />} />
          <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/auth/update-password" element={<UpdatePasswordPage />} />
          <Route path="/auth/confirm"         element={<ConfirmPage />} />

          {/* Pagos */}
          <Route path="/pricing"          element={<PricingPage />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />

          {/* CV público — accesible sin login */}
          <Route path="/cv/:slug" element={<InteractiveCVPage />} />

          {/* Dashboard */}
          <Route path="/dashboard" element={
            <DashboardWrapper mode={mode} toggleMode={toggleMode} title="Dashboard">
              <DashboardHome />
            </DashboardWrapper>
          } />

          <Route path="/dashboard/cvs" element={
            <DashboardWrapper mode={mode} toggleMode={toggleMode} title="Mis CVs">
              <CVListPage />
            </DashboardWrapper>
          } />

          {/* Editor con key dinámica — fix navegación rota */}
          <Route path="/dashboard/cvs/new"       element={<CVEditorWrapper mode={mode} toggleMode={toggleMode} />} />
          <Route path="/dashboard/cvs/:id/edit"  element={<CVEditorWrapper mode={mode} toggleMode={toggleMode} />} />

          <Route path="/dashboard/preview" element={
            <DashboardWrapper mode={mode} toggleMode={toggleMode} title="Vista previa">
              <CVPreviewPage />
            </DashboardWrapper>
          } />

          <Route path="/dashboard/analytics" element={
            <DashboardWrapper mode={mode} toggleMode={toggleMode} title="Analíticas">
              <AnalyticsPage />
            </DashboardWrapper>
          } />

          <Route path="/dashboard/settings" element={
            <DashboardWrapper mode={mode} toggleMode={toggleMode} title="Configuración">
              <SettingsPage />
            </DashboardWrapper>
          } />

          {/* Catch-all → home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}