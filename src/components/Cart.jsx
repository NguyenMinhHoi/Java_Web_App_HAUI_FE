import React, { useState, useEffect } from 'react';
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import HomeHeader from "./HomeHeader";
import HomeFooter from "./HomeFooter";
import CartItemCard from "./CartItemCard";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  // Giả sử dữ liệu này được lấy từ API hoặc Redux store
  useEffect(() => {
    // Mô phỏng việc lấy dữ liệu
    const fetchedItems = [
      { id: 1, name: "Áo thun", price: 200000,variant: "Màu : Xanh, Phụ kiện: Không, Size: L", quantity: 2, shopId: 1, shopName: "Shop A" },
      { id: 2, name: "Quần jean", price: 500000, quantity: 1, shopId: 1, shopName: "Shop A" },
      { id: 3, name: "Giày sneaker", price: 800000, quantity: 1, shopId: 2, shopName: "Shop B" },
    ];
    setCartItems(fetchedItems);
  }, []);

  useEffect(() => {
    const newTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotal(newTotal);
  }, [cartItems]);

  const handleQuantityChange = (id, change) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(0, item.quantity + change) }
          : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const groupedItems = cartItems.reduce((acc, item) => {
    if (!acc[item.shopId]) {
      acc[item.shopId] = { shopName: item.shopName, items: [] };
    }
    acc[item.shopId].items.push(item);
    return acc;
  }, {});

  return (
      <>
          <HomeHeader/>
          <div className="container mx-auto p-4">
              <h1 className="text-2xl font-bold mb-4">Giỏ hàng</h1>
              {Object.values(groupedItems).map((shop) => (
                  <div key={shop.shopName} className="mb-8 bg-white rounded-lg shadow-md p-4">
                      <h2 className="text-xl font-semibold mb-4">{shop.shopName}</h2>
                      {shop.items.map((item) => (
                          <CartItemCard
                              key={item.id}
                              item={item}
                              onQuantityChange={handleQuantityChange}
                              onRemove={handleRemoveItem}
                          />
                      ))}
                  </div>
              ))}
              <div className="mt-8 bg-white rounded-lg shadow-md p-4">
                  <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold">Tổng cộng:</h2>
                      <p className="text-2xl font-bold text-blue-600">{total.toLocaleString('vi-VN')} đ</p>
                  </div>
                  <button
                      className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300">
                      Tiến hành thanh toán
                  </button>
              </div>
          </div>
          <HomeFooter/>
      </>
  );
};

export default Cart;