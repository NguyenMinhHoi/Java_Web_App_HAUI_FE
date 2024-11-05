import React, { useState } from 'react';
import { FiMinus, FiPlus, FiTrash2, FiChevronDown } from 'react-icons/fi';
import VariantSelect from './VariantSelect';
import Modal from "./Modal";

const CartItemCard = ({ item, onQuantityChange, onRemove, onVariantChange }) => {
  const [showVariantSelect, setShowVariantSelect] = useState(false);

  const toggleVariantSelect = () => {
    setShowVariantSelect(!showVariantSelect);
  };

  return (
    <div className="flex flex-col border-b py-4">
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <img
                    src={`/path-to-image/${item.id}.jpg`}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-md"
                />
                <div>
                    <h3 className="font-medium text-lg">{item.name}</h3>
                    <p className="text-blue-600 font-semibold mt-1">
                        {item.price.toLocaleString('vi-VN')} đ
                    </p>
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <div>
                    <button
                        onClick={toggleVariantSelect}
                        className="text-gray-600 text-sm flex items-center hover:text-blue-500 focus:outline-none"
                    >
                        {item.variant} <FiChevronDown className="ml-1"/>
                    </button>
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <div className="flex items-center border rounded-md">
                    <button
                        onClick={() => onQuantityChange(item.id, -1)}
                        className="p-2 hover:bg-gray-100"
                    >
                        <FiMinus/>
                    </button>
                    <span className="px-4 py-2 border-x">{item.quantity}</span>
                    <button
                        onClick={() => onQuantityChange(item.id, 1)}
                        className="p-2 hover:bg-gray-100"
                    >
                        <FiPlus/>
                    </button>
                </div>
                <button
                    onClick={() => onRemove(item.id)}
                    className="text-red-500 hover:text-red-700"
                >
                    <FiTrash2 size={20}/>
                </button>
            </div>
        </div>
        {showVariantSelect && (
            <Modal isOpen={showVariantSelect} onClose={toggleVariantSelect}>
                <div className="mt-4">
                    <VariantSelect
                        groupOptions={item.groupOptions}
                        selectedOptions={item.selectedOptions}
                        handleOptionSelect={(groupName, optionName) => {
                            onVariantChange(item.id, groupName, optionName);
                            toggleVariantSelect();
                        }}
                    />
                </div>
            </Modal>
        )}
    </div>
  );
}

export default CartItemCard;