import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ isOpen, onClose }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const searchRef = useRef(null);
    const navigate = useNavigate();
    const url = "https://ecommerce-project-1-rho.vercel.app";

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    useEffect(() => {
        const searchProducts = async () => {
            if (!searchQuery.trim()) {
                setSearchResults([]);
                return;
            }

            setLoading(true);
            try {
                const response = await axiosInstance.get(`/user/home`);
                const products = response.data.data;
                const filtered = products.filter(product =>
                    product.name.toLowerCase().includes(searchQuery.toLowerCase())
                );
                setSearchResults(filtered);
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setLoading(false);
            }
        };

        const debounce = setTimeout(searchProducts, 300);
        return () => clearTimeout(debounce);
    }, [searchQuery]);

    const handleProductClick = (productId) => {
        navigate(`/products?id=${productId}`);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-[transparent] bg-opacity-50 z-50 flex items-start justify-center pt-20">
            <div ref={searchRef} className="bg-white w-full max-w-2xl rounded-lg shadow-xl mx-4">
                <div className="p-4">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search products..."
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                    />
                </div>

                <div className="max-h-96 overflow-y-auto">
                    {loading ? (
                        <div className="p-4 text-center text-gray-500">Loading...</div>
                    ) : searchResults.length > 0 ? (
                        <div className="divide-y">
                            {searchResults.map((product) => (
                                <div
                                    key={product.id}
                                    onClick={() => handleProductClick(product.id)}
                                    className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer"
                                >
                                    <img
                                        src={`${product?.Product_Images[0]?.image_path}`}
                                        alt={product.name}
                                        className="w-16 h-16 object-contain"
                                    />
                                    <div>
                                        <h3 className="font-medium">{product.name}</h3>
                                        <p className="text-green-600">₹{product.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : searchQuery ? (
                        <div className="p-4 text-center text-gray-500">No products found</div>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default SearchBar;