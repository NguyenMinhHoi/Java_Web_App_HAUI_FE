import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientSidebar from './ClientSidebar';
import ClientHeader from './ClientHeader';
import BookSection from './BookSection';
import demoBookCover from '../../assets/images/demoBook.png';
import {useDispatch} from "react-redux";
import {logout} from "../../redux/reducers/userReducer";

export default function ClientPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

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

  const generateSampleBooks = (count) => {
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      title: `Sách mẫu ${i + 1}`,
      author: `Tác giả ${String.fromCharCode(65 + i)}`,
      imageUrl: demoBookCover,
      canReadNow: Math.random() > 0.5
    }));
  };

  const sampleBooks = generateSampleBooks(20);

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
            <BookSection title="Đọc ngay" books={sampleBooks.slice(0, 10)} />
            <BookSection title="Dành cho bạn" books={sampleBooks.slice(5, 15)} />
            <BookSection title="Sách mới" books={sampleBooks.slice(10)} />
          </div>
        </main>
      </div>
    </div>
  );
}
