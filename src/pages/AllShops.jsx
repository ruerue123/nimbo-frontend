import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { IoIosArrowForward } from "react-icons/io";
import { FaStore, FaBox, FaShoppingBag, FaMapMarkerAlt } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { get_shops } from '../store/reducers/homeReducer';
import { FadeLoader } from 'react-spinners';

const AllShops = () => {
    const dispatch = useDispatch();
    const { shops, loader } = useSelector(state => state.home);

    useEffect(() => {
        dispatch(get_shops()); // Get all shops
    }, [dispatch]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <Header />

            {/* Hero Banner */}
            <section className='relative h-[220px] mt-6 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 overflow-hidden'>
                <div className='absolute inset-0 bg-black opacity-20'></div>
                <div className='absolute inset-0' style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\\"60\\" height=\\"60\\" viewBox=\\"0 0 60 60\\" xmlns=\\"http://www.w3.org/2000/svg\\"%3E%3Cg fill=\\"none\\" fill-rule=\\"evenodd\\"%3E%3Cg fill=\\"%23ffffff\\" fill-opacity=\\"0.05\\"%3E%3Cpath d=\\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
                }}></div>
                <div className='relative w-[85%] md:w-[90%] h-full mx-auto flex flex-col justify-center items-center text-white z-10'>
                    <h1 className='text-4xl md:text-3xl sm:text-2xl font-bold mb-3'>All Shops</h1>
                    <div className='flex items-center gap-2 text-lg'>
                        <Link to='/' className="hover:underline">Home</Link>
                        <IoIosArrowForward />
                        <Link to='/shops' className="hover:underline">Shop</Link>
                        <IoIosArrowForward />
                        <span className="font-semibold">All Shops</span>
                    </div>
                </div>
            </section>

            <section className='py-12'>
                <div className='w-[85%] md:w-[90%] mx-auto'>
                    {loader ? (
                        <div className='w-full flex justify-center items-center py-20'>
                            <FadeLoader color='#06b6d4' />
                        </div>
                    ) : (
                        <>
                            <div className='mb-8 text-center'>
                                <h2 className='text-3xl font-bold text-gray-800 mb-2'>
                                    Browse Our <span className='bg-gradient-to-r from-cyan-500 to-purple-600 bg-clip-text text-transparent'>Featured Shops</span>
                                </h2>
                                <p className='text-gray-600'>Discover amazing products from trusted sellers</p>
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                                {shops.map((shop, i) => (
                                    <Link
                                        key={i}
                                        to={`/shop/${shop._id}`}
                                        className='group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100'
                                    >
                                        {/* Shop Header with Image */}
                                        <div className='relative h-40 bg-gradient-to-br from-cyan-400 via-purple-400 to-pink-400 overflow-hidden'>
                                            <div className='absolute inset-0 bg-black opacity-10'></div>
                                            <div className='absolute inset-0 flex items-center justify-center'>
                                                <div className='w-24 h-24 rounded-full overflow-hidden bg-white shadow-2xl border-4 border-white group-hover:scale-110 transition-transform duration-300'>
                                                    <img
                                                        src={shop.image}
                                                        alt={shop.shopInfo?.shopName}
                                                        className='w-full h-full object-cover'
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Shop Details */}
                                        <div className='p-6'>
                                            <h3 className='text-xl font-bold text-gray-800 mb-2 text-center group-hover:text-cyan-600 transition-colors'>
                                                {shop.shopInfo?.shopName}
                                            </h3>

                                            {shop.shopInfo?.division && (
                                                <div className='flex items-center justify-center gap-2 text-sm text-gray-500 mb-4'>
                                                    <FaMapMarkerAlt className='text-cyan-500' />
                                                    <span>{shop.shopInfo.division}</span>
                                                </div>
                                            )}

                                            {/* Stats */}
                                            <div className='grid grid-cols-2 gap-4 mb-4'>
                                                <div className='bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-4 text-center'>
                                                    <FaBox className='text-2xl text-cyan-600 mx-auto mb-2' />
                                                    <p className='text-2xl font-bold text-gray-800'>{shop.productCount}</p>
                                                    <p className='text-xs text-gray-600'>Products</p>
                                                </div>
                                                <div className='bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center'>
                                                    <FaShoppingBag className='text-2xl text-purple-600 mx-auto mb-2' />
                                                    <p className='text-2xl font-bold text-gray-800'>{shop.totalSales}</p>
                                                    <p className='text-xs text-gray-600'>Sales</p>
                                                </div>
                                            </div>

                                            {/* View Shop Button */}
                                            <div className='w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl font-semibold text-center group-hover:shadow-lg group-hover:shadow-cyan-500/30 transition-all'>
                                                View Shop
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {shops.length === 0 && (
                                <div className='text-center py-20'>
                                    <FaStore className='text-6xl text-gray-300 mx-auto mb-4' />
                                    <h3 className='text-2xl font-bold text-gray-800 mb-2'>No Shops Found</h3>
                                    <p className='text-gray-600'>Check back later for new shops!</p>
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

export default AllShops;
