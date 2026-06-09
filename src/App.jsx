// src/App.jsx
import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import ProtectedRoute from "./components/auth/ProtectedRoute";

import DashboardLayout from "./components/dashboard/DashboardLayout";
import DashboardHome from "./components/dashboard/DashboardHome";
import CVListPage from "./components/dashboard/CVListPage";
import CVEditorPage from "./components/dashboard/CVEditorPage";
import CVPreviewPage from "./components/dashboard/CVPreviewPage";
import AnalyticsPage from "./components/dashboard/AnalyticsPage";
import SettingsPage from "./components/dashboard/SettingsPage";
import InteractiveCVPage from "./components/cv/InteractiveCVPage";
import PricingPage from "./components/PricingPage";

const LandingPage = ({ mode, toggleMode }) => (
  <>
    <Nav mode={mode} toggleMode={toggleMode} />
    <Ticker />
    <Hero />
    <Features />
    <Demo />
    <Stats />
    <Pricing />
    <FAQ />
    <CTAFinal />
    <Footer />
  </>
);

const DashboardWrapper = ({ mode, toggleMode, title, children }) => (
  <ProtectedRoute>
    <DashboardLayout mode={mode} toggleMode={toggleMode} title={title}>
      {children}
    </DashboardLayout>
  </ProtectedRoute>
);

export default function App() {
  const [mode, setMode] = useState("dark");
  const toggleMode = () => setMode(m => m === "dark" ? "light" : "dark");

  return (
    <BrowserRouter>
      <GlobalStyles mode={mode} />
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage mode={mode} toggleMode={toggleMode} />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/cv/:slug" element={<InteractiveCVPage />} />

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
          <Route path="/dashboard/cvs/new" element={
            <DashboardWrapper mode={mode} toggleMode={toggleMode} title="Nuevo CV">
              <CVEditorPage />
            </DashboardWrapper>
          } />
          <Route path="/dashboard/cvs/:id/edit" element={
            <DashboardWrapper mode={mode} toggleMode={toggleMode} title="Editar CV">
              <CVEditorPage />
            </DashboardWrapper>
          } />
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

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}