import React, {useState, useEffect} from 'react';
import {
    X,
    User,
    Phone,
    Briefcase,
    MapPin,
    FileText,
    MessageSquare,
    Activity,
    ShoppingCart,
    Package
} from 'lucide-react';
// import axiosInstance from "../../api/axiosInstance";

const CustomerModal = ({isOpen, onClose, customer, onSave}) => {
    // const [customer, setCustomer] = useState(customer || {});
    const [formData, setFormData] = useState(customer || {});
    const [activeTab, setActiveTab] = useState('general')
    ;
    useEffect(() => {
        // Sync formData with the customer prop if it changes
        setFormData(customer || {});
    }, [customer]);

    useEffect(() => {
        const handleEsc = (event) => {
            if (event.keyCode === 27) onClose();
        };
        window.addEventListener('keydown', handleEsc);

        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    const tabs = [
        {id: 'general', label: 'General', icon: User},
        {id: 'contacts', label: 'Contacts', icon: Phone},
        {id: 'marketing', label: 'Marketing', icon: Briefcase},
        {id: 'addresses', label: 'Additional Addresses', icon: MapPin},
        {id: 'userDefined', label: 'User Defined', icon: FileText},
        {id: 'notes', label: 'Notes', icon: MessageSquare},
        {id: 'activity', label: 'Activity', icon: Activity},
        {id: 'invoices', label: 'Invoices', icon: ShoppingCart},
        {id: 'items', label: 'Items', icon: Package},
    ];

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleSave = () => {
        if (formData.id) {
            // If formData has an id, update the customer
            updateCustomer();
        } else {
            // If no id exists, create a new customer
            createCustomer();
        }
        onSave(formData); // Pass the form data to the parent component
        onClose(); // Close the modal
    };

    const createCustomer = async () => {
        try {
            // Sending formData in the PUT request to create a new customer
            // const response = await axiosInstance.post('/customer/add', formData);
            //console.log('Customer created successfully:', response.data);
        } catch (error) {
            //console.error('Error creating customer:', error);
        }
    };

    const updateCustomer = async () => {
        try {
            // Sending formData in the POST request to update an existing customer
            //const response = await axiosInstance.put('/customer/update', formData);
            //console.log('Customer updated successfully:', response.data);
        } catch (error) {
            //console.error('Error updating customer:', error);
        }
    };


    const renderTabContent = () => {
        switch (activeTab) {
            case 'general':
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName || ''}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName || ''}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone || ''}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email || ''}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Postal Address</label>
                            <textarea
                                name="postalAddress"
                                value={formData.postalAddress || ''}
                                onChange={handleInputChange}
                                rows={1}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Mobile</label>
                            <input
                                type="tel"
                                name="mobile"
                                value={formData.mobile || ''}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Home Phone</label>
                            <input
                                type="tel"
                                name="homePhone"
                                value={formData.homePhone || ''}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Delivery Address</label>
                            <textarea
                                name="deliveryAddress"
                                value={formData.deliveryAddress || ''}
                                onChange={handleInputChange}
                                rows={3}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Web Address</label>
                            <input
                                type="url"
                                name="webAddress"
                                value={formData.webAddress || ''}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Contact</label>
                            <input
                                type="text"
                                name="contact"
                                value={formData.contact || ''}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Account Type</label>
                            <select
                                name="accountType"
                                value={formData.accountType || ''}
                                onChange={handleInputChange}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                                <option value="Account">Account</option>
                                <option value="Cash">Cash</option>
                                <option value="ChargeTo">Charge To</option>
                                <option value="AccountHeader">Account Header</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Account Application
                                Approved</label>
                            <select
                                name="accountApproved"
                                value={formData.accountApproved || ''}
                                onChange={handleInputChange}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                                <option value="No">No</option>
                                <option value="Yes">Yes</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">On Hold</label>
                            <select
                                name="onHold"
                                value={formData.onHold || ''}
                                onChange={handleInputChange}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                                <option value="No">No</option>
                                <option value="Yes">Yes</option>
                                <option value="Never">Never</option>
                                <option value="Always">Always</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">GST Rate</label>
                            <select
                                name="gstRate"
                                value={formData.gstRate || ''}
                                onChange={handleInputChange}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                                <option value="">Please Select</option>
                                <option value="Exempt (0%)">Exempt (0%)</option>
                                <option value="Standard (15%)">Standard (15%)</option>
                                <option value="Zero Rated (0%)">Zero Rated (0%)</option>
                            </select>
                        </div>
                        {/* Add more fields as needed */}
                    </div>
                );
            // Add cases for other tabs
            default:
                return <div>Content for {activeTab} tab</div>;
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" onClick={onClose}>
            <div className="relative top-20 mx-auto p-5 border w-11/12 shadow-lg rounded-md bg-white"
                 onClick={e => e.stopPropagation()}>
                <div className="mt-3">
                    <div className="flex justify-between items-center pb-3">
                        <h2 className="text-2xl font-bold">Customer</h2>
                        <button onClick={onClose} className="text-black close-modal">
                            <X size={24}/>
                        </button>
                    </div>
                    <div className="my-2 text-gray-600">
                        {customer.id && (
                            <p>
                                Customer ID: {customer.id} | Created on {customer.createdAt} | Updated
                                on {customer.modifiedAt || null} |
                                Modified by {customer.accountDetails?.name || null}
                            </p>
                        )}
                    </div>

                    <div className="mt-4">
                        <div className="flex space-x-4 mb-4 overflow-x-auto">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                                        activeTab === tab.id
                                            ? 'bg-indigo-100 text-indigo-700'
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    <tab.icon className="mr-2 h-5 w-5"/>
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                        <div className="mt-4 max-h-96 overflow-y-auto">
                            {renderTabContent()}

                            {/*{console.log(customer.name)}*/}
                        </div>
                    </div>
                    <div className="flex justify-end items-center mt-4">
                        <button onClick={onClose}
                                className="px-4 py-2 bg-gray-200 text-gray-800 text-base font-medium rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 mr-2">
                            Cancel
                        </button>
                        <button onClick={handleSave}
                                className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300">
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerModal;