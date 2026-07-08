// Footer.jsx - Clean Modern Version
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaCartShopping } from "react-icons/fa6";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa6";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";
import { useSelector } from 'react-redux';

const quickLinks = [
    { label: 'Home', to: '/' },
    { label: 'Shops', to: '/all-shops' },
    { label: 'Blog', to: '/blog' },
    { label: 'About Us', to: '/about' },
    { label: 'Contact', to: '/contact' },
];

const socials = [
    { Icon: FaInstagram, href: 'https://www.instagram.com/nimbo.cloud', label: 'Instagram' },
    { Icon: FaFacebookF, href: 'https://www.facebook.com/share/18x5nmg38S/', label: 'Facebook' },
    { Icon: FaWhatsapp, href: 'https://wa.me/263771133269', label: 'WhatsApp' },
];

const Footer = () => {
    const navigate = useNavigate();
    const { userInfo } = useSelector(state => state.auth);
    const { card_product_count, wishlist_count } = useSelector(state => state.card);

    const heading = 'font-bold text-lg text-white relative inline-block after:absolute after:-bottom-2 after:left-0 after:w-10 after:h-1 after:bg-gradient-to-r after:from-cyan-500 after:to-cyan-400';

    return (
        <footer className='relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300'>
            <div className='w-[85%] mx-auto py-10'>

                {/* GRID = 4 COLUMNS */}
                {/* NB: this project's Tailwind screens are max-width (desktop-first),
                    so base = desktop (4 cols), md: overrides for small screens (2 cols). */}
                <div className="grid grid-cols-4 md:grid-cols-2 gap-x-8 gap-y-8">

                    {/* --- Column 1: Company Info --- */}
                    <div className="space-y-3">
                        <img className='w-[130px]' src="/images/logo.png" alt="logo" />

                        <p className='text-gray-400 leading-relaxed text-sm'>
                            Your one-stop destination for quality products and exceptional service.
                        </p>

                        <div className='flex gap-2'>
                            {socials.map(({ Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target='_blank'
                                    rel='noreferrer'
                                    aria-label={label}
                                    className='w-8 h-8 rounded-full bg-white/10 hover:bg-cyan-500 flex items-center justify-center text-gray-300 hover:text-white transition-colors text-sm'
                                >
                                    <Icon />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* --- Column 2: Quick Links --- */}
                    <div className="space-y-3">
                        <h2 className={heading}>Quick Links</h2>
                        <ul className='space-y-2 text-gray-400 text-sm'>
                            {quickLinks.map(({ label, to }) => (
                                <li key={label}>
                                    <Link to={to} className='hover:text-cyan-400 transition-colors'>
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* --- Column 3: Contact --- */}
                    <div className="space-y-3">
                        <h2 className={heading}>Contact</h2>
                        <ul className='space-y-2 text-gray-300 text-sm'>
                            <li className='flex items-center gap-3'>
                                <MdLocationOn className='text-cyan-500 text-lg shrink-0' />
                                Zimre Park, Harare
                            </li>
                            <li className='flex items-center gap-3'>
                                <MdPhone className='text-green-500 text-lg shrink-0' />
                                +263 776 573 701
                            </li>
                            <li className='flex items-center gap-3'>
                                <MdEmail className='text-red-500 text-lg shrink-0' />
                                info@nimbo.co.zw
                            </li>
                        </ul>
                    </div>

                    {/* --- Column 4: Newsletter --- */}
                    <div className="space-y-3 md:col-span-2">
                        <h2 className={heading}>Newsletter</h2>

                        <p className='text-gray-400 text-sm'>
                            Subscribe to get special offers and exclusive deals!
                        </p>

                        <div className='flex gap-2'>
                            <input
                                className='flex-1 min-w-0 h-[42px] bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 outline-none text-white placeholder:text-gray-400 focus:border-cyan-500 text-sm'
                                type="email"
                                placeholder='Enter your email'
                            />
                            <button className='h-[42px] px-4 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-cyan-700 transition-colors text-sm shrink-0'>
                                Subscribe
                            </button>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className='border-t border-white/10 mt-8 pt-5 flex justify-between flex-wrap gap-3 text-gray-400 text-sm'>
                    <span>© {new Date().getFullYear()} Nimbo. All Rights Reserved.</span>
                    <div className='flex gap-6'>
                        <Link to="/about" className='hover:text-cyan-400'>Terms of Service</Link>
                        <Link to="/about" className='hover:text-cyan-400'>Privacy Policy</Link>
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
