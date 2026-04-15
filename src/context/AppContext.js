'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Load state from local storage on init
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    const storedCart = localStorage.getItem('cart');

    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedToken) setToken(storedToken);
    if (storedCart) setCart(JSON.parse(storedCart));
  }, []);

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
