'use client';

import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

const getStoredJson = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;

  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : fallback;
};

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => getStoredJson('user', null));
  const [cart, setCart] = useState(() => getStoredJson('cart', []));
  const [token, setToken] = useState(() => (typeof window === 'undefined' ? null : localStorage.getItem('token')));

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const addToCart = (product) => {
    const newCart = [...cart];
    const existing = newCart.find(item => item.product._id === product._id);
    if (existing) {
      existing.quantity += 1;
    } else {
      newCart.push({ product, quantity: 1, price: product.price });
    }
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  return (
    <AppContext.Provider value={{ user, token, cart, login, logout, addToCart, clearCart }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
