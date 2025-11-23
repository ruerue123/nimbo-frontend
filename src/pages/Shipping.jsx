import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IoIosArrowForward } from "react-icons/io";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaEdit, FaCheck, FaTruck } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { place_order } from '../store/reducers/orderReducer';

const Shipping = () => {
    const { state: { products, price, shipping_fee, items } } = useLocation()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { userInfo } = useSelector(state => state.auth)

    // Load saved address from localStorage on mount
    const getSavedAddress = () => {
        try {
            const saved = localStorage.getItem('shippingAddress')
            if (saved) {
                return JSON.parse(saved)
            }
        } catch (e) {
            console.log('Error loading saved address')
        }
        return {
            name: '',
            address: '',
            phone: '',
            post: '',
            province: '',
            city: '',
            area: ''
        }
    }

    const [res, setRes] = useState(false)
    const [state, setState] = useState(getSavedAddress)

    // Auto-set res to true if we have a saved complete address
    useEffect(() => {
        const { name, address, phone, post, province, city, area } = state
        if (name && address && phone && post && province && city && area) {
            setRes(true)
        }
    }, [])

    const inputHandle = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }

    const save = (e) => {
        e.preventDefault()
        const { name, address, phone, post, province, city, area } = state;
        if (name && address && phone && post && province && city && area) {
            // Save address to localStorage for future orders
            localStorage.setItem('shippingAddress', JSON.stringify(state))
            setRes(true)
        }
    }

    const placeOrder = () => {
        dispatch(place_order({
            price,
            products,
            shipping_fee,
            items,
            shippingInfo: state,
            userId: userInfo.id,
            navigate
        }))
    }

    const formatPrice = (value) => {
        return Number(value).toFixed(2)
    }

    return (
        <div className='min-h-screen bg-gray-50'>
            <Header />

            {/* Hero Banner */}
            <section className='relative h-[160px] sm:h-[120px] mt-6 bg-gradient-to-r from-cyan-500 via-cyan-600 to-cyan-700 overflow-hidden'>
                <div className='absolute inset-0 bg-black/20'></div>
                <div className='absolute inset-0' style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
                }}></div>
                <div className='relative w-[90%] max-w-6xl h-full mx-auto flex flex-col justify-center items-center text-white z-10'>
                    <h1 className='text-2xl sm:text-xl font-bold mb-2'>Checkout</h1>
                    <div className='flex items-center gap-2 text-sm'>
                        <Link to='/' className="hover:underline opacity-80">Home</Link>
                        <IoIosArrowForward className='opacity-60' />
                        <Link to='/card' className="hover:underline opacity-80">Cart</Link>
                        <IoIosArrowForward className='opacity-60' />
                        <span className="font-medium">Checkout</span>
                    </div>
                </div>
            </section>

            <section className='py-6 sm:py-4'>
                <div className='w-[90%] max-w-6xl mx-auto'>
                    <div className='flex flex-col lg:flex-row gap-6'>
                        {/* Left Column - Delivery Info & Products */}
                        <div className='flex-1 space-y-4'>
                            {/* Delivery Information Card */}
                            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
                                <div className='bg-gradient-to-r from-cyan-50 to-cyan-100 px-4 sm:px-6 py-3 sm:py-4 border-b border-cyan-200'>
                                    <div className='flex items-center gap-3'>
                                        <div className='w-8 h-8 sm:w-10 sm:h-10 bg-cyan-500 rounded-xl flex items-center justify-center'>
                                            <FaMapMarkerAlt className='text-white text-sm sm:text-base' />
                                        </div>
                                        <div>
                                            <h2 className='text-base sm:text-lg font-bold text-gray-800'>Delivery Information</h2>
                                            <p className='text-xs sm:text-sm text-gray-500'>Where should we deliver your order?</p>
                                        </div>
                                    </div>
                                </div>

                                <div className='p-4 sm:p-6'>
                                    {!res ? (
                                        <form onSubmit={save} className='space-y-4'>
                                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                                <div>
                                                    <label className='block text-sm font-medium text-gray-700 mb-1.5'>Full Name</label>
                                                    <input
                                                        onChange={inputHandle}
                                                        value={state.name}
                                                        type="text"
                                                        name="name"
                                                        placeholder='John Doe'
                                                        className='w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all text-sm'
                                                    />
                                                </div>
                                                <div>
                                                    <label className='block text-sm font-medium text-gray-700 mb-1.5'>Phone Number</label>
                                                    <input
                                                        onChange={inputHandle}
                                                        value={state.phone}
                                                        type="text"
                                                        name="phone"
                                                        placeholder='+263 77 123 4567'
                                                        className='w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all text-sm'
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className='block text-sm font-medium text-gray-700 mb-1.5'>Street Address</label>
                                                <input
                                                    onChange={inputHandle}
                                                    value={state.address}
                                                    type="text"
                                                    name="address"
                                                    placeholder='123 Main Street, Apartment 4B'
                                                    className='w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all text-sm'
                                                />
                                            </div>

                                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                                <div>
                                                    <label className='block text-sm font-medium text-gray-700 mb-1.5'>Province</label>
                                                    <input
                                                        onChange={inputHandle}
                                                        value={state.province}
                                                        type="text"
                                                        name="province"
                                                        placeholder='Harare'
                                                        className='w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all text-sm'
                                                    />
                                                </div>
                                                <div>
                                                    <label className='block text-sm font-medium text-gray-700 mb-1.5'>City</label>
                                                    <input
                                                        onChange={inputHandle}
                                                        value={state.city}
                                                        type="text"
                                                        name="city"
                                                        placeholder='Harare CBD'
                                                        className='w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all text-sm'
                                                    />
                                                </div>
                                            </div>

                                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                                <div>
                                                    <label className='block text-sm font-medium text-gray-700 mb-1.5'>Area</label>
                                                    <input
                                                        onChange={inputHandle}
                                                        value={state.area}
                                                        type="text"
                                                        name="area"
                                                        placeholder='Avondale'
                                                        className='w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all text-sm'
                                                    />
                                                </div>
                                                <div>
                                                    <label className='block text-sm font-medium text-gray-700 mb-1.5'>Postal Code</label>
                                                    <input
                                                        onChange={inputHandle}
                                                        value={state.post}
                                                        type="text"
                                                        name="post"
                                                        placeholder='00263'
                                                        className='w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all text-sm'
                                                    />
                                                </div>
                                            </div>

                                            <button
                                                type='submit'
                                                className='w-full py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-cyan-700 transition-all shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2'
                                            >
                                                <FaCheck />
                                                Save Delivery Address
                                            </button>
                                        </form>
                                    ) : (
                                        <div className='space-y-4'>
                                            <div className='bg-green-50 border border-green-200 rounded-xl p-3 sm:p-4'>
                                                <div className='flex items-start gap-3'>
                                                    <div className='w-7 h-7 sm:w-8 sm:h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0'>
                                                        <FaCheck className='text-white text-xs sm:text-sm' />
                                                    </div>
                                                    <div className='flex-1 min-w-0'>
                                                        <h3 className='font-semibold text-green-800 text-sm sm:text-base'>Deliver to {state.name}</h3>
                                                        <p className='text-xs sm:text-sm text-green-700 mt-1'>
                                                            {state.address}, {state.area}, {state.city}, {state.province}
                                                        </p>
                                                        <div className='flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-green-600'>
                                                            <span className='flex items-center gap-1'>
                                                                <FaPhone className='text-xs' /> {state.phone}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => setRes(false)}
                                                        className='text-cyan-600 hover:text-cyan-700 font-medium text-xs sm:text-sm flex items-center gap-1 flex-shrink-0'
                                                    >
                                                        <FaEdit /> Change
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Order Items - Hidden on mobile when address not saved */}
                            <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${!res ? 'hidden sm:block' : ''}`}>
                                <div className='px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100'>
                                    <h2 className='text-base sm:text-lg font-bold text-gray-800'>Order Items ({items})</h2>
                                </div>

                                <div className='divide-y divide-gray-100'>
                                    {products.map((p, i) => (
                                        <div key={i} className='p-4 sm:p-6'>
                                            <div className='flex items-center gap-2 mb-3'>
                                                <div className='w-2 h-2 bg-cyan-500 rounded-full'></div>
                                                <h3 className='font-semibold text-gray-800 text-sm sm:text-base'>{p.shopName}</h3>
                                            </div>

                                            <div className='space-y-3'>
                                                {p.products.map((pt, j) => (
                                                    <div key={j} className='flex gap-3 items-center'>
                                                        <div className='w-14 h-14 sm:w-20 sm:h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0'>
                                                            <img
                                                                className='w-full h-full object-cover'
                                                                src={pt.productInfo.images[0]}
                                                                alt={pt.productInfo.name}
                                                            />
                                                        </div>
                                                        <div className='flex-1 min-w-0'>
                                                            <h4 className='font-medium text-gray-800 truncate text-sm'>{pt.productInfo.name}</h4>
                                                            <p className='text-xs text-gray-500'>Qty: {pt.quantity}</p>
                                                        </div>
                                                        <div className='text-right flex-shrink-0'>
                                                            <p className='text-sm sm:text-lg font-bold text-cyan-600'>
                                                                ${formatPrice(pt.productInfo.price - Math.floor((pt.productInfo.price * pt.productInfo.discount) / 100))}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Order Summary */}
                        <div className='w-full lg:w-[350px]'>
                            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 sticky top-4 overflow-hidden'>
                                <div className='bg-gradient-to-r from-cyan-500 to-cyan-600 px-4 sm:px-6 py-3 sm:py-4'>
                                    <h2 className='text-base sm:text-lg font-bold text-white'>Order Summary</h2>
                                </div>

                                <div className='p-4 sm:p-6 space-y-3'>
                                    <div className='flex justify-between items-center text-gray-600 text-sm'>
                                        <span>Subtotal ({items} items)</span>
                                        <span className='font-semibold text-gray-800'>${formatPrice(price)}</span>
                                    </div>

                                    <div className='flex justify-between items-center text-gray-600 text-sm'>
                                        <span className='flex items-center gap-2'>
                                            <FaTruck className='text-cyan-500' />
                                            Delivery Fee
                                        </span>
                                        <span className='font-semibold text-gray-800'>${formatPrice(shipping_fee)}</span>
                                    </div>

                                    <div className='border-t border-gray-200 pt-3'>
                                        <div className='flex justify-between items-center'>
                                            <span className='text-base sm:text-lg font-bold text-gray-800'>Total</span>
                                            <span className='text-xl sm:text-2xl font-bold text-cyan-600'>${formatPrice(price + shipping_fee)}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={placeOrder}
                                        disabled={!res}
                                        className={`w-full py-3 sm:py-4 font-bold rounded-xl text-white transition-all flex items-center justify-center gap-2 text-sm sm:text-base ${res
                                            ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 shadow-lg shadow-cyan-500/30 cursor-pointer'
                                            : 'bg-gray-300 cursor-not-allowed'
                                            }`}
                                    >
                                        Proceed to Payment
                                    </button>

                                    {!res && (
                                        <p className='text-center text-xs sm:text-sm text-amber-600'>
                                            Please save your delivery address to continue
                                        </p>
                                    )}

                                    <div className='mt-3 p-3 bg-gray-50 rounded-xl space-y-1.5'>
                                        <div className='flex items-center gap-2 text-xs sm:text-sm text-gray-600'>
                                            <svg className='w-4 h-4 text-green-500' fill='currentColor' viewBox='0 0 20 20'>
                                                <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                                            </svg>
                                            <span>Secure checkout</span>
                                        </div>
                                        <div className='flex items-center gap-2 text-xs sm:text-sm text-gray-600'>
                                            <svg className='w-4 h-4 text-green-500' fill='currentColor' viewBox='0 0 20 20'>
                                                <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                                            </svg>
                                            <span>Fast delivery</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Shipping;
