import React, { useEffect } from 'react';
import { FaEye, FaHeart, FaTrash } from "react-icons/fa";
import { RiShoppingCartLine } from "react-icons/ri";
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { get_wishlist_products, remove_wishlist, messageClear } from '../../store/reducers/cardReducer';
import toast from 'react-hot-toast';

const Wishlist = () => {
    const dispatch = useDispatch()
    const { userInfo } = useSelector(state => state.auth)
    const { wishlist, successMessage } = useSelector(state => state.card)

    useEffect(() => {
        dispatch(get_wishlist_products(userInfo.id))
    }, [dispatch, userInfo.id])

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage)
            dispatch(messageClear())
        }
    }, [successMessage, dispatch])

    const formatPrice = (price) => Number(price).toFixed(2)

    return (
        <div className='space-y-4'>
            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6'>
                <div className='flex items-center justify-between mb-4'>
                    <h2 className='text-lg sm:text-xl font-bold text-gray-800'>My Wishlist</h2>
                    <span className='text-sm text-gray-500'>{wishlist.length} items</span>
                </div>

                {wishlist.length === 0 ? (
                    <div className='text-center py-12'>
                        <FaHeart className='w-12 h-12 mx-auto text-gray-300 mb-3' />
                        <p className='text-gray-500'>Your wishlist is empty</p>
                        <Link to='/shops' className='inline-block mt-4 px-6 py-2 bg-cyan-500 text-white rounded-lg font-medium text-sm'>
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4'>
                        {wishlist.map((p, i) => (
                            <div key={i} className='bg-white rounded-xl border border-gray-100 overflow-hidden group hover:shadow-lg transition-all'>
                                <div className='relative aspect-square bg-gray-100'>
                                    {p.discount > 0 && (
                                        <div className='absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10'>
                                            -{p.discount}%
                                        </div>
                                    )}

                                    <img
                                        className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                                        src={p.image}
                                        alt={p.name}
                                    />

                                    {/* Action buttons overlay */}
                                    <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2'>
                                        <Link
                                            to={`/product/details/${p.slug}`}
                                            className='w-10 h-10 bg-white rounded-full flex items-center justify-center text-cyan-600 hover:bg-cyan-500 hover:text-white transition-colors'
                                        >
                                            <FaEye />
                                        </Link>
                                        <button
                                            onClick={() => dispatch(remove_wishlist(p._id))}
                                            className='w-10 h-10 bg-white rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors'
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>

                                <div className='p-3'>
                                    <h3 className='font-medium text-gray-800 text-sm line-clamp-2 mb-2 min-h-[2.5rem]'>
                                        {p.name}
                                    </h3>
                                    <div className='flex items-center justify-between'>
                                        <span className='text-lg font-bold text-cyan-600'>
                                            ${formatPrice(p.price - (p.price * p.discount / 100))}
                                        </span>
                                        {p.discount > 0 && (
                                            <span className='text-xs text-gray-400 line-through'>
                                                ${formatPrice(p.price)}
                                            </span>
                                        )}
                                    </div>

                                    {/* Mobile remove button */}
                                    <button
                                        onClick={() => dispatch(remove_wishlist(p._id))}
                                        className='w-full mt-3 py-2 text-sm text-red-500 border border-red-200 rounded-lg flex items-center justify-center gap-2 md:hidden'
                                    >
                                        <FaTrash className='text-xs' /> Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
