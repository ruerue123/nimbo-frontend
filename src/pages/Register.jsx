import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { customer_register, messageClear } from '../store/reducers/authReducer';
import toast from 'react-hot-toast';
import { FadeLoader } from 'react-spinners';

const Register = () => {
    const navigate = useNavigate();
    const { loader, errorMessage, successMessage, userInfo } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const [state, setState] = useState({
        name: '',
        email: '',
        password: ''
    });

    const inputHandle = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        });
    };

    const register = (e) => {
        e.preventDefault();
        dispatch(customer_register(state));
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
                    {/* Register Card */}
                    <div className='bg-white rounded-2xl shadow-xl p-8 border border-gray-100'>
                        {/* Header */}
                        <div className='text-center mb-8'>
                            <h2 className='text-2xl font-bold text-gray-900 mb-2'>Create Account</h2>
                            <p className='text-gray-500'>Join us and start shopping</p>
                        </div>

                        {/* Form */}
                        <form onSubmit={register} className='space-y-5'>
                            <div>
                                <label htmlFor="name" className='block text-sm font-medium text-gray-700 mb-2'>
                                    Full Name
                                </label>
                                <input
                                    onChange={inputHandle}
                                    value={state.name}
                                    className='w-full px-4 py-3 outline-none border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all'
                                    type="text"
                                    name="name"
                                    id="name"
                                    placeholder='Enter your full name'
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className='block text-sm font-medium text-gray-700 mb-2'>
                                    Email Address
                                </label>
                                <input
                                    onChange={inputHandle}
                                    value={state.email}
                                    className='w-full px-4 py-3 outline-none border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all'
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder='Enter your email'
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className='block text-sm font-medium text-gray-700 mb-2'>
                                    Password
                                </label>
                                <input
                                    onChange={inputHandle}
                                    value={state.password}
                                    className='w-full px-4 py-3 outline-none border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all'
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder='Create a password'
                                    required
                                />
                            </div>

                            <button className='w-full py-3.5 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 transition-all'>
                                Create Account
                            </button>
                        </form>

                        {/* Login Link */}
                        <div className='mt-6 text-center'>
                            <p className='text-gray-600'>
                                Already have an account?{' '}
                                <Link to='/login' className='text-cyan-600 font-semibold hover:text-cyan-700 transition-colors'>
                                    Sign In
                                </Link>
                            </p>
                        </div>

                        {/* Divider */}
                        <div className='flex items-center my-6'>
                            <div className='flex-1 h-px bg-gray-200'></div>
                            <span className='px-4 text-sm text-gray-400'>Are you a seller?</span>
                            <div className='flex-1 h-px bg-gray-200'></div>
                        </div>

                        {/* Seller Links */}
                        <div className='space-y-3'>
                            <a
                                target='_blank'
                                rel="noreferrer"
                                href="https://nimbo-dashboard.vercel.app/register"
                                className='block w-full py-3 text-center bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors'
                            >
                                Register as Seller
                            </a>
                            <a
                                target='_blank'
                                rel="noreferrer"
                                href="https://nimbo-dashboard.vercel.app/login"
                                className='block w-full py-3 text-center border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors'
                            >
                                Login as Seller
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Register;
