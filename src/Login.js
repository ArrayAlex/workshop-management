import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from './api/axiosInstance';

const Login = ({ setIsAuthenticated }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [company, setCompany] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const verify = async () => {
        try {
            const response = await axiosInstance.get('/auth/verify');

            if (response.status === 200) {
                navigate('/dashboard');
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        setIsLoading(true);

        if (localStorage.getItem('userPlan')) {
            setIsAuthenticated(true);
            navigate('/dashboard'); // Redirect to dashboard if logged in
        } else {
            verify(); // If not logged in, verify through the backend
        }

        setIsLoading(false);
        // eslint-disable-next-line
    }, [setIsAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/auth/login', { username, password, company });
            //console.log(response.data);

            if (response.status === 200) {
                // Store user plan details in local storage
                localStorage.setItem('userPlan', JSON.stringify(response.data.plan));
                localStorage.setItem('newUser', response.data.newUser);
                localStorage.setItem('jobStatuses', JSON.stringify(response.data.jobStatuses));
                localStorage.setItem('jobTypes', JSON.stringify(response.data.jobTypes));
                localStorage.setItem('userid', JSON.stringify(response.data.userid));

                // Update the authentication state in App
                setIsAuthenticated(true);

                // Redirect to the dashboard
                navigate('/dashboard');
            } else {
                setError('Login failed, please check your credentials');
            }

        } catch (err) {
            setError('Invalid email or password');
            console.error(err);
        }
    };

    const LoadingSpinner = () => (
        <div className="flex justify-center items-center py-6">
            <div className="animate-spin border-t-4 border-blue-500 border-solid w-10 h-10 rounded-full"></div>
        </div>
    );

    if (isLoading) {
        return (
            <div className="p-6 max-h-[calc(90vh-8rem)] overflow-y-auto">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center">Login</h2>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500 p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Company</label>
                        <input
                            type="text"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            required
                            className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500 p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500 p-2"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        Login
                    </button>
                </form>
                <p className="text-center text-sm text-gray-600">
                    Don't have an account? <a href="/register" className="text-blue-600 hover:underline">Register
                    here</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
