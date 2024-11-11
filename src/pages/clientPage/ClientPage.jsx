import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import ClientSidebar from './ClientSidebar';
import ClientHeader from './ClientHeader';
import demoBookCover from '../../assets/images/demoBook.png';
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../../redux/reducers/userReducer";
import {Swiper, SwiperSlide} from "swiper/react";
import useAxiosSupport from "../../hooks/useAxiosSupport";
import {Navigation, Pagination} from "swiper/modules";

export default function ClientPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const {id} = useSelector(state => state.user);
  const [currentUser, setCurrentUser] = useState(id);
  const navigate = useNavigate();
  const axiosSupport = useAxiosSupport();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      dispatch(logout());
      navigate('/home');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleProductClick = (item) => navigate(`/product/${item.id}`);

  const fetchProducts = async (page, size) => {
    setLoading(true);
    try {
      const response = await axiosSupport.getAllProduct(page, size);
      setProducts(prevProducts => [...prevProducts, ...response]);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosSupport.getAllCategory();
      setCategories(response);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage, pageSize);
    fetchCategories();
  }, []);

  const renderCollectionCards = (collections) => {
    return collections.map((item, index) => (
      <SwiperSlide key={index}>
        <div
          className="bg-white rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow duration-300 w-full max-w-[300px] mx-auto mb-8 cursor-pointer transform hover:scale-105"
          onClick={() => handleProductClick(item)}
        >
          <div className="relative mb-4 overflow-hidden rounded-lg">
            <img
              src={item?.image?.[0]?.path || 'https://via.placeholder.com/300?text=No+Image'}
              alt={item.name || 'Product Image'}
              className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/300?text=No+Image';
              }}
            />
            {item.isDiscount && (
              <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                Sale
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold mb-2 text-gray-800 truncate">{item?.name}</h3>
          <p className="text-gray-600 mb-3 text-sm line-clamp-2">{item?.description}</p>
          <div className="flex justify-between items-center mb-3">
            <span className="text-lg font-bold text-blue-600">${item?.minPrice || 0} - ${item?.maxPrice || 0}</span>
            <span className="text-sm text-gray-500">Đã bán: {item?.sold || 0}</span>
          </div>
          <div className="flex items-center mb-4">
            <span className="text-yellow-400 mr-1">★</span>
            <span className="text-sm text-gray-600">{item?.rating?.toFixed(1) || 0}</span>
          </div>
          <button
            className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors duration-300"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Thêm vào giỏ hàng:', item.name);
            }}
          >
            Thêm vào giỏ hàng
          </button>
        </div>
      </SwiperSlide>
    ));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <ClientSidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
        <div className="flex-1 flex flex-col overflow-hidden">
            <ClientHeader
                currentUser={currentUser}
                onLogout={handleLogout}
                onMenuClick={toggleSidebar}
            />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 pt-16">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                        <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
                            Khám Phá Những Sản Phẩm Tuyệt Vời
                        </h1>
                        <p className="text-xl text-center mb-8">
                            Tìm kiếm ưu đãi tốt nhất cho tất cả mặt hàng yêu thích của bạn
                        </p>
                        <div className="max-w-3xl mx-auto">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Tim kiếm sản phẩm"
                                    className="w-full py-3 px-4 pr-12 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                />
                                <button
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                                         viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">Sản phẩm nổi bật</h2>
                    <Swiper
                        modules={[Navigation, Pagination]}
                        spaceBetween={24}
                        slidesPerView={1}
                        breakpoints={{
                            640: {slidesPerView: 2, spaceBetween: 20},
                            768: {slidesPerView: 3, spaceBetween: 24},
                            1024: {slidesPerView: 4, spaceBetween: 24},
                        }}
                        navigation
                        pagination={{clickable: true}}
                        className="mb-12"
                    >
                        {renderCollectionCards(products)}
                    </Swiper>

                    <h2 className="text-3xl font-bold text-gray-800 mb-6">Danh mục sản phẩm</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
                        {categories.map((category, index) => (
                            <div key={index}
                                 className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">{category.name}</h3>
                                <p className="text-sm text-gray-600">{category.productCount} sản phẩm</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

        </div>
    </div>
  );
}
