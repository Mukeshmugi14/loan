import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import OnboardingFlow from './pages/OnboardingFlow';
import DashboardLayout from './layouts/DashboardLayout';
import MainDashboard from './pages/MainDashboard';
import RecommendationsPage from './pages/RecommendationsPage';
import RecommendationDetailsPage from './pages/RecommendationDetailsPage';
import KycFlow from './pages/KycFlow';
import ApplicationFlow from './pages/ApplicationFlow';
import ApplicationTracker from './pages/ApplicationTracker';
import ApplicationsPage from './pages/ApplicationsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import AdminDashboard from './pages/AdminDashboard';
import LenderDashboard from './pages/LenderDashboard';

const ProtectedRoute = ({ children, requireOnboarded = false }: { children: React.ReactNode, requireOnboarded?: boolean }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth" />;
  if (requireOnboarded && !user.onboarded) return <Navigate to="/onboarding" />;
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/onboarding" element={
        <ProtectedRoute>
          <OnboardingFlow />
        </ProtectedRoute>
      } />
      
      {/* Dashboard Routes */}
      <Route element={<ProtectedRoute requireOnboarded={true}><DashboardLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<MainDashboard />} />
        <Route path="/recommendations" element={<RecommendationsPage />} />
        <Route path="/recommendations/:loanId" element={<RecommendationDetailsPage />} />
        <Route path="/apply/:loanId/kyc" element={<KycFlow />} />
        <Route path="/apply/:loanId/form" element={<ApplicationFlow />} />
        <Route path="/applications" element={<ApplicationsPage />} />
        <Route path="/applications/:appId/track" element={<ApplicationTracker />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Specialty Dashboards */}
      <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/lender" element={<ProtectedRoute><LenderDashboard /></ProtectedRoute>} />
    </Routes>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}