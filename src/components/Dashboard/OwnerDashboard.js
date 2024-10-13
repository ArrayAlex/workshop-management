import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, 
} from 'recharts';
import { 
  DollarSign, Users, ShoppingCart, TrendingUp, 
  Briefcase, Star, Clock, ActivitySquare
} from 'lucide-react';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';

const OwnerDashboard = () => {
  const [dateRange, setDateRange] = useState('month');

  // Sample data
  const financialData = [
    { month: 'Jan', revenue: 40000, expenses: 30000, profit: 10000 },
    { month: 'Feb', revenue: 45000, expenses: 32000, profit: 13000 },
    { month: 'Mar', revenue: 48000, expenses: 33000, profit: 15000 },
    { month: 'Apr', revenue: 52000, expenses: 35000, profit: 17000 },
    { month: 'May', revenue: 55000, expenses: 36000, profit: 19000 },
    { month: 'Jun', revenue: 58000, expenses: 37000, profit: 21000 },
  ];

  const customerSatisfactionData = [
    { month: 'Jan', score: 4.2 },
    { month: 'Feb', score: 4.3 },
    { month: 'Mar', score: 4.1 },
    { month: 'Apr', score: 4.4 },
    { month: 'May', score: 4.5 },
    { month: 'Jun', score: 4.6 },
  ];

  const serviceTypeData = [
    { name: 'Oil Change', value: 35 },
    { name: 'Brake Service', value: 25 },
    { name: 'Tire Service', value: 20 },
    { name: 'Engine Repair', value: 15 },
    { name: 'Other', value: 5 },
  ];

  const employeePerformanceData = [
    { name: 'John', efficiency: 85, jobs: 120 },
    { name: 'Jane', efficiency: 90, jobs: 150 },
    { name: 'Bob', efficiency: 78, jobs: 100 },
    { name: 'Alice', efficiency: 92, jobs: 140 },
    { name: 'Charlie', efficiency: 88, jobs: 130 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Owner Dashboard</h1>
            <select 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-4 rounded-lg shadow flex items-center">
              <DollarSign className="text-green-500 mr-4" size={24} />
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">$298,000</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow flex items-center">
              <TrendingUp className="text-blue-500 mr-4" size={24} />
              <div>
                <p className="text-sm text-gray-600">Net Profit</p>
                <p className="text-2xl font-bold">$95,000</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow flex items-center">
              <ShoppingCart className="text-purple-500 mr-4" size={24} />
              <div>
                <p className="text-sm text-gray-600">Jobs Completed</p>
                <p className="text-2xl font-bold">825</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow flex items-center">
              <Users className="text-yellow-500 mr-4" size={24} />
              <div>
                <p className="text-sm text-gray-600">New Customers</p>
                <p className="text-2xl font-bold">132</p>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Financial Performance */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Financial Performance</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={financialData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#8884d8" />
                  <Bar dataKey="expenses" fill="#82ca9d" />
                  <Bar dataKey="profit" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Customer Satisfaction Trend */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Customer Satisfaction Trend</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={customerSatisfactionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[3, 5]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="score" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Service Type Distribution */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Service Type Distribution</h2>
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

            {/* Employee Performance */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Employee Performance</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={employeePerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="efficiency" fill="#8884d8" />
                  <Bar yAxisId="right" dataKey="jobs" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <Briefcase className="text-indigo-500 mr-4" size={24} />
                <h3 className="text-lg font-semibold">Average Job Value</h3>
              </div>
              <p className="text-2xl font-bold mt-2">$360</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <Star className="text-yellow-500 mr-4" size={24} />
                <h3 className="text-lg font-semibold">Customer Retention Rate</h3>
              </div>
              <p className="text-2xl font-bold mt-2">85%</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <Clock className="text-green-500 mr-4" size={24} />
                <h3 className="text-lg font-semibold">Avg. Turnaround Time</h3>
              </div>
              <p className="text-2xl font-bold mt-2">1.5 days</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <ActivitySquare className="text-red-500 mr-4" size={24} />
                <h3 className="text-lg font-semibold">Equipment Utilization</h3>
              </div>
              <p className="text-2xl font-bold mt-2">78%</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OwnerDashboard;