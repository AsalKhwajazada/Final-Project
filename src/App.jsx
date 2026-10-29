import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';

// Pages
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import StudentChatPage from './pages/StudentChatPage';
import FindAcademyPage from './pages/FindAcademyPage';
import FindInstructorPage from './pages/FindInstructorPage';
import MyAssignmentsPage from './pages/MyAssignmentsPage';
import DesignPortfolioPage from './pages/DesignPortfolioPage';
import MyProfilePage from './pages/MyProfilePage';
import AssetMarketplacePage from './pages/AssetMarketplacePage';
import PreferencesPage from './pages/PreferencesPage';
import SettingsPage from './pages/SettingsPage';

import './App.css';

function RootRedirect() {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? '/dashboard' : '/signin'} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Root & Auth Routes */}
          <Route path="/" element={<RootRedirect />} />
          <Route path="/signin" element={<AuthPage mode="signin" />} />
          <Route path="/signup" element={<AuthPage mode="signup" />} />

          {/* Protected Application Routes inside MainLayout */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/student-chat" element={<StudentChatPage />} />
            <Route path="/find-academy" element={<FindAcademyPage />} />
            <Route path="/find-instructor" element={<FindInstructorPage />} />
            <Route path="/assignments" element={<MyAssignmentsPage />} />
            <Route path="/design-portfolio" element={<DesignPortfolioPage />} />
            <Route path="/profile" element={<MyProfilePage />} />
            <Route path="/asset-marketplace" element={<AssetMarketplacePage />} />
            <Route path="/preferences" element={<PreferencesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
