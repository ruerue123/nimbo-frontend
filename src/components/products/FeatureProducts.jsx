import React, { useEffect } from 'react';
import { FaEye, FaRegHeart } from "react-icons/fa";
import { RiShoppingCartLine } from "react-icons/ri";
import Rating from '../Rating';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux';
import { add_to_card,add_to_wishlist,messageClear } from '../../store/reducers/cardReducer';
import toast from 'react-hot-toast';

const FeatureProducts = ({products}) => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {userInfo } = useSelector(state => state.auth)
    const {errorMessage,successMessage } = useSelector(state => state.card)

    const add_card = (id) => {
        if (userInfo) {
           dispatch(add_to_card({
            userId: userInfo.id,
            quantity : 1,
            productId : id
           }))
        } else {
            navigate('/login')
        }
    }

    useEffect(() => { 
        if (successMessage) {
            toast.success(successMessage)
            dispatch(messageClear())  
        } 
        if (errorMessage) {
            toast.error(errorMessage)
            dispatch(messageClear())  
        } 
        
    },[successMessage,errorMessage])


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
        }))
    }


    return ( 
        <div className='w-[85%] mx-auto'>
            <div className='w-full'>
                <div className='text-center flex justify-center items-center flex-col text-4xl text-slate-600 font-bold relative pb-[45px]'>
                    <h2>Feature Products </h2>
                    <div className='w-[100px] h-[2px] bg-[#42accf] mt-4'></div>
                </div>
            </div>

            {/* Responsive Product Grid */}
            <div className='w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
                {products.map((p,i) => (
                    <div key={i} className='bg-white shadow rounded-lg overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-lg hover:scale-[1.02]'>
                        {/* Discount Badge */}
                        {p.discount && (
                            <div className='flex justify-center items-center absolute text-white w-[38px] h-[38px] rounded-full bg-red-500 font-semibold text-xs left-2 top-2'>
                                {p.discount}%
                            </div>
                        )}

                        {/* Product Image */}
                        <div className='relative w-full aspect-square bg-gray-100 flex items-center justify-center overflow-hidden'>
                            <img className='object-contain w-full h-full' src={p.images[0]} alt={p.name} />  
                            {/* Hover Actions */}
                            <ul className='flex transition-all duration-500 -bottom-10 justify-center items-center gap-2 absolute w-full group-hover:bottom-3'>
                                <li onClick={() => add_wishlist(p)} className='w-[38px] h-[38px] cursor-pointer bg-white flex justify-center items-center rounded-full hover:bg-[#42accf] hover:text-white transition-all'>
                                    <FaRegHeart />
                                </li>
                                <Link to={`/product/details/${p.slug}`} className='w-[38px] h-[38px] cursor-pointer bg-white flex justify-center items-center rounded-full hover:bg-[#42accf] hover:text-white transition-all'>
                                    <FaEye />
                                </Link> 
                                <li onClick={() => add_card(p._id)} className='w-[38px] h-[38px] cursor-pointer bg-white flex justify-center items-center rounded-full hover:bg-[#42accf] hover:text-white transition-all'>
                                    <RiShoppingCartLine />
                                </li>
                            </ul>  
                        </div>

                        {/* Product Details */}
                        <div className='p-3 flex flex-col flex-grow text-slate-600'>
                            <h2 className='font-bold text-sm truncate'>{p.name}</h2>
                            <div className='flex justify-between items-center mt-2'>
                                <span className='text-md font-semibold text-[#42accf]'>${p.price}</span>
                                <div className='flex'>
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
