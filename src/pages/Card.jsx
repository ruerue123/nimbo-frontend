// Card.jsx (Cart Page) - Modern redesigned version
import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { IoIosArrowForward } from "react-icons/io";
import { FaMinus, FaPlus, FaTrash, FaShoppingBag } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { get_card_products, delete_card_product, messageClear, quantity_inc, quantity_dec } from '../store/reducers/cardReducer';
import toast from 'react-hot-toast';

const Card = () => {
    const dispatch = useDispatch();
    const { userInfo } = useSelector(state => state.auth);
    const { card_products, successMessage, price, buy_product_item, shipping_fee, outofstock_products } = useSelector(state => state.card);
    const navigate = useNavigate();

    // Guard against direct navigation by logged-out users — `userInfo` may be
    // null until customer_fetch_me resolves, so we check before dispatching.
    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
            return;
        }
        dispatch(get_card_products(userInfo.id));
    }, [userInfo, dispatch, navigate]);

    const redirect = () => {
        navigate('/shipping', {
            state: {
                products: card_products,
                price: price,
                shipping_fee: shipping_fee,
                items: buy_product_item
            }
        });
    };

    useEffect(() => {
        if (successMessage && userInfo) {
            toast.success(successMessage);
            dispatch(messageClear());
            dispatch(get_card_products(userInfo.id));
        }
    }, [successMessage, dispatch, userInfo]);

    if (!userInfo) return null;

    const inc = (quantity, stock, card_id) => {
        const temp = quantity + 1;
        if (temp <= stock) {
            dispatch(quantity_inc(card_id));
        }
    };

    const dec = (quantity, card_id) => {
        const temp = quantity - 1;
        if (temp !== 0) {
            dispatch(quantity_dec(card_id));
        }
    };

    const formatPrice = (value) => Number(value).toFixed(2);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white md-lg:pb-20">
            <Header />

            {/* Hero Banner — desktop only. Mobile gets a compact title row below. */}
            <section className='md-lg:hidden relative h-[220px] mt-6 bg-gradient-to-r from-cyan-400 via-indigo-600 to-cyan-600 overflow-hidden'>
                <div className='absolute inset-0 bg-black opacity-20'></div>
                <div className='relative w-[85%] h-full mx-auto flex flex-col justify-center items-center text-white z-10'>
                    <h1 className='text-4xl font-bold mb-3'>Shopping Cart</h1>
                    <div className='flex items-center gap-2 text-lg'>
                        <Link to='/' className="hover:underline">Home</Link>
                        <IoIosArrowForward />
                        <span className="font-semibold">Cart</span>
                    </div>
                </div>
            </section>

            {/* Mobile compact title */}
            <div className='hidden md-lg:block bg-white border-b border-gray-100'>
                <div className='w-[92%] mx-auto py-4 flex items-center justify-between'>
                    <h1 className='text-xl font-bold text-gray-900'>Cart</h1>
                    <span className='text-sm text-gray-500'>{buy_product_item} item{buy_product_item === 1 ? '' : 's'}</span>
                </div>
            </div>

            <section className='py-10 md:py-5'>
                <div className='w-[85%] lg:w-[90%] md:w-[92%] mx-auto'>
                    {card_products.length > 0 || outofstock_products.length > 0 ? (
                        <div className='flex flex-wrap gap-6'>
                            {/* Cart Items */}
                            <div className='flex-1 min-w-[300px]'>
                                <div className='space-y-6'>
                                    {/* In Stock Products */}
                                    {card_products.length > 0 && (
                                        <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
                                            <div className='bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-green-100'>
                                                <h2 className='text-lg font-bold text-green-700 flex items-center gap-2'>
                                                    <FaShoppingBag />
                                                    In Stock ({card_products.length})
                                                </h2>
                                            </div>

                                            {card_products.map((shop, shopIndex) => (
                                                <div key={shopIndex} className='border-b border-gray-100 last:border-b-0'>
                                                    <div className='px-6 py-4 bg-gray-50'>
                                                        <h3 className='font-bold text-gray-900'>{shop.shopName}</h3>
                                                    </div>

                                                    {shop.products.map((product, productIndex) => (
                                                        <div key={productIndex} className='p-4 md:p-3 hover:bg-gray-50 transition-colors'>
                                                            <div className='flex gap-3'>
                                                                <div className='w-20 h-20 md:w-16 md:h-16 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex-shrink-0'>
                                                                    <img
                                                                        className='w-full h-full object-cover'
                                                                        src={product.productInfo.images[0]}
                                                                        alt={product.productInfo.name}
                                                                        loading='lazy'
                                                                        decoding='async'
                                                                    />
                                                                </div>
                                                                <div className='flex-1 min-w-0'>
                                                                    <h4 className='font-semibold text-gray-900 line-clamp-2 text-sm md:text-[13px]'>{product.productInfo.name}</h4>
                                                                    <p className='text-xs text-gray-500 mt-0.5'>{product.productInfo.brand}</p>
                                                                    {(product.selectedSize || product.selectedColor) && (
                                                                        <p className='text-xs text-gray-500 mt-0.5'>
                                                                            {product.selectedSize && <span>Size: <span className='text-gray-700 font-medium'>{product.selectedSize}</span></span>}
                                                                            {product.selectedSize && product.selectedColor && <span> · </span>}
                                                                            {product.selectedColor && <span>Color: <span className='text-gray-700 font-medium'>{product.selectedColor}</span></span>}
                                                                        </p>
                                                                    )}
                                                                    <div className='flex items-baseline gap-2 mt-1'>
                                                                        <span className='text-lg md:text-base font-bold bg-gradient-to-r from-cyan-500 to-cyan-600 bg-clip-text text-transparent'>
                                                                            ${formatPrice(product.productInfo.price - Math.floor((product.productInfo.price * product.productInfo.discount) / 100))}
                                                                        </span>
                                                                        {product.productInfo.discount > 0 && (
                                                                            <span className='text-xs text-gray-400 line-through'>${formatPrice(product.productInfo.price)}</span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className='flex items-center justify-between mt-3'>
                                                                <div className='flex items-center bg-gray-100 rounded-lg overflow-hidden'>
                                                                    <button
                                                                        onClick={() => dec(product.quantity, product._id)}
                                                                        aria-label='Decrease quantity'
                                                                        className='w-10 h-10 flex items-center justify-center hover:bg-gray-200 transition-colors'
                                                                    >
                                                                        <FaMinus className="text-sm" />
                                                                    </button>
                                                                    <span className='w-10 h-10 flex items-center justify-center font-bold text-sm'>{product.quantity}</span>
                                                                    <button
                                                                        onClick={() => inc(product.quantity, product.productInfo.stock, product._id)}
                                                                        aria-label='Increase quantity'
                                                                        className='w-10 h-10 flex items-center justify-center hover:bg-gray-200 transition-colors'
                                                                    >
                                                                        <FaPlus className="text-sm" />
                                                                    </button>
                                                                </div>
                                                                <button
                                                                    onClick={() => dispatch(delete_card_product(product._id))}
                                                                    className='px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium text-sm flex items-center gap-1.5'
                                                                    aria-label='Remove from cart'
                                                                >
                                                                    <FaTrash className='text-xs' /> Remove
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Out of Stock Products */}
                                    {outofstock_products.length > 0 && (
                                        <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
                                            <div className='bg-gradient-to-r from-red-50 to-pink-50 px-6 py-4 border-b border-red-100'>
                                                <h2 className='text-lg font-bold text-red-700'>Out of Stock ({outofstock_products.length})</h2>
                                            </div>

                                            {outofstock_products.map((product, index) => (
                                                <div key={index} className='p-6 flex flex-wrap gap-4 items-center opacity-60'>
                                                    <div className='flex gap-4 flex-1 min-w-[250px]'>
                                                        <div className='w-24 h-24 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex-shrink-0 relative'>
                                                            <img 
                                                                className='w-full h-full object-cover' 
                                                                src={product.products[0].images[0]} 
                                                                alt={product.products[0].name} 
                                                            />
                                                            <div className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
                                                                <span className='text-white text-xs font-bold'>OUT OF STOCK</span>
                                                            </div>
                                                        </div>
                                                        <div className='flex-1'>
                                                            <h4 className='font-semibold text-gray-900 mb-1'>{product.products[0].name}</h4>
                                                            <p className='text-sm text-gray-500'>Brand: {product.products[0].brand}</p>
                                                        </div>
                                                    </div>

                                                    <div className='flex items-center gap-6'>
                                                        <div>
                                                            <p className='text-xl font-bold text-gray-600'>
                                                                ${formatPrice(product.products[0].price - Math.floor((product.products[0].price * product.products[0].discount) / 100))}
                                                            </p>
                                                            {product.products[0].discount > 0 && (
                                                                <p className='text-sm text-gray-400 line-through'>${formatPrice(product.products[0].price)}</p>
                                                            )}
                                                        </div>

                                                        <button 
                                                            onClick={() => dispatch(delete_card_product(product._id))}
                                                            className='px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm'
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Order Summary — desktop/tablet only. On phones the
                                checkout CTA lives in the sticky bottom bar. */}
                            {card_products.length > 0 && (
                                <div className='w-[400px] lg:w-full md-lg:hidden'>
                                    <div className='bg-white rounded-2xl shadow-lg border border-gray-100 sticky top-6 overflow-hidden'>
                                        <div className='bg-gradient-to-r from-cyan-500 to-cyan-600 px-6 py-4'>
                                            <h2 className='text-xl font-bold text-white'>Order Summary</h2>
                                        </div>

                                        <div className='p-6 space-y-4'>
                                            <div className='flex justify-between items-center pb-4 border-b border-gray-200'>
                                                <span className='text-gray-600'>Items ({buy_product_item})</span>
                                                <span className='font-bold text-gray-900'>${formatPrice(price)}</span>
                                            </div>

                                            <div className='flex justify-between items-center pb-4 border-b border-gray-200'>
                                                <span className='text-gray-600'>Delivery Fee</span>
                                                <span className='font-bold text-gray-900'>${formatPrice(shipping_fee)}</span>
                                            </div>

                                            <div className='bg-gray-50 rounded-lg p-4'>
                                                <input
                                                    className='w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-all mb-3' 
                                                    type="text" 
                                                    placeholder='Enter coupon code' 
                                                />
                                                <button className='w-full py-3 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-lg font-semibold hover:shadow-lg transition-all'>
                                                    APPLY COUPON
                                                </button>
                                            </div>

                                            <div className='flex justify-between items-center pt-4 border-t-2 border-gray-200'>
                                                <span className='text-lg font-bold text-gray-900'>Total</span>
                                                <span className='text-2xl font-bold bg-gradient-to-r from-cyan-500 to-cyan-600 bg-clip-text text-transparent'>
                                                    ${formatPrice(price + shipping_fee)}
                                                </span>
                                            </div>

                                            <button
                                                onClick={redirect}
                                                className='w-full py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-xl font-bold text-lg hover:shadow-xl shadow-lg shadow-cyan-500/30 transition-all mt-4'
                                            >
                                                PROCEED TO CHECKOUT ({buy_product_item})
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className='flex flex-col items-center justify-center py-20'>
                            <div className='w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6'>
                                <FaShoppingBag className='text-5xl text-gray-400' />
                            </div>
                            <h2 className='text-2xl font-bold text-gray-800 mb-3'>Your cart is empty</h2>
                            <p className='text-gray-600 mb-6'>Start shopping and add items to your cart!</p>
                            <Link
                                to='/shops'
                                className='px-8 py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-xl shadow-lg shadow-cyan-500/30 transition-all'
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            <Footer />

            {/* Sticky mobile checkout — sits above the bottom nav. Only shows when
                there's something to actually buy. */}
            {card_products.length > 0 && (
                <div
                    className='hidden md-lg:flex fixed left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-gray-200 px-3 py-3 gap-3 items-center pl-safe pr-safe'
                    style={{ bottom: 'calc(4.5rem + env(safe-area-inset-bottom))' }}
                >
                    <div className='flex flex-col leading-tight'>
                        <span className='text-xs text-gray-500'>Total</span>
                        <span className='text-lg font-bold text-gray-900'>${formatPrice(price + shipping_fee)}</span>
                    </div>
                    <button
                        onClick={redirect}
                        className='flex-1 h-11 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/30'
                    >
                        Checkout ({buy_product_item})
                    </button>
                </div>
            )}
        </div>
    );
};

export default Card;