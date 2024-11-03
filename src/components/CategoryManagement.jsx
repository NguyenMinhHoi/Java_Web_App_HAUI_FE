import React, { useEffect, useState } from 'react';
import { FiSearch, FiTrash } from 'react-icons/fi';
import { FaPlus } from 'react-icons/fa';
import { CiEdit } from "react-icons/ci";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from './Modal';
import CategoryForm from './CategoryForm';
import AxiosSupport from '../services/axiosSupport';
import ConfirmDialog from './ConfirmDialog';

const axiosInstance = new AxiosSupport();

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [newCategory, setNewCategory] = useState({ name: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [categoryIdToDelete, setCategoryIdToDelete] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Số lượng danh mục trên mỗi trang

    const fetchCategories = async () => {
        try {
            const data = await axiosInstance.fetchWithAuth('getAllCategories');
            setCategories(data);
        } catch (error) {
            console.error('Lỗi khi lấy danh mục:', error);
            toast.error('Đã xảy ra lỗi khi tải danh sách danh mục.');
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const totalPages = Math.ceil(categories.length / itemsPerPage);
    const paginatedCategories = categories.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleAddCategory = async () => {
        try {
            await axiosInstance.fetchWithAuth('createCategory', {
                method: 'POST',
                body: JSON.stringify(newCategory),
            });
            await fetchCategories(); // Cập nhật danh sách sau khi thêm
            resetForm();
            toast.success('Danh mục đã được thêm thành công!');
        } catch (error) {
            console.error('Lỗi khi thêm danh mục:', error);
            toast.error('Đã xảy ra lỗi khi thêm danh mục.');
        }
    };

    const handleSaveEdit = async () => {
        try {
            const updatedCategory = { ...newCategory };
            const categoryId = editingCategory.categoryId;

            await axiosInstance.fetchWithAuth('updateCategory', {
                method: 'PUT',
                body: JSON.stringify(updatedCategory),
            }, categoryId);
            await fetchCategories(); // Cập nhật danh sách sau khi sửa
            resetForm();
            toast.success('Danh mục đã được cập nhật thành công!');
        } catch (error) {
            console.error('Lỗi khi cập nhật danh mục:', error);
            toast.error('Đã xảy ra lỗi khi cập nhật danh mục.');
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        try {
            await axiosInstance.fetchWithAuth('deleteCategory', {
                method: 'DELETE',
            }, categoryId);
            
            // Cập nhật danh sách sau khi xóa
            await fetchCategories(); // Cập nhật danh sách sau khi xóa
            setIsConfirmDialogOpen(false); // Đóng dialog xác nhận
            toast.success('Danh mục đã được xóa thành công!');
        } catch (error) {
            console.error('Lỗi khi xóa danh mục:', error);
            toast.error('Đã xảy ra lỗi khi xóa danh mục.');
        }
    };

    const resetForm = () => {
        setIsEditing(false);
        setNewCategory({ name: '' });
        setIsModalOpen(false);
        setEditingCategory(null);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen rounded-md">
            <div className="flex-1 p-4 lg:p-6 space-y-4 lg:space-y-6 overflow-x-auto">
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">Quản lý danh mục</h1>
                <div className="mb-4 lg:mb-6 flex justify-center items-center p-1">
                    <div className="relative flex items-center w-4/5">
                        <input
                            type="text"
                            placeholder="Tìm kiếm danh mục..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border border-gray-300 rounded-md py-2 pl-3 pr-4 text-gray-700 placeholder-gray-500"
                        />
                        <FiSearch size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer" />
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="flex justify-center items-start bg-white py-3 px-3 rounded-md text-black border border-gray-300 ml-4 w-1/5">
                        <FaPlus />
                    </button>
                </div>

                <div className="bg-white rounded-md shadow-md overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <th className="p-4">ID</th>
                                <th className="p-4">Tên</th>
                                <th className="p-4">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedCategories.map(category => (
                                <tr key={category.categoryId} className="hover:bg-gray-50">
                                    <td className="p-4 text-gray-500">{category.categoryId}</td>
                                    <td className="p-4">{category.name}</td>
                                    <td className="p-4">
                                        <button
                                            className="text-blue-400 hover:text-gray-600 mr-2"
                                            onClick={() => {
                                                setNewCategory({ name: category.name });
                                                setEditingCategory(category);
                                                setIsEditing(true);
                                                setIsModalOpen(true);
                                            }}
                                        >
                                            <CiEdit />
                                        </button>
                                        <button
                                            className="text-red-400 hover:text-gray-600"
                                            onClick={() => {
                                                setCategoryIdToDelete(category.categoryId);
                                                setIsConfirmDialogOpen(true);
                                            }}
                                        >
                                            <FiTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-gray-600 space-y-2 sm:space-y-0">
                    <span className="text-sm">Trang {currentPage} trên {totalPages}</span>
                    <div className="flex items-center space-x-2 text-sm">
                        <button
                            onClick={() => handlePageChange(1)}
                            className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                            disabled={currentPage === 1}
                        >
                            &lt;&lt;
                        </button>
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                            disabled={currentPage === 1}
                        >
                            &lt;
                        </button>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                            disabled={currentPage === totalPages}
                        >
                            &gt;
                        </button>
                        <button
                            onClick={() => handlePageChange(totalPages)}
                            className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                            disabled={currentPage === totalPages}
                        >
                            &gt;&gt;
                        </button>
                    </div>
                </div>

                <Modal isOpen={isModalOpen} onClose={resetForm}>
                    <CategoryForm
                        category={newCategory}
                        onChange={(e) => setNewCategory({ ...newCategory, [e.target.name]: e.target.value })}
                        onSubmit={isEditing ? handleSaveEdit : handleAddCategory}
                        onCancel={resetForm}
                        isEditing={isEditing}
                    />
                </Modal>

                <ConfirmDialog
                    isOpen={isConfirmDialogOpen}
                    onClose={() => setIsConfirmDialogOpen(false)}
                    onConfirm={() => handleDeleteCategory(categoryIdToDelete)}
                />

                <ToastContainer />
            </div>
        </div>
    );
};

export default CategoryManagement;
