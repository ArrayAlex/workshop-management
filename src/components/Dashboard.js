import React from 'react';
import Navbar from './Navbar'; // Import Navbar
import Sidebar from './Sidebar'; // Import Sidebar


const Dashboard = () => {
    return (
        <div className="flex flex-col h-screen">
            {/* Navbar */}
            <Navbar />

            <div className="flex flex-1">
                {/* Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <main className="flex-1 p-6 bg-grey-100">
                    <h1 className="text-2xl font-bold mb-4">Dashboard Overview</h1>
                    
                    {/* Cards Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded shadow">
                            <h2 className="font-semibold text-lg">Total Vehicles</h2>
                            <p className="text-2xl">150</p>
                        </div>
                        <div className="bg-white p-4 rounded shadow">
                            <h2 className="font-semibold text-lg">Active Customers</h2>
                            <p className="text-2xl">75</p>
                        </div>
                        <div className="bg-white p-4 rounded shadow">
                            <h2 className="font-semibold text-lg">Pending Appointments</h2>
                            <p className="text-2xl">5</p>
                        </div>
                    </div>

                    {/* Additional Content */}
                    <div className="mt-6">
                        <h2 className="font-semibold text-xl">Recent Activities</h2>
                        <ul className="bg-white p-4 rounded shadow mt-2">
                            <li className="border-b py-2">Vehicle ABC123 serviced on Oct 1</li>
                            <li className="border-b py-2">Customer John Doe added on Sep 30</li>
                            <li className="border-b py-2">Appointment scheduled for Oct 5</li>
                        </ul>
                    </div>

                    
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
