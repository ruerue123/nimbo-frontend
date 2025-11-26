import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { get_blogs, get_featured_blogs } from '../store/reducers/blogReducer';
import { FaCalendarAlt, FaEye, FaTag, FaSearch, FaStore, FaShoppingBag, FaBullhorn, FaNewspaper, FaSpinner } from 'react-icons/fa';
import { IoIosArrowForward } from 'react-icons/io';

const Blog = () => {
    const dispatch = useDispatch();
    const { blogs, featuredBlogs, totalBlogs, loader } = useSelector(state => state.blog);

    const [currentPage, setCurrentPage] = useState(1);
    const [category, setCategory] = useState('all');
    const [searchValue, setSearchValue] = useState('');
    const parPage = 9;

    useEffect(() => {
        dispatch(get_featured_blogs());
    }, [dispatch]);

    useEffect(() => {
        dispatch(get_blogs({ page: currentPage, parPage, category, searchValue }));
    }, [currentPage, category, searchValue, dispatch]);

    const categories = [
        { value: 'all', label: 'All News', icon: FaNewspaper },
        { value: 'new_seller', label: 'New Sellers', icon: FaStore },
        { value: 'new_product', label: 'New Arrivals', icon: FaShoppingBag },
        { value: 'promotion', label: 'Hot Deals', icon: FaBullhorn },
        { value: 'announcement', label: 'Announcements', icon: FaNewspaper }
    ];

    const getCategoryBadge = (cat) => {
        switch (cat) {
            case 'new_seller': return 'bg-emerald-100 text-emerald-700';
            case 'new_product': return 'bg-blue-100 text-blue-700';
            case 'promotion': return 'bg-red-100 text-red-700';
            case 'announcement': return 'bg-purple-100 text-purple-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const totalPages = Math.ceil(totalBlogs / parPage);

    return (
        <div className='min-h-screen bg-gray-50'>
            <Header />

            {/* Hero Banner */}
            <section className='relative h-[180px] mt-6 bg-gradient-to-r from-cyan-500 to-cyan-700 overflow-hidden'>
                <div className='absolute inset-0 bg-black/20'></div>
                <div className='absolute inset-0 opacity-10'>
                    <div className='absolute top-10 left-10 w-32 h-32 bg-white rounded-full'></div>
                    <div className='absolute bottom-5 right-20 w-24 h-24 bg-white rounded-full'></div>
                </div>
                <div className='relative w-[90%] max-w-6xl h-full mx-auto flex flex-col justify-center items-center text-white z-10'>
                    <h1 className='text-3xl font-bold mb-2'>News & Promotions</h1>
                    <p className='text-cyan-100 mb-3'>Discover new sellers, hot deals, and exclusive offers</p>
                    <div className='flex items-center gap-2 text-sm'>
                        <Link to='/' className="hover:underline opacity-80">Home</Link>
                        <IoIosArrowForward className='opacity-60' />
                        <span className="font-medium">News</span>
                    </div>
                </div>
            </section>

            <section className='py-8'>
                <div className='w-[95%] max-w-6xl mx-auto'>
                    {/* Featured Posts */}
                    {featuredBlogs.length > 0 && (
                        <div className='mb-10'>
                            <h2 className='text-2xl font-bold text-gray-800 mb-6'>Featured Deals & News</h2>
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                                {featuredBlogs.slice(0, 3).map((blog, i) => (
                                    <Link
                                        key={i}
                                        to={`/blog/${blog.slug}`}
                                        className='group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all'
                                    >
                                        <div className='relative h-48 bg-gradient-to-br from-cyan-400 to-cyan-600'>
                                            {blog.image ? (
                                                <img src={blog.image} alt={blog.title} className='w-full h-full object-cover' />
                                            ) : (
                                                <div className='w-full h-full flex items-center justify-center'>
                                                    <FaNewspaper className='text-white/50 text-5xl' />
                                                </div>
                                            )}
                                            <div className='absolute top-3 left-3'>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryBadge(blog.category)}`}>
                                                    {blog.category?.replace('_', ' ').toUpperCase()}
                                                </span>
                                            </div>
                                            <div className='absolute top-3 right-3 bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-bold'>
                                                Featured
                                            </div>
                                        </div>
                                        <div className='p-5'>
                                            <h3 className='font-bold text-gray-800 text-lg mb-2 line-clamp-2 group-hover:text-cyan-600 transition-colors'>
                                                {blog.title}
                                            </h3>
                                            <p className='text-gray-500 text-sm mb-4 line-clamp-2'>{blog.excerpt}</p>
                                            <div className='flex items-center justify-between text-xs text-gray-400'>
                                                <span className='flex items-center gap-1'>
                                                    <FaCalendarAlt /> {formatDate(blog.createdAt)}
                                                </span>
                                                <span className='flex items-center gap-1'>
                                                    <FaEye /> {blog.views} views
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Search and Filter */}
                    <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8'>
                        <div className='flex flex-col md:flex-row gap-4'>
                            {/* Search */}
                            <div className='relative flex-1'>
                                <FaSearch className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' />
                                <input
                                    type='text'
                                    placeholder='Search deals, products, sellers...'
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    className='w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:border-cyan-500 outline-none'
                                />
                            </div>

                            {/* Category Filter */}
                            <div className='flex flex-wrap gap-2'>
                                {categories.map((cat) => {
                                    const Icon = cat.icon;
                                    return (
                                        <button
                                            key={cat.value}
                                            onClick={() => { setCategory(cat.value); setCurrentPage(1); }}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${category === cat.value
                                                ? 'bg-cyan-500 text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                        >
                                            <Icon className='text-xs' />
                                            <span className='hidden sm:inline'>{cat.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Blog Grid */}
                    {loader ? (
                        <div className='flex items-center justify-center py-20'>
                            <FaSpinner className='animate-spin text-4xl text-cyan-500' />
                        </div>
                    ) : blogs.length === 0 ? (
                        <div className='text-center py-20'>
                            <FaNewspaper className='text-6xl text-gray-300 mx-auto mb-4' />
                            <p className='text-gray-500 text-lg'>No news or deals found</p>
                            <p className='text-gray-400 text-sm'>Check back later for new promotions and announcements</p>
                        </div>
                    ) : (
                        <>
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                                {blogs.map((blog, i) => (
                                    <Link
                                        key={i}
                                        to={`/blog/${blog.slug}`}
                                        className='group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all'
                                    >
                                        <div className='relative h-44 bg-gradient-to-br from-gray-100 to-gray-200'>
                                            {blog.image ? (
                                                <img src={blog.image} alt={blog.title} className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300' />
                                            ) : (
                                                <div className='w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-400 to-cyan-600'>
                                                    <FaNewspaper className='text-white/50 text-4xl' />
                                                </div>
                                            )}
                                            <div className='absolute top-3 left-3'>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryBadge(blog.category)}`}>
                                                    {blog.category?.replace('_', ' ').toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className='p-4'>
                                            <h3 className='font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-cyan-600 transition-colors'>
                                                {blog.title}
                                            </h3>
                                            <p className='text-gray-500 text-sm mb-3 line-clamp-2'>{blog.excerpt}</p>

                                            {/* Tags */}
                                            {blog.tags?.length > 0 && (
                                                <div className='flex flex-wrap gap-1 mb-3'>
                                                    {blog.tags.slice(0, 3).map((tag, j) => (
                                                        <span key={j} className='flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs'>
                                                            <FaTag className='text-[8px]' /> {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            <div className='flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100'>
                                                <span className='flex items-center gap-1'>
                                                    <FaCalendarAlt /> {formatDate(blog.createdAt)}
                                                </span>
                                                <span className='flex items-center gap-1'>
                                                    <FaEye /> {blog.views}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className='flex justify-center gap-2 mt-10'>
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className='px-4 py-2 rounded-lg border border-gray-200 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50'
                                    >
                                        Previous
                                    </button>

                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`w-10 h-10 rounded-lg font-medium ${currentPage === i + 1
                                                ? 'bg-cyan-500 text-white'
                                                : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className='px-4 py-2 rounded-lg border border-gray-200 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50'
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Blog;
