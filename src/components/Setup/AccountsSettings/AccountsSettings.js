import React, { useState, useMemo } from 'react';
import { Edit, Trash2, Plus, Search } from 'lucide-react';

const AccountsSettings = () => {
  const [employees, setEmployees] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Technician', photo: null },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Manager', photo: 'https://example.com/jane-photo.jpg' },
    { id: 3, name: 'Alice Johnson', email: 'alice@example.com', role: 'Technician', photo: null },
    { id: 4, name: 'Bob Brown', email: 'bob@example.com', role: 'Admin', photo: 'https://example.com/bob-photo.jpg' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);

  const filteredEmployees = useMemo(() => {
    return employees.filter(employee => 
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [employees, searchTerm]);

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getColorFromInitial = (initial) => {
    const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'];
    return colors[initial.charCodeAt(0) % colors.length];
  };

  const openModal = (employee = null) => {
    setCurrentEmployee(employee || { name: '', email: '', role: '' });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentEmployee(null);
  };

  const handleEmployeeChange = (e) => {
    const { name, value } = e.target;
    setCurrentEmployee({ ...currentEmployee, [name]: value });
  };

  const saveEmployee = () => {
    if (currentEmployee.id) {
      setEmployees(employees.map(emp => emp.id === currentEmployee.id ? currentEmployee : emp));
    } else {
      setEmployees([...employees, { ...currentEmployee, id: employees.length + 1 }]);
    }
    closeModal();
  };

  const deleteEmployee = (id) => {
    setEmployees(employees.filter(emp => emp.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Employee Accounts</h2>
        <button
          onClick={() => openModal()}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
        >
          <Plus size={18} className="mr-2" />
          Add New Employee
        </button>
      </div>
      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 pl-10 border rounded"
        />
        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left">Employee</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Role</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
              <tr key={employee.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">
                  <div className="flex items-center">
                    {employee.photo ? (
                      <img src={employee.photo} alt={employee.name} className="w-10 h-10 rounded-full mr-3" />
                    ) : (
                      <div className={`w-10 h-10 rounded-full mr-3 flex items-center justify-center text-white ${getColorFromInitial(employee.name[0])}`}>
                        {getInitials(employee.name)}
                      </div>
                    )}
                    <span>{employee.name}</span>
                  </div>
                </td>
                <td className="py-2 px-4">{employee.email}</td>
                <td className="py-2 px-4">{employee.role}</td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => openModal(employee)}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => deleteEmployee(employee.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-96">
            <h2 className="text-xl font-semibold mb-4">
              {currentEmployee.id ? 'Edit Employee' : 'Add New Employee'}
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                value={currentEmployee.name}
                onChange={handleEmployeeChange}
                className="w-full p-2 border rounded"
                placeholder="Employee Name"
              />
              <input
                type="email"
                name="email"
                value={currentEmployee.email}
                onChange={handleEmployeeChange}
                className="w-full p-2 border rounded"
                placeholder="Email"
              />
              <input
                type="text"
                name="role"
                value={currentEmployee.role}
                onChange={handleEmployeeChange}
                className="w-full p-2 border rounded"
                placeholder="Role"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={closeModal}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEmployee}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountsSettings;