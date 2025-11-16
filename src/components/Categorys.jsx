// ============ Categorys.jsx - Modern redesigned version ============
import React from 'react';
import Carousel from 'react-multi-carousel';
import { Link } from 'react-router-dom';
import 'react-multi-carousel/lib/styles.css';
import { useSelector } from 'react-redux';

const Categorys = () => {
    const { categorys } = useSelector((state) => state.home);

    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 6,
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 6,
        },
        tablet: {
            breakpoint: { max: 1024, min: 768 },
            items: 4,
        },
        mobile: {
            breakpoint: { max: 768, min: 464 },
            items: 3,
        },
        smmobile: {
            breakpoint: { max: 464, min: 0 },
            items: 2,
        },
    };

    return (
        <div className="w-[87%] mx-auto py-16 relative">
            {/* Section Header */}
            <div className="text-center mb-12">
                <h2 className='text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                    Shop by Category
                </h2>
                <p className="text-gray-600 mb-4">Explore our diverse range of product categories</p>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
            </div>

            {/* Categories Carousel */}
            <Carousel
                autoPlay={true}
                infinite={true}
                arrows={true}
                swipeable={true}
                draggable={true}
                showDots={false}
                responsive={responsive}
                transitionDuration={500}
                autoPlaySpeed={3000}
                pauseOnHover={true}
            >
                {categorys.map((c, i) => (
                    <Link
                        key={i}
                        to={`/products?category=${c.name}`}
                        className="group block mx-2"
                    >
                        <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 h-[200px]">
                            <div className="relative w-full h-full">
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100">
                                    <img 
                                        src={c.image} 
                                        alt={c.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                    <div className="bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg">
                                        <h3 className="font-bold text-gray-900 text-center group-hover:text-blue-600 transition-colors">
                                            {c.name}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </Carousel>
        </div>
    );
};

export default Categorys;