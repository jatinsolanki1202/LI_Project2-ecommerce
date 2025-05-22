import React, { useContext, useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance.js";
import { MdEdit, MdDelete } from "react-icons/md";
import { storeContext } from "../context/StoreContext.jsx";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar.jsx";

const AdminProductPage = () => {
  const { token, url, fetchToken } = useContext(storeContext)
  const navigate = useNavigate()
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    name: "", description: "",
    price: "", stock: "", images: null, category: ""
  });
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchCategories = async () => {
    const response = await axiosInstance.get('/admin/category', {
      headers: { token: localStorage.getItem("token") }
    });
    setCategories(response.data.data)
  }

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get("/admin/products", {
        headers: {
          token: localStorage.getItem("token")
        }
      });

      if (response.data.status !== 200) {
        toast.error("Unauthorized access, please login again");
        navigate("/admin/login");
        return;
      }
      setProducts(response.data.data.reverse());
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataObj = new FormData();

    formDataObj.append("name", formData.name);
    formDataObj.append("description", formData.description);
    formDataObj.append("price", formData.price);
    formDataObj.append("stock", formData.stock);
    formDataObj.append("category", formData?.category != "" ? formData.category : "earphones");

    if (formData.images && formData.images.length > 0) {
      for (let i = 0; i < formData.images.length; i++) {
        formDataObj.append("images", formData.images[i]);
      }
    }

    try {
      if (editingProduct) {
        let response = await axiosInstance.put(`/admin/edit-product/${editingProduct.id}`, formDataObj, {
          headers: {
            "Content-Type": "multipart/form-data",
            token
          }
        });

        if (response.data.success) toast.success(response.data.message)
        else toast.error(response.data.message)

      } else {
        let response = await axiosInstance.post("/admin/add-product", formDataObj, {
          headers: {
            "Content-Type": "multipart/form-data",
            token
          }
        });

        if (response.data.message == "session timed out. Please login again") {
          localStorage.removeItem("token")
          fetchToken()
        }
        if (response.data.success) toast.success(response.data.message)
        else toast.error(response.data.message)
      }
      setFormData({ name: "", description: "", price: "", stock: "", images: null, category: "" });
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Failed to save product")
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product?.name,
      description: product?.description,
      price: product?.price,
      stock: product?.stock || 0,
      category: product?.Category.name || "earphones",
      images: null,
    });
  };

  const handleDelete = async (id) => {
    try {
      const response = await axiosInstance.post(`/admin/delete-product/${id}`, {}, {
        headers: { token }
      });

      if (response.data.message == "session timed out. Please login again") {
        localStorage.removeItem("token")
        toast.error(response.data.message)
        fetchToken()
      } else if (response.data.success) {
        toast.success(response.data.message)
      } else {
        toast.error(response.data.message)
      }

      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Product Management</h1>

          {/* Product Form */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="p-6 bg-gradient-to-r from-blue-500 to-blue-200">
              <h2 className="text-xl font-semibold text-white">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6" encType="multipart/form-data">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    name="category"
                    defaultValue={"earphones"}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option disabled>Select Category</option>
                    {categories?.map((cat) => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter product description"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  rows="4"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Enter price"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min={0}
                    placeholder="Enter stock quantity"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {editingProduct ? "Update Images" : "Upload Images"}
                  </label>
                  <input
                    type="file"
                    name="images"
                    onChange={handleInputChange}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    required={!editingProduct}
                    multiple
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ name: "", description: "", price: "", stock: "", images: null, category: "" });
                    setEditingProduct(null);
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {editingProduct ? "Update Product" : "Add Product"}
                </button>
              </div>
            </form>
          </div>

          {/* Product List */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-blue-500 to-blue-200">
              <h2 className="text-xl font-semibold text-white">Product Inventory</h2>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Image
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              src={`https://ecommerce-project-1-rho.vercel.app/images/${product.Product_Images[0]?.image_path}`}
                              alt={product.name}
                              className="h-10 w-10 rounded-md object-contain"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{product.Category.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">₹{product.price}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                          <button
                            onClick={() => handleEdit(product)}
                            className="mr-2 text-blue-600 hover:text-blue-900"
                          >
                            <MdEdit className="inline mr-1" size={18} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <MdDelete className="inline mr-1" size={18} />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminProductPage;