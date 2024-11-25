import React, { useState, useEffect } from 'react';
import './Catalog.css';

const Catalog = () => {
    const [dresses, setDresses] = useState([]);

    useEffect(() => {
        // Fetch dresses from the backend or local data
        setDresses([
            { id: 1, name: "Pink Dress", price: 100, img: "/assets/pinkdress.jpg" },
            { id: 2, name: "Blue Dress", price: 120, img: "/assets/bluedress.jpg" }
        ]);
    }, []);

    return (
        <div className="catalog">
            <h2>Gowns and Dress for Every Event</h2>
            <div className="dress-list">
                {dresses.map(dress => (
                    <div key={dress.id} className="dress-item">
                        <img src={dress.img} alt={dress.name} />
                        <h3>{dress.name}</h3>
                        <p>Price: ₱{dress.price}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Catalog;
