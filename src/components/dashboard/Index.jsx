import React, { useEffect } from 'react';
import { FaBox, FaClock, FaTimesCircle, FaEye, FaCreditCard } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { get_dashboard_index_data } from '../../store/reducers/dashboardReducer';

const Index = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { userInfo } = useSelector(state => state.auth)
    const { recentOrders, totalOrder, pendingOrder, cancelledOrder } = useSelector(state => state.dashboard)

    useEffect(() => {
        dispatch(get_dashboard_index_data(userInfo.id))
    }, [dispatch, userInfo.id])

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

    const formatPrice = (price) => Number(price || 0).toFixed(2)

    const getPaymentBadge = (status) => {
        switch (status) {
            case 'paid': return 'bg-emerald-100 text-emerald-700';
            case 'cod': return 'bg-amber-100 text-amber-700';
            default: return 'bg-red-100 text-red-700';
        }
    }

    const getDeliveryBadge = (status, paymentStatus) => {
        // Show 'failed' for cancelled orders with unpaid status
        if (status === 'cancelled' && paymentStatus === 'unpaid') {
            return 'bg-red-100 text-red-700';
        }
        switch (status) {
            case 'delivered': return 'bg-emerald-100 text-emerald-700';
            case 'dispatched': return 'bg-purple-100 text-purple-700';
            case 'processing': return 'bg-blue-100 text-blue-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-amber-100 text-amber-700';
        }
    }

    const formatStatus = (status, paymentStatus) => {
        // Show 'Failed' for cancelled orders with unpaid status (payment failures)
        if (status === 'cancelled' && paymentStatus === 'unpaid') {
            return 'Failed';
        }
        const map = {
            'pending': 'Pending', 'order_received': 'Received', 'processing': 'Processing',
            'dispatched': 'Dispatched', 'delivered': 'Delivered', 'cancelled': 'Cancelled'
        }
        return map[status] || status
    }

    return (
        <div className='space-y-4'>
            {/* Stats Cards */}
            <div className='grid grid-cols-3 sm:grid-cols-1 gap-4'>
                <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-4'>
                    <div className='flex items-center gap-4'>
                        <div className='w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl flex items-center justify-center'>
                            <FaBox className='text-white text-xl' />
                        </div>
                        <div>
                            <h3 className='text-2xl font-bold text-gray-800'>{totalOrder}</h3>
                            <p className='text-sm text-gray-500'>Total Orders</p>
                        </div>
                    </div>
                </div>

                <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-4'>
                    <div className='flex items-center gap-4'>
                        <div className='w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center'>
                            <FaClock className='text-white text-xl' />
                        </div>
                        <div>
                            <h3 className='text-2xl font-bold text-gray-800'>{pendingOrder}</h3>
                            <p className='text-sm text-gray-500'>Pending</p>
                        </div>
                    </div>
                </div>

                <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-4'>
                    <div className='flex items-center gap-4'>
                        <div className='w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center'>
                            <FaTimesCircle className='text-white text-xl' />
                        </div>
                        <div>
                            <h3 className='text-2xl font-bold text-gray-800'>{cancelledOrder}</h3>
                            <p className='text-sm text-gray-500'>Cancelled</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
                <div className='p-4 border-b border-gray-100 flex items-center justify-between'>
                    <h2 className='text-lg font-bold text-gray-800'>Recent Orders</h2>
                    <Link to='/dashboard/my-orders' className='text-sm text-cyan-600 font-medium hover:underline'>
                        View All
                    </Link>
                </div>

                {/* Desktop Table */}
                <div className='hidden md:block overflow-x-auto'>
                    <table className='w-full'>
                        <thead className='bg-gray-50'>
                            <tr>
                                <th className='px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase'>Order ID</th>
                                <th className='px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase'>Price</th>
                                <th className='px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase'>Payment</th>
                                <th className='px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase'>Status</th>
                                <th className='px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase'>Action</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-100'>
                            {recentOrders.map((o, i) => (
                                <tr key={i} className='hover:bg-gray-50 transition-colors'>
                                    <td className='px-4 py-3'>
                                        <span className='text-sm font-medium text-gray-800'>#{o._id?.slice(-8)}</span>
                                    </td>
                                    <td className='px-4 py-3'>
                                        <span className='text-sm font-semibold text-cyan-600'>${formatPrice(o.price)}</span>
                                    </td>
                                    <td className='px-4 py-3'>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentBadge(o.payment_status)}`}>
                                            {o.payment_status === 'cod' ? 'COD' : o.payment_status?.charAt(0).toUpperCase() + o.payment_status?.slice(1)}
                                        </span>
                                    </td>
                                    <td className='px-4 py-3'>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDeliveryBadge(o.delivery_status, o.payment_status)}`}>
                                            {formatStatus(o.delivery_status, o.payment_status)}
                                        </span>
                                    </td>
                                    <td className='px-4 py-3'>
                                        <div className='flex gap-2'>
                                            <Link
                                                to={`/dashboard/order/details/${o._id}`}
                                                className='inline-flex items-center gap-1 px-2.5 py-1.5 bg-cyan-50 text-cyan-600 text-xs font-medium rounded-lg hover:bg-cyan-100'
                                            >
                                                <FaEye className='text-[10px]' /> View
                                            </Link>
                                            {o.payment_status !== 'paid' && o.payment_status !== 'cod' && (
                                                <button
                                                    onClick={() => redirect(o)}
                                                    className='inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 text-emerald-600 text-xs font-medium rounded-lg hover:bg-emerald-100'
                                                >
                                                    <FaCreditCard className='text-[10px]' /> Pay
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className='md:hidden divide-y divide-gray-100'>
                    {recentOrders.length === 0 ? (
                        <div className='p-8 text-center'>
                            <FaBox className='text-4xl text-gray-300 mx-auto mb-3' />
                            <p className='text-gray-500'>No recent orders</p>
                        </div>
                    ) : (
                        recentOrders.map((o, i) => (
                            <div key={i} className='p-4'>
                                <div className='flex items-start justify-between mb-3'>
                                    <div>
                                        <p className='text-xs text-gray-500'>Order</p>
                                        <p className='font-semibold text-gray-800'>#{o._id?.slice(-8)}</p>
                                    </div>
                                    <span className='text-lg font-bold text-cyan-600'>${formatPrice(o.price)}</span>
                                </div>

                                <div className='flex flex-wrap gap-2 mb-3'>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentBadge(o.payment_status)}`}>
                                        {o.payment_status === 'cod' ? 'COD' : o.payment_status?.charAt(0).toUpperCase() + o.payment_status?.slice(1)}
                                    </span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDeliveryBadge(o.delivery_status, o.payment_status)}`}>
                                        {formatStatus(o.delivery_status, o.payment_status)}
                                    </span>
                                </div>

                                <div className='flex gap-2'>
                                    <Link
                                        to={`/dashboard/order/details/${o._id}`}
                                        className='flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-cyan-50 text-cyan-600 text-sm font-medium rounded-lg'
                                    >
                                        <FaEye className='text-xs' /> View Details
                                    </Link>
                                    {o.payment_status !== 'paid' && o.payment_status !== 'cod' && (
                                        <button
                                            onClick={() => redirect(o)}
                                            className='flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg'
                                        >
                                            <FaCreditCard className='text-xs' /> Pay Now
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Index;
