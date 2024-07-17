import React, { useState } from 'react';
import "./style.css";

const WeightSelector = () => {
    const [weight, setWeight] = useState(0);

    const decreaseWeight = () => {
        if (weight > 0) {
            setWeight(prevWeight => prevWeight - 0.5);
        }
    };

    const increaseWeight = () => {
        setWeight(prevWeight => prevWeight + 0.5);
    };

    return (
        <div className="weight-selector">
            <button className="weight-button-less" onClick={decreaseWeight}>-</button>
            <span className="weight-display">{weight} kg</span>
            <button className="weight-button-plus" onClick={increaseWeight}>+</button>
        </div>
    );
};

export default WeightSelector;
