import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './components/context/UserContext';
import Navbar from './components/Navbar/Navbar';
import Welcome from './components/pages/Welcome';
import Onboarding from './components/pages/Onboarding';
import Dashboard from './components/pages/Dashboard';

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isOnboarded } = useUser();
  
  if (!isOnboarded) {
    return <Navigate to="/onboarding" replace />;
  }
  
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    // Initialize dark mode from localStorage or system preference
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      return JSON.parse(savedMode);
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  useEffect(() => {
    // Apply dark mode class to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Save preference
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = (): void => {
    setDarkMode((prev: boolean) => !prev);
  };
  
  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <Router>
          <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <Routes>
            <Route path="/" element={<Welcome darkMode={darkMode} />} />
            <Route path="/onboarding" element={<Onboarding darkMode={darkMode} />} />
            <Route 
              path="/dashboard/*" 
              element={
                <ProtectedRoute>
                  <Dashboard darkMode={darkMode} />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
};

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;
