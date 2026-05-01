import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaHome, FaSearch, FaShoppingBag, FaUser, FaHeart } from 'react-icons/fa';

// Bottom navigation shown on mobile only (hidden ≥md per Tailwind config —
// note the breakpoint is inverted so `md:hidden` hides on small screens, and
// the explicit md:flex on Header below shows mobile-only there).
//
// We deliberately keep this lean: 5 destinations, big tap targets, badge for
// the cart count. The active item gets a slim accent bar above the icon —
// less visual noise than highlighting the whole tile.
const items = [
    { to: '/', icon: FaHome, label: 'Home', match: (p) => p === '/' },
    { to: '/shops', icon: FaSearch, label: 'Shop', match: (p) => p.startsWith('/shops') || p.startsWith('/products') || p.startsWith('/all-shops') },
    { to: '/card', icon: FaShoppingBag, label: 'Cart', match: (p) => p === '/card' },
    { to: '/dashboard/my-wishlist', icon: FaHeart, label: 'Wishlist', match: (p) => p.includes('wishlist') },
    { to: '/dashboard', icon: FaUser, label: 'Account', match: (p) => p.startsWith('/dashboard') }
];

const MobileBottomNav = () => {
    const location = useLocation();
    const { card_product_count } = useSelector(state => state.card);
    const { userInfo } = useSelector(state => state.auth);

    return (
        <nav
            className='hidden md:flex fixed left-0 right-0 bottom-0 z-50 bg-white/95 backdrop-blur border-t border-gray-200 pb-safe'
            aria-label='Primary'
        >
            <ul className='flex w-full'>
                {items.map(({ to, icon: Icon, label, match }) => {
                    const active = match(location.pathname);
                    // Wishlist + Account require auth — bounce unauthenticated
                    // users to login rather than showing the empty dashboard.
                    const target = (label === 'Wishlist' || label === 'Account') && !userInfo
                        ? '/login'
                        : to;
                    return (
                        <li key={label} className='flex-1'>
                            <Link
                                to={target}
                                className='relative flex flex-col items-center justify-center gap-0.5 py-2 min-h-[3.5rem] text-[11px] font-medium'
                                aria-current={active ? 'page' : undefined}
                            >
                                {/* Active indicator pill above the icon */}
                                <span className={`absolute top-0 h-1 w-8 rounded-full transition-all ${active ? 'bg-cyan-500' : 'bg-transparent'}`} />
                                <span className={`relative ${active ? 'text-cyan-600' : 'text-gray-500'}`}>
                                    <Icon className='text-xl' />
                                    {label === 'Cart' && card_product_count > 0 && (
                                        <span className='absolute -top-1.5 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center'>
                                            {card_product_count > 99 ? '99+' : card_product_count}
                                        </span>
                                    )}
                                </span>
                                <span className={active ? 'text-cyan-600' : 'text-gray-600'}>{label}</span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

export default MobileBottomNav;
