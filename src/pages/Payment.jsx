import React, { useState, useEffect, useRef } from 'react';
import Header from './../components/Header';
import Footer from './../components/Footer';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { create_paynow_payment, create_paynow_mobile, confirm_cod_order, check_paynow_status, messageClear } from '../store/reducers/orderReducer';
import { FaCreditCard, FaMobileAlt, FaTruck, FaSpinner, FaCheckCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Payment = () => {
    const { state: { price, items, orderId } } = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const pollIntervalRef = useRef(null)

    const { userInfo } = useSelector(state => state.auth)
    const { loader, successMessage, errorMessage, paynowRedirectUrl, paymentStatus } = useSelector(state => state.order)

    const [paymentMethod, setPaymentMethod] = useState('paynow')
    const [mobileMethod, setMobileMethod] = useState('ecocash')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState(userInfo?.email || '')
    const [mobilePaymentPending, setMobilePaymentPending] = useState(false)
    const [pollCount, setPollCount] = useState(0)

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
            localStorage.setItem('orderId', orderId)
            window.location.href = paynowRedirectUrl
        }
    }, [paynowRedirectUrl, orderId])

    // Poll for mobile payment status
    useEffect(() => {
        if (mobilePaymentPending && orderId) {
            pollIntervalRef.current = setInterval(() => {
                dispatch(check_paynow_status(orderId))
                setPollCount(prev => prev + 1)
            }, 5000)

            if (pollCount >= 24) {
                clearInterval(pollIntervalRef.current)
                setMobilePaymentPending(false)
                toast.error('Payment timeout. Please try again.')
            }
        }
        return () => {
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current)
        }
    }, [mobilePaymentPending, orderId, pollCount, dispatch])

    useEffect(() => {
        if (paymentStatus === 'paid') {
            clearInterval(pollIntervalRef.current)
            setMobilePaymentPending(false)
            toast.success('Payment successful!')
            setTimeout(() => navigate('/dashboard/my-orders'), 1500)
        } else if (paymentStatus === 'failed') {
            clearInterval(pollIntervalRef.current)
            setMobilePaymentPending(false)
            toast.error('Payment failed. Please try again.')
        }
    }, [paymentStatus, navigate])

    const handlePaynowWeb = (e) => {
        e.preventDefault()
        if (!email) {
            toast.error('Please enter your email')
            return
        }
        dispatch(create_paynow_payment({ orderId, price, email }))
    }

    const handlePaynowMobile = (e) => {
        e.preventDefault()
        if (!email || !phone) {
            toast.error('Please enter email and phone number')
            return
        }
        dispatch(create_paynow_mobile({ orderId, price, email, phone, method: mobileMethod }))
        setMobilePaymentPending(true)
        setPollCount(0)
        toast.success('Check your phone to confirm payment!')
    }

    const handleCOD = (e) => {
        e.preventDefault()
        dispatch(confirm_cod_order(orderId))
        setTimeout(() => navigate('/dashboard/my-orders'), 2000)
    }

    return (
        <div className='bg-gray-50 min-h-screen'>
            <Header />
            <section className='py-4 mt-4'>
                <div className='w-[95%] max-w-6xl mx-auto'>
                    <div className='flex flex-col lg:flex-row gap-4'>
                        {/* Payment Methods - TOP on mobile, LEFT on desktop */}
                        <div className='flex-1'>
                            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
                                <div className='p-4 border-b border-gray-100'>
                                    <h2 className='text-lg font-bold text-gray-800'>Payment Method</h2>
                                </div>

                                <div className='flex border-b border-gray-100'>
                                    <button onClick={() => setPaymentMethod('paynow')} type="button"
                                        className={`flex-1 py-3 px-3 flex items-center justify-center gap-1.5 font-medium text-sm ${paymentMethod === 'paynow' ? 'text-cyan-600 border-b-2 border-cyan-600 bg-cyan-50' : 'text-gray-500'}`}>
                                        <FaCreditCard /> Card
                                    </button>
                                    <button onClick={() => setPaymentMethod('mobile')} type="button"
                                        className={`flex-1 py-3 px-3 flex items-center justify-center gap-1.5 font-medium text-sm ${paymentMethod === 'mobile' ? 'text-cyan-600 border-b-2 border-cyan-600 bg-cyan-50' : 'text-gray-500'}`}>
                                        <FaMobileAlt /> Mobile
                                    </button>
                                    <button onClick={() => setPaymentMethod('cod')} type="button"
                                        className={`flex-1 py-3 px-3 flex items-center justify-center gap-1.5 font-medium text-sm ${paymentMethod === 'cod' ? 'text-cyan-600 border-b-2 border-cyan-600 bg-cyan-50' : 'text-gray-500'}`}>
                                        <FaTruck /> COD
                                    </button>
                                </div>

                                {paymentMethod === 'paynow' && (
                                    <div className='p-4'>
                                        <div className='space-y-3'>
                                            <div>
                                                <label className='block text-xs font-medium text-gray-700 mb-1'>Email</label>
                                                <input type='email' value={email} onChange={(e) => setEmail(e.target.value)}
                                                    placeholder='your@email.com' className='w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:border-cyan-500 outline-none text-sm' />
                                            </div>
                                            <button onClick={handlePaynowWeb} disabled={loader} type="button"
                                                className='w-full py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 text-sm active:scale-[0.98]'>
                                                {loader ? <><FaSpinner className='animate-spin' /> Processing...</> : <>Pay ${formatPrice(price)}</>}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {paymentMethod === 'mobile' && (
                                    <div className='p-4'>
                                        {mobilePaymentPending ? (
                                            <div className='text-center py-8'>
                                                <FaSpinner className='animate-spin text-4xl text-cyan-500 mx-auto mb-4' />
                                                <h3 className='font-semibold text-gray-800 mb-2'>Waiting for Payment</h3>
                                                <p className='text-sm text-gray-500'>Check your phone and enter PIN</p>
                                            </div>
                                        ) : (
                                            <>
                                                <div className='mb-4'>
                                                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                                                        <button onClick={() => setMobileMethod('ecocash')} type="button"
                                                            className={`p-3 rounded-xl border-2 ${mobileMethod === 'ecocash' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                                                            <span className='font-medium text-sm'>EcoCash</span>
                                                        </button>
                                                        <button onClick={() => setMobileMethod('onemoney')} type="button"
                                                            className={`p-3 rounded-xl border-2 ${mobileMethod === 'onemoney' ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}>
                                                            <span className='font-medium text-sm'>OneMoney</span>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className='space-y-3'>
                                                    <div>
                                                        <label className='block text-xs font-medium text-gray-700 mb-1'>Email</label>
                                                        <input type='email' value={email} onChange={(e) => setEmail(e.target.value)}
                                                            placeholder='your@email.com' className='w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm' />
                                                    </div>
                                                    <div>
                                                        <label className='block text-xs font-medium text-gray-700 mb-1'>Phone</label>
                                                        <input type='tel' value={phone} onChange={(e) => setPhone(e.target.value)}
                                                            placeholder='0771234567' className='w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm' />
                                                    </div>
                                                    <button onClick={handlePaynowMobile} disabled={loader} type="button"
                                                        className={`w-full py-3 text-white font-semibold rounded-xl flex items-center justify-center gap-2 text-sm active:scale-[0.98] ${mobileMethod === 'ecocash' ? 'bg-green-500' : 'bg-red-500'}`}>
                                                        {loader ? <><FaSpinner className='animate-spin' /> Sending...</> : <>Pay ${formatPrice(price)}</>}
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}

                                {paymentMethod === 'cod' && (
                                    <div className='p-4'>
                                        <div className='bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4'>
                                            <div className='flex items-start gap-2'>
                                                <FaTruck className='text-amber-600 text-lg' />
                                                <div>
                                                    <h3 className='font-semibold text-amber-800 text-sm'>Cash on Delivery</h3>
                                                    <p className='text-xs text-amber-700'>Pay when your order arrives</p>
                                                </div>
                                            </div>
                                        </div>
                                        <button onClick={handleCOD} disabled={loader} type="button"
                                            className='w-full py-3 bg-amber-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 text-sm active:scale-[0.98]'>
                                            {loader ? <><FaSpinner className='animate-spin' /> Confirming...</> : <><FaCheckCircle /> Confirm Order - ${formatPrice(price)}</>}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Summary - BOTTOM on mobile, RIGHT on desktop */}
                        <div className='w-full lg:w-[280px]'>
                            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:sticky lg:top-4'>
                                <h2 className='text-sm font-bold text-gray-800 mb-3'>Order Summary</h2>
                                <div className='flex justify-between text-sm text-gray-600 pb-2 border-b'>
                                    <span>Items ({items})</span>
                                    <span>${formatPrice(price)}</span>
                                </div>
                                <div className='flex justify-between items-center pt-2'>
                                    <span className='font-bold text-gray-800'>Total</span>
                                    <span className='text-xl font-bold text-cyan-600'>${formatPrice(price)}</span>
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