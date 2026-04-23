import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { FadeLoader } from 'react-spinners';

const ProtectUser = () => {
    const { userInfo, authChecked } = useSelector(state => state.auth)

    if (!authChecked) {
        return (
            <div className='w-screen h-screen flex justify-center items-center'>
                <FadeLoader color='#059473' />
            </div>
        )
    }

    if (userInfo) {
        return <Outlet />
    }
    return <Navigate to='/login' replace={true} />
};

export default ProtectUser;
