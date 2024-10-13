import React, { useState, useCallback } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { CSVLink } from "react-csv";
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import { Helmet } from 'react-helmet';

const Reports = () => {
  const [timeRange, setTimeRange] = useState('12months');
  const [serviceFilter, setServiceFilter] = useState('all');

  // Extended sample data
  const allMonthlyData = [
    { month: 'Jan', revenue: 4000, expenses: 3000, profit: 1000 },
    { month: 'Feb', revenue: 3000, expenses: 2500, profit: 500 },
    { month: 'Mar', revenue: 5000, expenses: 3500, profit: 1500 },
    { month: 'Apr', revenue: 4500, expenses: 3200, profit: 1300 },
    { month: 'May', revenue: 6000, expenses: 4000, profit: 2000 },
    { month: 'Jun', revenue: 5500, expenses: 3800, profit: 1700 },
    { month: 'Jul', revenue: 7000, expenses: 4500, profit: 2500 },
    { month: 'Aug', revenue: 6500, expenses: 4200, profit: 2300 },
    { month: 'Sep', revenue: 5800, expenses: 3900, profit: 1900 },
    { month: 'Oct', revenue: 6200, expenses: 4100, profit: 2100 },
    { month: 'Nov', revenue: 5900, expenses: 4000, profit: 1900 },
    { month: 'Dec', revenue: 7500, expenses: 5000, profit: 2500 },
  ];

  const serviceTypes = [
    { name: 'Oil Change', value: 400 },
    { name: 'Tire Rotation', value: 300 },
    { name: 'Brake Service', value: 300 },
    { name: 'Engine Tune-up', value: 200 },
    { name: 'Transmission Service', value: 150 },
    { name: 'Battery Replacement', value: 100 },
  ];

  const customerSatisfaction = [
    { month: 'Jan', score: 4.2 }, { month: 'Feb', score: 4.3 }, { month: 'Mar', score: 4.1 },
    { month: 'Apr', score: 4.4 }, { month: 'May', score: 4.5 }, { month: 'Jun', score: 4.6 },
    { month: 'Jul', score: 4.3 }, { month: 'Aug', score: 4.4 }, { month: 'Sep', score: 4.5 },
    { month: 'Oct', score: 4.6 }, { month: 'Nov', score: 4.7 }, { month: 'Dec', score: 4.5 },
  ];

  const employeePerformance = [
    { name: 'John', sales: 4000, services: 2400 },
    { name: 'Jane', sales: 3000, services: 1398 },
    { name: 'Bob', sales: 2000, services: 9800 },
    { name: 'Mary', sales: 2780, services: 3908 },
    { name: 'Tom', sales: 1890, services: 4800 },
    { name: 'Alice', sales: 2390, services: 3800 },
    { name: 'David', sales: 3490, services: 4300 },
  ];

  // Filter data based on time range
  const monthlyRevenue = allMonthlyData.slice(-parseInt(timeRange));

  // Filter service types based on selected service
  const filteredServiceTypes = serviceFilter === 'all' 
    ? serviceTypes 
    : serviceTypes.filter(service => service.name === serviceFilter);

  const handleTimeRangeChange = useCallback((e) => {
    setTimeRange(e.target.value);
  }, []);

  const handleServiceFilterChange = useCallback((e) => {
    setServiceFilter(e.target.value);
  }, []);

  // Prepare CSV data for download
  const csvData = [
    ["Month", "Revenue", "Expenses", "Profit"],
    ...allMonthlyData.map(item => [item.month, item.revenue, item.expenses, item.profit])
  ];

  return (

        <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
        <Helmet>
            <title>Reports | Hoist</title>
            <link rel="icon" href="https://img.icons8.com/emoji/48/sport-utility-vehicle.png" type="image/png" />
        </Helmet>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Reports</h1>
            <CSVLink 
              data={csvData}
              filename={"workshop_report.csv"}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Download Report
            </CSVLink>
          </div>

          <div className="mb-6 flex space-x-4">
            <select 
              value={timeRange} 
              onChange={handleTimeRangeChange}
              className="p-2 border rounded"
            >
              <option value="3">Last 3 months</option>
              <option value="6">Last 6 months</option>
              <option value="12">Last 12 months</option>
            </select>
            <select 
              value={serviceFilter} 
              onChange={handleServiceFilterChange}
              className="p-2 border rounded"
            >
              <option value="all">All Services</option>
              {serviceTypes.map(service => (
                <option key={service.name} value={service.name}>{service.name}</option>
              ))}
            </select>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 pb-10">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
              <p className="text-2xl font-bold text-green-600">
                ${monthlyRevenue.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Average Job Value</h3>
              <p className="text-2xl font-bold text-blue-600">$350</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Customer Retention Rate</h3>
              <p className="text-2xl font-bold text-purple-600">85%</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Jobs Completed</h3>
              <p className="text-2xl font-bold text-orange-600">124</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Monthly Revenue Chart */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Monthly Revenue</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="expenses" stroke="#82ca9d" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="profit" stroke="#ffc658" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Service Types Pie Chart */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Service Types Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie dataKey="value" data={filteredServiceTypes} fill="#8884d8" label />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Customer Satisfaction Chart */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Customer Satisfaction Trend</h2>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={customerSatisfaction.slice(-parseInt(timeRange))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="score" stroke="#82ca9d" fill="#82ca9d" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Employee Performance Chart */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Employee Performance</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={employeePerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="#8884d8" />
                  <Bar dataKey="services" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </main>

  );
};

export default Reports; 