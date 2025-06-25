import React, { useState, useEffect, useContext } from 'react';
import { Search, Filter, Eye, Package, Calendar, DollarSign, User, MapPin, Phone, Mail, RefreshCw, IndianRupee } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance.js';
import { storeContext } from '../context/StoreContext.jsx';
import toast from 'react-hot-toast';

const AdminOrdersManagement = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
    const [orderStatusFilter, setOrderStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderDetails, setShowOrderDetails] = useState(false);
    const { token } = useContext(storeContext);

    // Mock data - replace with actual API call
    //   const mockOrders = [
    //     {
    //       id: 1,
    //       order_number: 'ORD-2025-001',
    //       customer_name: 'John Doe',
    //       customer_email: 'john.doe@email.com',
    //       customer_phone: '+91 9876543210',
    //       shipping_address: '123 Main Street, Ahmedabad, Gujarat, 380001',
    //       total_amount: 2499.99,
    //       payment_status: 'paid',
    //       order_status: 'processing',
    //       created_at: '2025-06-20T10:30:00Z',
    //       updated_at: '2025-06-21T14:20:00Z',
    //       order_items: [
    //         {
    //           id: 1,
    //           product_name: 'Wireless Headphones',
    //           quantity: 2,
    //           price: 1249.99,
    //           total: 2499.98
    //         },
    //         {
    //           id: 2,
    //           product_name: 'Phone Case',
    //           quantity: 1,
    //           price: 299.99,
    //           total: 299.99
    //         }
    //       ]
    //     },
    //     {
    //       id: 2,
    //       order_number: 'ORD-2025-002',
    //       customer_name: 'Jane Smith',
    //       customer_email: 'jane.smith@email.com',
    //       customer_phone: '+91 9876543211',
    //       shipping_address: '456 Oak Avenue, Mumbai, Maharashtra, 400001',
    //       total_amount: 1899.99,
    //       payment_status: 'pending',
    //       order_status: 'pending',
    //       created_at: '2025-06-22T09:15:00Z',
    //       updated_at: '2025-06-22T09:15:00Z',
    //       order_items: [
    //         {
    //           id: 3,
    //           product_name: 'Bluetooth Speaker',
    //           quantity: 1,
    //           price: 1899.99,
    //           total: 1899.99
    //         }
    //       ]
    //     },
    //     {
    //       id: 3,
    //       order_number: 'ORD-2025-003',
    //       customer_name: 'Rahul Patel',
    //       customer_email: 'rahul.patel@email.com',
    //       customer_phone: '+91 9876543212',
    //       shipping_address: '789 Gandhi Road, Ahmedabad, Gujarat, 380015',
    //       total_amount: 3299.99,
    //       payment_status: 'paid',
    //       order_status: 'shipped',
    //       created_at: '2025-06-18T15:45:00Z',
    //       updated_at: '2025-06-23T11:30:00Z',
    //       order_items: [
    //         {
    //           id: 4,
    //           product_name: 'Smart Watch',
    //           quantity: 1,
    //           price: 3299.99,
    //           total: 3299.99
    //         }
    //       ]
    //     }
    //   ];

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        filterOrders();
    }, [searchTerm, paymentStatusFilter, orderStatusFilter, dateFilter, orders]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            // Replace with actual API call
            const response = await axiosInstance.get('/admin/orders', {
                headers: { token }
            });

            setOrders(response.data.orders);
            setLoading(false)
            console.log(response.data.orders[0], " asdfsdfasdf");

            // Using mock data for demonstration
            //   setTimeout(() => {
            //     setOrders(mockOrders);
            //     setLoading(false);
            //   }, 1000);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to fetch orders');
            setLoading(false);
        }
    };

    const filterOrders = () => {
        let filtered = [...orders];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(order =>
                order.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.User.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.User.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.customer_phone?.includes(searchTerm)
            );
        }

        // Payment status filter
        if (paymentStatusFilter !== 'all') {
            filtered = filtered.filter(order => order.status === paymentStatusFilter);
        }

        // Order status filter
        if (orderStatusFilter !== 'all') {
            filtered = filtered.filter(order => order.delivery_status === orderStatusFilter);
        }

        // Date filter
        if (dateFilter !== 'all') {
            const now = new Date();
            filtered = filtered.filter(order => {
                const orderDate = new Date(order.created_at);
                switch (dateFilter) {
                    case 'today':
                        return orderDate.toDateString() === now.toDateString();
                    case 'week':
                        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                        return orderDate >= weekAgo;
                    case 'month':
                        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                        return orderDate >= monthAgo;
                    default:
                        return true;
                }
            });
        }

        setFilteredOrders(filtered);
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            // Replace with actual API call
            await axiosInstance.put(`/admin/orders/${orderId}/status`, {
                status: newStatus
            }, {
                headers: { token }
            });

            setOrders(orders.map(order =>
                order.id === orderId
                    ? { ...order, order_status: newStatus, updated_at: new Date().toISOString() }
                    : order
            ));
            toast.success('Order status updated successfully');
        } catch (error) {
            console.error('Error updating order status:', error);
            toast.error('Failed to update order status');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status, type) => {
        const colors = {
            payment: {
                paid: 'bg-green-100 text-green-800',
                pending: 'bg-yellow-100 text-yellow-800',
                failed: 'bg-red-100 text-red-800'
            },
            order: {
                pending: 'bg-gray-100 text-gray-800',
                processing: 'bg-blue-100 text-blue-800',
                shipped: 'bg-purple-100 text-purple-800',
                delivered: 'bg-green-100 text-green-800',
                cancelled: 'bg-red-100 text-red-800'
            }
        };
        return colors[type][status] || 'bg-gray-100 text-gray-800';
    };

    const OrderDetailsModal = ({ order, onClose }) => (
        <div className="fixed inset-0 bg-[#454343c2] scrollbar-hide backdrop-blur-sm shadow-lg bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">Order Details - {order.id}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                        ×
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Customer Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Customer Information
                            </h3>
                            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                <p><strong>Name:</strong> {order.User.name}</p>
                                <p className="flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    {order.User.email}
                                </p>
                                <p className="flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    {order?.User.addresses[0].phone}
                                </p>
                                <p className="flex items-start gap-2">
                                    <MapPin className="w-4 h-4 mt-1" />
                                    {order.User.addresses[0]
                                        ? `${order.User.addresses[0].address1}, ${order.User.addresses[0].city}, ${order.User.addresses[0].state}, ${order.User.addresses[0].zip}, ${order.User.addresses[0].country}`
                                        : 'No address on file'}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Package className="w-5 h-5" />
                                Order Information
                            </h3>
                            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                <p><strong>Order ID:</strong> {order.id}</p>
                                <p><strong>Order Date:</strong> {formatDate(order.created_at)}</p>
                                <p><strong>Last Updated:</strong> {formatDate(order.created_at)}</p>
                                <div className="flex gap-2">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.payment_status, 'payment')}`}>
                                        Payment: {order.status}
                                    </span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.order_status, 'order')}`}>
                                        Status: {order.delivery_status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Order Items</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full border border-gray-200 rounded-lg">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Product</th>
                                        <th className="px-4 py-3 text-center">Quantity</th>
                                        <th className="px-4 py-3 text-right">Price</th>
                                        <th className="px-4 py-3 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.OrderItems.map((item) => (
                                        <tr key={item.id} className="border-t border-gray-200">
                                            <td className="px-4 py-3">{item.product_name}</td>
                                            <td className="px-4 py-3 text-center">{item.quantity}</td>
                                            <td className="px-4 py-3 text-right">₹{item.price}</td>
                                            <td className="px-4 py-3 text-right font-semibold">₹{item.quantity * item.price}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-gray-50">
                                    <tr>
                                        <td colSpan="3" className="px-4 py-3 text-right font-semibold">Total Amount:</td>
                                        <td className="px-4 py-3 text-right font-bold text-lg text-green-600">₹{order.total_amount}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    {/* Status Update */}
                    <div className="border-t pt-4">
                        <h3 className="text-lg font-semibold mb-4">Update Order Status</h3>
                        <div className="flex gap-2 flex-wrap">
                            {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => updateOrderStatus(order.id, status)}
                                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${order.order_status === status
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                >
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-[#f9f9f9] min-h-screen">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-semibold text-gray-900">Orders Management</h1>
                            <p className="text-gray-600 mt-1">Manage and track all customer orders</p>
                        </div>
                        <button
                            onClick={fetchOrders}
                            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search orders..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Payment Status Filter */}
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <select
                                value={paymentStatusFilter}
                                onChange={(e) => setPaymentStatusFilter(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                            >
                                <option value="all">All Payment Status</option>
                                <option value="paid">Paid</option>
                                <option value="pending">Pending</option>
                                <option value="failed">Failed</option>
                            </select>
                        </div>

                        {/* Order Status Filter */}
                        <div className="relative">
                            <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <select
                                value={orderStatusFilter}
                                onChange={(e) => setOrderStatusFilter(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                            >
                                <option value="all">All Order Status</option>
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>

                        {/* Date Filter */}
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <select
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                            >
                                <option value="all">All Time</option>
                                <option value="today">Today</option>
                                <option value="week">Last 7 Days</option>
                                <option value="month">Last 30 Days</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                            <span className="ml-2 text-gray-600">Loading orders...</span>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Order
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Customer
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Payment Status
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Order Status
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{order.id}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{order.User.name}</div>
                                                <div className="text-sm text-gray-500">{order.customer_email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-semibold text-green-600 flex items-center gap-1">
                                                    <IndianRupee className="w-4 h-4" />
                                                    {order.total_amount}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status, 'payment')}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.delivery_status, 'order')}`}>
                                                    {order.delivery_status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(order.created_at)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => {
                                                        setSelectedOrder(order);
                                                        setShowOrderDetails(true);
                                                    }}
                                                    className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {filteredOrders.length === 0 && (
                                <div className="text-center py-12">
                                    <Package className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {searchTerm || paymentStatusFilter !== 'all' || orderStatusFilter !== 'all' || dateFilter !== 'all'
                                            ? 'Try adjusting your search or filters'
                                            : 'No orders have been placed yet'}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Order Details Modal */}
                {showOrderDetails && selectedOrder && (
                    <OrderDetailsModal
                        order={selectedOrder}
                        onClose={() => {
                            setShowOrderDetails(false);
                            setSelectedOrder(null);
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default AdminOrdersManagement;