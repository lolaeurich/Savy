import React, { useState } from 'react';
import "./style.css";

const QuantitySelector = () => {
    const [quantity, setQuantity] = useState(0);

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const increaseQuantity = () => {
        setQuantity(quantity + 1);
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
