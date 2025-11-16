import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Contact = () => {
    return (
        <div className="w-full">
            <Header />
            <div className="w-[85%] mx-auto py-16">
                <h1 className="text-4xl font-bold mb-6 text-gray-800">Contact Us</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                    <div>
                        <p className="text-gray-600 mb-4 text-lg">
                            Have questions? We’re here to help.
                        </p>

                        <ul className="text-gray-700 space-y-2">
                            <li><strong>Email:</strong> info@nimbo.co.zw</li>
                            <li><strong>Phone:</strong> +263 776 573 701</li>
                            <li><strong>Location:</strong> Harare, Zimbabwe</li>
                        </ul>
                    </div>

                    <form className='bg-white shadow-lg p-6 rounded-xl'>
                        <input
                            type="text"
                            placeholder="Your Name"
                            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg"
                        />
                        <input
                            type="email"
                            placeholder="Your Email"
                            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg"
                        />
                        <textarea
                            placeholder="Your Message"
                            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg h-32"
                        ></textarea>

                        <button
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-bold"
                        >
                            Send Message
                        </button>
                    </form>

                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Contact;
