import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import ClientSidebar from './ClientSidebar';
import ClientHeader from './ClientHeader';
import BookSection from './BookSection';
import demoBookCover from '../../assets/images/demoBook.png';
import {useDispatch} from "react-redux";
import {logout} from "../../redux/reducers/userReducer";
import {Swiper, SwiperSlide} from "swiper/react";
import useAxiosSupport from "../../hooks/useAxiosSupport";
import {Navigation, Pagination} from "swiper/modules";

export default function ClientPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
    const axiosSupport = useAxiosSupport();


    const [isMenuOpen, setIsMenuOpen] = useState(false);


    const [showMore, setShowMore] = useState(false);

    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [loading, setLoading] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
    const dispatch = useDispatch(); // Sử dụng useDispatch để dispatch action

    const handleLogout = async () => {
        try {
            // Dispatch action để xóa dữ liệu user trong Redux store
            dispatch(logout());

            // Chuyển hướng về trang home
            navigate('/home');
        } catch (error) {
            console.error('Logout failed:', error);
            // Xử lý lỗi nếu cần
        }
    };

    const handleProductClick = (item) => {
        navigate(`/product/${item.id}`);
    };


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

    useEffect(() => {
        fetchProducts(currentPage, pageSize);
    }, []);

    const renderCollectionCards = (collections) => {
        return collections.map((item, index) => (
            <SwiperSlide key={index}>
                <div
                    className="bg-white rounded-lg p-3 sm:p-4 md:p-6 shadow-md hover:shadow-lg transition-shadow w-full max-w-[250px] sm:max-w-[300px] md:max-w-[350px] mx-auto mb-8 sm:mb-10 md:mb-12 cursor-pointer"
                    onClick={()=>handleProductClick(item)}
                >
                    <div className="relative mb-3 sm:mb-4">
                        <img
                            src={item?.image?.[0]?.path || 'https://via.placeholder.com/300?text=No+Image'}
                            alt={item.name || 'Product Image'}
                            className="w-full h-32 sm:h-40 md:h-48 object-cover rounded-md"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/300?text=No+Image';
                            }}
                        />
                        {item.isDiscount && (
                            <span
                                className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-red-500 text-white px-1 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-bold">
            Sale
          </span>
                        )}
                    </div>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2 text-gray-800 truncate">{item?.name}</h3>
                    <p className="text-gray-600 mb-2 text-xs sm:text-sm md:text-base line-clamp-2">{item?.description}</p>
                    <div className="flex justify-between items-center mb-2 sm:mb-3">
              <span
                  className="text-base sm:text-lg font-bold text-[#0b328f]">${item?.minPrice || 0} - ${item?.maxPrice || 0}</span>
                        <span className="text-xs sm:text-sm text-gray-500">Đã bán: {item?.sold || 0}</span>
                    </div>
                    <div className="flex items-center mb-3 sm:mb-4">
                        <span className="text-yellow-400 mr-1">★</span>
                        <span className="text-sm text-gray-600">{item?.rating?.toFixed(1) || 0}</span>
                    </div>
                    <button
                        className="w-full bg-[#0b328f] text-white py-1.5 sm:py-2 rounded text-xs sm:text-sm md:text-base hover:bg-[#092569] transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            // Xử lý logic thêm vào giỏ hàng ở đây
                            console.log('Thêm vào giỏ hàng:', item.name);
                        }}
                    >
                        Thêm vào giỏ hàng
                    </button>
                </div>
            </SwiperSlide>));
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
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Swiper
                  modules={[Navigation, Pagination]}
                  spaceBetween={16}
                  slidesPerView={1}
                  breakpoints={{
                      640: {
                          slidesPerView: 2,
                          spaceBetween: 20,
                      },
                      768: {
                          slidesPerView: 3,
                          spaceBetween: 24,
                      },
                      1024: {
                          slidesPerView: 4,
                          spaceBetween: 24,
                      },
                  }}
                  navigation
                  pagination={{ clickable: true }}
                  className="mb-8"
              >
                  {renderCollectionCards(products)}
              </Swiper>
          </div>
        </main>
      </div>
    </div>
  );
}
