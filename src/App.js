// src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import VehicleForm from './VehicleForm'; 
import Login from './Login';
import JobBoard from './JobBoard';
import Dashboard from './components/Dashboard'; 
import Calendar from './components/Calendar'; 

import { checkAuth } from './utils/auth';

// Create a client
const queryClient = new QueryClient();

const PrivateRoute = ({ component: Component, isAuthenticated }) => {
    return isAuthenticated ? <Component /> : <Navigate to="/login" />;
};

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Start with false for testing

    useEffect(() => {
      const verifyAuth = async () => {
          const authStatus = await checkAuth();
  
          // Check local storage as a fallback
          if (localStorage.getItem('userPlan')) {
              setIsAuthenticated(true);
          } else {
              setIsAuthenticated(authStatus);
          }
      };
  
      verifyAuth();
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                    <Route path="/dashboard" element={<PrivateRoute component={Dashboard} isAuthenticated={isAuthenticated} />} />
                    <Route path="/vehicles" element={<PrivateRoute component={VehicleForm} isAuthenticated={isAuthenticated} />} />
                    <Route path="/jobs" element={<PrivateRoute component={JobBoard} isAuthenticated={isAuthenticated} />} />
                    <Route path="/cal" element={<PrivateRoute component={Calendar} isAuthenticated={isAuthenticated} />} />
                    <Route path="/" element={<Navigate to="/login" />} />
                </Routes>
            </Router>
        </QueryClientProvider>
    );
};

export default App;