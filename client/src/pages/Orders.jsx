import React, { useEffect, useState, useContext } from "react";
import axiosInstance from "../utils/axiosInstance";
import { storeContext } from "../context/StoreContext";
import toast from "react-hot-toast";

const OrdersPage = () => {
    const { token } = useContext(storeContext);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axiosInstance.get("/user/orders", {
                    headers: { token },
                });
                if (response.data.success) {
                    setOrders(response.data.data);
                } else {
                    toast.error(response.data.message || "No orders found");
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
                toast.error("Failed to fetch orders");
            }
        };

        fetchOrders();
    }, [token]);

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4 md:px-12">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Your Orders</h1>

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 text-gray-600 gap-2">
                    <div>
                        <span className="font-semibold">Total Orders:</span> {orders.length}
                    </div>
                    <div>
                        <span className="font-semibold">Total Amount Spent:</span> ₹
                        {(orders?.reduce((acc, order) => acc + (parseFloat(order.total_amount) || 0), 0)).toFixed(2)}
                    </div>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center text-gray-500">No orders placed yet.</div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="bg-white shadow rounded-lg p-6 space-y-4"
                            >
                                <div className="flex flex-col md:flex-row justify-between text-sm text-gray-600">
                                    <div>
                                        <span className="font-semibold">Order ID:</span> #{order.id}
                                    </div>
                                    <div>
                                        <span className="font-semibold">Placed on:</span>{" "}
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </div>
                                    <div>
                                        <span className="font-semibold">Status:</span>{" "}
                                        <span
                                            className={`font-bold ${order.status === "pending"
                                                    ? "text-yellow-600"
                                                    : order.status === "delivered"
                                                        ? "text-green-600"
                                                        : "text-blue-600"
                                                }`}
                                        >
                                            {order.status.toUpperCase()}
                                        </span>
                                    </div>
                                </div>

                                <div className="divide-y divide-gray-200">
                                    {order.OrderItems.map((item) => {
                                        const product = item.Product || {};
                                        const image = product.Product_Images?.[0]?.image_path;

                                        return (
                                            <div
                                                key={item.id}
                                                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-4"
                                            >
                                                <img
                                                    src={image}
                                                    alt={product.name}
                                                    className="w-20 h-20 object-cover rounded"
                                                />
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-800">
                                                        {item.product_name}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">
                                                        Quantity: {item.quantity}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        Price: ₹{item.price}
                                                    </p>
                                                </div>
                                                <div className="text-right text-sm text-gray-700 font-medium">
                                                    ₹{item.quantity * item.price}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="text-right text-lg font-bold text-gray-800">
                                    Total: ₹{order.total_amount}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersPage;
