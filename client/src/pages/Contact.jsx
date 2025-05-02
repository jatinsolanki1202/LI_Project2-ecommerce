import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';

const Contact = () => {
    const form = useRef();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        from_name: '',  // Changed from user_name
        from_email: '', // Changed from user_email
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const sendEmail = (e) => {
        e.preventDefault();
        setLoading(true);

        // Replace these with your EmailJS credentials
        emailjs.sendForm(
            'service_vtbmuni',
            'template_gj3bf5e',
            form.current,
            'VazotS1pAJ7iU0cyP'
        )
            .then(() => {
                toast.success('Message sent successfully!');
                form.current.reset();
                setFormData({ user_name: '', user_email: '', message: '' });
            })
            .catch(() => {
                toast.error('Failed to send message. Please try again.');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="bg-[#f9f9f9] text-gray-900 min-h-screen px-4 py-10">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-semibold mb-8">Contact Us</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Contact Information */}
                    <div className="bg-white rounded-lg shadow-md p-8">
                        <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-medium mb-2">Address</h3>
                                <p className="text-gray-600">123 Shopping Street, Commerce City, 12345</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium mb-2">Email</h3>
                                <p className="text-gray-600">support@yourecommerce.com</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium mb-2">Phone</h3>
                                <p className="text-gray-600">+1 (555) 123-4567</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white rounded-lg shadow-md p-8">
                        <h2 className="text-2xl font-semibold mb-4">Send Message</h2>
                        <form ref={form} onSubmit={sendEmail} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    name="from_name"
                                    value={formData.from_name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="from_email"
                                    value={formData.from_email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Message
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows="4"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition duration-300"
                            >
                                {loading ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;