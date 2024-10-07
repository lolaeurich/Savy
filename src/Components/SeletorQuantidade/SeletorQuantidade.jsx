import React, { useState, useEffect } from 'react';
import "./style.css";

const QuantitySelector = ({ initialQuantity, onQuantityChange }) => {
    const [quantity, setQuantity] = useState(initialQuantity || 1);

    useEffect(() => {
        setQuantity(initialQuantity); // Atualiza a quantidade se a prop mudar
    }, [initialQuantity]);

    const decreaseQuantity = () => {
        if (quantity > 1) {
            const newQuantity = quantity - 1;
            setQuantity(newQuantity);
            onQuantityChange(newQuantity); // Chama a função de callback
        }
    };

    const increaseQuantity = () => {
        const newQuantity = quantity + 1;
        setQuantity(newQuantity);
        onQuantityChange(newQuantity); // Chama a função de callback
    };

    return (
        <div className="quantity-selector">
            <button className="quantity-button-less" onClick={decreaseQuantity}>-</button>
            <span className="quantity-display">{quantity}</span>
            <button className="quantity-button-plus" onClick={increaseQuantity}>+</button>
        </div>
    );
};

export default QuantitySelector;
