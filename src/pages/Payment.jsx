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

    const formatPrice = (value) => Number(value).toFixed(2)

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
            <section className='py-6 sm:py-8 mt-4'>
                <div className='w-[95%] sm:w-[90%] max-w-6xl mx-auto'>
                    <div className='flex flex-col lg:flex-row gap-4 sm:gap-6'>
                        {/* Payment Options */}
                        <div className='flex-1'>
                            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
                                <div className='p-4 sm:p-6 border-b border-gray-100'>
                                    <h2 className='text-lg sm:text-xl font-bold text-gray-800'>Payment Method</h2>
                                    <p className='text-gray-500 text-xs sm:text-sm mt-1'>Choose how you'd like to pay</p>
                                </div>

                                {/* Payment Method Tabs - Scrollable on mobile */}
                                <div className='flex overflow-x-auto border-b border-gray-100'>
                                    <button
                                        onClick={() => setPaymentMethod('paynow')}
                                        className={`flex-1 min-w-[100px] py-3 sm:py-4 px-3 sm:px-6 flex items-center justify-center gap-1.5 sm:gap-2 font-medium transition-colors text-sm sm:text-base ${paymentMethod === 'paynow'
                                            ? 'text-cyan-600 border-b-2 border-cyan-600 bg-cyan-50'
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        <FaCreditCard className='text-sm sm:text-base' />
                                        <span className='whitespace-nowrap'>Pay Online</span>
                                    </button>
                                    <button
                                        onClick={() => setPaymentMethod('mobile')}
                                        className={`flex-1 min-w-[100px] py-3 sm:py-4 px-3 sm:px-6 flex items-center justify-center gap-1.5 sm:gap-2 font-medium transition-colors text-sm sm:text-base ${paymentMethod === 'mobile'
                                            ? 'text-cyan-600 border-b-2 border-cyan-600 bg-cyan-50'
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        <FaMobileAlt className='text-sm sm:text-base' />
                                        <span className='whitespace-nowrap'>Mobile</span>
                                    </button>
                                    <button
                                        onClick={() => setPaymentMethod('cod')}
                                        className={`flex-1 min-w-[100px] py-3 sm:py-4 px-3 sm:px-6 flex items-center justify-center gap-1.5 sm:gap-2 font-medium transition-colors text-sm sm:text-base ${paymentMethod === 'cod'
                                            ? 'text-cyan-600 border-b-2 border-cyan-600 bg-cyan-50'
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        <FaTruck className='text-sm sm:text-base' />
                                        <span className='whitespace-nowrap'>COD</span>
                                    </button>
                                </div>

                                {/* Paynow Web Payment */}
                                {paymentMethod === 'paynow' && (
                                    <div className='p-4 sm:p-6'>
                                        <div className='flex items-center gap-3 mb-4 sm:mb-6'>
                                            <img src="/images/payment/paynow.png" alt="Paynow" className='h-8 sm:h-10' onError={(e) => e.target.style.display = 'none'} />
                                            <div>
                                                <h3 className='font-semibold text-gray-800 text-sm sm:text-base'>Paynow</h3>
                                                <p className='text-xs sm:text-sm text-gray-500'>Pay securely with your bank card</p>
                                            </div>
                                        </div>

                                        <div className='space-y-4'>
                                            <div>
                                                <label className='block text-sm font-medium text-gray-700 mb-1.5'>Email Address</label>
                                                <input
                                                    type='email'
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder='your@email.com'
                                                    className='w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all text-sm'
                                                />
                                            </div>

                                            <button
                                                onClick={handlePaynowWeb}
                                                disabled={loader}
                                                className='w-full py-3 sm:py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-cyan-700 transition-all shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base'
                                            >
                                                {loader ? (
                                                    <>
                                                        <FaSpinner className='animate-spin' />
                                                        Processing...
                                                    </>
                                                ) : (
                                                    <>Pay ${formatPrice(price)} with Paynow</>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Mobile Money Payment */}
                                {paymentMethod === 'mobile' && (
                                    <div className='p-4 sm:p-6'>
                                        <div className='mb-4 sm:mb-6'>
                                            <h3 className='font-semibold text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base'>Select Mobile Money Provider</h3>
                                            <div className='grid grid-cols-2 gap-3 sm:gap-4'>
                                                <button
                                                    onClick={() => setMobileMethod('ecocash')}
                                                    className={`p-3 sm:p-4 rounded-xl border-2 transition-all ${mobileMethod === 'ecocash'
                                                        ? 'border-green-500 bg-green-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <div className='text-center'>
                                                        <span className='font-medium text-gray-800 text-sm sm:text-base'>EcoCash</span>
                                                    </div>
                                                </button>
                                                <button
                                                    onClick={() => setMobileMethod('onemoney')}
                                                    className={`p-3 sm:p-4 rounded-xl border-2 transition-all ${mobileMethod === 'onemoney'
                                                        ? 'border-red-500 bg-red-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <div className='text-center'>
                                                        <span className='font-medium text-gray-800 text-sm sm:text-base'>OneMoney</span>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>

                                        <div className='space-y-3 sm:space-y-4'>
                                            <div>
                                                <label className='block text-sm font-medium text-gray-700 mb-1.5'>Email Address</label>
                                                <input
                                                    type='email'
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder='your@email.com'
                                                    className='w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all text-sm'
                                                />
                                            </div>
                                            <div>
                                                <label className='block text-sm font-medium text-gray-700 mb-1.5'>Phone Number</label>
                                                <input
                                                    type='tel'
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    placeholder='0771234567'
                                                    className='w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all text-sm'
                                                />
                                            </div>

                                            <button
                                                onClick={handlePaynowMobile}
                                                disabled={loader}
                                                className={`w-full py-3 sm:py-4 text-white font-semibold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base ${mobileMethod === 'ecocash'
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
                                                    <>Pay ${formatPrice(price)} with {mobileMethod === 'ecocash' ? 'EcoCash' : 'OneMoney'}</>
                                                )}
                                            </button>

                                            <p className='text-xs sm:text-sm text-gray-500 text-center'>
                                                You will receive a prompt on your phone to confirm the payment
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Cash on Delivery */}
                                {paymentMethod === 'cod' && (
                                    <div className='p-4 sm:p-6'>
                                        <div className='bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6'>
                                            <div className='flex items-start gap-2 sm:gap-3'>
                                                <FaTruck className='text-amber-600 text-lg sm:text-xl mt-0.5 flex-shrink-0' />
                                                <div>
                                                    <h3 className='font-semibold text-amber-800 text-sm sm:text-base'>Cash on Delivery</h3>
                                                    <p className='text-xs sm:text-sm text-amber-700 mt-1'>
                                                        Pay with cash when your order is delivered.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='bg-gray-50 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6'>
                                            <h4 className='font-medium text-gray-800 mb-2 text-sm'>Order Details</h4>
                                            <div className='flex justify-between text-gray-600 text-sm'>
                                                <span>Items</span>
                                                <span>{items} item(s)</span>
                                            </div>
                                            <div className='flex justify-between text-gray-800 font-semibold mt-2'>
                                                <span className='text-sm'>Amount to Pay</span>
                                                <span className='text-base sm:text-lg text-cyan-600'>${formatPrice(price)}</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleCOD}
                                            disabled={loader}
                                            className='w-full py-3 sm:py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base'
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
                        <div className='w-full lg:w-[320px]'>
                            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 sticky top-4'>
                                <h2 className='text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4'>Order Summary</h2>

                                <div className='space-y-2 sm:space-y-3 pb-3 sm:pb-4 border-b border-gray-100'>
                                    <div className='flex justify-between text-gray-600 text-sm'>
                                        <span>Items ({items})</span>
                                        <span>${formatPrice(price)}</span>
                                    </div>
                                    <div className='flex justify-between text-gray-600 text-sm'>
                                        <span>Delivery</span>
                                        <span className='text-green-600'>Included</span>
                                    </div>
                                </div>

                                <div className='flex justify-between items-center pt-3 sm:pt-4'>
                                    <span className='font-semibold text-gray-800 text-sm sm:text-base'>Total</span>
                                    <span className='text-xl sm:text-2xl font-bold text-cyan-600'>${formatPrice(price)}</span>
                                </div>

                                <div className='mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-xl'>
                                    <div className='flex items-center gap-2 text-xs sm:text-sm text-gray-600'>
                                        <svg className='w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                                            <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                                        </svg>
                                        <span>Secure payment</span>
                                    </div>
                                    <div className='flex items-center gap-2 text-xs sm:text-sm text-gray-600 mt-1.5 sm:mt-2'>
                                        <svg className='w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20'>
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
