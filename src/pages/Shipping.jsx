import React, { useState } from 'react';
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

    const [res, setRes] = useState(false)
    const [state, setState] = useState({
        name: '',
        address: '',
        phone: '',
        post: '',
        province: '',
        city: '',
        area: ''
    })

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

    return (
        <div className='min-h-screen bg-gray-50'>
            <Header />

            {/* Hero Banner */}
            <section className='relative h-[200px] mt-6 bg-gradient-to-r from-cyan-500 via-cyan-600 to-cyan-700 overflow-hidden'>
                <div className='absolute inset-0 bg-black/20'></div>
                <div className='absolute inset-0' style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
                }}></div>
                <div className='relative w-[90%] max-w-6xl h-full mx-auto flex flex-col justify-center items-center text-white z-10'>
                    <h1 className='text-3xl md:text-2xl font-bold mb-3'>Checkout</h1>
                    <div className='flex items-center gap-2 text-sm'>
                        <Link to='/' className="hover:underline opacity-80">Home</Link>
                        <IoIosArrowForward className='opacity-60' />
                        <Link to='/card' className="hover:underline opacity-80">Cart</Link>
                        <IoIosArrowForward className='opacity-60' />
                        <span className="font-medium">Checkout</span>
                    </div>
                </div>
            </section>

            <section className='py-10'>
                <div className='w-[90%] max-w-6xl mx-auto'>
                    <div className='flex flex-wrap gap-8'>
                        {/* Left Column - Delivery Info & Products */}
                        <div className='flex-1 min-w-[300px] space-y-6'>
                            {/* Delivery Information Card */}
                            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
                                <div className='bg-gradient-to-r from-cyan-50 to-cyan-100 px-6 py-4 border-b border-cyan-200'>
                                    <div className='flex items-center gap-3'>
                                        <div className='w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center'>
                                            <FaMapMarkerAlt className='text-white' />
                                        </div>
                                        <div>
                                            <h2 className='text-lg font-bold text-gray-800'>Delivery Information</h2>
                                            <p className='text-sm text-gray-500'>Where should we deliver your order?</p>
                                        </div>
                                    </div>
                                </div>

                                <div className='p-6'>
                                    {!res ? (
                                        <form onSubmit={save} className='space-y-5'>
                                            <div className='grid grid-cols-2 md:grid-cols-1 gap-5'>
                                                <div>
                                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Full Name</label>
                                                    <input
                                                        onChange={inputHandle}
                                                        value={state.name}
                                                        type="text"
                                                        name="name"
                                                        placeholder='John Doe'
                                                        className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all'
                                                    />
                                                </div>
                                                <div>
                                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Phone Number</label>
                                                    <input
                                                        onChange={inputHandle}
                                                        value={state.phone}
                                                        type="text"
                                                        name="phone"
                                                        placeholder='+263 77 123 4567'
                                                        className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all'
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className='block text-sm font-medium text-gray-700 mb-2'>Street Address</label>
                                                <input
                                                    onChange={inputHandle}
                                                    value={state.address}
                                                    type="text"
                                                    name="address"
                                                    placeholder='123 Main Street, Apartment 4B'
                                                    className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all'
                                                />
                                            </div>

                                            <div className='grid grid-cols-2 md:grid-cols-1 gap-5'>
                                                <div>
                                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Province</label>
                                                    <input
                                                        onChange={inputHandle}
                                                        value={state.province}
                                                        type="text"
                                                        name="province"
                                                        placeholder='Harare'
                                                        className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all'
                                                    />
                                                </div>
                                                <div>
                                                    <label className='block text-sm font-medium text-gray-700 mb-2'>City</label>
                                                    <input
                                                        onChange={inputHandle}
                                                        value={state.city}
                                                        type="text"
                                                        name="city"
                                                        placeholder='Harare CBD'
                                                        className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all'
                                                    />
                                                </div>
                                            </div>

                                            <div className='grid grid-cols-2 md:grid-cols-1 gap-5'>
                                                <div>
                                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Area</label>
                                                    <input
                                                        onChange={inputHandle}
                                                        value={state.area}
                                                        type="text"
                                                        name="area"
                                                        placeholder='Avondale'
                                                        className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all'
                                                    />
                                                </div>
                                                <div>
                                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Postal Code</label>
                                                    <input
                                                        onChange={inputHandle}
                                                        value={state.post}
                                                        type="text"
                                                        name="post"
                                                        placeholder='00263'
                                                        className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all'
                                                    />
                                                </div>
                                            </div>

                                            <button
                                                type='submit'
                                                className='w-full py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-cyan-700 transition-all shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2'
                                            >
                                                <FaCheck />
                                                Save Delivery Address
                                            </button>
                                        </form>
                                    ) : (
                                        <div className='space-y-4'>
                                            <div className='bg-green-50 border border-green-200 rounded-xl p-4'>
                                                <div className='flex items-start gap-3'>
                                                    <div className='w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0'>
                                                        <FaCheck className='text-white text-sm' />
                                                    </div>
                                                    <div className='flex-1'>
                                                        <h3 className='font-semibold text-green-800'>Deliver to {state.name}</h3>
                                                        <p className='text-sm text-green-700 mt-1'>
                                                            {state.address}, {state.area}, {state.city}, {state.province}
                                                        </p>
                                                        <div className='flex items-center gap-4 mt-2 text-sm text-green-600'>
                                                            <span className='flex items-center gap-1'>
                                                                <FaPhone className='text-xs' /> {state.phone}
                                                            </span>
                                                            <span className='flex items-center gap-1'>
                                                                <FaEnvelope className='text-xs' /> info@nimbo.co.zw
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => setRes(false)}
                                                        className='text-cyan-600 hover:text-cyan-700 font-medium text-sm flex items-center gap-1'
                                                    >
                                                        <FaEdit /> Change
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
                                <div className='px-6 py-4 border-b border-gray-100'>
                                    <h2 className='text-lg font-bold text-gray-800'>Order Items ({items})</h2>
                                </div>

                                <div className='divide-y divide-gray-100'>
                                    {products.map((p, i) => (
                                        <div key={i} className='p-6'>
                                            <div className='flex items-center gap-2 mb-4'>
                                                <div className='w-2 h-2 bg-cyan-500 rounded-full'></div>
                                                <h3 className='font-semibold text-gray-800'>{p.shopName}</h3>
                                            </div>

                                            <div className='space-y-4'>
                                                {p.products.map((pt, j) => (
                                                    <div key={j} className='flex gap-4 items-center'>
                                                        <div className='w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0'>
                                                            <img
                                                                className='w-full h-full object-cover'
                                                                src={pt.productInfo.images[0]}
                                                                alt={pt.productInfo.name}
                                                            />
                                                        </div>
                                                        <div className='flex-1 min-w-0'>
                                                            <h4 className='font-medium text-gray-800 truncate'>{pt.productInfo.name}</h4>
                                                            <p className='text-sm text-gray-500'>Brand: {pt.productInfo.brand}</p>
                                                            <p className='text-sm text-gray-500'>Qty: {pt.quantity}</p>
                                                        </div>
                                                        <div className='text-right'>
                                                            <p className='text-lg font-bold text-cyan-600'>
                                                                ${pt.productInfo.price - Math.floor((pt.productInfo.price * pt.productInfo.discount) / 100)}
                                                            </p>
                                                            {pt.productInfo.discount > 0 && (
                                                                <p className='text-sm text-gray-400 line-through'>${pt.productInfo.price}</p>
                                                            )}
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
                        <div className='w-[380px] lg:w-full'>
                            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 sticky top-6 overflow-hidden'>
                                <div className='bg-gradient-to-r from-cyan-500 to-cyan-600 px-6 py-4'>
                                    <h2 className='text-lg font-bold text-white'>Order Summary</h2>
                                </div>

                                <div className='p-6 space-y-4'>
                                    <div className='flex justify-between items-center text-gray-600'>
                                        <span>Subtotal ({items} items)</span>
                                        <span className='font-semibold text-gray-800'>${price}</span>
                                    </div>

                                    <div className='flex justify-between items-center text-gray-600'>
                                        <span className='flex items-center gap-2'>
                                            <FaTruck className='text-cyan-500' />
                                            Delivery Fee
                                        </span>
                                        <span className='font-semibold text-gray-800'>${shipping_fee}</span>
                                    </div>

                                    <div className='border-t border-gray-200 pt-4'>
                                        <div className='flex justify-between items-center'>
                                            <span className='text-lg font-bold text-gray-800'>Total</span>
                                            <span className='text-2xl font-bold text-cyan-600'>${price + shipping_fee}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={placeOrder}
                                        disabled={!res}
                                        className={`w-full py-4 font-bold rounded-xl text-white transition-all flex items-center justify-center gap-2 ${res
                                            ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 shadow-lg shadow-cyan-500/30 cursor-pointer'
                                            : 'bg-gray-300 cursor-not-allowed'
                                            }`}
                                    >
                                        Proceed to Payment
                                    </button>

                                    {!res && (
                                        <p className='text-center text-sm text-amber-600'>
                                            Please save your delivery address to continue
                                        </p>
                                    )}

                                    <div className='mt-4 p-4 bg-gray-50 rounded-xl space-y-2'>
                                        <div className='flex items-center gap-2 text-sm text-gray-600'>
                                            <svg className='w-4 h-4 text-green-500' fill='currentColor' viewBox='0 0 20 20'>
                                                <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                                            </svg>
                                            <span>Secure checkout</span>
                                        </div>
                                        <div className='flex items-center gap-2 text-sm text-gray-600'>
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
