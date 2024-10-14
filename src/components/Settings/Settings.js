import React, { useState } from 'react';
import { User, Mail, Lock, Palette, Camera } from 'lucide-react';
import { Helmet } from 'react-helmet';

const CustomAlert = ({ message }) => (
  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
    <span className="block sm:inline">{message}</span>
  </div>
);

const SettingsPage = () => {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    photo: '/api/placeholder/150/150',
  });
  const [colorScheme, setColorScheme] = useState('light');
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleColorSchemeChange = (scheme) => {
    setColorScheme(scheme);
    // In a real app, you'd apply the color scheme to the entire app here
  };

  const handleSave = () => {
    // Simulate saving changes
    setMessage('Changes saved successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handlePasswordChange = () => {
    // In a real app, you'd implement password change logic here
    setMessage('Password changed successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (

        <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <Helmet>
            <title>Settings | Hoist</title>
            <link rel="icon" href="https://img.icons8.com/emoji/48/sport-utility-vehicle.png" type="image/png" />
        </Helmet>
          <h1 className="text-3xl font-bold mb-6">User Settings</h1>
          
          {message && <CustomAlert message={message} />}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <User className="text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={user.name}
                    onChange={handleInputChange}
                    className="flex-1 p-2 border rounded"
                    placeholder="Full Name"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleInputChange}
                    className="flex-1 p-2 border rounded"
                    placeholder="Email"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Profile Photo</h2>
              <div className="flex items-center space-x-4">
                <img src={user.photo} alt="Profile" className="w-24 h-24 rounded-full" />
                <button className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  <Camera size={18} />
                  <span>Change Photo</span>
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Security</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Lock className="text-gray-400" />
                  <input
                    type="password"
                    className="flex-1 p-2 border rounded"
                    placeholder="New Password"
                  />
                </div>
                <button
                  onClick={handlePasswordChange}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Change Password
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Appearance</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Palette className="text-gray-400" />
                  <select
                    value={colorScheme}
                    onChange={(e) => handleColorSchemeChange(e.target.value)}
                    className="flex-1 p-2 border rounded"
                  >
                    <option value="light">Light Mode</option>
                    <option value="dark">Dark Mode</option>
                    <option value="system">System Default</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </main>

  );
};

export default SettingsPage;