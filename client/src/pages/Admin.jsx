import React, { useContext, useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { MdEdit, MdDelete } from "react-icons/md";
import { storeContext } from "../context/storeContext.jsx";
import toast from "react-hot-toast";

const AdminPanel = () => {
  const { token, url, fetchToken } = useContext(storeContext)
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    name: "", description: "",
    price: "", stock: "", images: null, category: ""
  });
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchCategories = async () => {
    const response = await axiosInstance.get('/admin/category', {
      headers: { token }
    });

    console.log(response.data.data);

    setCategories(response.data.data)

  }

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])


  useEffect(() => {
    console.log(formData)

  }, [formData])
  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get("/products");
      setProducts(response.data.data);
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
    console.log(formData.category, "---oo");

    formDataObj.append("name", formData.name);
    formDataObj.append("description", formData.description);
    formDataObj.append("price", formData.price);
    formDataObj.append("stock", formData.stock);
    formDataObj.append("category", formData?.category != "" ? formData.category : "1");

    if (formData.images && formData.images.length > 0) {
      for (let i = 0; i < formData.images.length; i++) {
        formDataObj.append("images", formData.images[i]);
      }
    }

    try {
      if (editingProduct) {
        let response = await axiosInstance.put(`/admin/edit-product/${editingProduct.id}`, formDataObj, {
          "Content-Type": "multipart/form-data",
          headers: { token }
        });

        console.log("response", response.data);
        if (response.data.success) toast.success("Product details updated")
        else toast.error(response.data.message)

      } else {
        let response = await axiosInstance.post("/admin/add-product", formDataObj, {
          "Content-Type": "multipart/form-data",
          headers: { token }
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
    console.log(product.Category.name, "product...");

    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      stock: product.stock || "",
      category: product.Category.name,
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
    <div className="p-5 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-5">Admin Panel - Manage Products</h1>

      {/* Product Form */}
      <form onSubmit={handleSubmit} className="bg-gray-800 p-5 rounded-lg" encType="multipart/form-data">
        <h2 className="text-2xl font-semibold mb-3">{editingProduct ? "Edit Product" : "Add Product"}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Product Name" className="p-2 border border-gray-600 rounded bg-gray-700 text-white" required />
          <input type="text" name="description" value={formData.description} onChange={handleInputChange} placeholder="Description" className="p-2 border border-gray-600 rounded bg-gray-700 text-white" required />
          <input type="number" name="price" value={formData.price} onChange={handleInputChange} placeholder="Price" className="p-2 border border-gray-600 rounded bg-gray-700 text-white" required />
          <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} placeholder="Stock" className="p-2 border border-gray-600 rounded bg-gray-700 text-white" required />
          <select name="category" value={formData.category} onChange={handleInputChange} className="p-2 border border-gray-600 rounded bg-gray-700 text-white">
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <input type="file" name="images" onChange={handleInputChange} className="p-2 border border-gray-600 rounded bg-gray-700 text-white" required={!editingProduct} multiple />
        </div>
        <button type="submit" className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
          {editingProduct ? "Update Product" : "Add Product"}
        </button>
      </form>

      {/* Product List */}
      <div className="mt-6 bg-gray-800 p-5 rounded-lg">
        <h2 className="text-2xl font-semibold mb-3">All Products</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-white">
            <thead>
              <tr className="bg-gray-700 text-left">
                <th className="p-3">Images</th>
                <th className="p-3">Name</th>
                <th className="p-3">Category</th>
                <th className="p-3 text-right">Price (₹)</th>
                <th className="p-3 text-right">Stock</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-gray-600">
                  <td className="p-3">
                    <img src={`http://127.0.0.1:8000/images/${product.Product_Images[0]?.image_path}`} alt={product.name} className="h-12 w-12 object-cover rounded" />
                  </td>
                  <td className="p-3">{product.name}</td>
                  <td className="p-3">{product.Category.name}</td>
                  <td className="p-3 text-right">{product.price}</td>
                  <td className="p-3 text-right">{product.stock}</td>
                  <td className="p-3 flex gap-2 justify-center">
                    <button onClick={() => handleEdit(product)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded flex items-center">
                      <MdEdit className="mr-1" /> Edit
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center">
                      <MdDelete className="mr-1" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
