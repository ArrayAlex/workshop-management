import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { 
  Wrench, Clock, CheckCircle, AlertTriangle, 
} from 'lucide-react';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import { Helmet } from 'react-helmet';

const TechnicianDashboard = () => {
  const [selectedJob, setSelectedJob] = useState(null);

  // Sample data
  const jobsData = [
    { id: 1, customer: 'John Doe', vehicle: 'Toyota Camry', service: 'Oil Change', status: 'In Progress', eta: '2 hours' },
    { id: 2, customer: 'Jane Smith', vehicle: 'Honda Civic', service: 'Brake Inspection', status: 'Waiting', eta: '1 hour' },
    { id: 3, customer: 'Bob Johnson', vehicle: 'Ford F-150', service: 'Tire Rotation', status: 'Completed', eta: '-' },
    { id: 4, customer: 'Alice Brown', vehicle: 'Chevrolet Malibu', service: 'Engine Diagnostic', status: 'Scheduled', eta: '3 hours' },
  ];

  const performanceData = [
    { name: 'Mon', jobs: 4 },
    { name: 'Tue', jobs: 6 },
    { name: 'Wed', jobs: 5 },
    { name: 'Thu', jobs: 7 },
    { name: 'Fri', jobs: 8 },
  ];

  const serviceTypeData = [
    { name: 'Oil Change', value: 35 },
    { name: 'Brake Service', value: 25 },
    { name: 'Tire Service', value: 20 },
    { name: 'Engine Repair', value: 15 },
    { name: 'Other', value: 5 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="flex flex-col h-screen bg-gray-100">
        <Helmet>
            <title>Dashboard | Hoist</title>
            <link rel="icon" href="https://img.icons8.com/emoji/48/sport-utility-vehicle.png" type="image/png" />
        </Helmet>

      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
        
          <h1 className="text-3xl font-bold mb-6">Technician Dashboard</h1>
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-4 rounded-lg shadow flex items-center">
              <Wrench className="text-blue-500 mr-4" size={24} />
              <div>
                <p className="text-sm text-gray-600">Jobs Today</p>
                <p className="text-2xl font-bold">5</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow flex items-center">
              <Clock className="text-green-500 mr-4" size={24} />
              <div>
                <p className="text-sm text-gray-600">Avg. Completion Time</p>
                <p className="text-2xl font-bold">1.5 hrs</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow flex items-center">
              <CheckCircle className="text-purple-500 mr-4" size={24} />
              <div>
                <p className="text-sm text-gray-600">Completed This Week</p>
                <p className="text-2xl font-bold">23</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow flex items-center">
              <AlertTriangle className="text-yellow-500 mr-4" size={24} />
              <div>
                <p className="text-sm text-gray-600">Pending Jobs</p>
                <p className="text-2xl font-bold">2</p>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Weekly Performance</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="jobs" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Service Types</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={serviceTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {serviceTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Job List */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Today's Jobs</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ETA</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {jobsData.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedJob(job)}>
                      <td className="px-6 py-4 whitespace-nowrap">{job.customer}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{job.vehicle}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{job.service}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          job.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          job.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                          job.status === 'Waiting' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{job.eta}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Job Details Modal */}
          {selectedJob && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" onClick={() => setSelectedJob(null)}>
              <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" onClick={e => e.stopPropagation()}>
                <div className="mt-3 text-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Job Details</h3>
                  <div className="mt-2 px-7 py-3">
                    <p className="text-sm text-gray-500">
                      Customer: {selectedJob.customer}<br />
                      Vehicle: {selectedJob.vehicle}<br />
                      Service: {selectedJob.service}<br />
                      Status: {selectedJob.status}<br />
                      ETA: {selectedJob.eta}
                    </p>
                  </div>
                  <div className="items-center px-4 py-3">
                    <button
                      id="ok-btn"
                      className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                      onClick={() => setSelectedJob(null)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default TechnicianDashboard;