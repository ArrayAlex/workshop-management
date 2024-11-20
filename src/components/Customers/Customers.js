import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import CustomerModal from '../CustomerModal/CustomerModal';
import { Helmet } from 'react-helmet';
import axiosInstance from "../../api/axiosInstance";

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(false);
  const filteredCustomers = customers?.filter(customer => {
    const query = searchTerm.trim().toLowerCase();
    if (query.startsWith('#')) {
      // Exact match for ID if the query starts with #
      return customer.id.toString() === query.substring(1);
    } else {
      // Search across all fields
      return (
          `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(query) ||
          customer.email?.toLowerCase().includes(query) ||
          customer.phone?.toLowerCase().includes(query)
      );
    }
  });


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true); // Start loading
    try {
      const response = await axiosInstance.get('/customer/customers');
      if (response.status === 200) {
        setCustomers(response.data);
      } else {
        console.error("Failed to fetch customers. Status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const openModal = (customer) => {
    setCurrentCustomer(customer || {});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentCustomer(null);
  };

  const handleSaveCustomer = (savedCustomer) => {
    if (savedCustomer.id) {
      setCustomers(customers.map(c =>
          c.id === savedCustomer.id ? { ...savedCustomer, id: c.id } : c
      ));
    } else {
      setCustomers([...customers, {
        ...savedCustomer,
        id: Date.now(),
        accountType: savedCustomer.accountType || 'Account',
        accountApproved: savedCustomer.accountApproved || 'No',
        onHold: savedCustomer.onHold || 'No',
        gstRate: savedCustomer.gstRate || 'Standard (15%)'
      }]);
    }
  };

  const handleDeleteCustomer = (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      setCustomers(customers.filter(c => c.id !== id));
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
      <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
        <Helmet>
          <title>Customers | Hoist</title>
          <link rel="icon" href="https://img.icons8.com/emoji/48/sport-utility-vehicle.png" type="image/png" />
        </Helmet>
        <div className="container">
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
                onClick={() => openModal(null)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition duration-300"
            >
              <Plus size={20} className="mr-2" />
              Add Customer
            </button>
          </div>

          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            {loading ? (
                <div className="flex justify-center items-center py-6">
                  {/* Loading Spinner */}
                  <div className="animate-spin border-t-4 border-blue-500 border-solid w-10 h-10 rounded-full"></div>
                </div>
            ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                  {currentCustomers.map((customer) => (
                      <tr key={customer.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{customer.id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{`${customer.firstName} ${customer.lastName}`}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{customer.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{customer.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                              onClick={() => openModal(customer)}
                              className="text-indigo-600 hover:text-indigo-900 mr-3"
                          >
                            <Edit size={18}/>
                          </button>
                          <button
                              onClick={() => handleDeleteCustomer(customer.id)}
                              className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={18}/>
                          </button>
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg disabled:opacity-50"
            >
              Next
            </button>
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
