import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/useAuthStore';
import { Loader2 } from 'lucide-react';

import LoginPage from './routes/LoginPage';
import RegisterPage from './routes/RegisterPage';
import BusinessProfilePage from './routes/BusinessProfilePage';
import DashboardPage from './routes/DashboardPage';
import LandingPage from './routes/LandingPage';
import AiIdeasPage from './routes/AiIdeasPage';

function App() {
  const { checkAuth, isAuthenticated, isLoading } = useAuthStore();

  // When the app first loads, hit the backend to check if we have a valid cookie
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-950">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      {/* Toaster is what shows our beautiful success/error popups */}
      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#171717',
          color: '#fff',
          border: '1px solid #262626'
        }
      }} />
      
      <Routes>
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} 
        />
        <Route 
          path="/register" 
          element={isAuthenticated ? <Navigate to="/business-profile" /> : <RegisterPage />} 
        />
        
        {/* Protected Business Profile Route */}
        <Route 
          path="/business-profile" 
          element={isAuthenticated ? <BusinessProfilePage /> : <Navigate to="/login" />} 
        />
        
        {/* Landing Page Route */}
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />} 
        />
        
        {/* Dashboard Route */}
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <DashboardPage /> : <Navigate to="/" />} 
        />
        
        {/* AI Ideas Route */}
        <Route 
          path="/ideas" 
          element={isAuthenticated ? <AiIdeasPage /> : <Navigate to="/" />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
