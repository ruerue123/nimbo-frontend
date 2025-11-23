// Header.jsx - Modern version
import React, { useEffect, useState } from 'react';
import { MdEmail, MdSearch } from "react-icons/md";
import { IoMdPhonePortrait } from "react-icons/io";
import { FaList, FaLock, FaUser, FaTimes } from "react-icons/fa";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHeart, FaCartShopping } from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { get_card_products, get_wishlist_products } from '../store/reducers/cardReducer';

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { categorys } = useSelector(state => state.home);
    const { userInfo } = useSelector(state => state.auth);
    const { card_product_count, wishlist_count } = useSelector(state => state.card);

    const { pathname } = useLocation();

    const [categoryShow, setCategoryShow] = useState(true);
    const [searchValue, setSearchValue] = useState('');
    const [category, setCategory] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const search = () => {
        navigate(`/products/search?category=${category}&&value=${searchValue}`);
    };

    const redirect_card_page = () => {
        if (userInfo) {
            navigate('/card');
        } else {
            navigate('/login');
        }
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    useEffect(() => {
        if (userInfo) {
            dispatch(get_card_products(userInfo.id));
            dispatch(get_wishlist_products(userInfo.id));
        }
    }, [userInfo, dispatch]);

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/shops', label: 'Shop' },
        { path: '/blog', label: 'Blog' },
        { path: '/about', label: 'About Us' },
        { path: '/contact', label: 'Contact Us' }
    ];

    return (
        <div className='w-full bg-white shadow-sm'>
            {/* Top Header */}
            <div className='bg-gradient-to-r from-cyan-400 via-indigo-600 to-cyan-600 md-lg:hidden'>
                <div className='w-[85%] lg:w-[90%] mx-auto'>
                    <div className='flex w-full justify-between items-center h-[45px] text-white'>
                        <ul className='flex justify-start items-center gap-6 font-medium text-sm'>
                            <li className='flex items-center gap-2 relative after:absolute after:h-[14px] after:w-[1px] after:bg-white/30 after:-right-[12px]'>
                                <MdEmail />
                                <span>info@nimbo.co.zw</span>
                            </li>
                            <li className='flex items-center gap-2'>
                                <IoMdPhonePortrait />
                                <span>+263 776 573 701</span>
                            </li>
                        </ul>

                        <div className='flex items-center gap-6'>
                            {userInfo ? (
                                <Link className='flex items-center gap-2' to='/dashboard'>
                                    <FaUser />
                                    <span className='font-medium'>{userInfo.name}</span>
                                </Link>
                            ) : (
                                <Link to='/login' className='flex items-center gap-2'>
                                    <FaLock />
                                    <span className='font-medium'>Login</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className='border-b border-gray-100'>
                <div className='w-[85%] lg:w-[90%] mx-auto'>
                    <div className='h-[90px] md-lg:h-[70px] flex justify-between items-center'>
                        {/* Logo - Left side */}
                        <div className='w-3/12 md-lg:w-auto'>
                            <Link to='/' className='flex items-center gap-2'>
                                <img src="/images/logo.png" alt="" className='h-14 md-lg:h-10' />
                            </Link>
                        </div>

                        {/* Mobile Icons - Right side (only visible on mobile) */}
                        <div className='hidden md-lg:flex items-center gap-2'>
                            <button
                                onClick={() => navigate(userInfo ? '/dashboard/my-wishlist' : '/login')}
                                className='relative w-9 h-9 flex items-center justify-center rounded-full bg-pink-50'
                            >
                                <FaHeart className='text-red-500 text-sm' />
                                {wishlist_count !== 0 && (
                                    <span className='absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white flex items-center justify-center text-[10px] font-bold'>
                                        {wishlist_count}
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={redirect_card_page}
                                className='relative w-9 h-9 flex items-center justify-center rounded-full bg-cyan-50'
                            >
                                <FaCartShopping className='text-cyan-500 text-sm' />
                                {card_product_count !== 0 && (
                                    <span className='absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 rounded-full text-white flex items-center justify-center text-[10px] font-bold'>
                                        {card_product_count}
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={toggleMobileMenu}
                                className='w-9 h-9 bg-gradient-to-r from-cyan-400 to-cyan-600 text-white rounded-lg flex items-center justify-center'
                            >
                                {mobileMenuOpen ? <FaTimes className='text-sm' /> : <FaList className='text-sm' />}
                            </button>
                        </div>

                        {/* Desktop Navigation Section - Hidden on mobile */}
                        <div className='w-9/12 md-lg:hidden'>
                            <div className='flex justify-between items-center pl-8'>
                                {/* Desktop Navigation */}
                                <ul className='flex justify-start items-center gap-8 text-sm font-semibold'>
                                    {navLinks.map((link, i) => (
                                        <li key={i}>
                                            <Link
                                                to={link.path}
                                                className={`px-3 py-2 rounded-lg transition-all ${pathname === link.path
                                                    ? 'text-cyan-400 bg-cyan-50'
                                                    : 'text-gray-700 hover:text-cyan-400 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>

                                <div className='flex items-center gap-3'>
                                    <button
                                        onClick={() => navigate(userInfo ? '/dashboard/my-wishlist' : '/login')}
                                        className='relative w-11 h-11 flex items-center justify-center rounded-full bg-gradient-to-br from-pink-50 to-red-50 hover:from-pink-100 hover:to-red-100 transition-all group'
                                    >
                                        <FaHeart className='text-red-500 text-xl group-hover:scale-110 transition-transform' />
                                        {wishlist_count !== 0 && (
                                            <span className='absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full text-white flex items-center justify-center text-xs font-bold shadow-lg'>
                                                {wishlist_count}
                                            </span>
                                        )}
                                    </button>

                                    <button
                                        onClick={redirect_card_page}
                                        className='relative w-11 h-11 flex items-center justify-center rounded-full bg-gradient-to-br from-cyan-50 to-indigo-50 hover:from-cyan-100 hover:to-indigo-100 transition-all group'
                                    >
                                        <FaCartShopping className='text-cyan-400 text-xl group-hover:scale-110 transition-transform' />
                                        {card_product_count !== 0 && (
                                            <span className='absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full text-white flex items-center justify-center text-xs font-bold shadow-lg'>
                                                {card_product_count}
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search & Categories Bar */}
            <div className='bg-gray-50 border-b border-gray-100'>
                <div className='w-[85%] lg:w-[90%] mx-auto py-4'>
                    <div className='flex w-full flex-wrap md-lg:gap-4'>
                        {/* Categories Dropdown */}
                        <div className='w-3/12 md-lg:w-full'>
                            <div className='relative'>
                                <button
                                    onClick={() => setCategoryShow(!categoryShow)}
                                    className='h-[50px] w-full bg-gradient-to-r from-cyan-400 to-cyan-600 text-white flex justify-between items-center px-6 rounded-xl font-semibold hover:shadow-lg transition-all'
                                >
                                    <div className='flex items-center gap-3'>
                                        <FaList />
                                        <span>All Categories</span>
                                    </div>
                                    <IoIosArrowDown className={`transition-transform ${categoryShow ? '' : 'rotate-180'}`} />
                                </button>

                                <div className={`${categoryShow ? 'max-h-0' : 'max-h-[400px]'} overflow-y-auto transition-all duration-300 absolute z-50 bg-white w-full rounded-b-xl shadow-xl mt-1`}>
                                    <ul className='py-2'>
                                        {categorys.map((c, i) => (
                                            <li key={i} className='flex items-center gap-3 px-5 py-3 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-cyan-50 transition-all cursor-pointer group'>
                                                <div className='w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0'>
                                                    <img src={c.image} className='w-full h-full object-cover' alt={c.name} />
                                                </div>
                                                <Link to={`/products?category=${c.name}`} className='text-sm font-medium text-gray-700 group-hover:text-cyan-400 transition-colors'>
                                                    {c.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className='w-9/12 pl-6 md-lg:pl-0 md-lg:w-full'>
                            <div className='flex flex-wrap w-full justify-between items-center md-lg:gap-4'>
                                <div className='w-8/12 md-lg:w-full'>
                                    <div className='flex h-[50px] items-center bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all'>
                                        <div className='relative after:absolute after:h-[30px] after:w-[1px] after:bg-gray-200 after:right-0 md:hidden'>
                                            <select
                                                onChange={(e) => setCategory(e.target.value)}
                                                className='w-[180px] px-4 h-full outline-none border-none bg-transparent text-gray-700 font-medium cursor-pointer'
                                            >
                                                <option value="">All Categories</option>
                                                {categorys.map((c, i) => (
                                                    <option key={i} value={c.name}>{c.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <input
                                            className='flex-1 px-4 h-full outline-none bg-transparent text-gray-700'
                                            onChange={(e) => setSearchValue(e.target.value)}
                                            type="text"
                                            placeholder='Search for products...'
                                        />
                                        <button
                                            onClick={search}
                                            className='px-8 h-full bg-gradient-to-r from-cyan-400 to-cyan-600 text-white font-semibold flex items-center gap-2 hover:from-cyan-700 hover:to-cyan-700 transition-all'
                                        >
                                            <MdSearch className='text-xl' />
                                            <span>Search</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Support Contact */}
                                <div className='w-4/12 md-lg:hidden pl-4'>
                                    <div className='flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-gray-200'>
                                        <div className='w-12 h-12 rounded-full bg-gradient-to-br from-cyan-100 to-cyan-100 flex items-center justify-center flex-shrink-0'>
                                            <FaPhoneAlt className='text-cyan-400' />
                                        </div>
                                        <div>
                                            <h2 className='text-sm font-bold text-gray-900'>+263 776 573 701</h2>
                                            <span className='text-xs text-gray-500'>24/7 Support</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            <div className={`fixed top-0 left-0 w-full h-full bg-white z-50 transform transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6">
                    <div className="flex justify-between items-center mb-8">
                        <Link to='/' onClick={closeMobileMenu} className='flex items-center gap-2'>
                            <img src="/images/logo.png" alt="" className='h-12' />
                        </Link>
                        <button
                            onClick={closeMobileMenu}
                            className='w-10 h-10 bg-gradient-to-r from-cyan-400 to-cyan-600 text-white rounded-lg flex items-center justify-center'
                        >
                            <FaTimes />
                        </button>
                    </div>

                    <ul className='space-y-4'>
                        {navLinks.map((link, i) => (
                            <li key={i}>
                                <Link
                                    to={link.path}
                                    onClick={closeMobileMenu}
                                    className={`block px-4 py-3 rounded-lg transition-all text-lg font-medium ${pathname === link.path
                                        ? 'text-cyan-400 bg-cyan-50'
                                        : 'text-gray-700 hover:text-cyan-400 hover:bg-gray-50'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Mobile Auth Section */}
                    <div className="mt-8 pt-8 border-t border-gray-200">
                        {userInfo ? (
                            <Link
                                to='/dashboard'
                                onClick={closeMobileMenu}
                                className='flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-cyan-400 transition-colors'
                            >
                                <FaUser />
                                <span className='font-medium'>{userInfo.name}</span>
                            </Link>
                        ) : (
                            <Link
                                to='/login'
                                onClick={closeMobileMenu}
                                className='flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-cyan-400 transition-colors'
                            >
                                <FaLock />
                                <span className='font-medium'>Login</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={closeMobileMenu}
                ></div>
            )}
        </div>
    );
};

export default Header;