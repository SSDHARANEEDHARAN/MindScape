import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './components/context/UserContext';
import Navbar from './components/Navbar/Navbar';
import Welcome from './components/pages/Welcome';
import Onboarding from './components/pages/Onboarding';
import Dashboard from './components/pages/Dashboard';


// Security measures to deter inspection
const disableInspect = () => {
  // Prevent right-click
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });

  // Prevent F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
  document.addEventListener('keydown', (e) => {
    if (
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && e.key === 'I') ||
      (e.ctrlKey && e.shiftKey && e.key === 'J') ||
      (e.ctrlKey && e.key === 'U') ||
      (e.metaKey && e.altKey && e.key === 'I')
    ) {
      e.preventDefault();
    }
  });

  // Blur sensitive data when window loses focus
  window.addEventListener('blur', () => {
    const sensitiveElements = document.querySelectorAll('[data-sensitive="true"]');
    sensitiveElements.forEach(el => {
      el.classList.add('blurred');
    });
  });

  window.addEventListener('focus', () => {
    const sensitiveElements = document.querySelectorAll('[data-sensitive="true"]');
    sensitiveElements.forEach(el => {
      el.classList.remove('blurred');
    });
  });
};

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
    // Apply security measures
    disableInspect();
    
    // Apply dark mode class to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Save preference
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    
    // Add production-only error handling
    if (import.meta.env.PROD) { // Changed from process.env.NODE_ENV to Vite's import.meta.env
      window.onerror = (message, source, lineno, colno, error) => {
        console.error('An error occurred:', { message, source, lineno, colno, error });
        return true; // Prevent default error handling
      };
    }
    
    // Cleanup event listeners
    return () => {
      document.removeEventListener('contextmenu', (e) => e.preventDefault());
      document.removeEventListener('keydown', (e) => {
        if (
          e.key === 'F12' ||
          (e.ctrlKey && e.shiftKey && e.key === 'I') ||
          (e.ctrlKey && e.shiftKey && e.key === 'J') ||
          (e.ctrlKey && e.key === 'U') ||
          (e.metaKey && e.altKey && e.key === 'I')
        ) {
          e.preventDefault();
        }
      });
    };
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
  // Add CSP meta tag dynamically
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.httpEquiv = "Content-Security-Policy";
    meta.content = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;";
    document.head.appendChild(meta);
    
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;