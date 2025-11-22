import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FadeLoader } from 'react-spinners';
import { useDispatch, useSelector } from 'react-redux';
import { check_paynow_status, messageClear } from '../store/reducers/orderReducer';
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaHome, FaShoppingBag } from 'react-icons/fa';

const ConfirmOrder = () => {
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();

    const { paymentStatus, successMessage, errorMessage } = useSelector(state => state.order);

    const [status, setStatus] = useState('checking');
    const [orderId, setOrderId] = useState('');

    useEffect(() => {
        // Get orderId from URL params or localStorage
        const urlOrderId = searchParams.get('orderId');
        const storedOrderId = localStorage.getItem('orderId');
        const id = urlOrderId || storedOrderId;

        if (id) {
            setOrderId(id);
            // Check payment status with backend
            dispatch(check_paynow_status(id));
        } else {
            setStatus('error');
        }
    }, [searchParams, dispatch]);

    useEffect(() => {
        if (paymentStatus === 'paid') {
            setStatus('success');
            localStorage.removeItem('orderId');
        } else if (paymentStatus && paymentStatus !== 'paid') {
            // Still pending or failed
            setStatus('pending');
        }
    }, [paymentStatus]);

    useEffect(() => {
        if (errorMessage) {
            setStatus('error');
            dispatch(messageClear());
        }
    }, [errorMessage, dispatch]);

    // Poll for payment status every 5 seconds if pending
    useEffect(() => {
        let interval;
        if (status === 'pending' && orderId) {
            interval = setInterval(() => {
                dispatch(check_paynow_status(orderId));
            }, 5000);
        }
        return () => clearInterval(interval);
    }, [status, orderId, dispatch]);

    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center p-4'>
            <div className='bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-md w-full text-center'>
                {status === 'checking' && (
                    <>
                        <div className='flex justify-center mb-6'>
                            <FadeLoader color='#06b6d4' />
                        </div>
                        <h2 className='text-xl font-bold text-gray-800 mb-2'>Verifying Payment</h2>
                        <p className='text-gray-500'>Please wait while we confirm your payment...</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className='w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center'>
                            <FaCheckCircle className='text-green-500 text-5xl' />
                        </div>
                        <h2 className='text-2xl font-bold text-gray-800 mb-2'>Payment Successful!</h2>
                        <p className='text-gray-500 mb-8'>
                            Thank you for your purchase. Your order has been confirmed and is being processed.
                        </p>
                        <div className='space-y-3'>
                            <Link
                                to='/dashboard/my-orders'
                                className='w-full py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:from-cyan-600 hover:to-cyan-700 transition-all shadow-lg shadow-cyan-500/30'
                            >
                                <FaShoppingBag />
                                View My Orders
                            </Link>
                            <Link
                                to='/'
                                className='w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-all'
                            >
                                <FaHome />
                                Continue Shopping
                            </Link>
                        </div>
                    </>
                )}

                {status === 'pending' && (
                    <>
                        <div className='w-20 h-20 mx-auto mb-6 bg-amber-100 rounded-full flex items-center justify-center'>
                            <FaSpinner className='text-amber-500 text-4xl animate-spin' />
                        </div>
                        <h2 className='text-2xl font-bold text-gray-800 mb-2'>Payment Pending</h2>
                        <p className='text-gray-500 mb-4'>
                            We're waiting for your payment to be confirmed. If you've completed the payment, please wait a moment.
                        </p>
                        <div className='bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8'>
                            <p className='text-sm text-amber-700'>
                                If you used mobile money, please check your phone and enter your PIN to complete the transaction.
                            </p>
                        </div>
                        <div className='space-y-3'>
                            <button
                                onClick={() => dispatch(check_paynow_status(orderId))}
                                className='w-full py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:from-cyan-600 hover:to-cyan-700 transition-all shadow-lg shadow-cyan-500/30'
                            >
                                Check Payment Status
                            </button>
                            <Link
                                to='/dashboard/my-orders'
                                className='w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-all'
                            >
                                View My Orders
                            </Link>
                        </div>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className='w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center'>
                            <FaTimesCircle className='text-red-500 text-5xl' />
                        </div>
                        <h2 className='text-2xl font-bold text-gray-800 mb-2'>Payment Failed</h2>
                        <p className='text-gray-500 mb-8'>
                            We couldn't verify your payment. Please try again or contact support if the problem persists.
                        </p>
                        <div className='space-y-3'>
                            <Link
                                to='/dashboard/my-orders'
                                className='w-full py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:from-cyan-600 hover:to-cyan-700 transition-all shadow-lg shadow-cyan-500/30'
                            >
                                <FaShoppingBag />
                                View My Orders
                            </Link>
                            <Link
                                to='/'
                                className='w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-all'
                            >
                                <FaHome />
                                Go Home
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ConfirmOrder;
