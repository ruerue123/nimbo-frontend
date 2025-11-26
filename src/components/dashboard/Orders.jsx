import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { get_orders } from '../../store/reducers/orderReducer';
import { FaEye, FaCreditCard, FaBox } from 'react-icons/fa';

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
            case 'order_received':
                return 'bg-amber-100 text-amber-700';
            case 'cancelled':
                return 'bg-red-100 text-red-700';
            case 'processing':
            case 'warehouse':
                return 'bg-blue-100 text-blue-700';
            case 'dispatched':
                return 'bg-purple-100 text-purple-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    }

    const formatDeliveryStatus = (status) => {
        const statusMap = {
            'pending': 'Pending',
            'order_received': 'Order Received',
            'processing': 'Processing',
            'dispatched': 'Dispatched',
            'delivered': 'Delivered',
            'cancelled': 'Cancelled'
        }
        return statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1)
    }

    const formatPrice = (price) => {
        return Number(price).toFixed(2)
    }

    const formatPaymentStatus = (status) => {
        if (status === 'cod') return 'COD';
        return status.charAt(0).toUpperCase() + status.slice(1);
    }

    return (
        <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
            <div className='p-4 sm:p-6 border-b border-gray-100'>
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3'>
                    <h2 className='text-lg sm:text-xl font-bold text-gray-800'>My Orders</h2>
                    <select
                        className='w-full sm:w-auto px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 focus:border-cyan-500 outline-none'
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                    >
                        <option value="all">All Orders</option>
                        <option value="pending">Pending</option>
                        <option value="order_received">Order Received</option>
                        <option value="processing">Processing</option>
                        <option value="dispatched">Dispatched</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Desktop Table View - Show on large screens only */}
            <div className='hidden lg:block overflow-x-auto'>
                <table className='w-full'>
                    <thead className='bg-gray-50'>
                        <tr>
                            <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase'>Order ID</th>
                            <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase'>Price</th>
                            <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase'>Payment</th>
                            <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase'>Status</th>
                            <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase'>Action</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-100'>
                        {myOrders.map((o, i) => (
                            <tr key={i} className='hover:bg-gray-50 transition-colors'>
                                <td className='px-6 py-4'>
                                    <span className='text-sm font-medium text-gray-800'>#{o._id.slice(-8)}</span>
                                </td>
                                <td className='px-6 py-4'>
                                    <span className='text-sm font-semibold text-cyan-600'>${formatPrice(o.price)}</span>
                                </td>
                                <td className='px-6 py-4'>
                                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getPaymentStatusBadge(o.payment_status)}`}>
                                        {formatPaymentStatus(o.payment_status)}
                                    </span>
                                </td>
                                <td className='px-6 py-4'>
                                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getDeliveryStatusBadge(o.delivery_status)}`}>
                                        {formatDeliveryStatus(o.delivery_status)}
                                    </span>
                                </td>
                                <td className='px-6 py-4'>
                                    <div className='flex items-center gap-2'>
                                        <Link
                                            to={`/dashboard/order/details/${o._id}`}
                                            className='inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-50 text-cyan-600 text-sm font-medium rounded-lg hover:bg-cyan-100 transition-colors'
                                        >
                                            <FaEye className='text-xs' /> View
                                        </Link>
                                        {o.payment_status === 'unpaid' && (
                                            <button
                                                onClick={() => redirect(o)}
                                                className='inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 text-sm font-medium rounded-lg hover:bg-emerald-100 transition-colors'
                                            >
                                                <FaCreditCard className='text-xs' /> Pay
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View - Show on mobile and tablet */}
            <div className='lg:hidden divide-y divide-gray-100'>
                {myOrders.map((o, i) => (
                    <div key={i} className='p-4'>
                        <div className='flex items-start justify-between mb-3'>
                            <div>
                                <p className='text-xs text-gray-500'>Order</p>
                                <p className='font-semibold text-gray-800'>#{o._id.slice(-8)}</p>
                            </div>
                            <span className='text-lg font-bold text-cyan-600'>${formatPrice(o.price)}</span>
                        </div>

                        <div className='flex flex-wrap gap-2 mb-3'>
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getPaymentStatusBadge(o.payment_status)}`}>
                                <FaCreditCard className='mr-1 text-xs' />
                                {formatPaymentStatus(o.payment_status)}
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getDeliveryStatusBadge(o.delivery_status)}`}>
                                <FaBox className='mr-1 text-xs' />
                                {formatDeliveryStatus(o.delivery_status)}
                            </span>
                        </div>

                        <div className='flex flex-col sm:flex-row gap-2'>
                            <Link
                                to={`/dashboard/order/details/${o._id}`}
                                className='flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-cyan-50 text-cyan-600 text-sm font-medium rounded-lg hover:bg-cyan-100 transition-colors'
                            >
                                <FaEye className='text-xs' /> View Details
                            </Link>
                            {o.payment_status === 'unpaid' && (
                                <button
                                    onClick={() => redirect(o)}
                                    className='flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-medium rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all'
                                >
                                    <FaCreditCard className='text-xs' /> Pay Now
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {myOrders.length === 0 && (
                <div className='text-center py-12'>
                    <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                        <FaBox className='w-8 h-8 text-gray-300' />
                    </div>
                    <h3 className='font-semibold text-gray-800 mb-2'>No orders found</h3>
                    <p className='text-sm text-gray-500'>Your orders will appear here once you make a purchase</p>
                </div>
            )}
        </div>
    );
};

export default Orders;