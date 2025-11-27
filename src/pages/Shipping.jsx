import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IoIosArrowForward } from "react-icons/io";
import { FaMapMarkerAlt, FaPhone, FaEdit, FaCheck, FaTruck, FaSpinner } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { place_order } from '../store/reducers/orderReducer';

const Shipping = () => {
    const { state: { products, price, shipping_fee, items } } = useLocation()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { userInfo } = useSelector(state => state.auth)
    const { loader } = useSelector(state => state.order)

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

    useEffect(() => {
        const { name, address, phone, post, province, city, area } = state
        if (name && address && phone && post && province && city && area) {
            setRes(true)
        }
    }, [state])

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
            localStorage.setItem('shippingAddress', JSON.stringify(state))
            setRes(true)
        }
    }

    const placeOrder = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (!res) return
        dispatch(place_order({
            price,
            products,
            shipping_fee: 5,
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
            {/* Hero Banner */}
            <section className='relative h-[120px] mt-6 bg-gradient-to-r from-cyan-500 to-cyan-700 overflow-hidden'>
                <div className='absolute inset-0 bg-black/20'></div>
                <div className='relative w-[90%] max-w-6xl h-full mx-auto flex flex-col justify-center items-center text-white z-10'>
                    <h1 className='text-xl font-bold mb-2'>Checkout</h1>
                    <div className='flex items-center gap-2 text-sm'>
                        <Link to='/' className="hover:underline opacity-80">Home</Link>
                        <IoIosArrowForward className='opacity-60' />
                        <Link to='/card' className="hover:underline opacity-80">Cart</Link>
                        <IoIosArrowForward className='opacity-60' />
                        <span className="font-medium">Checkout</span>
                    </div>
                </div>
            </section>

            <section className='py-4'>
                <div className='w-[95%] max-w-6xl mx-auto'>
                    {/* MOBILE: Order Summary at top, then address/items below */}
                    {/* DESKTOP: Address/items on left, Order Summary on right */}
                    <div className='flex flex-col-reverse lg:flex-row gap-4'>
                        {/* Left Column - Address and Items */}
                        <div className='w-full lg:flex-1'>
                            {/* Step 1: Delivery Address */}
                            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4'>
                                <div className='bg-gradient-to-r from-cyan-50 to-cyan-100 px-4 py-3 border-b border-cyan-200'>
                                    <div className='flex items-center gap-3'>
                                        <div className='w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center'>
                                            <FaMapMarkerAlt className='text-white text-sm' />
                                        </div>
                                        <div>
                                            <h2 className='text-sm font-bold text-gray-800'>Step 1: Delivery Address</h2>
                                        </div>
                                    </div>
                                </div>

                                <div className='p-4'>
                                    {!res ? (
                                        <form onSubmit={save} className='space-y-3'>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <div>
                                                    <label className='block text-xs font-medium text-gray-700 mb-1'>Full Name *</label>
                                                    <input
                                                        onChange={inputHandle}
                                                        value={state.name}
                                                        type="text"
                                                        name="name"
                                                        required
                                                        placeholder='John Doe'
                                                        className='w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-cyan-500 outline-none text-sm'
                                                    />
                                                </div>
                                                <div>
                                                    <label className='block text-xs font-medium text-gray-700 mb-1'>Phone *</label>
                                                    <input
                                                        onChange={inputHandle}
                                                        value={state.phone}
                                                        type="tel"
                                                        name="phone"
                                                        required
                                                        placeholder='0771234567'
                                                        className='w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-cyan-500 outline-none text-sm'
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className='block text-xs font-medium text-gray-700 mb-1'>Street Address *</label>
                                                <input
                                                    onChange={inputHandle}
                                                    value={state.address}
                                                    type="text"
                                                    name="address"
                                                    required
                                                    placeholder='123 Main Street'
                                                    className='w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-cyan-500 outline-none text-sm'
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <div>
                                                    <label className='block text-xs font-medium text-gray-700 mb-1'>Province *</label>
                                                    <input
                                                        onChange={inputHandle}
                                                        value={state.province}
                                                        type="text"
                                                        name="province"
                                                        required
                                                        placeholder='Harare'
                                                        className='w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-cyan-500 outline-none text-sm'
                                                    />
                                                </div>
                                                <div>
                                                    <label className='block text-xs font-medium text-gray-700 mb-1'>City *</label>
                                                    <input
                                                        onChange={inputHandle}
                                                        value={state.city}
                                                        type="text"
                                                        name="city"
                                                        required
                                                        placeholder='CBD'
                                                        className='w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-cyan-500 outline-none text-sm'
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <div>
                                                    <label className='block text-xs font-medium text-gray-700 mb-1'>Area *</label>
                                                    <input
                                                        onChange={inputHandle}
                                                        value={state.area}
                                                        type="text"
                                                        name="area"
                                                        required
                                                        placeholder='Avondale'
                                                        className='w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-cyan-500 outline-none text-sm'
                                                    />
                                                </div>
                                                <div>
                                                    <label className='block text-xs font-medium text-gray-700 mb-1'>Postal Code *</label>
                                                    <input
                                                        onChange={inputHandle}
                                                        value={state.post}
                                                        type="text"
                                                        name="post"
                                                        required
                                                        placeholder='00263'
                                                        className='w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-cyan-500 outline-none text-sm'
                                                    />
                                                </div>
                                            </div>

                                            <button
                                                type='submit'
                                                className='w-full py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 text-sm active:scale-[0.98]'
                                            >
                                                <FaCheck />
                                                Save & Continue
                                            </button>
                                        </form>
                                    ) : (
                                        <div className='bg-green-50 border border-green-200 rounded-xl p-3'>
                                            <div className='flex items-start gap-3'>
                                                <div className='w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0'>
                                                    <FaCheck className='text-white text-xs' />
                                                </div>
                                                <div className='flex-1 min-w-0'>
                                                    <h3 className='font-semibold text-green-800 text-sm'>{state.name}</h3>
                                                    <p className='text-xs text-green-700'>{state.address}, {state.area}, {state.city}</p>
                                                    <p className='text-xs text-green-600 flex items-center gap-1 mt-0.5'>
                                                        <FaPhone className='text-xs' /> {state.phone}
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setRes(false)}
                                                    className='text-cyan-600 text-xs flex items-center gap-1'
                                                >
                                                    <FaEdit /> Edit
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Step 2: Order Items - Only show after address saved */}
                            {res && (
                                <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
                                    <div className='px-4 py-3 border-b border-gray-100'>
                                        <h2 className='text-sm font-bold text-gray-800'>Step 2: Review Items ({items})</h2>
                                    </div>

                                    <div className='divide-y divide-gray-100 max-h-[250px] overflow-y-auto'>
                                        {products.map((p, i) => (
                                            <div key={i} className='p-3'>
                                                <div className='flex items-center gap-2 mb-2'>
                                                    <div className='w-2 h-2 bg-cyan-500 rounded-full'></div>
                                                    <span className='font-medium text-gray-800 text-xs'>{p.shopName}</span>
                                                </div>

                                                <div className='space-y-2'>
                                                    {p.products.map((pt, j) => (
                                                        <div key={j} className='flex gap-2 items-center'>
                                                            <div className='w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0'>
                                                                <img
                                                                    className='w-full h-full object-cover'
                                                                    src={pt.productInfo.images[0]}
                                                                    alt={pt.productInfo.name}
                                                                />
                                                            </div>
                                                            <div className='flex-1 min-w-0'>
                                                                <h4 className='text-xs text-gray-800 truncate'>{pt.productInfo.name}</h4>
                                                                <p className='text-xs text-gray-500'>Qty: {pt.quantity}</p>
                                                            </div>
                                                            <span className='text-sm font-bold text-cyan-600'>
                                                                ${formatPrice(pt.productInfo.price - Math.floor((pt.productInfo.price * pt.productInfo.discount) / 100))}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column - Order Summary (shows at top on mobile due to flex-col-reverse) */}
                        <div className='w-full lg:w-[300px]'>
                            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden lg:sticky lg:top-4'>
                                <div className='bg-gradient-to-r from-cyan-500 to-cyan-600 px-4 py-3'>
                                    <h2 className='text-sm font-bold text-white flex items-center gap-2'>
                                        <FaTruck />
                                        Order Summary
                                    </h2>
                                </div>

                                <div className='p-4 space-y-2'>
                                    <div className='flex justify-between items-center text-gray-600 text-sm'>
                                        <span>Items ({items})</span>
                                        <span className='font-semibold text-gray-800'>${formatPrice(price)}</span>
                                    </div>

                                    <div className='flex justify-between items-center text-gray-600 text-sm'>
                                        <span>Delivery</span>
                                        <span className='font-semibold text-gray-800'>${formatPrice(shipping_fee)}</span>
                                    </div>

                                    <div className='border-t border-gray-200 pt-2'>
                                        <div className='flex justify-between items-center'>
                                            <span className='text-sm font-bold text-gray-800'>Total</span>
                                            <span className='text-lg font-bold text-cyan-600'>${formatPrice(price + shipping_fee)}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={placeOrder}
                                        disabled={!res || loader}
                                        type="button"
                                        className={`w-full py-3 font-bold rounded-xl text-white transition-all flex items-center justify-center gap-2 text-sm mt-2 ${res && !loader
                                            ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 active:scale-[0.98]'
                                            : 'bg-gray-300 cursor-not-allowed'
                                            }`}
                                    >
                                        {loader ? (
                                            <><FaSpinner className='animate-spin' /> Processing...</>
                                        ) : res ? 'Proceed to Payment' : 'Complete Step 1'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Shipping;