// ============ ShopProducts.jsx - Modern redesigned version ============
import React from 'react';
import { FaEye, FaRegHeart } from "react-icons/fa";
import { RiShoppingCartLine } from "react-icons/ri";
import Rating from '../Rating';
import { Link } from 'react-router-dom';

const ShopProducts = ({ styles, products }) => {
    return (
        <div className={`w-full grid ${styles === 'grid' ? 'grid-cols-3 md-lg:grid-cols-2 md:grid-cols-2' : 'grid-cols-1 md-lg:grid-cols-2 md:grid-cols-2'} gap-6`}>
            {products.map((p, i) => (
                <Link
                    key={i}
                    to={`/product/details/${p.slug}`}
                    className={`group flex transition-all duration-300 hover:shadow-xl ${styles === 'grid'
                            ? 'flex-col bg-white rounded-2xl overflow-hidden border border-gray-100'
                            : 'bg-white rounded-2xl overflow-hidden border border-gray-100 md-lg:flex-col'
                        }`}
                >
                    <div className={`relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 ${styles === 'grid'
                            ? 'w-full aspect-square'
                            : 'w-[250px] h-[250px] md-lg:w-full md-lg:aspect-square flex-shrink-0'
                        }`}>
                        <img
                            className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                            src={p.images[0]}
                            alt={p.name}
                        />

                        {p.discount > 0 && (
                            <div className='absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg'>
                                -{p.discount}%
                            </div>
                        )}

                        <ul className='flex transition-all duration-500 -bottom-12 justify-center items-center gap-2 absolute w-full group-hover:bottom-4 px-4'>
                            <li className='w-10 h-10 cursor-pointer bg-white/95 backdrop-blur-sm flex justify-center items-center rounded-xl hover:bg-red-500 hover:text-white shadow-lg transition-all hover:scale-110'>
                                <FaRegHeart />
                            </li>
                            <li className='w-10 h-10 cursor-pointer bg-white/95 backdrop-blur-sm flex justify-center items-center rounded-xl hover:bg-cyan-500 hover:text-white shadow-lg transition-all hover:scale-110'>
                                <FaEye />
                            </li>
                            <li className='w-10 h-10 cursor-pointer bg-white/95 backdrop-blur-sm flex justify-center items-center rounded-xl hover:bg-green-500 hover:text-white shadow-lg transition-all hover:scale-110'>
                                <RiShoppingCartLine />
                            </li>
                        </ul>
                    </div>

                    <div className='p-5 flex flex-col justify-between flex-1'>
                        <div>
                            <h2 className='font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-cyan-400 transition-colors'>
                                {p.name}
                            </h2>
                        </div>
                        <div className='flex justify-between items-center mt-3'>
                            <span className='text-2xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent'>
                                ${p.price}
                            </span>
                            <div className='flex text-amber-400'>
                                <Rating ratings={p.rating} />
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default ShopProducts;