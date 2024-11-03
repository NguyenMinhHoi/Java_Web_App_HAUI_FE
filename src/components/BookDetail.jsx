import React from 'react';

const BookDetail = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row md:space-x-8">
                {/* Image section - 40% width on md screens and above */}
                <div className="md:w-2/5 mb-8 md:mb-0">
                    <img
                        src="/placeholder.svg?height=600&width=400"
                        alt="Book cover"
                        className="w-full h-auto object-cover rounded-lg shadow-lg"
                    />
                </div>

                {/* Book details section - 60% width on md screens and above */}
                <div className="md:w-3/5">
                    <h1 className="text-3xl font-bold mb-4">Tên sách</h1>

                    <div className="space-y-2 mb-6">
                        <p><span className="font-semibold">Tác giả:</span> Nguyễn Văn A</p>
                        <p><span className="font-semibold">Năm xuất bản:</span> 2023</p>
                        <p><span className="font-semibold">Nhà xuất bản:</span> NXB Trẻ</p>
                    </div>

                    <div className="space-y-4">
                        <p className="text-gray-700">
                            Mô tả ngắn về cuốn sách. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>

                        <div className="flex space-x-4">
                            <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition duration-300">
                                Trailer
                            </button>
                            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300">
                                Đọc ngay
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetail;