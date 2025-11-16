// ============ FeatureProducts.jsx - Modern redesigned version ============
import React, { useEffect } from 'react';
import { FaEye, FaRegHeart } from "react-icons/fa";
import { RiShoppingCartLine } from "react-icons/ri";
import Rating from '../Rating';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { add_to_card, add_to_wishlist, messageClear } from '../../store/reducers/cardReducer';
import toast from 'react-hot-toast';

const FeatureProducts = ({ products }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userInfo } = useSelector(state => state.auth);
    const { errorMessage, successMessage } = useSelector(state => state.card);

    const add_card = (id) => {
        if (userInfo) {
            dispatch(add_to_card({
                userId: userInfo.id,
                quantity: 1,
                productId: id
            }));
        } else {
            navigate('/login');
        }
    };

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage, dispatch]);

    const add_wishlist = (pro) => {
        dispatch(add_to_wishlist({
            userId: userInfo.id,
            productId: pro._id,
            name: pro.name,
            price: pro.price,
            image: pro.images[0],
            discount: pro.discount,
            rating: pro.rating,
            slug: pro.slug
        }));
    };

    return (
        <div className='w-[85%] flex flex-wrap mx-auto'>
            <div className='w-full mb-12'>
                <div className='text-center'>
                    <h2 className='text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                        Featured Products
                    </h2>
                    <p className="text-gray-600 mb-4">Discover our hand-picked selection</p>
                    <div className='w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full'></div>
                </div>
            </div>

            <div className='w-full grid grid-cols-4 md-lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6'>
                {products.map((p, i) => (
                    <div key={i} className='group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100'>
                        <div className='relative overflow-hidden aspect-square bg-gradient-to-br from-gray-50 to-gray-100'>
                            {p.discount > 0 && (
                                <div className='absolute z-10 top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg'>
                                    -{p.discount}%
                                </div>
                            )}

                            <img
                                className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                                src={p.images[0]}
                                alt={p.name}
                            />

                            <ul className='flex transition-all duration-500 -bottom-12 justify-center items-center gap-2 absolute w-full group-hover:bottom-4 px-4'>
                                <li
                                    onClick={() => add_wishlist(p)}
                                    className='w-11 h-11 cursor-pointer bg-white/95 backdrop-blur-sm flex justify-center items-center rounded-xl hover:bg-red-500 hover:text-white shadow-lg transition-all hover:scale-110'
                                >
                                    <FaRegHeart />
                                </li>
                                <Link
                                    to={`/product/details/${p.slug}`}
                                    className='w-11 h-11 cursor-pointer bg-white/95 backdrop-blur-sm flex justify-center items-center rounded-xl hover:bg-blue-500 hover:text-white shadow-lg transition-all hover:scale-110'
                                >
                                    <FaEye />
                                </Link>
                                <li
                                    onClick={() => add_card(p._id)}
                                    className='w-11 h-11 cursor-pointer bg-white/95 backdrop-blur-sm flex justify-center items-center rounded-xl hover:bg-green-500 hover:text-white shadow-lg transition-all hover:scale-110'
                                >
                                    <RiShoppingCartLine />
                                </li>
                            </ul>
                        </div>

                        <div className='p-4'>
                            <h2 className='font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3rem] group-hover:text-blue-600 transition-colors'>
                                {p.name}
                            </h2>
                            <div className='flex justify-between items-center'>
                                <span className='text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                                    ${p.price}
                                </span>
                                <div className='flex text-amber-400'>
                                    <Rating ratings={p.rating} />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeatureProducts;