import React, { createContext, useState, useContext } from 'react';

// Cria o contexto
const CartContext = createContext();

// Provedor do contexto
export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const addItemToCart = (item) => {
        setCartItems(prevItems => [...prevItems, item]);
    };

    const removeItemFromCart = (itemId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    };

    return (
        <CartContext.Provider value={{ cartItems, addItemToCart, removeItemFromCart }}>
            {children}
        </CartContext.Provider>
    );
};

// Hook para usar o contexto
export const useCart = () => useContext(CartContext);
