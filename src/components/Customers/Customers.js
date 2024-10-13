import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import CustomerModal from '../CustomerModal/CustomerModal';
import { Helmet } from 'react-helmet';

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);

  useEffect(() => {
    // Fetch customers from API or load from storage
    // For now, we'll use dummy data
    setCustomers([
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', company: 'ABC Corp', lastOrder: '2023-05-15' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '987-654-3210', company: 'XYZ Ltd', lastOrder: '2023-06-01' },
      // Add more dummy customers as needed
    ]);
  }, []);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (customer = null) => {
    setCurrentCustomer(customer || {});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentCustomer(null);
  };

  const handleSaveCustomer = (savedCustomer) => {
    if (savedCustomer.id) {
      setCustomers(customers.map(c => c.id === savedCustomer.id ? savedCustomer : c));
    } else {
      setCustomers([...customers, { ...savedCustomer, id: Date.now() }]);
    }
  };

  const handleDeleteCustomer = (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      setCustomers(customers.filter(c => c.id !== id));
    }
  };

  return (
    
        <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
        <Helmet>
            <title>Customers | Hoist</title>
            <link rel="icon" href="https://img.icons8.com/emoji/48/sport-utility-vehicle.png" type="image/png" />
        </Helmet>
          <div className="container mx-auto">
            <h1 className="text-3xl font-bold mb-6">Customers</h1>
            
            <div className="flex justify-between items-center mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
              </div>
              <button
                onClick={() => openModal()}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition duration-300"
              >
                <Plus size={20} className="mr-2" />
                Add Customer
              </button>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Order</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <span className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                              {customer.name.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{customer.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{customer.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{customer.company}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{customer.lastOrder}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => openModal(customer)} 
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteCustomer(customer.id)} 
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <CustomerModal 
              isOpen={isModalOpen}
              onClose={closeModal}
              customer={currentCustomer}
              onSave={handleSaveCustomer}
            />
          </div>
        </main>

  );
};

export default CustomersPage;