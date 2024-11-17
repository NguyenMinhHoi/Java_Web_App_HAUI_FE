import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const CollectionSection = ({ products, renderCollectionCards }) => {
    const [showMore, setShowMore] = useState(false);

    return (
        <div className="py-12 sm:py-16 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-[#0b328f]">
                    Khám phá Bộ sưu tập của chúng tôi
                </h2>
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
                    pagination={{clickable: true}}
                    className="mb-8"
                >
                    {renderCollectionCards(products)}
                </Swiper>
                {showMore && (
                    <>
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
                            pagination={{clickable: true}}
                            className="mb-8"
                        >
                            {renderCollectionCards(products)}
                        </Swiper>
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
                            pagination={{clickable: true}}
                            className="mb-8"
                        >
                            {renderCollectionCards(products)}
                        </Swiper>
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
                            pagination={{clickable: true}}
                            className="mb-8"
                        >
                            {renderCollectionCards(products)}
                        </Swiper>
                    </>
                )}
                <div className="text-center">
                    <button
                        onClick={() => setShowMore(!showMore)}
                        className="bg-[#f2a429] text-white py-2 px-4 rounded hover:bg-[#e09321] transition-colors text-sm sm:text-base inline-flex items-center justify-center mx-auto"
                    >
                        {showMore ? <FiArrowUp className="mr-2"/> : <FiArrowDown className="mr-2"/>}
                        <span>{showMore ? 'Thu gọn' : 'Xem thêm'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CollectionSection;