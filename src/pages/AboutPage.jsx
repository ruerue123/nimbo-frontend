import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const About = () => {
    return (
        <div className="w-full">
            <Header />
            <div className="w-[85%] mx-auto py-16">
                <h1 className="text-4xl font-bold mb-6 text-gray-800">About Us</h1>

                <p className="text-gray-600 leading-7 text-lg">
                    Nimbo Online is a modern multi-vendor marketplace designed to empower Zimbabwean
                    businesses by giving them a secure, beautiful, and easy-to-use platform to sell
                    their products online.
                </p>

                <p className="text-gray-600 mt-4 leading-7 text-lg">
                    Our mission is to bring convenience, trust, and growth to e-commerce by
                    connecting customers with reliable sellers across the country.
                </p>
            </div>
            <Footer />
        </div>
    );
};

export default About;
