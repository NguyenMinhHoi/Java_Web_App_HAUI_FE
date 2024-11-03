import React from 'react';

export default function BookItem({ item, toggleMenu, openMenuId }) {
    return (
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-200 w-60 flex-shrink-0 relative">
            <img src={item.imageUrl} alt={item.title} className="w-full h-64 object-cover" />
            <div className="p-4">
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.author}</p>
            </div>
            <div className="absolute top-2 right-2">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleMenu(item.id);
                    }}
                    className="w-8 h-8 rounded-full bg-[#faa21a] border border-gray-300 flex items-center justify-center text-white hover:bg-[#e89100] transition-colors duration-200"
                >
                    <span className="text-xl leading-none">&#8942;</span>
                </button>
                {openMenuId === item.id && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                            <a href="/add-to-bookshelf" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Thêm vào tủ sách của tôi</a>
                            {item.canReadNow && (
                                <a href={`/read/${item.id}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Đọc ngay</a>
                            )}
                            {!item.canReadNow && (
                                <a href={`/borrow/${item.id}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Đăng ký mượn</a>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
