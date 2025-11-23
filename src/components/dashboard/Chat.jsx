import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { add_friend, messageClear, send_message, updateMessage } from '../../store/reducers/chatReducer';
import toast from 'react-hot-toast';
import io from 'socket.io-client';
import { FaList, FaPaperPlane, FaComments, FaCircle, FaTruck, FaUser } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';

const socket = io('https://nimbo-backend-1.onrender.com', {
    transports: ['websocket'],
    withCredentials: true
});

const Chat = () => {
    const scrollRef = useRef();
    const dispatch = useDispatch();
    const { sellerId } = useParams();
    const { userInfo } = useSelector(state => state.auth);
    const { fb_messages, currentFd, my_friends, successMessage } = useSelector(state => state.chat);
    const [text, setText] = useState('');
    const [receverMessage, setReceverMessage] = useState('');
    const [activeSeller, setActiveSeller] = useState([]);
    const [show, setShow] = useState(false);

    useEffect(() => {
        socket.emit('add_user', userInfo.id, userInfo);
    }, [userInfo]);

    useEffect(() => {
        dispatch(add_friend({
            sellerId: sellerId || "",
            userId: userInfo.id
        }));
    }, [sellerId, userInfo.id, dispatch]);

    const send = (e) => {
        e?.preventDefault();
        if (text.trim()) {
            dispatch(send_message({
                userId: userInfo.id,
                text,
                sellerId,
                name: userInfo.name
            }));
            setText('');
        }
    };

    const requestDeliveryDetails = () => {
        const requestMessage = "Hi! Could you please provide the delivery details for my order? I'd like to know the courier name, contact number, and estimated delivery date/time. Thank you!";
        dispatch(send_message({
            userId: userInfo.id,
            text: requestMessage,
            sellerId,
            name: userInfo.name
        }));
    };

    useEffect(() => {
        socket.on('seller_message', msg => {
            setReceverMessage(msg);
        });
        socket.on('activeSeller', (sellers) => {
            setActiveSeller(sellers);
        });
        return () => {
            socket.off('seller_message');
            socket.off('activeSeller');
        };
    }, []);

    useEffect(() => {
        if (successMessage) {
            socket.emit('send_customer_message', fb_messages[fb_messages.length - 1]);
            dispatch(messageClear());
        }
    }, [successMessage, fb_messages, dispatch]);

    useEffect(() => {
        if (receverMessage) {
            if (sellerId === receverMessage.senderId && userInfo.id === receverMessage.receverId) {
                dispatch(updateMessage(receverMessage));
            } else {
                toast.success(receverMessage.senderName + " sent a message");
                dispatch(messageClear());
            }
        }
    }, [receverMessage, sellerId, userInfo.id, dispatch]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [fb_messages]);

    // Format message time
    const formatTime = (date) => {
        if (!date) return '';
        const d = new Date(date);
        return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    const isSellerOnline = (fdId) => activeSeller.some(c => c.sellerId === fdId);

    return (
        <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
            <div className='flex h-[500px] relative'>
                {/* Sellers List Sidebar */}
                <div className={`w-[280px] h-full absolute z-10 ${show ? 'left-0' : '-left-[300px]'} md:left-0 md:relative transition-all border-r border-gray-100 bg-white`}>
                    <div className='p-4 border-b border-gray-100 flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                            <FaComments className='text-cyan-500' />
                            <h2 className='font-semibold text-gray-800'>Messages</h2>
                        </div>
                        <button onClick={() => setShow(false)} className='md:hidden w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-lg'>
                            <IoMdClose className='text-xl' />
                        </button>
                    </div>

                    <div className='overflow-y-auto h-[calc(100%-65px)]'>
                        {my_friends.length === 0 ? (
                            <div className='flex flex-col items-center justify-center h-full text-gray-400 p-4'>
                                <FaUser className='text-3xl mb-2' />
                                <p className='text-sm text-center'>No conversations yet</p>
                                <p className='text-xs text-center mt-1'>Start chatting with sellers from their product pages</p>
                            </div>
                        ) : (
                            my_friends.map((f, i) => (
                                <Link
                                    key={i}
                                    to={`/dashboard/chat/${f.fdId}`}
                                    onClick={() => setShow(false)}
                                    className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 ${sellerId === f.fdId ? 'bg-cyan-50 border-l-4 border-l-cyan-500' : ''}`}
                                >
                                    <div className='relative'>
                                        <div className='w-10 h-10 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center overflow-hidden'>
                                            {f.image ? (
                                                <img src={f.image} alt={f.name} className='w-full h-full object-cover' />
                                            ) : (
                                                <span className='text-white font-semibold'>{f.name?.charAt(0).toUpperCase()}</span>
                                            )}
                                        </div>
                                        {isSellerOnline(f.fdId) && (
                                            <FaCircle className='absolute -bottom-0.5 -right-0.5 text-green-500 text-[10px] bg-white rounded-full' />
                                        )}
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                        <h3 className='font-medium text-gray-800 text-sm truncate'>{f.name}</h3>
                                        <p className='text-xs text-gray-500'>{isSellerOnline(f.fdId) ? 'Online' : 'Offline'}</p>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className='flex-1 flex flex-col'>
                    {currentFd ? (
                        <>
                            {/* Chat Header */}
                            <div className='p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50'>
                                <div className='flex items-center gap-3'>
                                    <div className='relative'>
                                        <div className='w-10 h-10 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center overflow-hidden'>
                                            {currentFd.image ? (
                                                <img src={currentFd.image} alt={currentFd.name} className='w-full h-full object-cover' />
                                            ) : (
                                                <span className='text-white font-semibold'>{currentFd.name?.charAt(0).toUpperCase()}</span>
                                            )}
                                        </div>
                                        {isSellerOnline(currentFd.fdId) && (
                                            <FaCircle className='absolute -bottom-0.5 -right-0.5 text-green-500 text-[10px] bg-white rounded-full' />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className='font-semibold text-gray-800'>{currentFd.name}</h3>
                                        <p className={`text-xs flex items-center gap-1 ${isSellerOnline(currentFd.fdId) ? 'text-green-500' : 'text-gray-400'}`}>
                                            <FaCircle className='text-[6px]' />
                                            {isSellerOnline(currentFd.fdId) ? 'Online' : 'Offline'}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setShow(true)}
                                    className='md:hidden w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center text-white shadow-lg'
                                >
                                    <FaList />
                                </button>
                            </div>

                            {/* Messages Area */}
                            <div className='flex-1 overflow-y-auto p-4 bg-gray-50'>
                                {fb_messages.length === 0 ? (
                                    <div className='flex flex-col items-center justify-center h-full text-gray-400'>
                                        <div className='w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
                                            <FaComments className='text-3xl' />
                                        </div>
                                        <p className='font-medium mb-2'>Start a conversation</p>
                                        <p className='text-sm text-center mb-4'>Say hi to {currentFd.name}!</p>

                                        {/* Request Delivery Details Button */}
                                        <button
                                            onClick={requestDeliveryDetails}
                                            className='flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all'
                                        >
                                            <FaTruck />
                                            Request Delivery Details
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        {fb_messages.map((m, i) => {
                                            const isFromSeller = currentFd?.fdId !== m.receverId;
                                            return (
                                                <div
                                                    key={i}
                                                    ref={i === fb_messages.length - 1 ? scrollRef : null}
                                                    className={`flex mb-3 ${isFromSeller ? 'justify-start' : 'justify-end'}`}
                                                >
                                                    <div className={`flex items-end gap-2 max-w-[75%] ${isFromSeller ? '' : 'flex-row-reverse'}`}>
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0 overflow-hidden ${isFromSeller ? 'bg-gradient-to-br from-purple-400 to-purple-600' : 'bg-gradient-to-br from-cyan-400 to-cyan-600'}`}>
                                                            {isFromSeller ? (
                                                                currentFd.image ? (
                                                                    <img src={currentFd.image} alt="" className='w-full h-full object-cover' />
                                                                ) : currentFd.name?.charAt(0).toUpperCase()
                                                            ) : userInfo.name?.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className={`px-4 py-2 rounded-2xl ${isFromSeller ? 'bg-white border border-gray-200 rounded-bl-none text-gray-800' : 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-br-none'}`}>
                                                                <p className='text-sm'>{m.message}</p>
                                                            </div>
                                                            <p className={`text-[10px] text-gray-400 mt-1 ${isFromSeller ? 'text-left' : 'text-right'}`}>
                                                                {formatTime(m.createdAt)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {/* Quick Action - Request Delivery Details */}
                                        <div className='flex justify-center mt-4'>
                                            <button
                                                onClick={requestDeliveryDetails}
                                                className='flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium hover:bg-purple-200 transition-colors'
                                            >
                                                <FaTruck className='text-[10px]' />
                                                Request Delivery Details
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Message Input */}
                            <form onSubmit={send} className='p-4 border-t border-gray-100 bg-white'>
                                <div className='flex gap-3'>
                                    <input
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        className='flex-1 px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl focus:border-cyan-500 focus:bg-white outline-none transition-all text-sm'
                                        type="text"
                                        placeholder='Type your message...'
                                    />
                                    <button
                                        type='submit'
                                        disabled={!text.trim()}
                                        className='px-5 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold rounded-xl flex items-center gap-2 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed'
                                    >
                                        <FaPaperPlane className='text-sm' />
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className='flex-1 flex flex-col items-center justify-center text-gray-400 p-6'>
                            <div className='w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
                                <FaComments className='text-4xl' />
                            </div>
                            <p className='font-medium text-lg mb-2'>Your Messages</p>
                            <p className='text-sm text-center mb-6 max-w-[280px]'>
                                Select a seller from the list to view your conversation, or start a new chat from a product page.
                            </p>
                            <button
                                onClick={() => setShow(true)}
                                className='md:hidden flex items-center gap-2 px-4 py-2.5 bg-cyan-500 text-white rounded-xl text-sm font-medium'
                            >
                                <FaList /> View Sellers
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;
