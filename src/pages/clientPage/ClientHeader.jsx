import React, { useState, useRef, useEffect } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { FiSearch, FiBell, FiUser, FiLogOut, FiMenu } from 'react-icons/fi';
import useAxiosSupport from "../../hooks/useAxiosSupport";
import {FaShoppingCart} from "react-icons/fa";

export default function ClientHeader({ currentUser, onLogout, onMenuClick }) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const [user,setCurrentUser] = useState(null);
  const userMenuRef = useRef(null);
  const axiosSupport = useAxiosSupport();
  useEffect(() => {
    const fetchUser = async () => {
      const updatedUser = await axiosSupport.getUserById(currentUser);
      setCurrentUser(updatedUser);
    };
    fetchUser();
  }, []);

  const handleCartClick = () => {
    navigate('/cart');
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuRef]);

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-30">
      <div className="flex items-center">
        <button onClick={onMenuClick} className="mr-4">
          <FiMenu className="h-6 w-6" />
        </button>
        <Link to="/client" className="text-xl font-semibold text-gray-900 mr-8">HTQ eCommerce</Link>
        <div className="flex space-x-4">
          <nav className="hidden md:block">
            <ul className="flex space-x-4 lg:space-x-6">
              <li><a href="#" className="hover:text-[#f2a429] transition-colors text-sm lg:text-base">Danh mục</a></li>
              <li><a href="#" className="hover:text-[#f2a429] transition-colors text-sm lg:text-base">BestSeller</a>
              </li><li><a href="#" className="hover:text-[#f2a429] transition-colors text-sm lg:text-base">Dịch vụ</a></li>
              <li><a href="#" className="hover:text-[#f2a429] transition-colors text-sm lg:text-base">Giới thiệu</a></li>
            </ul>
          </nav>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <input
              type="text"
              placeholder="Tìm kiếm..."
              className="bg-gray-100 text-gray-900 text-sm rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"/>
        </div>
        <button className="text-gray-500 hover:text-gray-700">
          <FiBell className="h-5 w-5"/>
        </button>

        <button onClick={handleCartClick} className="text-gray hover:text-[#f2a429] transition-colors">
          <FaShoppingCart className="h-6 w-6"/>
        </button>
        <div className="relative" ref={userMenuRef}>
          <button
              onClick={toggleUserMenu}
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
          >
            <FiUser className="h-5 w-5"/>
          </button>
          {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <p className="px-4 py-2 text-sm text-gray-700">{currentUser?.email || 'user@example.com'}</p>
                <Link to="/client/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Hồ
                  sơ</Link>
                <Link to="/client/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Cài
                  đặt</Link>
                <button
                    onClick={onLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <FiLogOut className="h-4 w-4 mr-2"/>
                  Đăng xuất
                </button>
              </div>
          )}
        </div>
      </div>
    </header>
  );
}
