import React from 'react';

const About = () => {
    return (
        <div className="bg-[#f9f9f9] text-gray-900 min-h-screen px-4 py-10">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-semibold mb-8">About Us</h1>

                <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
                    <p className="text-gray-600 mb-6">
                        We are passionate about delivering high-quality products directly to your doorstep.
                        Founded with a vision to make premium shopping accessible to everyone, we've grown
                        into a trusted destination for quality merchandise.
                    </p>

                    <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
                    <p className="text-gray-600 mb-6">
                        To provide our customers with an exceptional shopping experience through carefully
                        curated products, competitive prices, and outstanding customer service.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-semibold mb-3">Quality Products</h3>
                        <p className="text-gray-600">
                            We carefully select each product to ensure it meets our high standards of quality.
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-semibold mb-3">Fast Delivery</h3>
                        <p className="text-gray-600">
                            We partner with reliable delivery services to ensure your orders reach you quickly.
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-semibold mb-3">Customer Support</h3>
                        <p className="text-gray-600">
                            Our dedicated team is always ready to assist you with any questions or concerns.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;