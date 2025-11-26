import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { get_orders } from '../../store/reducers/orderReducer';
import { FaTruck, FaBox, FaCheckCircle, FaClock, FaSpinner, FaMapMarkerAlt, FaPhone, FaCalendarAlt, FaEye } from 'react-icons/fa';

const Delivery = () => {
    const dispatch = useDispatch();
    const { userInfo } = useSelector(state => state.auth);
    const { myOrders } = useSelector(state => state.order);
    const [activeTab, setActiveTab] = useState('pending');

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

    const getStatusBadge = (status, paymentStatus) => {
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
    };

    const formatStatus = (status, paymentStatus) => {
        // Show 'Failed' for cancelled orders with unpaid status (payment failures)
        if (status === 'cancelled' && paymentStatus === 'unpaid') {
            return 'Failed';
        }
        const map = {
            'pending': 'Pending', 'order_received': 'Received', 'processing': 'Processing',
            'dispatched': 'On the Way', 'delivered': 'Delivered', 'cancelled': 'Cancelled'
        };
        return map[status] || status;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    // Filter orders - Pending includes all non-delivered, non-cancelled orders
    const pendingOrders = myOrders.filter(order =>
        ['pending', 'order_received', 'processing', 'dispatched'].includes(order.delivery_status)
    );

    const deliveredOrders = myOrders.filter(order =>
        order.delivery_status === 'delivered'
    );

    const currentOrders = activeTab === 'pending' ? pendingOrders : deliveredOrders;

    const OrderCard = ({ order }) => (
        <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
            {/* Order Header */}
            <div className='p-4 border-b border-gray-100'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                        {getStatusIcon(order.delivery_status)}
                        <span className='text-sm font-medium text-gray-800'>#{order._id?.slice(-8)}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.delivery_status, order.payment_status)}`}>
                        {formatStatus(order.delivery_status, order.payment_status)}
                    </span>
                </div>
            </div>

            {/* Products */}
            <div className='p-4'>
                <div className='flex gap-2 mb-3 overflow-x-auto pb-2'>
                    {order.products?.slice(0, 3).map((p, j) => (
                        <div key={j} className='w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0'>
                            <img src={p.images?.[0]} alt={p.name} className='w-full h-full object-cover' />
                        </div>
                    ))}
                    {order.products?.length > 3 && (
                        <div className='w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center flex-shrink-0'>
                            <span className='text-xs font-medium text-gray-600'>+{order.products.length - 3}</span>
                        </div>
                    )}
                </div>

                <div className='text-sm text-gray-600 mb-3'>
                    <span className='font-semibold text-gray-800'>{order.products?.length}</span> item(s) -
                    <span className='font-bold text-cyan-600 ml-1'>${Number(order.price).toFixed(2)}</span>
                </div>

                {/* Delivery Details - Only for pending orders with details */}
                {activeTab === 'pending' && order.deliveryDetails?.courierName && (
                    <div className='bg-purple-50 rounded-xl p-3 mb-3'>
                      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className='flex items-center gap-1.5'>
                                <FaBox className='text-purple-500 flex-shrink-0' />
                                <div>
                                    <p className='text-purple-600'>Courier</p>
                                    <p className='font-medium text-gray-800'>{order.deliveryDetails.courierName}</p>
                                </div>
                            </div>
                            {order.deliveryDetails.courierPhone && (
                                <div className='flex items-center gap-1.5'>
                                    <FaPhone className='text-purple-500 flex-shrink-0' />
                                    <div>
                                        <p className='text-purple-600'>Contact</p>
                                        <p className='font-medium text-gray-800'>{order.deliveryDetails.courierPhone}</p>
                                    </div>
                                </div>
                            )}
                            {order.deliveryDetails.estimatedDate && (
                                <div className='flex items-center gap-1.5 sm:col-span-2'>
                                    <FaCalendarAlt className='text-purple-500 flex-shrink-0' />
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
                    <FaMapMarkerAlt className='text-gray-400 mt-0.5 flex-shrink-0' />
                    <span className='line-clamp-2'>
                        {order.shippingInfo?.address}, {order.shippingInfo?.area}, {order.shippingInfo?.city}
                    </span>
                </div>

                {/* Action */}
                <Link
                    to={`/dashboard/order/details/${order._id}`}
                    className={`flex items-center justify-center gap-2 w-full py-2.5 text-white rounded-xl text-sm font-medium transition-colors ${activeTab === 'pending' ? 'bg-purple-500 hover:bg-purple-600' : 'bg-emerald-500 hover:bg-emerald-600'
                        }`}
                >
                    <FaEye /> View Details
                </Link>
            </div>
        </div>
    );

    return (
        <div className='px-4 md:px-6 py-6 space-y-4'>
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

            {/* Tabs */}
            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
                <div className='flex border-b border-gray-100'>
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'pending'
                            ? 'text-purple-600 bg-purple-50 border-b-2 border-purple-600'
                            : 'text-gray-500 hover:bg-gray-50'
                            }`}
                    >
                        <FaTruck className='text-base' />
                        <span className='hidden sm:inline'>Pending</span> ({pendingOrders.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('delivered')}
                        className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'delivered'
                            ? 'text-emerald-600 bg-emerald-50 border-b-2 border-emerald-600'
                            : 'text-gray-500 hover:bg-gray-50'
                            }`}
                    >
                        <FaCheckCircle className='text-base' />
                        <span className='hidden sm:inline'>Delivered</span> ({deliveredOrders.length})
                    </button>
                </div>

                {/* Orders Grid - 1 card on mobile, 2 on desktop */}
                {currentOrders.length > 0 ? (
                    <div className='p-4'>
                       <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
                            {currentOrders.map((order, i) => (
                                <OrderCard key={i} order={order} />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className='p-8 text-center'>
                        <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                            {activeTab === 'pending' ? (
                                <FaTruck className='text-3xl text-gray-400' />
                            ) : (
                                <FaCheckCircle className='text-3xl text-gray-400' />
                            )}
                        </div>
                        <h3 className='font-semibold text-gray-800 mb-2'>
                            {activeTab === 'pending' ? 'No pending deliveries' : 'No delivered orders yet'}
                        </h3>
                        <p className='text-sm text-gray-500'>
                            {activeTab === 'pending'
                                ? 'Orders in transit will appear here'
                                : 'Your completed deliveries will appear here'
                            }
                        </p>
                    </div>
                )}
            </div>

            {/* Empty State - No orders at all */}
            {myOrders.length === 0 && (
                <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center'>
                    <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                        <FaTruck className='text-3xl text-gray-400' />
                    </div>
                    <h3 className='font-semibold text-gray-800 mb-2'>No deliveries yet</h3>
                    <p className='text-sm text-gray-500 mb-4'>Your order deliveries will appear here</p>
                    <Link to='/' className='inline-flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-xl text-sm font-medium hover:bg-cyan-600 transition-colors'>
                        Start Shopping
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Delivery;