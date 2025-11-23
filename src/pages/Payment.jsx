import React, { useState, useEffect } from 'react';
import Header from './../components/Header';
import Footer from './../components/Footer';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { create_paynow_payment, create_paynow_mobile, confirm_cod_order, messageClear } from '../store/reducers/orderReducer';
import { FaCreditCard, FaMobileAlt, FaTruck, FaSpinner, FaCheckCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Payment = () => {
    const { state: { price, items, orderId } } = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { userInfo } = useSelector(state => state.auth)
    const { loader, successMessage, errorMessage, paynowRedirectUrl } = useSelector(state => state.order)

    const [paymentMethod, setPaymentMethod] = useState('paynow')
    const [mobileMethod, setMobileMethod] = useState('ecocash')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState(userInfo?.email || '')

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage)
            dispatch(messageClear())
        }
        if (errorMessage) {
            toast.error(errorMessage)
            dispatch(messageClear())
        }
    }, [successMessage, errorMessage, dispatch])

    useEffect(() => {
        if (paynowRedirectUrl) {
            // Store orderId for confirmation page
            localStorage.setItem('orderId', orderId)
            window.location.href = paynowRedirectUrl
        }
    }, [paynowRedirectUrl, orderId])

    const handlePaynowWeb = () => {
        if (!email) {
            toast.error('Please enter your email')
            return
        }
        dispatch(create_paynow_payment({ orderId, price, email }))
    }

    const handlePaynowMobile = () => {
        if (!email || !phone) {
            toast.error('Please enter email and phone number')
            return
        }
        dispatch(create_paynow_mobile({
            orderId,
            price,
            email,
            phone,
            method: mobileMethod
        }))
    }

    const handleCOD = () => {
        dispatch(confirm_cod_order(orderId))
        setTimeout(() => {
            navigate('/dashboard/my-orders')
        }, 2000)
    }

    return (
        <div className='bg-gray-50 min-h-screen'>
            <Header />
            <section className='py-12 mt-16'>
                <div className='w-[90%] max-w-6xl mx-auto'>
                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                        {/* Payment Options */}
                        <div className='lg:col-span-2'>
                            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
                                <div className='p-6 border-b border-gray-100'>
                                    <h2 className='text-xl font-bold text-gray-800'>Payment Method</h2>
                                    <p className='text-gray-500 text-sm mt-1'>Choose how you'd like to pay</p>
                                </div>

                                {/* Payment Method Tabs */}
                                <div className='flex border-b border-gray-100'>
                                    <button
                                        onClick={() => setPaymentMethod('paynow')}
                                        className={`flex-1 py-4 px-6 flex items-center justify-center gap-2 font-medium transition-colors ${paymentMethod === 'paynow'
                                            ? 'text-cyan-600 border-b-2 border-cyan-600 bg-cyan-50'
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        <FaCreditCard />
                                        <span>Pay Online</span>
                                    </button>
                                    <button
                                        onClick={() => setPaymentMethod('mobile')}
                                        className={`flex-1 py-4 px-6 flex items-center justify-center gap-2 font-medium transition-colors ${paymentMethod === 'mobile'
                                            ? 'text-cyan-600 border-b-2 border-cyan-600 bg-cyan-50'
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        <FaMobileAlt />
                                        <span>Mobile Money</span>
                                    </button>
                                    <button
                                        onClick={() => setPaymentMethod('cod')}
                                        className={`flex-1 py-4 px-6 flex items-center justify-center gap-2 font-medium transition-colors ${paymentMethod === 'cod'
                                            ? 'text-cyan-600 border-b-2 border-cyan-600 bg-cyan-50'
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        <FaTruck />
                                        <span>Cash on Delivery</span>
                                    </button>
                                </div>

                                {/* Paynow Web Payment */}
                                {paymentMethod === 'paynow' && (
                                    <div className='p-6'>
                                        <div className='flex items-center gap-3 mb-6'>
                                            <img src="/images/payment/paynow.png" alt="Paynow" className='h-10' onError={(e) => e.target.style.display = 'none'} />
                                            <div>
                                                <h3 className='font-semibold text-gray-800'>Paynow</h3>
                                                <p className='text-sm text-gray-500'>Pay securely with your bank card</p>
                                            </div>
                                        </div>

                                        <div className='space-y-4'>
                                            <div>
                                                <label className='block text-sm font-medium text-gray-700 mb-2'>Email Address</label>
                                                <input
                                                    type='email'
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder='your@email.com'
                                                    className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all'
                                                />
                                            </div>

                                            <button
                                                onClick={handlePaynowWeb}
                                                disabled={loader}
                                                className='w-full py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-cyan-700 transition-all shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 disabled:opacity-50'
                                            >
                                                {loader ? (
                                                    <>
                                                        <FaSpinner className='animate-spin' />
                                                        Processing...
                                                    </>
                                                ) : (
                                                    <>Pay ${price} with Paynow</>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Mobile Money Payment */}
                                {paymentMethod === 'mobile' && (
                                    <div className='p-6'>
                                        <div className='mb-6'>
                                            <h3 className='font-semibold text-gray-800 mb-4'>Select Mobile Money Provider</h3>
                                            <div className='grid grid-cols-2 gap-4'>
                                                <button
                                                    onClick={() => setMobileMethod('ecocash')}
                                                    className={`p-4 rounded-xl border-2 transition-all ${mobileMethod === 'ecocash'
                                                        ? 'border-green-500 bg-green-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <div className='text-center'>
                                                        <div className='text-2xl mb-2'></div>
                                                        <span className='font-medium text-gray-800'>EcoCash</span>
                                                    </div>
                                                </button>
                                                <button
                                                    onClick={() => setMobileMethod('onemoney')}
                                                    className={`p-4 rounded-xl border-2 transition-all ${mobileMethod === 'onemoney'
                                                        ? 'border-red-500 bg-red-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <div className='text-center'>
                                                        <div className='text-2xl mb-2'></div>
                                                        <span className='font-medium text-gray-800'>OneMoney</span>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>

                                        <div className='space-y-4'>
                                            <div>
                                                <label className='block text-sm font-medium text-gray-700 mb-2'>Email Address</label>
                                                <input
                                                    type='email'
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder='your@email.com'
                                                    className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all'
                                                />
                                            </div>
                                            <div>
                                                <label className='block text-sm font-medium text-gray-700 mb-2'>Phone Number</label>
                                                <input
                                                    type='tel'
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    placeholder='0771234567'
                                                    className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all'
                                                />
                                            </div>

                                            <button
                                                onClick={handlePaynowMobile}
                                                disabled={loader}
                                                className={`w-full py-4 text-white font-semibold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 ${mobileMethod === 'ecocash'
                                                    ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-green-500/30'
                                                    : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-red-500/30'
                                                    }`}
                                            >
                                                {loader ? (
                                                    <>
                                                        <FaSpinner className='animate-spin' />
                                                        Processing...
                                                    </>
                                                ) : (
                                                    <>Pay ${price} with {mobileMethod === 'ecocash' ? 'EcoCash' : 'OneMoney'}</>
                                                )}
                                            </button>

                                            <p className='text-sm text-gray-500 text-center'>
                                                You will receive a prompt on your phone to confirm the payment
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Cash on Delivery */}
                                {paymentMethod === 'cod' && (
                                    <div className='p-6'>
                                        <div className='bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6'>
                                            <div className='flex items-start gap-3'>
                                                <FaTruck className='text-amber-600 text-xl mt-0.5' />
                                                <div>
                                                    <h3 className='font-semibold text-amber-800'>Cash on Delivery</h3>
                                                    <p className='text-sm text-amber-700 mt-1'>
                                                        Pay with cash when your order is delivered. Please have the exact amount ready.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='bg-gray-50 rounded-xl p-4 mb-6'>
                                            <h4 className='font-medium text-gray-800 mb-2'>Order Details</h4>
                                            <div className='flex justify-between text-gray-600'>
                                                <span>Items</span>
                                                <span>{items} item(s)</span>
                                            </div>
                                            <div className='flex justify-between text-gray-800 font-semibold mt-2'>
                                                <span>Amount to Pay</span>
                                                <span className='text-lg text-cyan-600'>${price}</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleCOD}
                                            disabled={loader}
                                            className='w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 disabled:opacity-50'
                                        >
                                            {loader ? (
                                                <>
                                                    <FaSpinner className='animate-spin' />
                                                    Confirming...
                                                </>
                                            ) : (
                                                <>
                                                    <FaCheckCircle />
                                                    Confirm Cash on Delivery
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className='lg:col-span-1'>
                            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24'>
                                <h2 className='text-lg font-bold text-gray-800 mb-4'>Order Summary</h2>

                                <div className='space-y-3 pb-4 border-b border-gray-100'>
                                    <div className='flex justify-between text-gray-600'>
                                        <span>Items ({items})</span>
                                        <span>${price}</span>
                                    </div>
                                    <div className='flex justify-between text-gray-600'>
                                        <span>Delivery</span>
                                        <span className='text-green-600'>Included</span>
                                    </div>
                                </div>

                                <div className='flex justify-between items-center pt-4'>
                                    <span className='font-semibold text-gray-800'>Total</span>
                                    <span className='text-2xl font-bold text-cyan-600'>${price}</span>
                                </div>

                                <div className='mt-6 p-4 bg-gray-50 rounded-xl'>
                                    <div className='flex items-center gap-2 text-sm text-gray-600'>
                                        <svg className='w-5 h-5 text-green-500' fill='currentColor' viewBox='0 0 20 20'>
                                            <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                                        </svg>
                                        <span>Secure payment</span>
                                    </div>
                                    <div className='flex items-center gap-2 text-sm text-gray-600 mt-2'>
                                        <svg className='w-5 h-5 text-green-500' fill='currentColor' viewBox='0 0 20 20'>
                                            <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                                        </svg>
                                        <span>Money-back guarantee</span>
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

export default Payment;
