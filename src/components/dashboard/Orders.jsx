import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { get_orders } from '../../store/reducers/orderReducer';
import { FaEye, FaCreditCard } from 'react-icons/fa';

const Orders = () => {
    const [state, setState] = useState('all')

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { userInfo } = useSelector(state => state.auth)
    const { myOrders } = useSelector(state => state.order)

    useEffect(() => {
        dispatch(get_orders({ status: state, customerId: userInfo.id }))
    }, [state, dispatch, userInfo.id])

    const redirect = (ord) => {
        let items = 0;
        for (let i = 0; i < ord.products.length; i++) {
            items = ord.products[i].quantity + items;
        }
        navigate('/payment', {
            state: {
                price: ord.price,
                items,
                orderId: ord._id
            }
        })
    }

    const getPaymentStatusBadge = (status) => {
        switch (status) {
            case 'paid':
                return 'bg-emerald-100 text-emerald-700';
            case 'cod':
                return 'bg-amber-100 text-amber-700';
            case 'unpaid':
            default:
                return 'bg-red-100 text-red-700';
        }
    }

    const getDeliveryStatusBadge = (status) => {
        switch (status) {
            case 'delivered':
                return 'bg-emerald-100 text-emerald-700';
            case 'pending':
                return 'bg-amber-100 text-amber-700';
            case 'cancelled':
                return 'bg-red-100 text-red-700';
            case 'processing':
            case 'warehouse':
                return 'bg-blue-100 text-blue-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    }

    const formatPaymentStatus = (status) => {
        if (status === 'cod') return 'Cash on Delivery';
        return status.charAt(0).toUpperCase() + status.slice(1);
    }

    return (
        <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
            <div className='p-6 border-b border-gray-100'>
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                    <h2 className='text-xl font-bold text-gray-800'>My Orders</h2>
                    <select
                        className='px-4 py-2 border border-gray-200 rounded-xl text-gray-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all'
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                    >
                        <option value="all">All Orders</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            <div className='overflow-x-auto'>
                <table className='w-full'>
                    <thead className='bg-gray-50'>
                        <tr>
                            <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Order ID</th>
                            <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Price</th>
                            <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Payment</th>
                            <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Status</th>
                            <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Action</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-100'>
                        {myOrders.map((o, i) => (
                            <tr key={i} className='hover:bg-gray-50 transition-colors'>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <span className='text-sm font-medium text-gray-800'>#{o._id.slice(-8)}</span>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <span className='text-sm font-semibold text-gray-800'>${o.price}</span>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getPaymentStatusBadge(o.payment_status)}`}>
                                        {formatPaymentStatus(o.payment_status)}
                                    </span>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getDeliveryStatusBadge(o.delivery_status)}`}>
                                        {o.delivery_status.charAt(0).toUpperCase() + o.delivery_status.slice(1)}
                                    </span>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='flex items-center gap-2'>
                                        <Link
                                            to={`/dashboard/order/details/${o._id}`}
                                            className='inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-50 text-cyan-600 text-sm font-medium rounded-lg hover:bg-cyan-100 transition-colors'
                                        >
                                            <FaEye className='text-xs' />
                                            View
                                        </Link>

                                        {o.payment_status === 'unpaid' && (
                                            <button
                                                onClick={() => redirect(o)}
                                                className='inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 text-sm font-medium rounded-lg hover:bg-emerald-100 transition-colors'
                                            >
                                                <FaCreditCard className='text-xs' />
                                                Pay Now
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {myOrders.length === 0 && (
                    <div className='text-center py-12'>
                        <div className='text-gray-400 mb-2'>
                            <svg className='w-12 h-12 mx-auto' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4' />
                            </svg>
                        </div>
                        <p className='text-gray-500'>No orders found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
