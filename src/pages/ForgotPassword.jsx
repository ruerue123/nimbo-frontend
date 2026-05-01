import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import api from '../api/api';
import toast from 'react-hot-toast';
import { FadeLoader } from 'react-spinners';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loader, setLoader] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setLoader(true);
        try {
            const { data } = await api.post('/forgot-password', { email, role: 'customer' });
            toast.success(data?.message || 'Check your email for a reset link.');
            setSubmitted(true);
        } catch (err) {
            toast.error(err?.response?.data?.error || 'Something went wrong. Try again.');
        } finally {
            setLoader(false);
        }
    };

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
                            <h2 className='text-2xl font-bold text-gray-900 mb-2'>Forgot password?</h2>
                            <p className='text-gray-500'>Enter your email and we'll send you a reset link.</p>
                        </div>

                        {submitted ? (
                            <div className='text-center space-y-4'>
                                <p className='text-gray-700'>
                                    If an account exists for <span className='font-semibold'>{email}</span>, a reset link is on its way. The link expires in 1 hour.
                                </p>
                                <Link to='/login' className='inline-block text-cyan-600 font-semibold hover:text-cyan-700'>
                                    Back to login
                                </Link>
                            </div>
                        ) : (
                            <form onSubmit={submit} className='space-y-5'>
                                <div>
                                    <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-2'>Email Address</label>
                                    <input
                                        id='email'
                                        type='email'
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder='you@example.com'
                                        className='w-full px-4 py-3 outline-none border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all'
                                    />
                                </div>
                                <button
                                    type='submit'
                                    disabled={loader}
                                    className='w-full py-3.5 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-xl transition-all disabled:opacity-60'
                                >
                                    Send reset link
                                </button>
                                <div className='text-center'>
                                    <Link to='/login' className='text-cyan-600 font-medium hover:text-cyan-700 text-sm'>
                                        Back to login
                                    </Link>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ForgotPassword;
