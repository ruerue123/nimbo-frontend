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
import { FadeLoader } from 'react-spinners';

const Details = () => {
    const navigate = useNavigate();
    const { slug } = useParams();
    const dispatch = useDispatch();
    const { product, relatedProducts, moreProducts, loader } = useSelector(state => state.home);
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
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');

    // Reset variant selection when navigating to a different product.
    useEffect(() => {
        setSelectedSize('');
        setSelectedColor('');
    }, [product?._id]);

    // For variant products, the meaningful stock is the variant's stock —
    // not the top-level (which is just the sum). When nothing is selected
    // yet we report 0 so the buyer is forced to pick.
    const variantStock = (() => {
        if (!product?.hasVariants) return null;
        const hasSizes = Array.isArray(product.sizes) && product.sizes.length > 0;
        const hasColors = Array.isArray(product.colors) && product.colors.length > 0;
        if (hasSizes && !selectedSize) return 0;
        if (hasColors && !selectedColor) return 0;
        const v = (product.variants || []).find(v =>
            (hasSizes ? v.size === selectedSize : v.size === '') &&
            (hasColors ? v.color === selectedColor : v.color === '')
        );
        return v ? v.stock : 0;
    })();
    const effectiveStock = product?.hasVariants ? variantStock : product?.stock;

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
        const cap = effectiveStock ?? 0;
        if (quantity >= cap) {
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
        if (!userInfo) {
            navigate('/login');
            return;
        }
        if (product.hasVariants) {
            const hasSizes = Array.isArray(product.sizes) && product.sizes.length > 0;
            const hasColors = Array.isArray(product.colors) && product.colors.length > 0;
            if (hasSizes && !selectedSize) {
                toast.error('Please select a size');
                return;
            }
            if (hasColors && !selectedColor) {
                toast.error('Please select a color');
                return;
            }
            if (!variantStock) {
                toast.error('That option is out of stock');
                return;
            }
        }
        dispatch(add_to_card({
            userId: userInfo.id,
            quantity,
            productId: product._id,
            selectedSize: product.hasVariants ? selectedSize : '',
            selectedColor: product.hasVariants ? selectedColor : ''
        }));
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
                shipping_fee: 5,
                items: 1
            }
        });
    };

    if (loader) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                <Header />
                <div className='w-full flex justify-center items-center py-40'>
                    <FadeLoader color='#06b6d4' />
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white md-lg:pb-16">
            <Header />

            {/* Hero Banner — hidden on mobile (eats real estate; the breadcrumb
                row below already conveys location). */}
            <section className='md:hidden relative h-[220px] mt-6 bg-gradient-to-r from-cyan-400 via-indigo-600 to-cyan-600 overflow-hidden'>
                <div className='absolute inset-0 bg-black opacity-20'></div>
                <div className='relative w-[85%] h-full mx-auto flex flex-col justify-center items-center text-white z-10'>
                    <h1 className='text-4xl font-bold mb-3'>Product Details</h1>
                    <div className='flex items-center gap-2 text-lg'>
                        <Link to='/' className="hover:underline">Home</Link>
                        <IoIosArrowForward />
                        <span className="font-semibold">Product Details</span>
                    </div>
                </div>
            </section>

            {/* Breadcrumb */}
            <section className='bg-white border-b'>
                <div className='w-[85%] md:w-[92%] mx-auto py-4 md:py-3'>
                    <div className='flex items-center text-sm md:text-xs text-gray-600 gap-2 overflow-x-auto whitespace-nowrap no-scrollbar'>
                        <Link to='/' className="hover:text-cyan-400">Home</Link>
                        <IoIosArrowForward />
                        <Link to='/' className="hover:text-cyan-400">{product.category}</Link>
                        <IoIosArrowForward />
                        <span className="text-gray-900 font-medium truncate">{product.name}</span>
                    </div>
                </div>
            </section>

            {/* Product Details Section */}
            <section className='py-10 md:py-5'>
                <div className='w-[85%] md:w-[92%] mx-auto'>
                    <div className='grid grid-cols-2 md-lg:grid-cols-1 gap-10 md:gap-6'>
                        {/* Product Images */}
                        <div>
                            <div className='bg-white rounded-2xl p-6 md:p-3 border border-gray-100 shadow-sm mb-4'>
                                <div className='relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 aspect-square'>
                                    <img
                                        className='w-full h-full object-contain'
                                        src={image ? image : product.images?.[0]}
                                        alt={product.name}
                                        loading='eager'
                                        decoding='async'
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
                                                <div className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${image === img ? 'border-cyan-400 shadow-lg' : 'border-gray-200 hover:border-gray-300'}`}>
                                                    <img className='w-full h-[120px] md:h-[80px] object-cover' src={img} alt="" loading='lazy' decoding='async' />
                                                </div>
                                            </div>
                                        ))}
                                    </Carousel>
                                )}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className='flex flex-col gap-5 md:gap-4'>
                            <div>
                                <div className="inline-block px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs font-semibold mb-3">
                                    {product.brand}
                                </div>
                                <h1 className='text-3xl md:text-2xl sm:text-xl font-bold text-gray-900 leading-tight'>{product.name}</h1>
                            </div>

                            <div className='flex items-center gap-3'>
                                <div className='flex text-lg'>
                                    <Rating ratings={product.rating || 0} />
                                </div>
                                <span className='text-green-600 font-medium text-sm'>(24 reviews)</span>
                            </div>

                            {/* Price */}
                            <div className='flex flex-wrap items-center gap-3 py-4 border-y border-gray-200'>
                                {product.discount !== 0 ? (
                                    <>
                                        <span className='text-4xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent'>
                                            ${product.price - Math.floor((product.price * product.discount) / 100)}
                                        </span>
                                        <div className='flex items-center gap-2'>
                                            <span className='text-xl md:text-lg text-gray-400 line-through'>${product.price}</span>
                                            <span className="px-2.5 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold">
                                                -{product.discount}% OFF
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <span className='text-4xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent'>
                                        ${product.price}
                                    </span>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <p className='text-gray-600 leading-relaxed'>{product.description}</p>
                                <p className='text-gray-900 font-semibold mt-3'>Shop: {product.shopName}</p>
                            </div>

                            {/* Variant pickers (only when the product uses variants) */}
                            {product.hasVariants && (
                                <div className='space-y-4'>
                                    {Array.isArray(product.sizes) && product.sizes.length > 0 && (
                                        <div>
                                            <span className='text-gray-700 font-semibold block mb-2'>Size</span>
                                            <div className='flex flex-wrap gap-2'>
                                                {product.sizes.map((s) => (
                                                    <button
                                                        key={s}
                                                        type='button'
                                                        onClick={() => { setSelectedSize(s); setQuantity(1); }}
                                                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${selectedSize === s ? 'bg-cyan-500 border-cyan-500 text-white' : 'bg-white border-gray-200 text-gray-700 hover:border-cyan-400'}`}
                                                    >
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {Array.isArray(product.colors) && product.colors.length > 0 && (
                                        <div>
                                            <span className='text-gray-700 font-semibold block mb-2'>Color {selectedColor && <span className='text-gray-500 font-normal'>— {selectedColor}</span>}</span>
                                            <div className='flex flex-wrap gap-2'>
                                                {product.colors.map((c, i) => (
                                                    <button
                                                        key={i}
                                                        type='button'
                                                        onClick={() => { setSelectedColor(c.name); setQuantity(1); }}
                                                        title={c.name}
                                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all ${selectedColor === c.name ? 'border-cyan-500 ring-2 ring-cyan-200 text-gray-900' : 'border-gray-200 text-gray-700 hover:border-cyan-400'}`}
                                                    >
                                                        {c.hex && <span className='inline-block w-4 h-4 rounded-full border border-gray-300' style={{ background: c.hex }} />}
                                                        <span>{c.name}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Add to Cart Section — desktop/tablet only. On mobile this
                                lives in a sticky bar at the bottom (rendered below). */}
                            {effectiveStock > 0 && (
                                <div className='md-lg:hidden flex items-center gap-4 pb-6 border-b border-gray-200'>
                                    <div className='flex items-center bg-gray-100 rounded-xl overflow-hidden'>
                                        <button
                                            onClick={dec}
                                            aria-label='Decrease quantity'
                                            className='w-12 h-12 flex items-center justify-center hover:bg-gray-200 transition-colors'
                                        >
                                            <FaMinus />
                                        </button>
                                        <span className='w-16 h-12 flex items-center justify-center font-bold text-lg'>{quantity}</span>
                                        <button
                                            onClick={inc}
                                            aria-label='Increase quantity'
                                            className='w-12 h-12 flex items-center justify-center hover:bg-gray-200 transition-colors'
                                        >
                                            <FaPlus />
                                        </button>
                                    </div>

                                    <button
                                        onClick={add_card}
                                        className='flex-1 py-3 px-6 bg-gradient-to-r from-cyan-400 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all'
                                    >
                                        Add To Cart
                                    </button>

                                    <button
                                        onClick={add_wishlist}
                                        aria-label='Add to wishlist'
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
                                    <span className={`font-semibold ${effectiveStock ? 'text-green-600' : 'text-red-600'}`}>
                                        {product.hasVariants
                                            ? (effectiveStock > 0
                                                ? `In Stock (${effectiveStock})`
                                                : (selectedSize || selectedColor || (!product.sizes?.length && !product.colors?.length)
                                                    ? 'Out Of Stock'
                                                    : 'Select options to see stock'))
                                            : (product.stock ? `In Stock (${product.stock})` : 'Out Of Stock')}
                                    </span>
                                </div>
                                
                                <div className='flex items-center gap-4'>
                                    <span className='text-gray-600 font-semibold w-32'>Share:</span>
                                    <div className='flex gap-2'>
                                        {[
                                            { Icon: FaFacebookF, color: 'bg-cyan-400' },
                                            { Icon: FaTwitter, color: 'bg-sky-500' },
                                            { Icon: FaLinkedin, color: 'bg-cyan-700' },
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

                            {/* Action Buttons — desktop only; mobile uses the sticky bar below. */}
                            <div className='md-lg:hidden flex gap-3 pt-4'>
                                {effectiveStock > 0 && (
                                    <button
                                        onClick={buynow}
                                        className='flex-1 py-3 px-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all'
                                    >
                                        Buy Now
                                    </button>
                                )}
                                <Link
                                    to={`/dashboard/my-orders`}
                                    className='flex-1 py-3 px-6 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold text-center hover:shadow-xl transition-all'
                                >
                                    View My Orders
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Reviews & Description Section */}
            <section className='bg-gray-50 py-10 md:py-6'>
                <div className='w-[85%] md:w-[92%] mx-auto'>
                    <div className='flex flex-wrap gap-6 md:gap-4'>
                        <div className='flex-1 min-w-[300px]'>
                            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
                                <div className='grid grid-cols-2'>
                                    <button 
                                        onClick={() => setState('reviews')} 
                                        className={`py-4 font-semibold transition-all ${state === 'reviews' ? 'bg-gradient-to-r from-cyan-400 to-cyan-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                    >
                                        Reviews
                                    </button>
                                    <button 
                                        onClick={() => setState('description')} 
                                        className={`py-4 font-semibold transition-all ${state === 'description' ? 'bg-gradient-to-r from-cyan-400 to-cyan-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
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
                                <div className='px-6 py-4 bg-gradient-to-r from-cyan-400 to-cyan-600'>
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
                                            <h3 className='text-gray-900 font-semibold mb-1 group-hover:text-cyan-400 transition-colors'>{p.name}</h3>
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
            <section className='py-10 md:py-6'>
                <div className='w-[85%] md:w-[92%] mx-auto'>
                    <h2 className='text-2xl md:text-xl font-bold mb-6 md:mb-4 text-gray-900'>Related Products</h2>
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
                                            <h3 className='text-gray-900 font-semibold mb-2 line-clamp-2 group-hover:text-cyan-400 transition-colors'>{p.name}</h3>
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

            {/* Sticky mobile add-to-cart bar — sits above the bottom nav, slides
                up on scroll. Only rendered ≤md-lg per Tailwind config. */}
            <div
                className='hidden md-lg:flex fixed left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-gray-200 px-3 py-2 gap-2 items-center pl-safe pr-safe'
                style={{ bottom: 'calc(4.5rem + env(safe-area-inset-bottom))' }}
            >
                {effectiveStock > 0 ? (
                    <>
                        <div className='flex items-center bg-gray-100 rounded-xl overflow-hidden shrink-0'>
                            <button onClick={dec} aria-label='Decrease quantity' className='w-10 h-11 flex items-center justify-center'>
                                <FaMinus className='text-sm' />
                            </button>
                            <span className='w-9 h-11 flex items-center justify-center font-bold'>{quantity}</span>
                            <button onClick={inc} aria-label='Increase quantity' className='w-10 h-11 flex items-center justify-center'>
                                <FaPlus className='text-sm' />
                            </button>
                        </div>
                        <button
                            onClick={add_card}
                            className='flex-1 h-11 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-600 text-white font-semibold text-sm'
                        >
                            Add to Cart
                        </button>
                        <button
                            onClick={buynow}
                            className='flex-1 h-11 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold text-sm'
                        >
                            Buy Now
                        </button>
                    </>
                ) : (
                    <button disabled className='flex-1 h-11 rounded-xl bg-gray-200 text-gray-500 font-semibold text-sm cursor-not-allowed'>
                        {product.hasVariants && !selectedSize && product.sizes?.length ? 'Select a size' : 'Out of stock'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default Details;