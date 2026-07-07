import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    customer_verify_email,
    customer_resend_verification,
    messageClear
} from '../store/reducers/authReducer';
import toast from 'react-hot-toast';
import { FadeLoader } from 'react-spinners';

const VerifyEmail = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loader, errorMessage, successMessage, userInfo, pendingEmail } = useSelector(state => state.auth);

    const [code, setCode] = useState('');

    // Reached directly without a pending signup/login → nothing to verify.
    useEffect(() => {
        if (!pendingEmail) {
            navigate('/login');
        }
    }, [pendingEmail, navigate]);

    const submit = (e) => {
        e.preventDefault();
        dispatch(customer_verify_email({ email: pendingEmail, code }));
    };

    const resend = () => {
        dispatch(customer_resend_verification({ email: pendingEmail }));
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
        if (userInfo) {
            navigate('/');
        }
    }, [successMessage, errorMessage, userInfo, dispatch, navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {loader && (
                <div className='w-screen h-screen flex justify-center items-center fixed left-0 top-0 bg-black/30 backdrop-blur-sm z-[999]'>
                    <FadeLoader color='#06b6d4' />
                </div>
            )}
            <Header />

            <div className='py-16'>
                <div className='w-[90%] max-w-md mx-auto'>
                    <div className='bg-white rounded-2xl shadow-xl p-8 border border-gray-100'>
                        <div className='text-center mb-8'>
                            <h2 className='text-2xl font-bold text-gray-900 mb-2'>Verify your email</h2>
                            <p className='text-gray-500'>
                                We sent a 6-digit code to{' '}
                                <span className='font-semibold text-gray-700'>{pendingEmail}</span>. Enter it below to activate your account.
                            </p>
                        </div>

                        <form onSubmit={submit} className='space-y-5'>
                            <div>
                                <label htmlFor='code' className='block text-sm font-medium text-gray-700 mb-2'>
                                    Verification code
                                </label>
                                <input
                                    id='code'
                                    name='code'
                                    type='text'
                                    inputMode='numeric'
                                    autoComplete='one-time-code'
                                    maxLength={6}
                                    required
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                                    placeholder='000000'
                                    className='w-full px-4 py-3 outline-none border border-gray-200 rounded-xl text-gray-700 text-center text-2xl tracking-[0.5em] placeholder-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all'
                                />
                            </div>

                            <button
                                type='submit'
                                disabled={loader || code.length !== 6}
                                className='w-full py-3.5 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-xl transition-all disabled:opacity-60'
                            >
                                Verify & Continue
                            </button>
                        </form>

                        <div className='mt-6 text-center text-sm text-gray-600'>
                            Didn't get the code?{' '}
                            <button
                                onClick={resend}
                                className='text-cyan-600 font-semibold hover:text-cyan-700'
                            >
                                Resend
                            </button>
                        </div>

                        <div className='mt-4 text-center'>
                            <Link to='/login' className='text-cyan-600 font-medium hover:text-cyan-700 text-sm'>
                                Back to login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default VerifyEmail;
