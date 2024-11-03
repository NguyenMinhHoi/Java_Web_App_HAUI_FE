import React from 'react';

const CategoryForm = ({ category, onChange, onSubmit, onCancel, isEditing }) => {
    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">{isEditing ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}</h2>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
                <div>
                    <label className="block text-gray-700">Tên danh mục:</label>
                    <input
                        type="text"
                        name="name"
                        value={category.name}
                        onChange={onChange}
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="flex justify-end space-x-4">
                    <button
                        type="submit"
                        className={`${isEditing ? 'bg-blue-400' : 'bg-green-400'} text-white px-4 py-2 rounded-md hover:bg-${isEditing ? 'green-600' : 'blue-600'}`}
                    >
                        {isEditing ? 'Lưu' : 'Thêm'}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                    >
                        Hủy
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CategoryForm;
