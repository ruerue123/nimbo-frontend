// ============ Pagination.jsx - Modern redesigned version ============
import React from 'react';
import { MdOutlineKeyboardDoubleArrowLeft, MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";

const Pagination = ({ pageNumber, setPageNumber, totalItem, parPage, showItem }) => {
    let totalPage = Math.ceil(totalItem / parPage);
    let startPage = pageNumber;

    let dif = totalPage - pageNumber;
    if (dif <= showItem) {
        startPage = totalPage - showItem;
    }
    let endPage = startPage < 0 ? showItem : showItem + startPage;

    if (startPage <= 0) {
        startPage = 1;
    }

    const createBtn = () => {
        const btns = [];
        for (let i = startPage; i < endPage; i++) {
            btns.push(
                <li
                    key={i}
                    onClick={() => setPageNumber(i)}
                    className={`w-10 h-10 rounded-xl flex justify-center items-center cursor-pointer font-semibold transition-all ${pageNumber === i
                            ? 'bg-gradient-to-r from-cyan-400 to-cyan-600 text-white shadow-lg scale-110'
                            : 'bg-white text-gray-700 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-cyan-50 hover:text-cyan-400 border border-gray-200'
                        }`}
                >
                    {i}
                </li>
            );
        }
        return btns;
    };

    return (
        <ul className='flex gap-2 items-center'>
            {pageNumber > 1 && (
                <li
                    onClick={() => setPageNumber(pageNumber - 1)}
                    className='w-10 h-10 rounded-xl flex justify-center items-center bg-white border border-gray-200 text-gray-700 cursor-pointer hover:bg-gradient-to-r hover:from-cyan-400 hover:to-cyan-600 hover:text-white hover:border-transparent transition-all'
                >
                    <MdOutlineKeyboardDoubleArrowLeft className="text-xl" />
                </li>
            )}
            {createBtn()}
            {pageNumber < totalPage && (
                <li
                    onClick={() => setPageNumber(pageNumber + 1)}
                    className='w-10 h-10 rounded-xl flex justify-center items-center bg-white border border-gray-200 text-gray-700 cursor-pointer hover:bg-gradient-to-r hover:from-cyan-400 hover:to-cyan-600 hover:text-white hover:border-transparent transition-all'
                >
                    <MdOutlineKeyboardDoubleArrowRight className="text-xl" />
                </li>
            )}
        </ul>
    );
};

export default Pagination;