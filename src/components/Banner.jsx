// ============ Banner.jsx - Modern redesigned version ============
import React, { useEffect } from 'react';
import Carousel from 'react-multi-carousel';
import { Link } from 'react-router-dom';
import 'react-multi-carousel/lib/styles.css';
import { useDispatch, useSelector } from 'react-redux';
import { get_banners } from '../store/reducers/homeReducer';

const Banner = () => {
    const dispatch = useDispatch();
    const { banners } = useSelector(state => state.home);

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

    useEffect(() => {
        dispatch(get_banners());
    }, [dispatch]);

    return (
        <div className='w-full md-lg:mt-6'>
            <div className='w-[85%] lg:w-[90%] mx-auto'>
                <div className='my-8'>
                    <div className="rounded-3xl overflow-hidden shadow-2xl">
                        <Carousel
                            autoPlay={true}
                            infinite={true}
                            arrows={true}
                            showDots={true}
                            responsive={responsive}
                            autoPlaySpeed={5000}
                            transitionDuration={800}
                            customTransition="transform 800ms ease-in-out"
                        >
                            {banners.length > 0 && banners.map((b, i) => (
                                <Link key={i} to={`product/details/${b.link}`} className="block relative group">
                                    <div className="relative overflow-hidden aspect-[21/9] md:aspect-[16/9]">
                                        <img 
                                            src={b.banner} 
                                            alt="" 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>
                                </Link>
                            ))}
                        </Carousel>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Banner;