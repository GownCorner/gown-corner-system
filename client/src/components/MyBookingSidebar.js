import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import './MyBookingSidebar.css';

const MyBookingSidebar = () => {
    const { cartItems, removeItem, totalPrice } = useContext(CartContext);

    return (
        <div className="my-booking-sidebar">
            <h3>My Booking</h3>
            {cartItems.length === 0 ? (
                <p>Your booking cart is empty.</p>
            ) : (
                cartItems.map((item, index) => (
                    <div key={index} className="cart-item">
                        <img src={item.image} alt={item.name} />
                        <div>
                            <h4>{item.name}</h4>
                            <p>₱{item.price}</p>
                            <button onClick={() => removeItem(item.id)}>Remove</button>
                        </div>
                    </div>
                ))
            )}
            <h4>Total: ₱{totalPrice}</h4>
            <button className="checkout-button">Checkout</button>
        </div>
    );
};

export default MyBookingSidebar;
