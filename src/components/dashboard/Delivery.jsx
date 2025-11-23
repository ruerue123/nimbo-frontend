import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { get_orders } from '../../store/reducers/orderReducer';
import { FaTruck, FaBox, FaCheckCircle, FaClock, FaSpinner, FaMapMarkerAlt, FaPhone, FaCalendarAlt, FaEye } from 'react-icons/fa';

const Delivery = () => {
    const dispatch = useDispatch();
    const { userInfo } = useSelector(state => state.auth);
    const { myOrders } = useSelector(state => state.order);

    useEffect(() => {
        dispatch(get_orders({ customerId: userInfo.id, status: 'all' }));
    }, [userInfo.id, dispatch]);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'delivered': return <FaCheckCircle className='text-emerald-500' />;
            case 'dispatched': return <FaTruck className='text-purple-500' />;
            case 'processing': return <FaSpinner className='text-blue-500 animate-spin' />;
            default: return <FaClock className='text-amber-500' />;
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'delivered': return 'bg-emerald-100 text-emerald-700';
            case 'dispatched': return 'bg-purple-100 text-purple-700';
            case 'processing': return 'bg-blue-100 text-blue-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-amber-100 text-amber-700';
        }
    };

    const formatStatus = (status) => {
        const map = {
            'pending': 'Pending', 'order_received': 'Received', 'processing': 'Processing',
            'dispatched': 'On the Way', 'delivered': 'Delivered', 'cancelled': 'Cancelled'
        };
        return map[status] || status;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    // Filter orders that are in transit or have delivery details
    const activeDeliveries = myOrders.filter(order =>
        ['order_received', 'processing', 'dispatched'].includes(order.delivery_status) ||
        order.deliveryDetails?.courierName
    );

    const completedDeliveries = myOrders.filter(order =>
        order.delivery_status === 'delivered'
    );

    return (
        <div className='space-y-4'>
            {/* Header */}
            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-4'>
                <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center'>
                        <FaTruck className='text-white' />
                    </div>
                    <div>
                        <h1 className='text-lg font-bold text-gray-800'>Delivery Tracking</h1>
                        <p className='text-xs text-gray-500'>Track your orders and delivery details</p>
                    </div>
                </div>
            </div>

            {/* Active Deliveries */}
            {activeDeliveries.length > 0 && (
                <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
                    <div className='px-4 py-3 border-b border-gray-100 bg-purple-50'>
                        <h2 className='text-sm font-bold text-purple-800 flex items-center gap-2'>
                            <FaTruck /> Active Deliveries ({activeDeliveries.length})
                        </h2>
                    </div>
                    <div className='divide-y divide-gray-100'>
                        {activeDeliveries.map((order, i) => (
                            <div key={i} className='p-4'>
                                {/* Order Header */}
                                <div className='flex items-center justify-between mb-3'>
                                    <div className='flex items-center gap-2'>
                                        {getStatusIcon(order.delivery_status)}
                                        <span className='text-sm font-medium text-gray-800'>Order #{order._id?.slice(-8)}</span>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.delivery_status)}`}>
                                        {formatStatus(order.delivery_status)}
                                    </span>
                                </div>

                                {/* Products */}
                                <div className='flex gap-2 mb-3 overflow-x-auto pb-2'>
                                    {order.products?.slice(0, 4).map((p, j) => (
                                        <div key={j} className='w-14 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0'>
                                            <img src={p.images?.[0]} alt={p.name} className='w-full h-full object-cover' />
                                        </div>
                                    ))}
                                    {order.products?.length > 4 && (
                                        <div className='w-14 h-14 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0'>
                                            <span className='text-xs font-medium text-gray-600'>+{order.products.length - 4}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Delivery Details */}
                                {order.deliveryDetails?.courierName && (
                                    <div className='bg-purple-50 rounded-xl p-3 mb-3'>
                                        <div className='grid grid-cols-2 gap-2 text-xs'>
                                            <div className='flex items-center gap-1.5'>
                                                <FaBox className='text-purple-500' />
                                                <div>
                                                    <p className='text-purple-600'>Courier</p>
                                                    <p className='font-medium text-gray-800'>{order.deliveryDetails.courierName}</p>
                                                </div>
                                            </div>
                                            {order.deliveryDetails.courierPhone && (
                                                <div className='flex items-center gap-1.5'>
                                                    <FaPhone className='text-purple-500' />
                                                    <div>
                                                        <p className='text-purple-600'>Contact</p>
                                                        <p className='font-medium text-gray-800'>{order.deliveryDetails.courierPhone}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {order.deliveryDetails.estimatedDate && (
                                                <div className='flex items-center gap-1.5 col-span-2'>
                                                    <FaCalendarAlt className='text-purple-500' />
                                                    <div>
                                                        <p className='text-purple-600'>Expected</p>
                                                        <p className='font-medium text-gray-800'>
                                                            {formatDate(order.deliveryDetails.estimatedDate)}
                                                            {order.deliveryDetails.estimatedTime && ` at ${order.deliveryDetails.estimatedTime}`}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        {order.deliveryDetails.notes && (
                                            <p className='text-xs text-gray-600 mt-2 italic'>"{order.deliveryDetails.notes}"</p>
                                        )}
                                    </div>
                                )}

                                {/* Shipping Address */}
                                <div className='flex items-start gap-2 text-xs text-gray-600 mb-3'>
                                    <FaMapMarkerAlt className='text-gray-400 mt-0.5' />
                                    <span>
                                        {order.shippingInfo?.address}, {order.shippingInfo?.area}, {order.shippingInfo?.city}
                                    </span>
                                </div>

                                {/* Action */}
                                <Link
                                    to={`/dashboard/order/details/${order._id}`}
                                    className='flex items-center justify-center gap-2 w-full py-2 bg-purple-500 text-white rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors'
                                >
                                    <FaEye /> View Details
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Completed Deliveries */}
            {completedDeliveries.length > 0 && (
                <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
                    <div className='px-4 py-3 border-b border-gray-100'>
                        <h2 className='text-sm font-bold text-gray-800 flex items-center gap-2'>
                            <FaCheckCircle className='text-emerald-500' /> Delivered ({completedDeliveries.length})
                        </h2>
                    </div>
                    <div className='divide-y divide-gray-100'>
                        {completedDeliveries.slice(0, 5).map((order, i) => (
                            <Link
                                key={i}
                                to={`/dashboard/order/details/${order._id}`}
                                className='p-3 flex items-center gap-3 hover:bg-gray-50 transition-colors'
                            >
                                <div className='flex gap-1'>
                                    {order.products?.slice(0, 2).map((p, j) => (
                                        <div key={j} className='w-10 h-10 bg-gray-100 rounded-lg overflow-hidden'>
                                            <img src={p.images?.[0]} alt={p.name} className='w-full h-full object-cover' />
                                        </div>
                                    ))}
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <p className='text-sm font-medium text-gray-800'>Order #{order._id?.slice(-8)}</p>
                                    <p className='text-xs text-gray-500'>{order.products?.length} item(s) - ${Number(order.price).toFixed(2)}</p>
                                </div>
                                <span className='px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium'>
                                    Delivered
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {myOrders.length === 0 && (
                <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center'>
                    <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                        <FaTruck className='text-3xl text-gray-400' />
                    </div>
                    <h3 className='font-semibold text-gray-800 mb-2'>No deliveries yet</h3>
                    <p className='text-sm text-gray-500 mb-4'>Your order deliveries will appear here</p>
                    <Link to='/' className='inline-flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-xl text-sm font-medium'>
                        Start Shopping
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Delivery;
