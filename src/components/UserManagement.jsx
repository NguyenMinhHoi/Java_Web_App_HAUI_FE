import React, { useEffect, useState } from 'react';
import { FiSearch, FiTrash } from 'react-icons/fi';
import { FaUserPlus } from 'react-icons/fa';
import { CiEdit } from "react-icons/ci";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from './Modal';
import UserForm from './UserForm';
import AxiosSupport from '../services/axiosSupport';
import ConfirmDialog from './ConfirmDialog';

const axiosInstance = new AxiosSupport();

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [newUser, setNewUser] = useState({ username: '', email: '', roles: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUsers, setSelectedUsers] = useState({});

    const itemsPerPage = 10;

    const fetchUsers = async () => {
        try {
            const data = await axiosInstance.fetchWithAuth('getAllUsers');
            setUsers(data);
        } catch (error) {
            console.error('Lỗi khi lấy người dùng:', error);
            toast.error('Đã xảy ra lỗi khi tải danh sách người dùng.');
        }
    };

    const handleSearch = async () => {
        if (!searchQuery) {
            fetchUsers();
            return;
        }

        try {
            const data = await axiosInstance.searchUsersByName(searchQuery);
            setUsers(data);
        } catch (error) {
            console.error('Lỗi khi tìm kiếm người dùng:', error);
            toast.error('Đã xảy ra lỗi khi tìm kiếm người dùng.');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const totalPages = Math.ceil(users.length / itemsPerPage);
    const paginatedUsers = users.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleAddUser = async () => {
        try {
            const response = await axiosInstance.fetchWithAuth('register', {
                method: 'POST',
                body: JSON.stringify({
                    ...newUser,
                    confirmPassword: newUser.password
                }),
            });

            setUsers([...users, response]);
            resetForm();
            toast.success('Người dùng đã được thêm thành công!');
        } catch (error) {
            console.error('Lỗi khi thêm người dùng:', error);
            toast.error('Đã xảy ra lỗi khi thêm người dùng.');
        }
    };

    const handleEditUser = (user) => {
        setNewUser({ name: user.username, email: user.email });
        setEditingUser(user);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleSaveEdit = async () => {
        try {
            const updatedUser = { ...newUser };
            const userId = editingUser.id;

            const response = await axiosInstance.fetchWithAuth('updateUser', {
                method: 'PUT',
                body: JSON.stringify(updatedUser),
            }, userId);

            setUsers(users.map(user => (user.id === userId ? response : user)));
            toast.success('Người dùng đã được cập nhật thành công!');
            resetForm();
        } catch (error) {
            console.error('Lỗi khi cập nhật người dùng:', error);
            toast.error('Đã xảy ra lỗi khi cập nhật người dùng.');
        }
    };

    const handleDeleteUser = async (id) => {
        try {
            await axiosInstance.fetchWithAuth('deleteUser', {
                method: 'DELETE',
            }, id);
            setUsers(users.filter(user => user.id !== id));
            toast.success('Người dùng đã được xóa thành công!');
        } catch (error) {
            console.error('Lỗi khi xóa người dùng:', error);
            toast.error('Đã xảy ra lỗi khi xóa người dùng.');
        }
    };

    const openConfirmDialog = (id) => {
        setUserIdToDelete(id);
        setIsConfirmDialogOpen(true);
    };

    const confirmDelete = () => {
        if (userIdToDelete) {
            handleDeleteUser(userIdToDelete);
        }
        setIsConfirmDialogOpen(false);
        setUserIdToDelete(null);
    };

    const resetForm = () => {
        setIsEditing(false);
        setNewUser({ name: '', email: '', role: '' });
        setIsModalOpen(false);
        setEditingUser(null);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleSelectAll = (event) => {
        const isChecked = event.target.checked;
        const newSelectedUsers = {};
        paginatedUsers.forEach(user => {
            newSelectedUsers[user.id] = isChecked;
        });
        setSelectedUsers(newSelectedUsers);
    };

    const handleSelectUser = (id) => {
        setSelectedUsers(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const isAllSelected = paginatedUsers.every(user => selectedUsers[user.id]);

    return (
        <div className="p-6 bg-gray-50 min-h-screen rounded-md">
            <div className="flex-1 p-4 lg:p-6 space-y-4 lg:space-y-6 overflow-x-auto">
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">Quản lý người dùng</h1>
                <div className="mb-4 lg:mb-6 flex justify-center items-center p-1">
                    <div className="relative flex items-center w-4/5">
                        <input
                            type="text"
                            placeholder="Tìm kiếm người dùng..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border border-gray-300 rounded-md py-2 pl-3 pr-4 text-gray-700 placeholder-gray-500"
                        />
                        <FiSearch size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer" onClick={handleSearch} />
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="flex justify-center items-start bg-white py-3 px-3 rounded-md text-black border border-gray-300 ml-4 w-1/5">
                        <FaUserPlus />
                    </button>
                </div>

                <div className="bg-white rounded-md shadow-md overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <th className="p-4">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-blue-600"
                                        checked={isAllSelected}
                                        onChange={handleSelectAll}
                                    />
                                </th>
                                <th className="p-4">ID</th>
                                <th className="p-4">Tên</th>
                                <th className="p-4 hidden sm:table-cell">Email</th>
                                <th className="p-4 hidden md:table-cell">Vai trò</th>
                                <th className="p-4">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedUsers.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="p-4">
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300 text-blue-600"
                                            checked={selectedUsers[user.id] || false}
                                            onChange={() => handleSelectUser(user.id)}
                                        />
                                    </td>
                                    <td className="p-4 text-gray-500">USER-{user.id.toString().padStart(4, '0')}</td>
                                    <td className="p-4">{user.username}</td>
                                    <td className="p-4 hidden sm:table-cell">{user.email}</td>
                                    <td className="p-4 hidden md:table-cell">
                                        <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">{user.roles[0].name}</span>
                                    </td>
                                    <td className="p-4">
                                        <button
                                            className="text-blue-400 hover:text-gray-600 mr-2"
                                            onClick={() => handleEditUser(user)}
                                        >
                                            <CiEdit />
                                        </button>
                                        <button
                                            className="text-red-400 hover:text-gray-600"
                                            onClick={() => openConfirmDialog(user.id)}
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
                    <span className="text-sm">{Object.values(selectedUsers).filter(Boolean).length} trên {users.length} hàng được chọn.</span>
                    <div className="flex items-center space-x-2 text-sm">
                        <span className="hidden sm:inline">Số hàng mỗi trang: {itemsPerPage}</span>
                        <span>Trang {currentPage} trên {totalPages}</span>
                        <div className="flex space-x-1">
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
                </div>

                <Modal isOpen={isModalOpen} onClose={resetForm}>
                    <UserForm
                        user={newUser}
                        onChange={(e) => setNewUser({ ...newUser, [e.target.name]: e.target.value })}
                        onSubmit={isEditing ? handleSaveEdit : handleAddUser}
                        onCancel={resetForm}
                        isEditing={isEditing}
                    />
                </Modal>

                <ConfirmDialog
                    isOpen={isConfirmDialogOpen}
                    onClose={() => setIsConfirmDialogOpen(false)}
                    onConfirm={confirmDelete}
                />

                <ToastContainer />
            </div>
        </div>
    );
};

export default UserManagement;
