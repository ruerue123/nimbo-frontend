import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { get_order_details, updateOrderDeliveryDetails } from '../../store/reducers/orderReducer';
import { FaBox, FaTruck, FaCheckCircle, FaClock, FaMapMarkerAlt, FaPhone, FaArrowLeft, FaUser, FaCalendarAlt, FaStickyNote } from 'react-icons/fa';
import io from 'socket.io-client';
import toast from 'react-hot-toast';

const socket = io('https://nimbo-backend-1.onrender.com', {
    transports: ['websocket'],
    withCredentials: true
});

const OrderDetails = () => {
    const { orderId } = useParams()
    const dispatch = useDispatch()

    const { myOrder } = useSelector(state => state.order)

    useEffect(() => {
        dispatch(get_order_details(orderId))
    }, [orderId, dispatch])

    // Listen for real-time delivery updates
    useEffect(() => {
        socket.on('order_delivery_updated', (data) => {
            console.log('📦 Received delivery update:', data)
            if (data.orderId === orderId) {
                dispatch(updateOrderDeliveryDetails(data.deliveryDetails))
                toast.success('Delivery details updated by seller!')
            }
        })

        return () => {
            socket.off('order_delivery_updated')
        }
    }, [orderId, dispatch])

    const formatPrice = (price) => Number(price || 0).toFixed(2)

    const getStatusBadge = (status) => {
        switch (status) {
            case 'order_received': return 'bg-amber-100 text-amber-700';
            case 'processing': return 'bg-blue-100 text-blue-700';
            case 'dispatched': return 'bg-purple-100 text-purple-700';
            case 'delivered': return 'bg-emerald-100 text-emerald-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    }

    const formatStatus = (status) => {
        const map = {
            'pending': 'Pending', 'order_received': 'Order Received', 'processing': 'Processing',
            'dispatched': 'Dispatched', 'delivered': 'Delivered', 'cancelled': 'Cancelled'
        }
        return map[status] || status
    }

    const trackingSteps = [
        { key: 'order_received', label: 'Received', icon: FaBox },
        { key: 'processing', label: 'Processing', icon: FaClock },
        { key: 'dispatched', label: 'Dispatched', icon: FaTruck },
        { key: 'delivered', label: 'Delivered', icon: FaCheckCircle }
    ]

    const getCurrentStep = () => {
        const idx = trackingSteps.findIndex(s => s.key === myOrder?.delivery_status)
        return idx >= 0 ? idx : -1
    }

    return (
        <div className='space-y-4'>
            {/* Header */}
            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-4'>
                <div className='flex items-center justify-between flex-wrap gap-3'>
                    <div className='flex items-center gap-3'>
                        <Link to='/dashboard/my-orders' className='w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-200'>
                            <FaArrowLeft className='text-sm' />
                        </Link>
                        <div>
                            <h1 className='text-lg font-bold text-gray-800'>Order #{myOrder._id?.slice(-8)}</h1>
                            <p className='text-xs text-gray-500'>{myOrder.date}</p>
                        </div>
                    </div>
                    <div className='flex gap-2'>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${myOrder.payment_status === 'paid' ? 'bg-emerald-100 text-emerald-700' : myOrder.payment_status === 'cod' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                            {myOrder.payment_status === 'paid' ? 'Paid' : myOrder.payment_status === 'cod' ? 'COD' : 'Unpaid'}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(myOrder.delivery_status)}`}>
                            {formatStatus(myOrder.delivery_status)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Tracking */}
            {myOrder.delivery_status !== 'cancelled' && (
                <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-4'>
                    <h2 className='text-sm font-bold text-gray-800 mb-4'>Track Order</h2>
                    <div className='flex justify-between items-center relative px-4'>
                        <div className='absolute top-4 left-8 right-8 h-1 bg-gray-200'>
                            <div className='h-full bg-cyan-500 transition-all' style={{ width: `${Math.max(0, (getCurrentStep() / 3) * 100)}%` }} />
                        </div>
                        {trackingSteps.map((step, i) => {
                            const done = i <= getCurrentStep()
                            const Icon = step.icon
                            return (
                                <div key={step.key} className='flex flex-col items-center z-10'>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${done ? 'bg-cyan-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                                        <Icon className='text-xs' />
                                    </div>
                                    <span className={`text-xs mt-1 ${done ? 'text-cyan-600 font-medium' : 'text-gray-400'}`}>{step.label}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
                {/* Products */}
                <div className='lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100'>
                    <div className='p-4 border-b border-gray-100'>
                        <h2 className='text-sm font-bold text-gray-800'>Items ({myOrder.products?.length || 0})</h2>
                    </div>
                    <div className='divide-y divide-gray-100'>
                        {myOrder.products?.map((p, i) => (
                            <div key={i} className='p-3 flex gap-3'>
                                <div className='w-14 h-14 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0'>
                                    <img className='w-full h-full object-cover' src={p.images[0]} alt={p.name} />
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <h3 className='font-medium text-gray-800 text-sm truncate'>{p.name}</h3>
                                    <p className='text-xs text-gray-500'>Brand: {p.brand} | Qty: {p.quantity}</p>
                                    <div className='flex items-center gap-2 mt-1'>
                                        <span className='text-sm font-bold text-cyan-600'>${formatPrice(p.price - (p.price * p.discount / 100))}</span>
                                        {p.discount > 0 && <span className='text-xs text-gray-400 line-through'>${formatPrice(p.price)}</span>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Summary */}
                <div className='space-y-4'>
                    <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-4'>
                        <h2 className='text-sm font-bold text-gray-800 mb-3'>Summary</h2>
                        <div className='flex justify-between items-center pt-2 border-t border-gray-100'>
                            <span className='font-bold text-gray-800'>Total</span>
                            <span className='text-xl font-bold text-cyan-600'>${formatPrice(myOrder.price)}</span>
                        </div>
                    </div>

                    <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-4'>
                        <h2 className='text-sm font-bold text-gray-800 mb-3'>Delivery Address</h2>
                        <div className='space-y-2 text-sm'>
                            <div className='flex items-start gap-2'>
                                <FaMapMarkerAlt className='text-cyan-500 mt-0.5' />
                                <div>
                                    <p className='font-medium text-gray-800'>{myOrder.shippingInfo?.name}</p>
                                    <p className='text-xs text-gray-500'>{myOrder.shippingInfo?.address}, {myOrder.shippingInfo?.city}</p>
                                </div>
                            </div>
                            <div className='flex items-center gap-2'>
                                <FaPhone className='text-cyan-500' />
                                <span className='text-gray-600'>{myOrder.shippingInfo?.phone}</span>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Details from Seller */}
                    {myOrder.deliveryDetails && (myOrder.deliveryDetails.courierName || myOrder.deliveryDetails.estimatedDate) && (
                        <div className='bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-sm border border-purple-200 p-4'>
                            <div className='flex items-center gap-2 mb-3'>
                                <FaTruck className='text-purple-600' />
                                <h2 className='text-sm font-bold text-purple-800'>Delivery Information</h2>
                            </div>
                            <div className='space-y-3 text-sm'>
                                {myOrder.deliveryDetails.courierName && (
                                    <div className='flex items-start gap-2'>
                                        <FaUser className='text-purple-500 mt-0.5' />
                                        <div>
                                            <p className='text-xs text-purple-600'>Courier/Driver</p>
                                            <p className='font-medium text-gray-800'>{myOrder.deliveryDetails.courierName}</p>
                                        </div>
                                    </div>
                                )}
                                {myOrder.deliveryDetails.courierPhone && (
                                    <div className='flex items-center gap-2'>
                                        <FaPhone className='text-purple-500' />
                                        <div>
                                            <p className='text-xs text-purple-600'>Contact</p>
                                            <p className='font-medium text-gray-800'>{myOrder.deliveryDetails.courierPhone}</p>
                                        </div>
                                    </div>
                                )}
                                {(myOrder.deliveryDetails.estimatedDate || myOrder.deliveryDetails.estimatedTime) && (
                                    <div className='flex items-start gap-2'>
                                        <FaCalendarAlt className='text-purple-500 mt-0.5' />
                                        <div>
                                            <p className='text-xs text-purple-600'>Expected Delivery</p>
                                            <p className='font-medium text-gray-800'>
                                                {myOrder.deliveryDetails.estimatedDate && new Date(myOrder.deliveryDetails.estimatedDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                                {myOrder.deliveryDetails.estimatedTime && ` at ${myOrder.deliveryDetails.estimatedTime}`}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {myOrder.deliveryDetails.trackingNumber && (
                                    <div className='flex items-center gap-2'>
                                        <FaBox className='text-purple-500' />
                                        <div>
                                            <p className='text-xs text-purple-600'>Tracking #</p>
                                            <p className='font-medium text-gray-800'>{myOrder.deliveryDetails.trackingNumber}</p>
                                        </div>
                                    </div>
                                )}
                                {myOrder.deliveryDetails.notes && (
                                    <div className='flex items-start gap-2 pt-2 border-t border-purple-200'>
                                        <FaStickyNote className='text-purple-500 mt-0.5' />
                                        <div>
                                            <p className='text-xs text-purple-600'>Note from Seller</p>
                                            <p className='text-gray-700 text-xs'>{myOrder.deliveryDetails.notes}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
