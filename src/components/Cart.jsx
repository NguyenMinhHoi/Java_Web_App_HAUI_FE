import React, { useState, useEffect } from 'react';
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import HomeHeader from "./HomeHeader";
import HomeFooter from "./HomeFooter";
import CartItemCard from "./CartItemCard";
import {useSelector} from "react-redux";
import ClientHeader from "../pages/clientPage/ClientHeader";
import useAxiosSupport from "../hooks/useAxiosSupport";

const Cart = () => {
    const axiosSupport = useAxiosSupport();
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const {id : userId} = useSelector(state => state.user);

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await axiosSupport.getCartByUserId(userId);
                setCartItems([...response.variants]);
            } catch (error) {
                console.error('Error fetching cart items:', error);
            }
        };

        fetchCartItems();
    }, [userId, axiosSupport]);

    useEffect(() => {
        if(Array.isArray(cartItems) && cartItems.length > 0) {
            const newTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
            setTotal(newTotal);
        }
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


    const groupedItems =  cartItems.reduce((acc, item) => {
        if (!acc[item.product.merchant.id]) {
            acc[item.product.merchant.id] = { shopName: item.product.merchant.name, items: [] };
        }
        acc[item.product.merchant.id].items.push(item);
        return acc;
    }, {});


  return (
      <>
          {userId ? <ClientHeader currentUser={userId}/> :<HomeHeader/>}
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
                      <p className="text-2xl font-bold text-blue-600">${total} VND</p>
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