import React, { createContext, useState, useEffect, useContext } from 'react';
import axiosClient from '../api/axiosClient';
import { ENDPOINTS } from '../api/config';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { token, role } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token && role === 'user') {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [token, role]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get(ENDPOINTS.CART);
      if (res.data && res.data.cart) {
        setCartItems(res.data.cart);
      } else if (Array.isArray(res.data)) {
        setCartItems(res.data);
      }
    } catch (err) {
      console.warn('Failed to fetch cart items:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      setLoading(true);
      const res = await axiosClient.post(ENDPOINTS.ADD_TO_CART, {
        productId,
        quantity,
      });
      if (res.data) {
        await fetchCart();
        return { success: true, message: res.data.message || 'Item added to cart!' };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not add item to cart';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      setLoading(true);
      const res = await axiosClient.post(ENDPOINTS.REMOVE_FROM_CART(itemId));
      if (res.data) {
        await fetchCart();
        return { success: true, message: 'Item removed from cart' };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not remove item from cart';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((acc, item) => {
      const price = item.productId?.price || item.price || 0;
      const discount = item.productId?.discount || item.discount || 0;
      const finalPrice = price - (price * discount) / 100;
      const qty = item.quantity || 1;
      return acc + finalPrice * qty;
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        fetchCart,
        addToCart,
        removeFromCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
