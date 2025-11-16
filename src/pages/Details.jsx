// Details.jsx - Modern redesigned version
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { IoIosArrowForward } from "react-icons/io";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Rating from '../components/Rating';
import { FaHeart, FaMinus, FaPlus } from "react-icons/fa6";
import { FaFacebookF, FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";
import Reviews from '../components/Reviews';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useDispatch, useSelector } from 'react-redux';
import { product_details } from '../store/reducers/homeReducer';
import toast from 'react-hot-toast';
import { add_to_card, messageClear, add_to_wishlist } from '../store/reducers/cardReducer';

const Details = () => {
    const navigate = useNavigate();
    const { slug } = useParams();
    const dispatch = useDispatch();
    const { product, relatedProducts, moreProducts } = useSelector(state => state.home);
    const { userInfo } = useSelector(state => state.auth);
    const { errorMessage, successMessage } = useSelector(state => state.card);

    useEffect(() => {
        dispatch(product_details(slug));
    }, [slug, dispatch]);

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage, dispatch]);

    const [image, setImage] = useState('');
    const [state, setState] = useState('reviews');

    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 5
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 5
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 4
        },
        mdtablet: {
            breakpoint: { max: 991, min: 464 },
            items: 4
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 3
        },
        smmobile: {
            breakpoint: { max: 640, min: 0 },
            items: 2
        },
        xsmobile: {
            breakpoint: { max: 440, min: 0 },
            items: 1
        },
    };

    const [quantity, setQuantity] = useState(1);

    const inc = () => {
        if (quantity >= product.stock) {
            toast.error('Out of Stock');
        } else {
            setQuantity(quantity + 1);
        }
    };

    const dec = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const add_card = () => {
        if (userInfo) {
            dispatch(add_to_card({
                userId: userInfo.id,
                quantity,
                productId: product._id
            }));
        } else {
            navigate('/login');
        }
    };

    const add_wishlist = () => {
        if (userInfo) {
            dispatch(add_to_wishlist({
                userId: userInfo.id,
                productId: product._id,
                name: product.name,
                price: product.price,
                image: product.images[0],
                discount: product.discount,
                rating: product.rating,
                slug: product.slug
            }));
        } else {
            navigate('/login');
        }
    };

    const buynow = () => {
        let price = 0;
        if (product.discount !== 0) {
            price = product.price - Math.floor((product.price * product.discount) / 100);
        } else {
            price = product.price;
        }

        const obj = [
            {
                sellerId: product.sellerId,
                shopName: product.shopName,
                price: quantity * (price - Math.floor((price * 5) / 100)),
                products: [
                    {
                        quantity,
                        productInfo: product
                    }
                ]
            }
        ];

        navigate('/shipping', {
            state: {
                products: obj,
                price: price * quantity,
                shipping_fee: 50,
                items: 1
            }
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <Header />
            
            {/* Hero Banner */}
            <section className='relative h-[220px] mt-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 overflow-hidden'>
                <div className='absolute inset-0 bg-black opacity-20'></div>
                <div className='absolute inset-0' style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
                }}></div>
                <div className='relative w-[85%] md:w-[90%] h-full mx-auto flex flex-col justify-center items-center text-white z-10'>
                    <h1 className='text-4xl md:text-3xl sm:text-2xl font-bold mb-3'>Product Details</h1>
                    <div className='flex items-center gap-2 text-lg'>
                        <Link to='/' className="hover:underline">Home</Link>
                        <IoIosArrowForward />
                        <span className="font-semibold">Product Details</span>
                    </div>
                </div>
            </section>

            {/* Breadcrumb */}
            <section className='bg-white border-b'>
                <div className='w-[85%] md:w-[90%] mx-auto py-4'>
                    <div className='flex items-center text-sm text-gray-600 gap-2'>
                        <Link to='/' className="hover:text-blue-600">Home</Link>
                        <IoIosArrowForward />
                        <Link to='/' className="hover:text-blue-600">{product.category}</Link>
                        <IoIosArrowForward />
                        <span className="text-gray-900 font-medium">{product.name}</span>
                    </div>
                </div>
            </section>

            {/* Product Details Section */}
            <section className='py-12'>
                <div className='w-[85%] md:w-[90%] mx-auto'>
                    <div className='grid grid-cols-2 md-lg:grid-cols-1 gap-10'>
                        {/* Product Images */}
                        <div>
                            <div className='bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6'>
                                <div className='relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 aspect-square'>
                                    <img 
                                        className='w-full h-full object-contain' 
                                        src={image ? image : product.images?.[0]} 
                                        alt={product.name} 
                                    />
                                </div>
                            </div>
                            
                            {/* Thumbnail Gallery */}
                            <div className='py-3'>
                                {product.images && (
                                    <Carousel
                                        autoPlay={true}
                                        infinite={true}
                                        responsive={responsive}
                                        transitionDuration={500}
                                    >
                                        {product.images.map((img, i) => (
                                            <div 
                                                key={i} 
                                                onClick={() => setImage(img)}
                                                className='px-2'
                                            >
                                                <div className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${image === img ? 'border-blue-600 shadow-lg' : 'border-gray-200 hover:border-gray-300'}`}>
                                                    <img className='w-full h-[120px] object-cover' src={img} alt="" />
                                                </div>
                                            </div>
                                        ))}
                                    </Carousel>
                                )}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className='flex flex-col gap-6'>
                            <div>
                                <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold mb-3">
                                    {product.brand}
                                </div>
                                <h1 className='text-4xl md:text-3xl font-bold text-gray-900 mb-4'>{product.name}</h1>
                            </div>

                            <div className='flex items-center gap-4'>
                                <div className='flex text-xl'>
                                    <Rating ratings={product.rating || 0} />
                                </div>
                                <span className='text-green-600 font-medium'>(24 reviews)</span>
                            </div>

                            {/* Price */}
                            <div className='flex items-center gap-4 py-4 border-y border-gray-200'>
                                {product.discount !== 0 ? (
                                    <>
                                        <span className='text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                                            ${product.price - Math.floor((product.price * product.discount) / 100)}
                                        </span>
                                        <div>
                                            <span className='text-2xl text-gray-400 line-through'>${product.price}</span>
                                            <span className="ml-2 px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-bold">
                                                -{product.discount}% OFF
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <span className='text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                                        ${product.price}
                                    </span>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <p className='text-gray-600 leading-relaxed'>{product.description}</p>
                                <p className='text-gray-900 font-semibold mt-3'>Shop: {product.shopName}</p>
                            </div>

                            {/* Add to Cart Section */}
                            {product.stock > 0 && (
                                <div className='flex items-center gap-4 pb-6 border-b border-gray-200'>
                                    <div className='flex items-center bg-gray-100 rounded-xl overflow-hidden'>
                                        <button 
                                            onClick={dec} 
                                            className='w-12 h-12 flex items-center justify-center hover:bg-gray-200 transition-colors'
                                        >
                                            <FaMinus />
                                        </button>
                                        <span className='w-16 h-12 flex items-center justify-center font-bold text-lg'>{quantity}</span>
                                        <button 
                                            onClick={inc} 
                                            className='w-12 h-12 flex items-center justify-center hover:bg-gray-200 transition-colors'
                                        >
                                            <FaPlus />
                                        </button>
                                    </div>

                                    <button 
                                        onClick={add_card} 
                                        className='flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all'
                                    >
                                        Add To Cart
                                    </button>

                                    <button 
                                        onClick={add_wishlist} 
                                        className='w-12 h-12 flex items-center justify-center bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors'
                                    >
                                        <FaHeart className="text-xl" />
                                    </button>
                                </div>
                            )}

                            {/* Product Meta */}
                            <div className='space-y-3'>
                                <div className='flex items-center gap-4'>
                                    <span className='text-gray-600 font-semibold w-32'>Availability:</span>
                                    <span className={`font-semibold ${product.stock ? 'text-green-600' : 'text-red-600'}`}>
                                        {product.stock ? `In Stock (${product.stock})` : 'Out Of Stock'}
                                    </span>
                                </div>
                                
                                <div className='flex items-center gap-4'>
                                    <span className='text-gray-600 font-semibold w-32'>Share:</span>
                                    <div className='flex gap-2'>
                                        {[
                                            { Icon: FaFacebookF, color: 'bg-blue-600' },
                                            { Icon: FaTwitter, color: 'bg-sky-500' },
                                            { Icon: FaLinkedin, color: 'bg-blue-700' },
                                            { Icon: FaGithub, color: 'bg-gray-800' }
                                        ].map(({ Icon, color }, i) => (
                                            <button 
                                                key={i}
                                                className={`w-10 h-10 flex items-center justify-center ${color} text-white rounded-lg hover:opacity-90 transition-opacity`}
                                            >
                                                <Icon />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className='flex gap-3 pt-4'>
                                {product.stock > 0 && (
                                    <button 
                                        onClick={buynow} 
                                        className='flex-1 py-3 px-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all'
                                    >
                                        Buy Now
                                    </button>
                                )}
                                <Link 
                                    to={`/dashboard/chat/${product.sellerId}`} 
                                    className='flex-1 py-3 px-6 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold text-center hover:shadow-xl transition-all'
                                >
                                    Chat with Seller
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Reviews & Description Section */}
            <section className='bg-gray-50 py-12'>
                <div className='w-[85%] md:w-[90%] mx-auto'>
                    <div className='flex flex-wrap gap-6'>
                        <div className='flex-1 min-w-[300px]'>
                            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
                                <div className='grid grid-cols-2'>
                                    <button 
                                        onClick={() => setState('reviews')} 
                                        className={`py-4 font-semibold transition-all ${state === 'reviews' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                    >
                                        Reviews
                                    </button>
                                    <button 
                                        onClick={() => setState('description')} 
                                        className={`py-4 font-semibold transition-all ${state === 'description' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                    >
                                        Description
                                    </button>
                                </div>

                                <div className='p-6'>
                                    {state === 'reviews' ? (
                                        <Reviews product={product} />
                                    ) : (
                                        <p className='text-gray-600 leading-relaxed'>{product.description}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* More from Shop */}
                        <div className='w-[350px] md-lg:w-full'>
                            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
                                <div className='px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600'>
                                    <h2 className='font-bold text-white text-lg'>From {product.shopName}</h2>
                                </div>
                                <div className='p-4 space-y-4 max-h-[600px] overflow-y-auto'>
                                    {moreProducts.map((p, i) => (
                                        <Link key={i} to={`/product/details/${p.slug}`} className='block group'>
                                            <div className='relative overflow-hidden rounded-xl aspect-square bg-gradient-to-br from-gray-50 to-gray-100 mb-2'>
                                                <img className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300' src={p.images[0]} alt={p.name} />
                                                {p.discount !== 0 && (
                                                    <div className='absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold'>
                                                        -{p.discount}%
                                                    </div>
                                                )}
                                            </div>
                                            <h3 className='text-gray-900 font-semibold mb-1 group-hover:text-blue-600 transition-colors'>{p.name}</h3>
                                            <div className='flex items-center justify-between'>
                                                <span className='text-xl font-bold text-gray-900'>${p.price}</span>
                                                <Rating ratings={p.rating} />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Products */}
            <section className='py-12'>
                <div className='w-[85%] md:w-[90%] mx-auto'>
                    <h2 className='text-3xl font-bold mb-8 text-gray-900'>Related Products</h2>
                    <Swiper
                        slidesPerView='auto'
                        breakpoints={{
                            1280: { slidesPerView: 4 },
                            768: { slidesPerView: 3 },
                            565: { slidesPerView: 2 }
                        }}
                        spaceBetween={25}
                        loop={true}
                        pagination={{
                            clickable: true,
                            el: '.custom_bullet'
                        }}
                        modules={[Pagination]}
                        className='mySwiper'
                    >
                        {relatedProducts.map((p, i) => (
                            <SwiperSlide key={i}>
                                <Link to={`/product/details/${p.slug}`} className='block group'>
                                    <div className='bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100'>
                                        <div className='relative overflow-hidden aspect-square bg-gradient-to-br from-gray-50 to-gray-100'>
                                            <img className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300' src={p.images[0]} alt={p.name} />
                                            {p.discount !== 0 && (
                                                <div className='absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold'>
                                                    -{p.discount}%
                                                </div>
                                            )}
                                        </div>
                                        <div className='p-4'>
                                            <h3 className='text-gray-900 font-semibold mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors'>{p.name}</h3>
                                            <div className='flex items-center justify-between'>
                                                <span className='text-xl font-bold text-gray-900'>${p.price}</span>
                                                <Rating ratings={p.rating} />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <div className='w-full flex justify-center mt-8'>
                        <div className='custom_bullet flex justify-center gap-3 !w-auto'></div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Details;