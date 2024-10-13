import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import Login from './Login';
import JobBoard from './components/JobBoard/JobBoard';
import Calendar from './components/Calender/Calendar'; 
import InvoiceManager from './components/InvoiceManager/InvoiceManager';
import Settings from './components/Settings/Settings'; 
import Setup from './components/Setup/Setup'; 
import Reports from './components/Reports/Reports'; 
import CustomersPage from './components/Customers/Customers'; 
import FloatingActionButton from './components/FloatingActionButton/FloatingActionButton';
import { checkAuth } from './utils/auth';
import TechnicianDashboard from './components/Dashboard/TechnicianDashboard';
import OwnerDashboard from './components/Dashboard/OwnerDashboard';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';

// Create a client
const queryClient = new QueryClient();

const PrivateRoute = ({ component: Component, isAuthenticated, ...rest }) => {
    return isAuthenticated ? (
        <div className="flex flex-col h-screen overflow-hidden">
            <Navbar toggleSidebar={rest.toggleSidebar} />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar isCollapsed={rest.isSidebarCollapsed} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
                    <Component />
                </main>
            </div>
        </div>
    ) : <Navigate to="/login" />;
};

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(true); // Start with false for testing
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
        localStorage.getItem('sidebarCollapsed') === 'true'
    );

    const toggleSidebar = () => {
        const newState = !isSidebarCollapsed;
        setIsSidebarCollapsed(newState);
        localStorage.setItem('sidebarCollapsed', newState.toString());
    };

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

        const handleResize = () => {
            if (window.innerWidth <= 768 && !isSidebarCollapsed) {
                setIsSidebarCollapsed(true);
                localStorage.setItem('sidebarCollapsed', 'true');
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isSidebarCollapsed]);

    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                    <Route path="/dashboard" element={
                        <PrivateRoute 
                            component={TechnicianDashboard} 
                            isAuthenticated={isAuthenticated} 
                            isSidebarCollapsed={isSidebarCollapsed}
                            toggleSidebar={toggleSidebar}
                        />
                    } />
                    <Route path="/jobs" element={
                        <PrivateRoute 
                            component={JobBoard} 
                            isAuthenticated={isAuthenticated} 
                            isSidebarCollapsed={isSidebarCollapsed}
                            toggleSidebar={toggleSidebar}
                        />
                    } />
                    <Route path="/customers" element={
                        <PrivateRoute 
                            component={CustomersPage} 
                            isAuthenticated={isAuthenticated} 
                            isSidebarCollapsed={isSidebarCollapsed}
                            toggleSidebar={toggleSidebar}
                        />
                    } />
                    <Route path="/invoice" element={
                        <PrivateRoute 
                            component={InvoiceManager} 
                            isAuthenticated={isAuthenticated} 
                            isSidebarCollapsed={isSidebarCollapsed}
                            toggleSidebar={toggleSidebar}
                        />
                    } />
                    <Route path="/settings" element={
                        <PrivateRoute 
                            component={Settings} 
                            isAuthenticated={isAuthenticated} 
                            isSidebarCollapsed={isSidebarCollapsed}
                            toggleSidebar={toggleSidebar}
                        />
                    } />
                    <Route path="/reports" element={
                        <PrivateRoute 
                            component={Reports} 
                            isAuthenticated={isAuthenticated} 
                            isSidebarCollapsed={isSidebarCollapsed}
                            toggleSidebar={toggleSidebar}
                        />
                    } />
                    <Route path="/setup" element={
                        <PrivateRoute 
                            component={Setup} 
                            isAuthenticated={isAuthenticated} 
                            isSidebarCollapsed={isSidebarCollapsed}
                            toggleSidebar={toggleSidebar}
                        />
                    } />
                    <Route path="/cal" element={
                        <PrivateRoute 
                            component={Calendar} 
                            isAuthenticated={isAuthenticated} 
                            isSidebarCollapsed={isSidebarCollapsed}
                            toggleSidebar={toggleSidebar}
                        />
                    } />
                    <Route path="/" element={<Navigate to="/login" />} />
                </Routes>

                {/* Add Floating Action Button */}
                <FloatingActionButton />
            </Router>
        </QueryClientProvider>
    );
};

export default App;