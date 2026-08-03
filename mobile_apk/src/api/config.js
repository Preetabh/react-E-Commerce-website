import { Platform } from 'react-native';

// 🔹 Base API URL configuration
// For Android Emulator use 10.0.2.2:4000
// For iOS Simulator use localhost:4000
// For Physical Device replace with your LAN IP (e.g. http://192.168.1.5:4000)
// For Hosted Server use https://biggest-shop-mart.onrender.com

const DEFAULT_DEV_URL = Platform.OS === 'android' ? 'http://10.0.2.2:4000' : 'http://localhost:4000';

export const API_BASE_URL = DEFAULT_DEV_URL;

export const ENDPOINTS = {
  // Products
  PRODUCTS: '/products',
  PRODUCT_BY_ID: (id) => `/products/${id}`,
  SUGGESTED_PRODUCTS: (id) => `/products/suggest/${id}`,
  ADD_PRODUCT: '/products/addProduct',
  
  // User Auth & Actions
  USER_REGISTER: '/users/register',
  USER_LOGIN: '/users/login',
  USER_LOGOUT: '/users/logout',
  USER_PROFILE: '/users/profile',
  USER_PROFILE_EDIT: '/users/profile/edit',
  CART: '/users/getCartItems',
  ADD_TO_CART: '/users/addtocart',
  REMOVE_FROM_CART: (itemId) => `/users/removeCart/${itemId}`,
  BUY_NOW_SUCCESS: (id) => `/users/buynowSuccessful/${id}`,
  MY_ORDERS: '/users/myorders',
  CANCEL_ORDER: (orderId) => `/users/myorders/${orderId}`,
  SEND_OTP: '/users/send-otp',
  RESET_PASSWORD: '/users/reset-password',

  // Owner Auth & Actions
  OWNER_REGISTER: '/owner/register',
  OWNER_LOGIN: '/owner/login',
  OWNER_LOGOUT: '/owner/logout',
  OWNER_PROFILE: '/owner/profile',
  OWNER_EDIT_PROFILE: '/owner/editprofile',
  OWNER_DASHBOARD: '/owner/dashboard',
  OWNER_ORDERS: '/owner/orders',
  OWNER_UPDATE_ORDER_STATUS: '/owner/orders/update-status',
  OWNER_GET_PRODUCT: (id) => `/owner/EditProduct/${id}`,
  OWNER_EDIT_PRODUCT: (id) => `/owner/EditProduct/${id}`,
  OWNER_DELETE_PRODUCT: (id) => `/owner/delete/${id}`,

  // AI Assistance
  AI_HELP: '/ai-help',
};
