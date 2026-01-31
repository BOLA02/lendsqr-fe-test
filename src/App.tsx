import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import UserDetails from './components/UserDetails';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check localStorage on mount
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    setIsLoggedIn(authStatus === 'true');
    setIsLoading(false);
  }, []);

  
  useEffect(() => {
    const handleAuthChange = () => {
      const authStatus = localStorage.getItem('isAuthenticated');
      setIsLoggedIn(authStatus === 'true');
    };

    
    window.addEventListener('logout', handleAuthChange);

    return () => {
      window.removeEventListener('logout', handleAuthChange);
    };
  }, []);

  const handleLogin = () => {
    localStorage.setItem('isAuthenticated', 'true');
    setIsLoggedIn(true);
  };

  if (isLoading) {
    return null; 
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            isLoggedIn ? (
              <Dashboard />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        <Route 
          path="/users/:userId" 
          element={
            isLoggedIn ? (
              <UserDetails />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;