import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import Login from './Login';
import JobBoard from './components/JobBoard/JobBoard';
import Dashboard from './components/Dashboard/Dashboard'; 
import Calendar from './components/Calender/Calendar'; 
import InvoiceManager from './components/InvoiceManager/InvoiceManager';
import Settings from './components/Settings/Settings'; 
import Setup from './components/Setup/Setup'; 
import CustomersPage from './components/Customers/Customers'; 
import FloatingActionButton from './components/FloatingActionButton/FloatingActionButton';
import { checkAuth } from './utils/auth';

// Create a client
const queryClient = new QueryClient();

const PrivateRoute = ({ component: Component, isAuthenticated }) => {
    return isAuthenticated ? <Component /> : <Navigate to="/login" />;
};

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(true); // Start with false for testing

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
                    {/* <Route path="/vehicles" element={<PrivateRoute component={Vehicles} isAuthenticated={isAuthenticated} />} /> */}
                    <Route path="/jobs" element={<PrivateRoute component={JobBoard} isAuthenticated={isAuthenticated} />} />
                    <Route path="/customers" element={<PrivateRoute component={CustomersPage} isAuthenticated={isAuthenticated} />} />
                    <Route path="/invoice" element={<PrivateRoute component={InvoiceManager} isAuthenticated={isAuthenticated} />} />
                    <Route path="/settings" element={<PrivateRoute component={Settings} isAuthenticated={isAuthenticated} />} />
                    <Route path="/setup" element={<PrivateRoute component={Setup} isAuthenticated={isAuthenticated} />} />
                    <Route path="/cal" element={<PrivateRoute component={Calendar} isAuthenticated={isAuthenticated} />} />
                    <Route path="/" element={<Navigate to="/login" />} />
                </Routes>

                {/* Add Floating Action Button */}
                <FloatingActionButton />
            </Router>
        </QueryClientProvider>
    );
};

export default App;
