import React, { useContext, useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, LineElement, PointElement } from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";
import { storeContext } from "../context/StoreContext.jsx";
import AdminSidebar from "../components/AdminSidebar";
const AdminPanel = () => {
  ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
  );
  const navigate = useNavigate()
  const { fetchToken, token } = useContext(storeContext)
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [selectedProduct, setSelectedProduct] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const checkUserRole = async () => {
    try {
      let token = localStorage.getItem("token")
      if (!token) navigate("admin/login")

      let response = await axiosInstance.get("/check/login-status", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.data.role == "admin") {
        navigate("/admin")
      } else {
        navigate("/admin/login")
      }
    } catch (err) {
      toast.error("something went wrong")
    }
  }

  const fetchCategories = async () => {
    try {
      const categoryResponse = await axiosInstance.get("/admin/category", {
        headers: {
          token: localStorage.getItem("token")
        }
      })
      if (categoryResponse.data.success) {
        setCategories(categoryResponse.data.data)
      }

    } catch (error) {
      console.log("error fetching categories:", error.message)
    }
  }

  const fetchProducts = async () => {
    try {
      const productResponse = await axiosInstance.get("/products", {
        headers: {
          token: token
        }
      })
      if (productResponse.data.success) {
        setProducts(productResponse.data.data)
      }

    } catch (error) {
      console.log("error fetching categories:", error.message)
    }
  }

  const fetchOrders = async () => {
    try {
      const ordersResponse = await axiosInstance.get("/orders", {
        headers: {
          token: token
        }
      })
      if (ordersResponse.data.success) {
        setOrders(ordersResponse.data.data)
      }
    } catch (error) {
      console.log("error fetching categories:", error.message)
    }
  }
  useEffect(() => {
    checkUserRole()
    fetchCategories()
    fetchProducts()
    fetchOrders()
  }, [])

  const categoryData = {
    labels: categories.map(category => category.name),
    datasets: [
      {
        label: 'Products',
        data: categories.map(category => category?.Products?.length),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(75, 192, 118, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(246, 55, 169, 0.59)',
        ],
        borderWidth: 4,
      },
    ],
  }

  const productOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chart.js Bar Chart',
      },
    },
  };

  const productsData = {
    labels: products?.map(product => product.name),
    datasets: [
      {
        label: 'Sales',
        data: products.map(product => {
          const totalQuantity = orders?.reduce((sum, order) => {
            const orderItems = order.OrderItems.filter(item => item.product_id === product.id);
            return sum + orderItems.reduce((itemSum, item) => itemSum + item.quantity, 0);
          }, 0);
          return totalQuantity;
        }),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]

  }

  const getUniqueMonths = () => {
    const uniqueMonths = [...new Set(orders?.map(order => {
      const date = new Date(order.created_at);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }))].sort().reverse();

    return uniqueMonths;
  };

  const isDateInRange = (dateToCheck) => {
    if (!startDate && !endDate) return true;

    const orderDate = new Date(dateToCheck);
    orderDate.setHours(0, 0, 0, 0);

    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (end) end.setDate(end.getDate() + 1);

    if (start && end) {
      return orderDate >= start && orderDate < end;
    } else if (start) {
      return orderDate >= start;
    } else if (end) {
      return orderDate < end;
    }
    return true;
  };

  const ordersData = {
    labels: orders
      ?.filter(order => isDateInRange(order.created_at))
      ?.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      ?.map(order => {
        const date = new Date(order.created_at);
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
      }),
    datasets: [{
      label: selectedProduct ?
        `Orders for ${products.find(p => p.id === parseInt(selectedProduct))?.name || 'Selected Product'}` :
        'Select a product',
      data: orders
        ?.filter(order => isDateInRange(order.created_at))
        ?.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        ?.map(order => {
          const orderItems = order.OrderItems.filter(item =>
            item.product_id === parseInt(selectedProduct)
          );
          return orderItems.reduce((sum, item) => sum + item.quantity, 0);
        }),
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1,
      fill: false
    }]
  }

  const ordersOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      }
    },
    plugins: {
      tooltip: {
        enabled: true
      },
      legend: {
        display: true,
        position: 'top'
      }
    }
  }

  let revenueSum = 0
  for (let order of orders) {
    revenueSum += Number(order.total_amount)
  }

  useEffect(() => {
    console.log('Date Range:', { startDate, endDate });
    console.log('Filtered Orders:', orders?.filter(order => isDateInRange(order.created_at)));
  }, [startDate, endDate, orders]);

  return (
    <div className="flex bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-semibold text-gray-800">Welcome to Admin Panel</h1>
        <p className="text-gray-600 mt-2">Manage your store efficiently from here.</p>

        {/* Dashboard Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white shadow-lg rounded-lg p-6 h-[550px]">
            <h3 className="text-xl font-semibold text-gray-700">Total Categories</h3>
            <p className="text-2xl font-bold text-blue-600">{categories?.length}</p>
            <div className="h-[300px] flex items-center justify-center">
              <Doughnut className="mt-5" data={categoryData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
            <h2>Categories</h2>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6 h-[550px]">
            <h3 className="text-xl font-semibold text-gray-700">Orders</h3>
            <p className="text-2xl font-bold text-red-600">{orders?.length}</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Product
                </label>
                <select
                  className="w-full px-2 py-1 border rounded-md text-sm"
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  value={selectedProduct}
                >
                  <option value="">Select a product</option>
                  {products?.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-2 py-1 border rounded-md text-sm"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      if (endDate && new Date(e.target.value) > new Date(endDate)) {
                        setEndDate('');
                      }
                    }}
                    max={endDate || undefined}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-2 py-1 border rounded-md text-sm"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      if (startDate && new Date(startDate) > new Date(e.target.value)) {
                        setStartDate('');
                      }
                    }}
                    min={startDate || undefined}
                  />
                </div>
              </div>
            </div>

            <div className="h-[300px] mt-4">
              <Line
                data={ordersData}
                options={ordersOptions}
              />
            </div>
          </div>

          {/* Orders chart */}
          <div className="bg-white shadow-lg rounded-lg p-6 lg:col-span-2 h-[500px]">
            <h3 className="text-xl font-semibold text-gray-700">Total Orders Chart</h3>
            <h5 className="text-md font-semibold text-gray-700"> Total products: <span className="text-blue-600">{products?.length}</span></h5>
            {/* <p className="text-2xl font-bold text-green-600">{products?.length}</p> */}
            <div className="h-[400px] w-full">
              <Bar responsive={true} data={productsData} options={{ ...productOptions, maintainAspectRatio: false }} />
            </div>
          </div>

          {/* Sales Chart */}


          <div className="bg-white shadow-lg rounded-lg p-6 lg:col-span-2 h-[500px]">
            <h3 className="text-xl font-semibold text-gray-700">Product Revenue Analysis</h3>
            <h5 className="text-md font-semibold text-gray-700">
              Total revenue: <span className="text-blue-600">
                ₹ {Number(revenueSum).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </h5>

            <div className="h-[400px] w-full mt-4">
              <Bar
                data={{
                  labels: products?.map(product => product.name) || [],
                  datasets: [{
                    label: 'Revenue (₹)',
                    data: products?.map(product => {
                      // Calculate total revenue for each product
                      const revenue = orders?.reduce((totalRevenue, order) => {
                        // Get all order items for this product
                        const productItems = order.OrderItems?.filter(item =>
                          item.product_id === product.id
                        );
                        // Since price is not saved in OrderItems, get price from the product object
                        // Calculate revenue for this product in this order
                        const orderRevenue = productItems.reduce((sum, item) =>
                          sum + (Number(product.price) * Number(item.quantity)), 0
                        );

                        return totalRevenue + orderRevenue;
                      }, 0) || 0;
                      return revenue;
                    }) || [],
                    backgroundColor: 'rgba(47, 109, 171, 0.6)',
                    borderColor: 'rgb(42, 104, 191)',
                    borderWidth: 1
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Revenue (₹)'
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: 'Product Revenue Distribution'
                    },
                    tooltip: {
                      callbacks: {
                        label: function (context) {
                          return `Revenue: ₹${context.raw.toFixed(2)}`;
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
