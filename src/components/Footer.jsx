// Footer.jsx - Clean Modern Version
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaCartShopping } from "react-icons/fa6";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";
import { useSelector } from 'react-redux';

const Footer = () => {
    const navigate = useNavigate();
    const { userInfo } = useSelector(state => state.auth);
    const { card_product_count, wishlist_count } = useSelector(state => state.card);

    return (
        <footer className='relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300'>
            <div className='w-[85%] mx-auto py-16'>

                {/* GRID = 2 CLEAN COLUMNS */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                    {/* --- Column 1: Company Info --- */}
                    <div className="space-y-6">
                        <img className='w-[180px]' src="/images/logo.png" alt="logo" />

                        <p className='text-gray-400 leading-relaxed'>
                            Your one-stop destination for quality products and exceptional service. Shop with confidence!
                        </p>

                        <ul className='space-y-3 text-gray-300'>
                            <li className='flex items-center gap-3'>
                                <MdLocationOn className='text-cyan-500 text-xl' />
                                Zimre Park, Harare
                            </li>
                            <li className='flex items-center gap-3'>
                                <MdPhone className='text-green-500 text-xl' />
                                +263 776 573 701
                            </li>
                            <li className='flex items-center gap-3'>
                                <MdEmail className='text-red-500 text-xl' />
                                info@nimbo.co.zw
                            </li>
                        </ul>
                    </div>

                    {/* --- Column 2: Newsletter --- */}
                    <div className="space-y-6">

                        <h2 className='font-bold text-xl text-white relative inline-block after:absolute after:-bottom-2 after:left-0 after:w-12 after:h-1 after:bg-gradient-to-r from-cyan-500 to-cyan-500'>
                            Newsletter
                        </h2>

                        <p className='text-gray-300'>
                            Subscribe to get special offers, free giveaways, and exclusive deals!
                        </p>

                        <div className='relative'>
                            <input
                                className='w-full h-[50px] bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 outline-none text-white placeholder:text-gray-400 focus:border-cyan-500'
                                type="email"
                                placeholder='Enter your email'
                            />
                            <button className='absolute right-1 top-1 h-[42px] px-6 bg-gradient-to-r from-cyan-400 to-cyan-600 text-white font-semibold rounded-lg hover:from-cyan-700 hover:to-cyan-700'>
                                Subscribe
                            </button>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className='border-t border-white/10 mt-12 pt-6 flex justify-between flex-wrap text-gray-400 text-sm'>
                    <span>© 2025 Nimbo. All Rights Reserved.</span>
                    <div className='flex gap-6'>
                        <Link to="#" className='hover:text-cyan-400'>Terms of Service</Link>
                        <Link to="#" className='hover:text-cyan-400'>Privacy Policy</Link>
                    </div>
                </div>
            </div>

            {/* Floating Mobile Buttons */}
            <div className='hidden md:flex fixed bottom-6 right-6 flex-col gap-3 z-50'>
                <button
                    onClick={() => navigate(userInfo ? '/card' : '/login')}
                    className='relative w-14 h-14 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition'
                >
                    <FaCartShopping className='text-white text-xl' />
                    {card_product_count !== 0 &&
                        <span className='absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold'>
                            {card_product_count}
                        </span>
                    }
                </button>

                <button
                    onClick={() => navigate(userInfo ? '/dashboard/my-wishlist' : '/login')}
                    className='relative w-14 h-14 bg-gradient-to-br from-pink-500 to-red-600 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition'
                >
                    <FaHeart className='text-white text-xl' />
                    {wishlist_count !== 0 &&
                        <span className='absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold'>
                            {wishlist_count}
                        </span>
                    }
                </button>
            </div>
        </footer>
    );
};

export default Footer;
