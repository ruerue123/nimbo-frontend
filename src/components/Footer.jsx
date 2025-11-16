// Footer.jsx - Modern redesigned version
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaLinkedin, FaGithub, FaHeart, FaCartShopping } from "react-icons/fa6";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";
import { useSelector } from 'react-redux';

const Footer = () => {
    const navigate = useNavigate();
    const { userInfo } = useSelector(state => state.auth);
    const { card_product_count, wishlist_count } = useSelector(state => state.card);

    const socialLinks = [
        { Icon: FaFacebookF, color: 'hover:bg-blue-600' },
        { Icon: FaTwitter, color: 'hover:bg-sky-500' },
        { Icon: FaLinkedin, color: 'hover:bg-blue-700' },
        { Icon: FaGithub, color: 'hover:bg-gray-800' }
    ];

    const usefulLinks = [
        'About Us',
        'About Our Shop',
        'Delivery Information',
        'Privacy Policy',
        'Blogs'
    ];

    const services = [
        'Our Service',
        'Company Profile',
        'Delivery Information',
        'Privacy Policy',
        'Blogs'
    ];

    return (
        <footer className='relative'>
            {/* Main Footer */}
            <div className='bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'>
                <div className='w-[85%] flex flex-wrap mx-auto py-16 md-lg:pb-10 sm:pb-6 gap-8'>
                    {/* Company Info */}
                    <div className='w-full lg:w-[calc(33.333%-1rem)] md:w-full'>
                        <div className='flex flex-col gap-6'>
                            <img className='w-[180px] h-auto' src="/images/logo.png" alt="logo" />
                            <p className='text-gray-400 leading-relaxed'>
                                Your one-stop destination for quality products and exceptional service. Shop with confidence!
                            </p>
                            <ul className='flex flex-col gap-3 text-gray-300'>
                                <li className='flex items-center gap-3'>
                                    <MdLocationOn className='text-blue-500 text-xl flex-shrink-0' />
                                    <span>Zimre Park, Harare</span>
                                </li>
                                <li className='flex items-center gap-3'>
                                    <MdPhone className='text-green-500 text-xl flex-shrink-0' />
                                    <span>+263 776 573 701</span>
                                </li>
                                <li className='flex items-center gap-3'>
                                    <MdEmail className='text-red-500 text-xl flex-shrink-0' />
                                    <span>info@nimbo.co.zw</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Useful Links */}
                    <div className='w-full lg:w-[calc(33.333%-1rem)] md:w-full'>
                        <div className='flex justify-center sm:justify-start w-full'>
                            <div>
                                <h2 className='font-bold text-xl mb-6 text-white relative inline-block after:absolute after:bottom-[-8px] after:left-0 after:w-12 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-purple-500 after:rounded-full'>
                                    Quick Links
                                </h2>
                                <div className='flex gap-12 lg:gap-8'>
                                    <ul className='flex flex-col gap-3 text-gray-300'>
                                        {usefulLinks.map((link, i) => (
                                            <li key={i}>
                                                <Link to="#" className='hover:text-blue-400 transition-colors hover:translate-x-1 inline-block duration-200'>
                                                    {link}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>

                                    <ul className='flex flex-col gap-3 text-gray-300'>
                                        {services.map((service, i) => (
                                            <li key={i}>
                                                <Link to="#" className='hover:text-blue-400 transition-colors hover:translate-x-1 inline-block duration-200'>
                                                    {service}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div className='w-full lg:w-[calc(33.333%-1rem)] md:w-full'>
                        <div className='flex flex-col gap-5'>
                            <h2 className='font-bold text-xl text-white relative inline-block after:absolute after:bottom-[-8px] after:left-0 after:w-12 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-purple-500 after:rounded-full'>
                                Newsletter
                            </h2>
                            <p className='text-gray-300 leading-relaxed'>
                                Subscribe to get special offers, free giveaways, and exclusive deals!
                            </p>
                            <div className='relative'>
                                <input
                                    className='w-full h-[50px] bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 outline-none text-white placeholder:text-gray-400 focus:border-blue-500 focus:bg-white/15 transition-all'
                                    type="email"
                                    placeholder='Enter your email'
                                />
                                <button className='absolute right-1 top-1 h-[42px] px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all'>
                                    Subscribe
                                </button>
                            </div>

                            {/* Social Links */}
                            <div>
                                <p className='text-gray-400 mb-3 text-sm'>Follow us on social media</p>
                                <ul className='flex gap-3'>
                                    {socialLinks.map(({ Icon, color }, i) => (
                                        <li key={i}>
                                            <a
                                                href="#"
                                                className={`w-11 h-11 flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white ${color} hover:text-white transition-all hover:scale-110`}
                                            >
                                                <Icon />
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className='border-t border-white/10'>
                    <div className='w-[85%] mx-auto py-6'>
                        <div className='flex justify-between items-center flex-wrap gap-4 text-gray-400 text-sm'>
                            <span>© 2025 Nimbo. All Rights Reserved.</span>
                            <div className='flex gap-6'>
                                <Link to="#" className='hover:text-blue-400 transition-colors'>Terms of Service</Link>
                                <Link to="#" className='hover:text-blue-400 transition-colors'>Privacy Policy</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Floating Action Buttons */}
            <div className='hidden md-lg:flex fixed bottom-6 right-6 flex-col gap-3 z-50'>
                <button
                    onClick={() => navigate(userInfo ? '/card' : '/login')}
                    className='relative w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all hover:scale-110 group'
                >
                    <FaCartShopping className='text-white text-xl group-hover:scale-110 transition-transform' />
                    {card_product_count !== 0 && (
                        <span className='absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full text-white flex items-center justify-center text-xs font-bold shadow-lg'>
                            {card_product_count}
                        </span>
                    )}
                </button>

                <button
                    onClick={() => navigate(userInfo ? '/dashboard/my-wishlist' : '/login')}
                    className='relative w-14 h-14 bg-gradient-to-br from-pink-500 to-red-600 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all hover:scale-110 group'
                >
                    <FaHeart className='text-white text-xl group-hover:scale-110 transition-transform' />
                    {wishlist_count !== 0 && (
                        <span className='absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full text-white flex items-center justify-center text-xs font-bold shadow-lg'>
                            {wishlist_count}
                        </span>
                    )}
                </button>
            </div>
        </footer>
    );
};

export default Footer;