import React, { useState } from 'react';

const GownDetailsModal = ({ gown, onClose, onAddToCart, availableFrom, availableUntil }) => {
    const [quantity, setQuantity] = useState(1);

    return (
        <div className="gown-details-modal">
            <button onClick={onClose}>X</button>
            <img src={require(`../assets/${gown.image}`)} alt={gown.name} />
            <h2>{gown.name}</h2>
            <p>{gown.description}</p>
            <p>Available: {availableFrom.toLocaleDateString()} - {availableUntil.toLocaleDateString()}</p>
            <input
                type="number"
                value={quantity}
                min="1"
                onChange={(e) => setQuantity(e.target.value)}
            />
            <button onClick={() => onAddToCart(gown, quantity)}>Add to Cart</button>
        </div>
    );
};

export default GownDetailsModal;
