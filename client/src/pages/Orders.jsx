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
                                className="bg-white shadow-lg rounded-lg p-6 space-y-6"
                            >
                                {/* Header Row */}
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-sm text-gray-600">
                                    <div>
                                        <span className="font-semibold">Order ID:</span> #{order.id}
                                    </div>
                                    <div>
                                        <span className="font-semibold">Placed on:</span>{" "}
                                        {new Date(order.created_at).toLocaleDateString("en-IN", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </div>
                                    <div className="flex space-x-4 mt-2 md:mt-0">
                                        {/* Payment Status Badge */}
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-semibold ${order.payment_status === "paid"
                                                    ? "bg-green-100 text-green-800"
                                                    : order.payment_status === "pending"
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}
                                        >
                                            Payment: {order.status.toUpperCase()}
                                        </span>

                                        {/* Delivery Status Badge */}
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-semibold ${order.delivery_status === "delivered"
                                                    ? "bg-green-100 text-green-800"
                                                    : order.delivery_status === "shipped"
                                                        ? "bg-purple-100 text-purple-800"
                                                        : order.delivery_status === "processing"
                                                            ? "bg-blue-100 text-blue-800"
                                                            : order.delivery_status === "pending"
                                                                ? "bg-yellow-100 text-yellow-800"
                                                                : "bg-red-100 text-red-800"
                                                }`}
                                        >
                                            Delivery: {order.delivery_status.toUpperCase()}
                                        </span>
                                    </div>
                                </div>

                                {/* Items List */}
                                <div className="divide-y divide-gray-200">
                                    {order.OrderItems.map((item) => {
                                        const product = item.Product || {};
                                        const image = product.Product_Images?.[0]?.image_path;
                                        const subTotal = item.quantity * Number(item.price);
                                        const tax = subTotal * 0.18;
                                        return (
                                            <div
                                                key={item.id}
                                                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-4"
                                            >
                                                <img
                                                    src={
                                                        image ||
                                                        "https://img.freepik.com/free-vector/realistic-round-box-mockup_52683-87713.jpg?semt=ais_hybrid&w=740"
                                                    }
                                                    alt={product.name}
                                                    className="w-20 h-20 object-contain rounded"
                                                />
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-800">
                                                        {item.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">
                                                        Qty: {item.quantity}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        Price: ₹{Number(item.price).toFixed(2)}
                                                    </p>
                                                </div>
                                                <div className="text-right text-sm text-gray-700 font-medium space-y-1">
                                                    <div>Sub-total: ₹{subTotal.toFixed(2)}</div>
                                                    <div>+ GST (18%): ₹{tax.toFixed(2)}</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Grand Total */}
                                <div className="text-right text-lg font-bold text-gray-800">
                                    Total: ₹
                                    {(
                                        Number(order.total_amount) +
                                        Number(order.total_amount) * 0.18
                                    ).toFixed(2)}
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
