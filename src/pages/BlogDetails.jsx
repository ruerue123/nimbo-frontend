import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { get_blog, clearBlog } from '../store/reducers/blogReducer';
import { FaCalendarAlt, FaEye, FaTag, FaStore, FaShoppingBag, FaArrowLeft, FaSpinner, FaNewspaper } from 'react-icons/fa';
import { IoIosArrowForward } from 'react-icons/io';

const BlogDetails = () => {
    const { slug } = useParams();
    const dispatch = useDispatch();
    const { blog, relatedBlogs, loader } = useSelector(state => state.blog);

    useEffect(() => {
        dispatch(get_blog(slug));
        return () => dispatch(clearBlog());
    }, [slug, dispatch]);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getCategoryBadge = (cat) => {
        switch (cat) {
            case 'new_seller': return 'bg-emerald-100 text-emerald-700';
            case 'new_product': return 'bg-blue-100 text-blue-700';
            case 'promotion': return 'bg-red-100 text-red-700';
            case 'announcement': return 'bg-purple-100 text-purple-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getCategoryIcon = (cat) => {
        switch (cat) {
            case 'new_seller': return <FaStore />;
            case 'new_product': return <FaShoppingBag />;
            default: return <FaNewspaper />;
        }
    };

    if (loader) {
        return (
            <div className='min-h-screen bg-gray-50'>
                <Header />
                <div className='flex items-center justify-center py-40'>
                    <FaSpinner className='animate-spin text-5xl text-cyan-500' />
                </div>
                <Footer />
            </div>
        );
    }

    if (!blog) {
        return (
            <div className='min-h-screen bg-gray-50'>
                <Header />
                <div className='flex flex-col items-center justify-center py-40'>
                    <FaNewspaper className='text-6xl text-gray-300 mb-4' />
                    <p className='text-gray-500 text-xl mb-4'>Blog post not found</p>
                    <Link to='/blog' className='px-6 py-2 bg-cyan-500 text-white rounded-xl font-medium'>
                        Back to Blog
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gray-50'>
            <Header />

            {/* Hero Banner */}
            <section className='relative h-[300px] sm:h-[400px] mt-6 overflow-hidden'>
                {blog.image ? (
                    <img src={blog.image} alt={blog.title} className='w-full h-full object-cover' />
                ) : (
                    <div className='w-full h-full bg-gradient-to-br from-cyan-500 to-cyan-700'></div>
                )}
                <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent'></div>
                <div className='absolute inset-0 flex flex-col justify-end'>
                    <div className='w-[95%] max-w-4xl mx-auto pb-8 text-white'>
                        <div className='flex items-center gap-2 text-sm mb-4'>
                            <Link to='/' className="hover:underline opacity-80">Home</Link>
                            <IoIosArrowForward className='opacity-60' />
                            <Link to='/blog' className="hover:underline opacity-80">Blog</Link>
                            <IoIosArrowForward className='opacity-60' />
                            <span className="opacity-80 truncate max-w-[200px]">{blog.title}</span>
                        </div>

                        <div className='flex items-center gap-3 mb-4'>
                            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${getCategoryBadge(blog.category)}`}>
                                {getCategoryIcon(blog.category)}
                                {blog.category?.replace('_', ' ').toUpperCase()}
                            </span>
                            {blog.featured && (
                                <span className='px-3 py-1 bg-amber-500 text-white rounded-full text-sm font-bold'>
                                    Featured
                                </span>
                            )}
                        </div>

                        <h1 className='text-2xl sm:text-4xl font-bold mb-4 leading-tight'>{blog.title}</h1>

                        <div className='flex flex-wrap items-center gap-4 text-sm text-white/80'>
                            <span className='flex items-center gap-1.5'>
                                <FaCalendarAlt /> {formatDate(blog.createdAt)}
                            </span>
                            <span className='flex items-center gap-1.5'>
                                <FaEye /> {blog.views} views
                            </span>
                            {blog.sellerName && (
                                <span className='flex items-center gap-1.5'>
                                    <FaStore /> {blog.sellerName}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <section className='py-10'>
                <div className='w-[95%] max-w-4xl mx-auto'>
                    {/* Back Button */}
                    <Link to='/blog' className='inline-flex items-center gap-2 text-cyan-600 font-medium mb-6 hover:gap-3 transition-all'>
                        <FaArrowLeft /> Back to Blog
                    </Link>

                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                        {/* Main Content */}
                        <div className='lg:col-span-2'>
                            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8'>
                                {/* Excerpt */}
                                <p className='text-lg text-gray-600 leading-relaxed mb-6 pb-6 border-b border-gray-100 italic'>
                                    {blog.excerpt}
                                </p>

                                {/* Content */}
                                <div
                                    className='prose prose-lg max-w-none prose-headings:text-gray-800 prose-p:text-gray-600 prose-a:text-cyan-600 prose-strong:text-gray-800'
                                    dangerouslySetInnerHTML={{ __html: blog.content }}
                                />

                                {/* Tags */}
                                {blog.tags?.length > 0 && (
                                    <div className='mt-8 pt-6 border-t border-gray-100'>
                                        <h4 className='text-sm font-semibold text-gray-700 mb-3'>Tags</h4>
                                        <div className='flex flex-wrap gap-2'>
                                            {blog.tags.map((tag, i) => (
                                                <span key={i} className='flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm'>
                                                    <FaTag className='text-xs' /> {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Product Link */}
                                {blog.productId && (
                                    <div className='mt-8 p-4 bg-cyan-50 rounded-xl border border-cyan-100'>
                                        <p className='text-cyan-800 font-medium mb-2'>Check out this product:</p>
                                        <Link
                                            to={`/product/details/${blog.productName?.toLowerCase().replace(/\s+/g, '-')}`}
                                            className='inline-flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg font-medium hover:bg-cyan-600 transition-colors'
                                        >
                                            <FaShoppingBag /> View {blog.productName}
                                        </Link>
                                    </div>
                                )}

                                {/* Seller Link */}
                                {blog.sellerId && !blog.productId && (
                                    <div className='mt-8 p-4 bg-emerald-50 rounded-xl border border-emerald-100'>
                                        <p className='text-emerald-800 font-medium mb-2'>Visit the seller's store:</p>
                                        <Link
                                            to={`/shops`}
                                            className='inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors'
                                        >
                                            <FaStore /> Browse {blog.sellerName}'s Products
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className='lg:col-span-1'>
                            {/* Related Posts */}
                            {relatedBlogs.length > 0 && (
                                <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-5'>
                                    <h3 className='font-bold text-gray-800 mb-4'>Related Posts</h3>
                                    <div className='space-y-4'>
                                        {relatedBlogs.map((post, i) => (
                                            <Link
                                                key={i}
                                                to={`/blog/${post.slug}`}
                                                className='flex gap-3 group'
                                            >
                                                <div className='w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0'>
                                                    {post.image ? (
                                                        <img src={post.image} alt={post.title} className='w-full h-full object-cover' />
                                                    ) : (
                                                        <div className='w-full h-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center'>
                                                            <FaNewspaper className='text-white/50' />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className='flex-1 min-w-0'>
                                                    <h4 className='font-medium text-gray-800 text-sm line-clamp-2 group-hover:text-cyan-600 transition-colors'>
                                                        {post.title}
                                                    </h4>
                                                    <p className='text-xs text-gray-400 mt-1'>{formatDate(post.createdAt)}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* CTA */}
                            <div className='mt-6 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl p-6 text-white'>
                                <h3 className='font-bold text-lg mb-2'>Browse Our Marketplace</h3>
                                <p className='text-cyan-100 text-sm mb-4'>Discover amazing products from our trusted sellers</p>
                                <Link
                                    to='/shops'
                                    className='inline-block w-full text-center py-2.5 bg-white text-cyan-600 rounded-xl font-semibold hover:bg-cyan-50 transition-colors'
                                >
                                    Shop Now
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default BlogDetails;
