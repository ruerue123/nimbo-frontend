// Shops.jsx - Modern redesigned version
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { IoIosArrowForward } from "react-icons/io";
import { Range } from 'react-range';
import { AiFillStar } from 'react-icons/ai';
import { CiStar } from 'react-icons/ci';
import Products from '../components/products/Products';
import { BsFillGridFill } from 'react-icons/bs';
import { FaThList, FaHeart, FaShoppingCart } from 'react-icons/fa';
import Pagination from '../components/Pagination';
import { useDispatch, useSelector } from 'react-redux';
import { price_range_product, query_products } from '../store/reducers/homeReducer';

const Shops = () => {
    const dispatch = useDispatch();
    const { products, categorys, priceRange, latest_product, totalProduct, parPage } = useSelector(state => state.home);

    useEffect(() => {
        dispatch(price_range_product());
    }, []);

    useEffect(() => {
        setState({
            values: [priceRange.low, priceRange.high]
        });
    }, [priceRange]);

    const [filter, setFilter] = useState(true);
    const [state, setState] = useState({ values: [priceRange.low, priceRange.high] });
    const [rating, setRating] = useState('');
    const [styles, setStyles] = useState('grid');
    const [pageNumber, setPageNumber] = useState(1);
    const [sortPrice, setSortPrice] = useState('');
    const [category, setCategory] = useState('');

    const queryCategory = (e, value) => {
        if (e.target.checked) {
            setCategory(value);
        } else {
            setCategory('');
        }
    };

    useEffect(() => {
        dispatch(
            query_products({
                low: state.values[0],
                high: state.values[1],
                category,
                rating,
                sortPrice,
                pageNumber
            })
        );
    }, [state.values[0], state.values[1], category, rating, sortPrice, pageNumber]);

    const resetRating = () => {
        setRating('');
        dispatch(
            query_products({
                low: state.values[0],
                high: state.values[1],
                category,
                rating: '',
                sortPrice,
                pageNumber
            })
        );
    };

    const RatingStars = ({ ratings }) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= ratings) {
                stars.push(<AiFillStar key={i} />);
            } else {
                stars.push(<CiStar key={i} />);
            }
        }
        return <>{stars}</>;
    };

    const ProductCard = ({ product }) => {
        const discountedPrice = product.discount !== 0 
            ? product.price - Math.floor((product.price * product.discount) / 100)
            : product.price;

        return (
            <Link to={`/product/details/${product.slug}`} className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100">
                <div className="relative overflow-hidden aspect-square bg-gradient-to-br from-gray-50 to-gray-100">
                    <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {product.discount > 0 && (
                        <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                            -{product.discount}%
                        </div>
                    )}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button className="p-2.5 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors">
                            <FaHeart className="text-red-500 text-lg" />
                        </button>
                        <button className="p-2.5 bg-white rounded-full shadow-lg hover:bg-cyan-50 transition-colors">
                            <FaShoppingCart className="text-cyan-400 text-lg" />
                        </button>
                    </div>
                    {!product.stock && (
                        <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center">
                            <span className="text-white font-bold text-lg">Out of Stock</span>
                        </div>
                    )}
                </div>
                
                <div className="p-5">
                    <p className="text-xs text-gray-500 mb-1 font-medium">{product.brand}</p>
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[2.5rem] group-hover:text-cyan-400 transition-colors">
                        {product.name}
                    </h3>
                    
                    <div className="flex items-center gap-2 mb-3 text-amber-400">
                        <div className="flex text-sm">
                            <RatingStars ratings={product.rating || 0} />
                        </div>
                        <span className="text-xs text-gray-500">({product.rating || 0})</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
                                ${discountedPrice}
                            </span>
                            {product.discount > 0 && (
                                <span className="text-sm text-gray-400 line-through">
                                    ${product.price}
                                </span>
                            )}
                        </div>
                        {product.stock > 0 && (
                            <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-1 rounded-full">
                                {product.stock} left
                            </span>
                        )}
                    </div>
                </div>
            </Link>
        );
    };

    const ProductListCard = ({ product }) => {
        const discountedPrice = product.discount !== 0 
            ? product.price - Math.floor((product.price * product.discount) / 100)
            : product.price;

        return (
            <Link to={`/product/details/${product.slug}`} className="group flex bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 h-[200px]">
                <div className="relative w-[200px] flex-shrink-0 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                    <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {product.discount > 0 && (
                        <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            -{product.discount}%
                        </div>
                    )}
                </div>
                
                <div className="flex-1 p-5 flex flex-col justify-between">
                    <div>
                        <p className="text-xs text-gray-500 mb-1 font-medium">{product.brand}</p>
                        <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2 group-hover:text-cyan-400 transition-colors">
                            {product.name}
                        </h3>
                        
                        <div className="flex items-center gap-2 mb-2 text-amber-400">
                            <div className="flex text-sm">
                                <RatingStars ratings={product.rating || 0} />
                            </div>
                            <span className="text-xs text-gray-500">({product.rating || 0})</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
                                ${discountedPrice}
                            </span>
                            {product.discount > 0 && (
                                <span className="text-sm text-gray-400 line-through">
                                    ${product.price}
                                </span>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2 bg-red-50 rounded-full hover:bg-red-100 transition-colors">
                                <FaHeart className="text-red-500" />
                            </button>
                            <button className="p-2 bg-cyan-50 rounded-full hover:bg-cyan-100 transition-colors">
                                <FaShoppingCart className="text-cyan-400" />
                            </button>
                        </div>
                    </div>
                </div>
            </Link>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <Header />
            
            {/* Hero Banner */}
            <section className='relative h-[280px] mt-6 bg-gradient-to-r from-cyan-400 via-cyan-600 to-pink-500 overflow-hidden'>
                <div className='absolute inset-0 bg-black opacity-20'></div>
                <div className='absolute inset-0' style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
                }}></div>
                <div className='relative w-[85%] md:w-[90%] h-full mx-auto flex flex-col justify-center items-center text-white z-10'>
                    <h1 className='text-5xl md:text-4xl sm:text-3xl font-bold mb-4 text-center'>Discover Amazing Products</h1>
                    <div className='flex items-center gap-3 text-lg'>
                        <Link to='/' className="hover:underline">Home</Link>
                        <IoIosArrowForward />
                        <span className="font-semibold">Shop</span>
                    </div>
                </div>
            </section>

            <section className='py-12'>
                <div className='w-[85%] md:w-[90%] mx-auto'>
                    {/* Mobile Filter Button */}
                    <div className={`md:block hidden ${!filter ? 'mb-6' : 'mb-0'}`}>
                        <button 
                            onClick={() => setFilter(!filter)} 
                            className='w-full py-3 px-4 bg-gradient-to-r from-cyan-400 to-cyan-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all'
                        >
                            {filter ? 'Show Filters' : 'Hide Filters'}
                        </button>
                    </div>

                    <div className='flex gap-6'>
                        {/* Sidebar Filters */}
                        <div className={`w-[280px] md:w-full flex-shrink-0 ${filter ? 'md:hidden' : 'md:block'}`}>
                            <div className="sticky top-6 space-y-6">
                                {/* Categories */}
                                <div className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100'>
                                    <h2 className='text-xl font-bold mb-4 text-gray-800'>Categories</h2>
                                    <div className='space-y-3'>
                                        {categorys.map((c, i) => (
                                            <label key={i} className='flex items-center gap-3 cursor-pointer group'>
                                                <input 
                                                    checked={category === c.name} 
                                                    onChange={(e) => queryCategory(e, c.name)} 
                                                    type="checkbox" 
                                                    className='w-5 h-5 rounded border-gray-300 text-cyan-400 focus:ring-2 focus:ring-cyan-500 cursor-pointer'
                                                />
                                                <span className='text-gray-700 group-hover:text-cyan-400 transition-colors font-medium'>{c.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Range */}
                                <div className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100'>
                                    <h2 className='text-xl font-bold mb-6 text-gray-800'>Price Range</h2>
                                    <Range
                                        step={5}
                                        min={priceRange.low}
                                        max={priceRange.high}
                                        values={state.values}
                                        onChange={(values) => setState({ values })}
                                        renderTrack={({ props, children }) => (
                                            <div {...props} className='w-full h-2 bg-gray-200 rounded-full'>
                                                {children}
                                            </div>
                                        )}
                                        renderThumb={({ props }) => (
                                            <div className='w-5 h-5 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-full shadow-lg' {...props} />
                                        )}
                                    />
                                    <div className='mt-4 text-center'>
                                        <span className='text-lg font-bold bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent'>
                                            ${Math.floor(state.values[0])} - ${Math.floor(state.values[1])}
                                        </span>
                                    </div>
                                </div>

                                {/* Rating */}
                                <div className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100'>
                                    <h2 className='text-xl font-bold mb-4 text-gray-800'>Rating</h2>
                                    <div className='space-y-3'>
                                        {[5, 4, 3, 2, 1].map((r) => (
                                            <div 
                                                key={r} 
                                                onClick={() => setRating(r)} 
                                                className={`flex items-center gap-2 cursor-pointer p-2 rounded-lg transition-all ${rating === r ? 'bg-amber-50' : 'hover:bg-gray-50'}`}
                                            >
                                                <div className='flex text-amber-400'>
                                                    <RatingStars ratings={r} />
                                                </div>
                                                <span className='text-sm text-gray-600'>& Up</span>
                                            </div>
                                        ))}
                                        <div 
                                            onClick={resetRating} 
                                            className='flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-all'
                                        >
                                            <div className='flex text-gray-300'>
                                                <RatingStars ratings={0} />
                                            </div>
                                            <span className='text-sm text-gray-600'>All Ratings</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Latest Products */}
                                <div className='md:hidden'>
                                    <Products title='Latest Products' products={latest_product} />
                                </div>
                            </div>
                        </div>

                        {/* Products Grid */}
                        <div className='flex-1'>
                            {/* Toolbar */}
                            <div className='bg-white rounded-2xl p-4 mb-6 shadow-sm border border-gray-100'>
                                <div className='flex justify-between items-center flex-wrap gap-4'>
                                    <h2 className='text-lg font-semibold text-gray-800'>
                                        <span className="bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
                                            {totalProduct}
                                        </span> Products Found
                                    </h2>
                                    
                                    <div className='flex items-center gap-3'>
                                        <select 
                                            onChange={(e) => setSortPrice(e.target.value)} 
                                            className='px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 text-gray-700 font-medium bg-white transition-all'
                                        >
                                            <option value="">Sort By</option>
                                            <option value="low-to-high">Price: Low to High</option>
                                            <option value="high-to-low">Price: High to Low</option>
                                        </select>
                                        
                                        <div className='flex gap-2 md-lg:hidden'>
                                            <button 
                                                onClick={() => setStyles('grid')} 
                                                className={`p-3 rounded-lg transition-all ${styles === 'grid' ? 'bg-gradient-to-r from-cyan-400 to-cyan-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                            >
                                                <BsFillGridFill />
                                            </button>
                                            <button 
                                                onClick={() => setStyles('list')} 
                                                className={`p-3 rounded-lg transition-all ${styles === 'list' ? 'bg-gradient-to-r from-cyan-400 to-cyan-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                            >
                                                <FaThList />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Products Display */}
                            <div className='mb-8'>
                                {styles === 'grid' ? (
                                    <div className='grid grid-cols-3 lg:grid-cols-2 md:grid-cols-1 gap-6'>
                                        {products.map((product, i) => (
                                            <ProductCard key={i} product={product} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className='space-y-4'>
                                        {products.map((product, i) => (
                                            <ProductListCard key={i} product={product} />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Pagination */}
                            {totalProduct > parPage && (
                                <div className='flex justify-center'>
                                    <Pagination 
                                        pageNumber={pageNumber} 
                                        setPageNumber={setPageNumber} 
                                        totalItem={totalProduct} 
                                        parPage={parPage} 
                                        showItem={Math.floor(totalProduct / parPage)} 
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Shops;