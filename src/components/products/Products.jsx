// ============ Products.jsx (Sidebar) - Modern redesigned version ============
import React from 'react';
import Carousel from 'react-multi-carousel';
import { Link } from 'react-router-dom';
import 'react-multi-carousel/lib/styles.css';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const Products = ({ title, products }) => {
    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 1
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 1
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 1
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1
        },
    };

    const ButtonGroup = ({ next, previous }) => {
        return (
            <div className='flex justify-between items-center mb-4'>
                <h3 className='text-xl font-bold text-gray-900'>{title}</h3>
                <div className='flex gap-2'>
                    <button
                        onClick={() => previous()}
                        className='w-9 h-9 flex justify-center items-center bg-gradient-to-r from-cyan-400 to-cyan-600 text-white rounded-lg hover:from-cyan-700 hover:to-cyan-700 transition-all hover:scale-110'
                    >
                        <IoIosArrowBack />
                    </button>
                    <button
                        onClick={() => next()}
                        className='w-9 h-9 flex justify-center items-center bg-gradient-to-r from-cyan-400 to-cyan-600 text-white rounded-lg hover:from-cyan-700 hover:to-cyan-700 transition-all hover:scale-110'
                    >
                        <IoIosArrowForward />
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className='bg-white rounded-2xl p-4 shadow-sm border border-gray-100'>
            <Carousel
                autoPlay={false}
                infinite={false}
                arrows={false}
                responsive={responsive}
                transitionDuration={500}
                renderButtonGroupOutside={true}
                customButtonGroup={<ButtonGroup />}
            >
                {products.map((p, i) => (
                    <div key={i} className='flex flex-col gap-3'>
                        {p.map((pl, j) => (
                            <Link
                                key={j}
                                to={`/product/details/${pl.slug}`}
                                className='flex items-start gap-3 p-2 rounded-xl hover:bg-gradient-to-r hover:from-cyan-50 hover:to-cyan-50 transition-all group'
                            >
                                <div className='w-20 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex-shrink-0'>
                                    <img
                                        className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300'
                                        src={pl.images[0]}
                                        alt={pl.name}
                                    />
                                </div>
                                <div className='flex-1 flex flex-col gap-1'>
                                    <h4 className='text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-cyan-400 transition-colors'>
                                        {pl.name}
                                    </h4>
                                    {pl.shopName && (
                                        <span className='text-xs text-gray-500'>
                                            by <span className='text-cyan-600'>{pl.shopName}</span>
                                        </span>
                                    )}
                                    <span className='text-lg font-bold bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent'>
                                        ${pl.price}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default Products;